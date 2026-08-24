// RLS 权限自测：两个匿名身份互相试探，验证"只能动自己的东西"
// 运行：node supabase/rls-test.mjs
import { createClient } from '@supabase/supabase-js';

const URL = process.env.SUPABASE_URL || 'https://fnnyaroicflzmjuvtemc.supabase.co';
const KEY =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZubnlhcm9pY2Zsem1qdXZ0ZW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NDY1ODcsImV4cCI6MjEwMzEyMjU4N30.Eb4hdlu_5Y5ig42kaKGPgGBRrrdYhzXmIJtDIdNTGZA';

const results = [];
const check = (name, cond) => results.push([cond ? 'PASS' : 'FAIL', name]);
const mk = () => createClient(URL, KEY);

// —— 访客 A ——
const A = mk();
const { data: sa, error: ea } = await A.auth.signInAnonymously();
check('A 匿名登录', !ea && !!sa?.user?.id);
if (ea) {
  console.log('登录失败:', ea.message);
  process.exit(1);
}
const uidA = sa.user.id;

// —— 访客 B ——
const B = mk();
const { data: sb } = await B.auth.signInAnonymously();
const uidB = sb.user.id;
check('B 匿名登录，且身份不同于 A', uidB && uidB !== uidA);

// 卡片
{
  const { error } = await A.from('wb_cards').insert({ id: 'test-a-card', owner: uidA, data: { v: 1 } });
  check('A 贴一张卡', !error);

  const { data: seen } = await B.from('wb_cards').select('*').eq('id', 'test-a-card');
  check('B 能看到 A 的卡（公开可见）', seen?.length === 1);

  const { data: upRows, error: upErr } = await B.from('wb_cards')
    .update({ data: { hacked: true } })
    .eq('id', 'test-a-card')
    .select();
  check('B 偷改 A 的卡 → 被数据库拒绝', !!upErr || upRows?.length === 0);

  const { data: delRows, error: delErr } = await B.from('wb_cards')
    .delete()
    .eq('id', 'test-a-card')
    .select();
  check('B 偷删 A 的卡 → 被数据库拒绝', !!delErr || delRows?.length === 0);

  const { data: still } = await A.from('wb_cards').select('*').eq('id', 'test-a-card');
  check('A 的卡完好无损', still?.length === 1 && !still[0].data?.hacked);

  const { error: insB } = await B.from('wb_cards').insert({ id: 'test-b-card', owner: uidB, data: { v: 2 } });
  check('B 贴自己的卡', !insB);

  const { error: spoof } = await B.from('wb_cards').insert({ id: 'test-spoof', owner: uidA, data: {} });
  check('B 冒充 A 的名义贴卡 → 被拒', !!spoof);
}

// 投票（特殊：允许任何人以自己的身份给别人的卡投票）
{
  const { error: v1 } = await B.from('wb_votes').insert({ card_id: 'test-a-card', voter: uidB, option_index: 1 });
  check('B 给 A 发起的投票投票', !v1);

  const { error: v2 } = await B.from('wb_votes')
    .upsert({ card_id: 'test-a-card', voter: uidB, option_index: 2 }, { onConflict: 'card_id,voter' });
  check('B 改票', !v2);

  const { error: v3 } = await B.from('wb_votes').insert({ card_id: 'test-a-card', voter: uidA, option_index: 0 });
  check('B 替 A 投票 → 被拒', !!v3);

  const { data: votes } = await A.from('wb_votes').select('*').eq('card_id', 'test-a-card');
  check('票数公开可见且正确', votes?.length === 1 && votes[0].option_index === 2);
}

// 涂鸦
{
  const { error: s1 } = await A.from('wb_strokes').insert({
    id: 'test-stk-a', owner: uidA, data: { points: [1, 2, 3, 4], color: '#000', width: 3 },
  });
  const { error: s2 } = await B.from('wb_strokes').insert({
    id: 'test-stk-b', owner: uidB, data: { points: [5, 6, 7, 8], color: '#f00', width: 6 },
  });
  check('两人都能画', !s1 && !s2);

  const { data: delStk, error: delStkErr } = await B.from('wb_strokes')
    .delete()
    .eq('id', 'test-stk-a')
    .select();
  check('B 偷擦 A 的笔迹 → 被拒', !!delStkErr || delStk?.length === 0);
}

// 管理员名单
{
  const { error } = await B.from('wb_admins').insert({ uid: uidB });
  check('B 自封管理员 → 被拒（管理员只能在后台加）', !!error);
}

// 清理测试数据
await A.from('wb_cards').delete().eq('id', 'test-a-card');
await B.from('wb_cards').delete().eq('id', 'test-b-card');
await A.from('wb_strokes').delete().eq('id', 'test-stk-a');
await B.from('wb_strokes').delete().eq('id', 'test-stk-b');
await B.from('wb_votes').delete().eq('card_id', 'test-a-card').eq('voter', uidB);

let fail = 0;
for (const [s, n] of results) {
  if (s === 'FAIL') fail++;
  console.log(s, n);
}
console.log(fail ? `\n${fail} 项未通过 ❌` : '\n全部通过 ✅');
process.exit(fail ? 1 : 0);
