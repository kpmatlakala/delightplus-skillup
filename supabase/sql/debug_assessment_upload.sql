-- Debug and fix the learner_progress table structure

-- 1. First, let's see what columns actually exist in learner_progress
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'learner_progress' 
  AND table_schema = 'cet'
ORDER BY ordinal_position;

-- 2. Let's see the actual table structure
\d cet.learner_progress;

-- 3. Check if the table exists at all
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_name = 'learner_progress';

-- 4. Let's see what tables exist in the cet schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'cet'
ORDER BY table_name;