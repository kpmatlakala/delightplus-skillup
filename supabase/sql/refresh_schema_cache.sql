-- Force refresh Supabase schema cache by making a small change

-- 1. First, let's see what columns actually exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'learner_progress' 
  AND table_schema = 'cet'
ORDER BY column_name;

-- 2. Force schema cache refresh by making a harmless change
COMMENT ON TABLE cet.learner_progress IS 'Learner progress tracking with quiz support - updated';

-- 3. Try to select from the table to force cache refresh
SELECT COUNT(*) as total_progress_records FROM cet.learner_progress;

-- 4. Test if the new columns are accessible
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'learner_progress' 
        AND table_schema = 'cet' 
        AND column_name = 'quiz_completed'
    ) THEN 'quiz_completed column exists'
    ELSE 'quiz_completed column missing'
  END as quiz_completed_status,
  
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'learner_progress' 
        AND table_schema = 'cet' 
        AND column_name = 'quiz_score'
    ) THEN 'quiz_score column exists'
    ELSE 'quiz_score column missing'
  END as quiz_score_status;

-- 5. If columns exist, try a test query
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'learner_progress' 
      AND table_schema = 'cet' 
      AND column_name = 'quiz_completed'
  ) THEN
    -- Test query to make sure columns work
    PERFORM quiz_completed, quiz_score FROM cet.learner_progress LIMIT 1;
    RAISE NOTICE 'Quiz columns are working correctly!';
  ELSE
    RAISE NOTICE 'Quiz columns still not available in schema cache';
  END IF;
END $$;