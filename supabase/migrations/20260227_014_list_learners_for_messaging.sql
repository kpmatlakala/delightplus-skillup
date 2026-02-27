-- ──────────────────────────────────────────────────────────────────────────────
-- 014 · Lightweight learner directory for messaging recipient picker
--       Accessible to ANY authenticated user (security definer).
--       Returns only display info — no PII (email / phone).
-- ──────────────────────────────────────────────────────────────────────────────

create or replace function public.cet_list_learners_for_messaging()
returns table (
  id           uuid,
  full_name    text,
  learner_code text
)
language sql
stable
security definer
set search_path = public, cet
as $$
  select
    l.id,
    l.full_name,
    l.learner_code
  from cet.learners l
  join cet.enrollments e on e.learner_id = l.id
  where
    l.status = 'Active'
    and e.status = 'Active'
    -- exclude the caller themselves so you can't message yourself
    and l.user_id <> auth.uid()
  order by l.full_name
  limit 50;
$$;

grant execute on function public.cet_list_learners_for_messaging() to authenticated;
