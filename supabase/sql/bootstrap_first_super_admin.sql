-- Bootstrap first CET super admin after creating auth user in Supabase Auth.
-- Target email: matlakalakabelo1@gmail.com
--
-- Step 1 (Dashboard): Authentication -> Users -> Add user
--   - Email: matlakalakabelo1@gmail.com
--   - Set password : 
--   - Mark email as confirmed (recommended)
--
-- Step 2 (SQL Editor): Run this script

begin;

insert into public.users (id, username, display_name, role, app_metadata, created_at, updated_at)
select
  au.id,
  'matlakalakabelo1' as username,
  'Kabelo Matlakala' as display_name,
  'admin' as role,
  coalesce(u.app_metadata, '{}'::jsonb) as app_metadata,
  now(),
  now()
from auth.users au
left join public.users u on u.id = au.id
where au.email = 'matlakalakabelo1@gmail.com'
on conflict (id) do update
set
  username = excluded.username,
  display_name = excluded.display_name,
  role = 'admin',
  updated_at = now();

-- Verify auth + profile role mapping used by CET policies
select
  au.id,
  au.email,
  pu.username,
  pu.role
from auth.users au
left join public.users pu on pu.id = au.id
where au.email = 'matlakalakabelo1@gmail.com';

commit;
