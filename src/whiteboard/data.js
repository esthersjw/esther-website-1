// 共享白板数据层：先本地模式跑通，Supabase 模式接口就绪
// 权限模型：每个访客有一个匿名 token（owner），只能编辑/删除自己创建的卡。

export const ESTHER_OWNER = 'esther'; // 预制内容的所有者（管理员）

export const TOKEN_KEY = 'wb.myToken';
export const CARDS_KEY = 'wb.cards.v2';
export const STROKES_KEY = 'wb.strokes.v1';

export function getMyToken() {
  // 管理员激活：访问 whiteboard.html?admin=esther 即可（换设备时用）
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.get('admin') === ESTHER_OWNER) {
      localStorage.setItem(TOKEN_KEY, ESTHER_OWNER);
    }
  } catch {
    /* ignore */
  }
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

export function isAdmin(token) {
  return token === ESTHER_OWNER;
}

// ---------- Supabase 配置（拿到用户 key 后填写） ----------
export const WB_CONFIG = {
  MODE: 'local', // 'local' | 'supabase'
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  TABLE: 'wb_cards',
  STROKES_TABLE: 'wb_strokes',
  POLL_MS: 8000,
};

export function supabaseReady() {
  return (
    WB_CONFIG.MODE === 'supabase' &&
    WB_CONFIG.SUPABASE_URL &&
    WB_CONFIG.SUPABASE_ANON_KEY
  );
}

// ---------- 本地存储 ----------
export function loadLocalCards() {
  try {
    return JSON.parse(localStorage.getItem(CARDS_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveLocalCards(cards) {
  try {
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  } catch {
    /* ignore quota */
  }
}

export function loadLocalStrokes() {
  try {
    return JSON.parse(localStorage.getItem(STROKES_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveLocalStrokes(strokes) {
  try {
    localStorage.setItem(STROKES_KEY, JSON.stringify(strokes));
  } catch {
    /* ignore quota */
  }
}

// ---------- Supabase (PostgREST) ----------
function sbHeaders() {
  return {
    apikey: WB_CONFIG.SUPABASE_ANON_KEY,
    Authorization: `Bearer ${WB_CONFIG.SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
}

// 只拉取"别人或自己的留言卡"；种子卡由前端 seedCards 提供
export async function fetchRemoteCards() {
  const url = `${WB_CONFIG.SUPABASE_URL}/rest/v1/${WB_CONFIG.TABLE}?select=*&order=created_at.asc`;
  const res = await fetch(url, { headers: sbHeaders() });
  if (!res.ok) throw new Error(`load ${res.status}`);
  return res.json();
}

export async function postRemoteCard(card) {
  const url = `${WB_CONFIG.SUPABASE_URL}/rest/v1/${WB_CONFIG.TABLE}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { ...sbHeaders(), Prefer: 'return=minimal' },
    body: JSON.stringify(card),
  });
  if (!res.ok) throw new Error(`post ${res.status}`);
}

// 服务端 RLS 会强制 owner 匹配，前端不传 owner 条件也能安全删除
export async function deleteRemoteCard(id) {
  const url = `${WB_CONFIG.SUPABASE_URL}/rest/v1/${WB_CONFIG.TABLE}?id=eq.${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { ...sbHeaders(), Prefer: 'return=minimal' },
  });
  if (!res.ok) throw new Error(`delete ${res.status}`);
}

export async function updateRemoteCard(id, patch) {
  const url = `${WB_CONFIG.SUPABASE_URL}/rest/v1/${WB_CONFIG.TABLE}?id=eq.${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { ...sbHeaders(), Prefer: 'return=minimal' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`update ${res.status}`);
}

// ---------- 涂鸦笔迹（Supabase） ----------
export async function fetchRemoteStrokes() {
  const url = `${WB_CONFIG.SUPABASE_URL}/rest/v1/${WB_CONFIG.STROKES_TABLE}?select=*&order=created_at.asc`;
  const res = await fetch(url, { headers: sbHeaders() });
  if (!res.ok) throw new Error(`load strokes ${res.status}`);
  return res.json();
}

export async function postRemoteStroke(stroke) {
  const url = `${WB_CONFIG.SUPABASE_URL}/rest/v1/${WB_CONFIG.STROKES_TABLE}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { ...sbHeaders(), Prefer: 'return=minimal' },
    body: JSON.stringify(stroke),
  });
  if (!res.ok) throw new Error(`post stroke ${res.status}`);
}

export async function deleteRemoteStroke(id) {
  const url = `${WB_CONFIG.SUPABASE_URL}/rest/v1/${WB_CONFIG.STROKES_TABLE}?id=eq.${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { ...sbHeaders(), Prefer: 'return=minimal' },
  });
  if (!res.ok) throw new Error(`delete stroke ${res.status}`);
}
