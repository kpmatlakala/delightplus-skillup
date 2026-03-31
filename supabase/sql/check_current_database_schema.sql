-- Check current database schema before running migrations
-- This will help us understand what exists and what needs to be created

-- 1. Check if cet schema exists
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'cet';

-- 2. Check what tables exist in cet schema
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'cet'
ORDER BY table_name;

-- 3. Check if learner_progress table exists and its structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'cet' 
  AND table_name = 'learner_progress'
ORDER BY ordinal_position;

-- 4. Check if learners table exists and its structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'cet' 
  AND table_name = 'learners'
ORDER BY ordinal_position;

-- 5. Check current user and authentication
SELECT 
  auth.uid() as current_user_id,
  CASE 
    WHEN auth.uid() IS NULL THEN 'Not authenticated'
    ELSE 'Authenticated'
  END as auth_status;

-- 6. If learners table exists, check if there are any records
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'cet' AND table_name = 'learners'
  ) THEN
    RAISE NOTICE 'Learners table exists. Record count: %', (SELECT COUNT(*) FROM cet.learners);
  ELSE
    RAISE NOTICE 'Learners table does not exist';
  END IF;
END $$;

-- 7. If learner_progress table exists, check if there are any records
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'cet' AND table_name = 'learner_progress'
  ) THEN
    RAISE NOTICE 'Learner_progress table exists. Record count: %', (SELECT COUNT(*) FROM cet.learner_progress);
  ELSE
    RAISE NOTICE 'Learner_progress table does not exist';
  END IF;
END $$;