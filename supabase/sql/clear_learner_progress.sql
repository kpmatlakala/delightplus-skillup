-- Clear learner progress for fresh testing
-- This will reset all quiz and assessment progress

-- Clear learner progress (this will reset quiz/assessment status)
DELETE FROM cet.learner_progress 
WHERE user_id = (SELECT auth.uid());

-- If the quiz_answers table exists, clear it too
DROP TABLE IF EXISTS cet.quiz_answers CASCADE;

-- If the assessment_submissions_detailed table exists, clear it too  
DROP TABLE IF EXISTS cet.assessment_submissions_detailed CASCADE;

-- Clear any existing functions
DROP FUNCTION IF EXISTS public.save_quiz_answers(TEXT, JSONB, JSONB, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS public.get_quiz_answers(TEXT);
DROP FUNCTION IF EXISTS public.save_assessment_submission(TEXT, TEXT, TEXT, TEXT, BIGINT, JSONB, JSONB);
DROP FUNCTION IF EXISTS public.get_assessment_submission(TEXT);

-- Show current progress (should be empty after clearing)
SELECT 
  module_unit_standard_id,
  guide_completed,
  quiz_completed,
  quiz_score,
  assessment_submitted
FROM cet.learner_progress 
WHERE user_id = (SELECT auth.uid());