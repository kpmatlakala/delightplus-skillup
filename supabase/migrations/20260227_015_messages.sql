-- ──────────────────────────────────────────────────────────────────────────────
-- 015 · Direct messaging: conversations + messages tables + RPCs + realtime
--       Supports: learner → facilitator, learner → learner, admin → any
-- ──────────────────────────────────────────────────────────────────────────────

-- ── Tables ───────────────────────────────────────────────────────────────────

create table cet.conversations (
  id            uuid        primary key default gen_random_uuid(),
  participant_a uuid        not null references auth.users(id) on delete cascade,
  participant_b uuid        not null references auth.users(id) on delete cascade,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint no_self_conversation check (participant_a <> participant_b)
);

-- Unique pair regardless of insertion order
create unique index idx_conversations_pair on cet.conversations (
  least(participant_a::text, participant_b::text),
  greatest(participant_a::text, participant_b::text)
);

create trigger set_conversations_updated_at
  before update on cet.conversations
  for each row execute function cet.set_updated_at();

create table cet.messages (
  id              uuid        primary key default gen_random_uuid(),
  conversation_id uuid        not null references cet.conversations(id) on delete cascade,
  sender_id       uuid        not null references auth.users(id) on delete cascade,
  body            text        not null check (length(trim(body)) > 0),
  sent_at         timestamptz not null default now(),
  read_at         timestamptz
);

create index idx_messages_conversation_id on cet.messages(conversation_id);
create index idx_messages_sent_at         on cet.messages(sent_at);

-- ── Row-Level Security ───────────────────────────────────────────────────────

alter table cet.conversations enable row level security;
alter table cet.messages       enable row level security;

-- Conversations: both participants can read
create policy "participants_read_conversations" on cet.conversations
  for select to authenticated
  using (participant_a = auth.uid() or participant_b = auth.uid());

-- Messages: participants in the conversation can read
create policy "participants_read_messages" on cet.messages
  for select to authenticated
  using (
    exists (
      select 1 from cet.conversations c
      where c.id = conversation_id
        and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
    )
  );

-- ── Grants (SELECT needed for realtime; writes go via security definer RPCs) ─

grant select on cet.conversations to authenticated;
grant select on cet.messages       to authenticated;

-- ── Realtime ─────────────────────────────────────────────────────────────────

alter publication supabase_realtime add table cet.conversations;
alter publication supabase_realtime add table cet.messages;

-- ── RPCs ─────────────────────────────────────────────────────────────────────

-- Send a message (creates conversation if needed, inserts message)
create or replace function public.cet_send_message(
  p_recipient_id uuid,
  p_body         text
)
returns uuid   -- conversation_id
language plpgsql
security definer
set search_path = public, cet
as $$
declare
  v_sender  uuid := auth.uid();
  v_conv_id uuid;
begin
  if v_sender is null then
    raise exception 'Not authenticated';
  end if;
  if trim(coalesce(p_body, '')) = '' then
    raise exception 'Message body cannot be empty';
  end if;
  if p_recipient_id = v_sender then
    raise exception 'Cannot send message to yourself';
  end if;

  -- Find existing conversation between this pair
  select id into v_conv_id
  from cet.conversations
  where (participant_a = v_sender and participant_b = p_recipient_id)
     or (participant_a = p_recipient_id and participant_b = v_sender)
  limit 1;

  -- Create if not exists
  if v_conv_id is null then
    insert into cet.conversations (participant_a, participant_b)
    values (v_sender, p_recipient_id)
    returning id into v_conv_id;
  end if;

  insert into cet.messages (conversation_id, sender_id, body)
  values (v_conv_id, v_sender, trim(p_body));

  update cet.conversations set updated_at = now() where id = v_conv_id;

  return v_conv_id;
end;
$$;

-- Get all conversations for the caller (one row per conversation)
create or replace function public.cet_get_my_conversations()
returns table (
  conversation_id uuid,
  other_user_id   uuid,
  other_name      text,
  other_code      text,
  other_role      text,
  last_body       text,
  last_sent_at    timestamptz,
  unread_count    bigint
)
language sql
stable
security definer
set search_path = public, cet
as $$
  with my_convs as (
    select
      c.id as conv_id,
      case
        when c.participant_a = auth.uid() then c.participant_b
        else c.participant_a
      end as other_id
    from cet.conversations c
    where c.participant_a = auth.uid() or c.participant_b = auth.uid()
  ),
  last_msg as (
    select distinct on (m.conversation_id)
      m.conversation_id,
      m.body,
      m.sent_at
    from cet.messages m
    where m.conversation_id in (select conv_id from my_convs)
    order by m.conversation_id, m.sent_at desc
  ),
  unread as (
    select m.conversation_id, count(*) as cnt
    from cet.messages m
    where m.conversation_id in (select conv_id from my_convs)
      and m.sender_id <> auth.uid()
      and m.read_at is null
    group by m.conversation_id
  )
  select
    mc.conv_id,
    mc.other_id,
    coalesce(u.display_name, l.full_name, 'Unknown') as other_name,
    l.learner_code as other_code,
    coalesce(u.role, 'user')::text as other_role,
    lm.body as last_body,
    lm.sent_at as last_sent_at,
    coalesce(ur.cnt, 0) as unread_count
  from my_convs mc
  left join public.users u on u.id = mc.other_id
  left join cet.learners l on l.user_id = mc.other_id
  left join last_msg lm on lm.conversation_id = mc.conv_id
  left join unread ur on ur.conversation_id = mc.conv_id
  order by lm.sent_at desc nulls last;
$$;

-- Get messages for a specific conversation (caller must be a participant)
create or replace function public.cet_get_conversation_messages(
  p_conversation_id uuid
)
returns table (
  id        uuid,
  sender_id uuid,
  body      text,
  sent_at   timestamptz,
  read_at   timestamptz
)
language sql
stable
security definer
set search_path = public, cet
as $$
  select m.id, m.sender_id, m.body, m.sent_at, m.read_at
  from cet.messages m
  join cet.conversations c on c.id = m.conversation_id
  where m.conversation_id = p_conversation_id
    and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
  order by m.sent_at asc;
$$;

-- Mark all unread messages in a conversation as read
create or replace function public.cet_mark_conversation_read(
  p_conversation_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, cet
as $$
declare
  v_uid uuid := auth.uid();
begin
  if not exists (
    select 1 from cet.conversations
    where id = p_conversation_id
      and (participant_a = v_uid or participant_b = v_uid)
  ) then
    raise exception 'Access denied';
  end if;

  update cet.messages
  set read_at = now()
  where conversation_id = p_conversation_id
    and sender_id <> v_uid
    and read_at is null;
end;
$$;

-- Get the facilitator / admin user ID (for learners to initiate a conversation)
-- Returns null if caller is the only admin (admin messaging themselves is blocked)
create or replace function public.cet_get_facilitator_user_id()
returns uuid
language sql
stable
security definer
set search_path = public, cet
as $$
  select id
  from public.users
  where role in ('admin', 'moderator')
    and id <> coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)
  order by created_at asc
  limit 1;
$$;

-- Update cet_list_learners_for_messaging to also return user_id (needed to send messages)
-- Must drop first because the return type changes (added user_id column)
drop function if exists public.cet_list_learners_for_messaging();

create or replace function public.cet_list_learners_for_messaging()
returns table (
  id           uuid,
  user_id      uuid,
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
    l.user_id,
    l.full_name,
    l.learner_code
  from cet.learners l
  join cet.enrollments e on e.learner_id = l.id
  where
    l.status = 'Active'
    and e.status = 'Active'
    and l.user_id is not null
    and l.user_id <> auth.uid()
  order by l.full_name
  limit 50;
$$;

-- ── Grants ───────────────────────────────────────────────────────────────────

grant execute on function public.cet_send_message(uuid, text)              to authenticated;
grant execute on function public.cet_get_my_conversations()                 to authenticated;
grant execute on function public.cet_get_conversation_messages(uuid)        to authenticated;
grant execute on function public.cet_mark_conversation_read(uuid)           to authenticated;
grant execute on function public.cet_get_facilitator_user_id()              to authenticated;
grant execute on function public.cet_list_learners_for_messaging()          to authenticated;
