-- Fix: Announcements table + RPC bridge (idempotent)
-- Run this in Supabase SQL Editor if `cet_get_announcements` returns 404.

create extension if not exists pgcrypto;
create schema if not exists cet;

create table if not exists cet.announcements (
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

alter table cet.announcements add column if not exists audience text;
alter table cet.announcements add column if not exists pinned boolean;
alter table cet.announcements add column if not exists author text;
alter table cet.announcements add column if not exists updated_at timestamptz;

alter table cet.announcements alter column audience set default 'All';
alter table cet.announcements alter column pinned set default false;
alter table cet.announcements alter column author set default 'Admin';
alter table cet.announcements alter column updated_at set default now();

update cet.announcements set audience = 'All' where audience is null;
update cet.announcements set pinned = false where pinned is null;
update cet.announcements set author = 'Admin' where author is null;
update cet.announcements set updated_at = created_at where updated_at is null;

do $$
begin
  begin
    alter table cet.announcements
      add constraint cet_announcements_audience_check
      check (audience in ('All','Block 1','Block 2','Block 3','Admin Only'));
  exception
    when duplicate_object then null;
  end;
end $$;

alter table cet.announcements enable row level security;

drop policy if exists admin_manage_announcements on cet.announcements;
create policy admin_manage_announcements on cet.announcements
  for all to authenticated
  using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','moderator'))
  )
  with check (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','moderator'))
  );

drop policy if exists learner_read_announcements on cet.announcements;
create policy learner_read_announcements on cet.announcements
  for select to authenticated
  using (audience <> 'Admin Only');

grant select, insert, update, delete on cet.announcements to authenticated;

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

  update cet.announcements
  set pinned = p_pinned
  where id = p_id;
end;
$$;

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

  delete from cet.announcements
  where id = p_id;
end;
$$;

grant execute on function public.cet_get_announcements() to authenticated;
grant execute on function public.cet_post_announcement(text, text, text) to authenticated;
grant execute on function public.cet_pin_announcement(uuid, boolean) to authenticated;
grant execute on function public.cet_delete_announcement(uuid) to authenticated;

do $$
begin
  begin
    alter publication supabase_realtime add table cet.announcements;
  exception
    when duplicate_object then null;
  end;
end $$;
