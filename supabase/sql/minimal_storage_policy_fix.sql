-- Minimal fix for storage policies only
-- Run this if you just need to fix storage issues

-- Check if assessment-submissions bucket exists
SELECT 
  'Bucket Check' as type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'assessment-submissions')
    THEN 'assessment-submissions bucket EXISTS'
    ELSE 'assessment-submissions bucket MISSING'
  END as status;

-- Create bucket if it doesn't exist (this might need to be done in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('assessment-submissions', 'assessment-submissions', false)
-- ON CONFLICT (id) DO NOTHING;

-- Check current storage policies
SELECT 
  'Current Policies' as type,
  bucket_id,
  name,
  definition
FROM storage.policies 
WHERE bucket_id = 'assessment-submissions'
ORDER BY name;

-- Remove old policies if they exist
DELETE FROM storage.policies 
WHERE bucket_id = 'assessment-submissions';

-- Create new storage policies
INSERT INTO storage.policies (bucket_id, name, definition, check_definition) VALUES
(
  'assessment-submissions',
  'Learners can upload to their own folder',
  '(bucket_id = ''assessment-submissions'') AND (auth.uid()::text = (storage.foldername(name))[1])',
  '(bucket_id = ''assessment-submissions'') AND (auth.uid()::text = (storage.foldername(name))[1])'
),
(
  'assessment-submissions',
  'Admins can access all files',
  '(bucket_id = ''assessment-submissions'') AND (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>''role'' IN (''admin'', ''lecturer'')))',
  '(bucket_id = ''assessment-submissions'') AND (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>''role'' IN (''admin'', ''lecturer'')))'
)
ON CONFLICT (bucket_id, name) DO UPDATE SET
  definition = EXCLUDED.definition,
  check_definition = EXCLUDED.check_definition;

-- Verify policies were created
SELECT 
  'New Policies' as type,
  bucket_id,
  name,
  definition
FROM storage.policies 
WHERE bucket_id = 'assessment-submissions'
ORDER BY name;