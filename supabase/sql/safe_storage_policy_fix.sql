-- SAFE STORAGE POLICY FIX
-- This script only ADDS new policies without dropping existing ones
-- Review this carefully before running on production

-- First, let's check what we currently have
-- Run this query first to see existing policies:
-- SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE '%assessment%';

-- Only add new policies if they don't exist
-- This is safe because it won't affect existing data

-- Policy for learner uploads (more permissive path matching)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Learners can upload assessments v2'
  ) THEN
    CREATE POLICY "Learners can upload assessments v2"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'assessment-submissions'
      AND (
        -- Allow learner-{userId} format
        (storage.foldername(name))[1] = 'learner-' || auth.uid()::text
        OR
        -- Also allow direct userId format (fallback)
        (storage.foldername(name))[1] = auth.uid()::text
      )
    );
  END IF;
END $$;

-- Policy for learner reads (more permissive path matching)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Learners can read assessments v2'
  ) THEN
    CREATE POLICY "Learners can read assessments v2"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
      bucket_id = 'assessment-submissions'
      AND (
        -- Allow learner-{userId} format
        (storage.foldername(name))[1] = 'learner-' || auth.uid()::text
        OR
        -- Also allow direct userId format (fallback)
        (storage.foldername(name))[1] = auth.uid()::text
      )
    );
  END IF;
END $$;

-- Admin read policy (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can read all assessments v2'
  ) THEN
    CREATE POLICY "Admins can read all assessments v2"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
      bucket_id = 'assessment-submissions'
      AND EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
      )
    );
  END IF;
END $$;