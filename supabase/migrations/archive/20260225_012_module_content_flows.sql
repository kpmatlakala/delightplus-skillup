-- ============================================================
-- Migration 012: Module content flows (lesson content from DB)
--
-- Stores the structured lesson flow for each unit standard as
-- JSONB so both admin and learner always pull from the same
-- single source of truth, eliminating content drift between
-- the static TS file and what facilitators may have updated.
-- ============================================================

create table if not exists cet.module_content_flows (
  id                       uuid        primary key default gen_random_uuid(),
  unit_standard_id         text        unique not null,
  flow                     jsonb       not null,
  updated_by               uuid        references auth.users(id) on delete set null,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create trigger set_module_content_flows_updated_at
before update on cet.module_content_flows
for each row
execute function cet.set_updated_at();

create index idx_cet_module_content_flows_unit_std
on cet.module_content_flows(unit_standard_id);

-- RLS: anyone authenticated can read; only admin/lecturer can write
alter table cet.module_content_flows enable row level security;

create policy "Authenticated users can read module flows"
on cet.module_content_flows for select
using (auth.role() = 'authenticated');

create policy "Admins and lecturers can manage module flows"
on cet.module_content_flows for all
using  (cet.get_my_role() in ('admin', 'lecturer'))
with check (cet.get_my_role() in ('admin', 'lecturer'));

-- Grants
grant select                    on cet.module_content_flows to authenticated;
grant insert, update, delete    on cet.module_content_flows to authenticated; -- gated by RLS above

-- ============================================================
-- Public RPC: fetch one flow (returns null row when not found)
-- ============================================================
create or replace function public.cet_get_module_flow(
  p_unit_std_id text
)
returns jsonb
language sql
stable
security definer
set search_path = public, cet
as $$
  select flow
  from cet.module_content_flows
  where unit_standard_id = p_unit_std_id
  limit 1;
$$;

grant execute on function public.cet_get_module_flow(text) to authenticated;

-- ============================================================
-- Public RPC: upsert (insert or replace) a flow
-- Only admins/lecturers can call this (enforced via caller check).
-- ============================================================
create or replace function public.cet_upsert_module_flow(
  p_unit_std_id text,
  p_flow        jsonb
)
returns void
language plpgsql
security definer
set search_path = public, cet
as $$
declare
  v_role cet.user_role := cet.get_my_role();
begin
  if v_role not in ('admin', 'lecturer') then
    raise exception 'Only admins and lecturers can update module flows';
  end if;

  insert into cet.module_content_flows (unit_standard_id, flow, updated_by)
  values (p_unit_std_id, p_flow, auth.uid())
  on conflict (unit_standard_id) do update
    set flow       = excluded.flow,
        updated_by = excluded.updated_by,
        updated_at = now();
end;
$$;

grant execute on function public.cet_upsert_module_flow(text, jsonb) to authenticated;

comment on function public.cet_get_module_flow    is 'Returns the structured JSONB lesson flow for the given unit standard ID, or NULL if not seeded yet.';
comment on function public.cet_upsert_module_flow is 'Admins/lecturers can push or update the lesson flow JSONB for a unit standard.';
