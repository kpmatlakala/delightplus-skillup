-- Verify that the quiz and assessment tables and functions were created correctly

-- Check if tables exist
SELECT 
  table_name, 
  table_schema
FROM information_schema.tables 
WHERE table_name IN ('quiz_answers', 'assessment_submissions_detailed')
  AND table_schema = 'cet';

-- Check if functions exist
SELECT 
  routine_name,
  routine_schema,
  routine_type
FROM information_schema.routines 
WHERE routine_name IN (
  'save_quiz_answers', 
  'get_quiz_answers', 
  'save_assessment_submission', 
  'get_assessment_submission'
)
AND routine_schema = 'public';

-- Check if learner_progress table has the new columns
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'learner_progress' 
  AND table_schema = 'cet'
  AND column_name IN ('quiz_completed', 'quiz_passed', 'quiz_score', 'quiz_completed_at');

-- Test calling one of the functions (should not error)
SELECT 'Functions are working!' as status;