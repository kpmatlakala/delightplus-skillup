-- Check the actual structure of existing tables
-- This will help us understand what columns actually exist

-- 1. Check if cet schema exists
SELECT 'Schema Check' as check_type, schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'cet';

-- 2. List all tables in cet schema
SELECT 'Tables in CET schema' as check_type, table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'cet'
ORDER BY table_name;

-- 3. Check ACTUAL structure of learner_progress table
SELECT 
  'learner_progress columns' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'cet' 
  AND table_name = 'learner_progress'
ORDER BY ordinal_position;

-- 4. Check ACTUAL structure of learners table (if it exists)
SELECT 
  'learners columns' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'cet' 
  AND table_name = 'learners'
ORDER BY ordinal_position;

-- 5. Show sample data from learner_progress to understand the structure
SELECT 'Sample learner_progress data' as info;
SELECT * FROM cet.learner_progress LIMIT 3;

-- 6. Show sample data from learners (if exists)
SELECT 'Sample learners data' as info;
SELECT * FROM cet.learners LIMIT 3;