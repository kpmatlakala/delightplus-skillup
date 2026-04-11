-- Check current storage policies to understand what we're working with
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%assessment%'
ORDER BY policyname;

-- Also check if the bucket exists
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets 
WHERE id = 'assessment-submissions';

-- Check existing objects in the bucket (if any)
SELECT name, bucket_id, owner, created_at
FROM storage.objects 
WHERE bucket_id = 'assessment-submissions'
LIMIT 10;