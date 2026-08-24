-- ============================================================
-- 不二的小站 · 共享白板数据库初始化（只跑一次）
-- 用法：Supabase Dashboard → SQL Editor → New query → 全选粘贴 → Run
-- ============================================================

-- 1) 卡片（整张卡存 data jsonb，owner 是创建者的匿名身份 uid）
create table if not exists public.wb_cards (
  id text primary key,
  owner text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- 2) 涂鸦笔迹
create table if not exists public.wb_strokes (
  id text primary key,
  owner text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- 3) 投票（一人一票，可改可取消）
create table if not exists public.wb_votes (
  card_id text not null,
  voter text not null,
  option_index integer not null,
  created_at timestamptz not null default now(),
  primary key (card_id, voter)
);

-- 4) 管理员名单（Esther 的 uid 之后由第二条小脚本加入）
create table if not exists public.wb_admins (
  uid text primary key,
  created_at timestamptz not null default now()
);

-- 打开行级安全（RLS）——所有权限都在数据库层面强制
alter table public.wb_cards enable row level security;
alter table public.wb_strokes enable row level security;
alter table public.wb_votes enable row level security;
alter table public.wb_admins enable row level security;

-- 判断当前访问者是不是管理员（security definer：绕过 wb_admins 自身 RLS）
create or replace function public.wb_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.wb_admins where uid = auth.uid()::text);
$$;

-- 卡片规则：大家都能看、都能贴；只能改/删自己的；管理员全权
drop policy if exists wb_cards_select on public.wb_cards;
drop policy if exists wb_cards_insert on public.wb_cards;
drop policy if exists wb_cards_update on public.wb_cards;
drop policy if exists wb_cards_delete on public.wb_cards;
create policy wb_cards_select on public.wb_cards for select using (true);
create policy wb_cards_insert on public.wb_cards for insert to authenticated
  with check (owner = auth.uid()::text);
create policy wb_cards_update on public.wb_cards for update to authenticated
  using (owner = auth.uid()::text or public.wb_is_admin())
  with check (owner = auth.uid()::text or public.wb_is_admin());
create policy wb_cards_delete on public.wb_cards for delete to authenticated
  using (owner = auth.uid()::text or public.wb_is_admin());

-- 涂鸦规则：大家都能看、都能画；只能擦自己的；管理员全能擦
drop policy if exists wb_strokes_select on public.wb_strokes;
drop policy if exists wb_strokes_insert on public.wb_strokes;
drop policy if exists wb_strokes_delete on public.wb_strokes;
create policy wb_strokes_select on public.wb_strokes for select using (true);
create policy wb_strokes_insert on public.wb_strokes for insert to authenticated
  with check (owner = auth.uid()::text);
create policy wb_strokes_delete on public.wb_strokes for delete to authenticated
  using (owner = auth.uid()::text or public.wb_is_admin());

-- 投票规则：大家都能看；只能以自己的身份投/改/取消
drop policy if exists wb_votes_select on public.wb_votes;
drop policy if exists wb_votes_insert on public.wb_votes;
drop policy if exists wb_votes_update on public.wb_votes;
drop policy if exists wb_votes_delete on public.wb_votes;
create policy wb_votes_select on public.wb_votes for select using (true);
create policy wb_votes_insert on public.wb_votes for insert to authenticated
  with check (voter = auth.uid()::text);
create policy wb_votes_update on public.wb_votes for update to authenticated
  using (voter = auth.uid()::text)
  with check (voter = auth.uid()::text);
create policy wb_votes_delete on public.wb_votes for delete to authenticated
  using (voter = auth.uid()::text);

-- 管理员名单：大家可读（前端据此显示管理功能）；写入只在 SQL Editor 手动进行
drop policy if exists wb_admins_select on public.wb_admins;
create policy wb_admins_select on public.wb_admins for select using (true);

-- 实时同步（一个浏览器动了，其他人的屏幕立刻跟上）
do $$
begin
  execute 'alter publication supabase_realtime add table public.wb_cards';
exception when duplicate_object then null;
end $$;
do $$
begin
  execute 'alter publication supabase_realtime add table public.wb_strokes';
exception when duplicate_object then null;
end $$;
do $$
begin
  execute 'alter publication supabase_realtime add table public.wb_votes';
exception when duplicate_object then null;
end $$;
