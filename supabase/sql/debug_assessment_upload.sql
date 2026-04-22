-- Debug script using correct column names from unified schema
-- This matches your actual schema structure

-- 1. Check current user authentication
SELECT 
  auth.uid() as current_user_id,
  auth.jwt() ->> 'role' as user_role,
  auth.jwt() ->> 'email' as user_email;

-- 2. Check if cet schema exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'cet')
    THEN 'CET schema exists'
    ELSE 'CET schema does NOT exist'
  END as schema_status;

-- 3. Check what tables exist in cet schema
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'cet'
ORDER BY table_name;

-- 4. Check learner_progress table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'cet' 
  AND table_name = 'learner_progress'
ORDER BY ordinal_position;

-- 5. Check current user's progress data (using correct column names)
SELECT 
  lp.user_id,
  lp.module_unit_standard_id,
  lp.guide_completed,
  lp.quiz_passed,
  lp.quiz_completed,
  lp.quiz_score,
  lp.assessment_unlocked,
  lp.assessment_submitted,
  lp.submission_path,
  lp.submission_uploaded_at
FROM cet.learner_progress lp
WHERE lp.user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'cet' AND table_name = 'learner_progress'
  )
LIMIT 5;

-- 6. Test the path format that would be generated
SELECT 
  'learner-' || COALESCE(auth.uid()::text, 'no-auth') || '/unit-test-module-' || extract(epoch from now())::bigint || '-assessment.txt' as generated_path;

-- 7. Check storage policies for assessment-submissions bucket
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%submission%'
ORDER BY policyname;

-- 8. Check if the assessment-submissions bucket exists
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'assessment-submissions';

-- 9. Check all storage buckets
SELECT 
  id,
  name,
  public
FROM storage.buckets 
ORDER BY name;