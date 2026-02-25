# Next Steps: Auth + Role Routing + Dashboards

This project now includes an initial migration:

- `supabase/migrations/20260225_001_initial_schema_and_rls.sql`

It creates core tables and row-level-security policies for:

- CET domain tables under `cet` schema
- role mapping from existing `public.users.role` to CET roles (`admin`, `lecturer`, `learner`)
- programs, modules
- learners, enrollments
- attendance sessions and records
- assessments and results
- announcements

## 1) Apply schema in Supabase

Use your normal Supabase migration flow (CLI or dashboard SQL editor) to apply the migration.

After migration, regenerate TypeScript types and replace the generated file at:

- `src/integrations/supabase/types.ts`

## 2) Ensure `public.users` is populated and role-mapped

CET access control now reads from `public.users` and maps roles as:

- `admin` -> `admin`
- `moderator` -> `lecturer`
- `user` (default) -> `learner`

After auth sign-up, ensure each user has a row in `public.users`.

Example SQL (replace with real values):

```sql
insert into public.users (id, username, display_name, role)
values (
  '00000000-0000-0000-0000-000000000000',
  'platformadmin',
  'Platform Admin',
  'admin'
)
on conflict (id)
do update set role = excluded.role;
```

For this project bootstrap account, use:

- [supabase/sql/bootstrap_first_super_admin.sql](supabase/sql/bootstrap_first_super_admin.sql)

## 3) Implement auth pages in frontend

Minimum pages to add:

- `/auth/login`
- `/auth/register` (optional if admin-only provisioning)

Use Supabase auth APIs:

- `supabase.auth.signInWithPassword`
- `supabase.auth.signUp`
- `supabase.auth.signOut`
- `supabase.auth.getSession`

## 4) Add role-aware route guards

Create guards that check:

- user is authenticated
- user role via `cet.get_my_role()` (derived from `public.users.role`)

Suggested route behavior:

- `admin`: access all pages
- `lecturer`: no access to admin-only settings (if added)
- `learner`: learner dashboard + own progress/attendance/results only

## 5) Build dashboards by role

Start with these role-targeted views:

- Admin dashboard: aggregate counts + compliance + announcements management
- Lecturer dashboard: modules, attendance capture, assessment capture
- Learner dashboard: own attendance, progress, assessment results, announcements

## 6) Replace local mock data incrementally

Current pages use `src/data/courseData.ts`.

Target CET tables are in schema `cet` (for example `cet.programs`, `cet.modules`, `cet.learners`, etc.).

Migrate page-by-page:

1. `ProgramsPage` + `ModulesPage`
2. `LearnersPage`
3. `AttendancePage`
4. `AssessmentsPage`
5. `AnnouncementsPage`

Keep fallback UI states (loading/empty/error) during the transition.

## 7) Validation checklist

- anonymous users cannot access protected routes
- learner can only see own learner/enrollment/attendance/assessment rows
- lecturer can manage operational tables but not escalate roles
- admin can manage all records
- route redirects are deterministic and role-safe

## 8) When to use `public` vs `cet`

- Keep using `public.users` for global identity profile + base role.
- Use `cet.*` for all course manager data to avoid collision with existing non-CET product tables.
- Ignore unrelated legacy/public tables unless a feature explicitly requires them.
