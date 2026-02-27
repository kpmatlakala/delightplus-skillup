-- ──────────────────────────────────────────────────────────────────────────────
-- 013 · Announcements table + RPC bridge + realtime
-- ──────────────────────────────────────────────────────────────────────────────

create table cet.announcements (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  message     text        not null,
  audience    text        not null default 'All'
                check (audience in ('All','Block 1','Block 2','Block 3','Admin Only')),
  pinned      boolean     not null default false,
  author      text        not null default 'Admin',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger set_announcements_updated_at
before update on cet.announcements
for each row execute function cet.set_updated_at();

-- ── Row-Level Security ──────────────────────────────────────────────────────
alter table cet.announcements enable row level security;

-- Admins / lecturers can read + write everything
create policy "admin_manage_announcements" on cet.announcements
  for all to authenticated
  using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','moderator'))
  )
  with check (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','moderator'))
  );

-- Learners can read non-admin-only announcements
create policy "learner_read_announcements" on cet.announcements
  for select to authenticated
  using (audience <> 'Admin Only');

-- ── Grants ──────────────────────────────────────────────────────────────────
grant select, insert, update, delete on cet.announcements to authenticated;

-- ── Realtime ────────────────────────────────────────────────────────────────
alter publication supabase_realtime add table cet.announcements;

-- ── Seed data ───────────────────────────────────────────────────────────────
insert into cet.announcements (title, message, audience, pinned, author) values
  (
    'Block 1 Schedule Confirmed',
    'Block 1 training begins 02 March 2026 at CET Venda. All 5 modules (Days 1–5) are confirmed. Facilitator guides and learner workbooks will be distributed via USB on Day 1.',
    'All', true, 'Admin'
  ),
  (
    'Offline Portal Available',
    'The CET Connect portal is available offline. Connect to the local Wi-Fi hotspot and navigate to http://192.168.1.100:5173 to access all materials without internet.',
    'All', true, 'Admin'
  ),
  (
    'Assessment Submissions Open',
    'Summative assessment briefs for Block 1 (14924, 14920, 14918, 14927, 14915) are now available in each module''s Assessment tab. Learners must complete the quiz before the assessment unlocks.',
    'Block 1', false, 'Admin'
  ),
  (
    'Facilitator Resource Pack Updated',
    'Updated Facilitator Guides and Lesson Plan packs for Block 1 are available under each module''s Facilitator Guide tab. Please review session notes before Day 1.',
    'Admin Only', false, 'Admin'
  );

-- ── Public RPC bridge ────────────────────────────────────────────────────────

-- Read (any authenticated user — RLS filters audience)
create or replace function public.cet_get_announcements()
returns table (
  id         uuid,
  title      text,
  message    text,
  audience   text,
  pinned     boolean,
  author     text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public, cet
as $$
  select id, title, message, audience, pinned, author, created_at
  from cet.announcements
  order by pinned desc, created_at desc;
$$;

-- Post (admin/lecturer only — enforced inside function)
create or replace function public.cet_post_announcement(
  p_title    text,
  p_message  text,
  p_audience text default 'All'
)
returns uuid
language plpgsql
security definer
set search_path = public, cet
as $$
declare
  v_id   uuid;
  v_role text;
begin
  select role into v_role from public.users where id = auth.uid();
  if v_role not in ('admin','moderator') then
    raise exception 'Permission denied';
  end if;

  insert into cet.announcements (title, message, audience)
  values (p_title, p_message, p_audience)
  returning id into v_id;

  return v_id;
end;
$$;

-- Pin / unpin (admin/lecturer only)
create or replace function public.cet_pin_announcement(p_id uuid, p_pinned boolean)
returns void
language plpgsql
security definer
set search_path = public, cet
as $$
declare
  v_role text;
begin
  select role into v_role from public.users where id = auth.uid();
  if v_role not in ('admin','moderator') then
    raise exception 'Permission denied';
  end if;
  update cet.announcements set pinned = p_pinned where id = p_id;
end;
$$;

-- Delete (admin/lecturer only)
create or replace function public.cet_delete_announcement(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public, cet
as $$
declare
  v_role text;
begin
  select role into v_role from public.users where id = auth.uid();
  if v_role not in ('admin','moderator') then
    raise exception 'Permission denied';
  end if;
  delete from cet.announcements where id = p_id;
end;
$$;
