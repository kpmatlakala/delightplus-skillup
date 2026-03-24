-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  Migration 016 — Assessment Submissions Storage                         ║
-- ║  Date: 2026-03-04                                                       ║
-- ║                                                                          ║
-- ║  Creates the private `assessment-submissions` storage bucket and        ║
-- ║  RLS policies so that:                                                  ║
-- ║    • Learners can upload/read files inside their own folder             ║
-- ║      (path prefix: learner-{uid}/)                                      ║
-- ║    • Admins and moderators can read all submissions                     ║
-- ║    • Learners can generate signed URLs for their own files (for email)  ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- ── 1. Create bucket (idempotent) ────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'assessment-submissions',
  'assessment-submissions',
  false,
  10485760,  -- 10 MB per file
  array['text/plain', 'application/octet-stream']
)
on conflict (id) do nothing;

-- ── 2. Drop existing policies first (idempotent) ─────────────────────────────

drop policy if exists "Learner can upload own submission"   on storage.objects;
drop policy if exists "Learner can read own submission"     on storage.objects;
drop policy if exists "Learner can delete own submission"   on storage.objects;
drop policy if exists "Admin can read all submissions"      on storage.objects;

-- ── 3. INSERT — learner uploads into their own folder ─────────────────────────
--    Path format enforced by frontend: learner-{auth.uid()}/module-{id}/filename

create policy "Learner can upload own submission"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'assessment-submissions'
  and (storage.foldername(name))[1] = 'learner-' || auth.uid()::text
);

-- ── 4. SELECT — learner reads their own folder ───────────────────────────────

create policy "Learner can read own submission"
on storage.objects for select
to authenticated
using (
  bucket_id = 'assessment-submissions'
  and (storage.foldername(name))[1] = 'learner-' || auth.uid()::text
);

-- ── 5. DELETE — learner can remove their own files ───────────────────────────

create policy "Learner can delete own submission"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'assessment-submissions'
  and (storage.foldername(name))[1] = 'learner-' || auth.uid()::text
);

-- ── 6. SELECT — admin / moderator reads everything ───────────────────────────
--    Reads auth.jwt() role claim set in raw_user_meta_data by the platform.

create policy "Admin can read all submissions"
on storage.objects for select
to authenticated
using (
  bucket_id = 'assessment-submissions'
  and (
    (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'moderator')
    or
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'moderator')
  )
);

-- ── End of migration 016 ─────────────────────────────────────────────────────
