-- Corrected migration using actual column names from unified schema
-- Based on the existing cet.learner_progress table structure

BEGIN;

-- =====================================================
-- STEP 1: Check current table structure
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '=== CHECKING EXISTING SCHEMA ===';
  
  -- Check if learner_progress table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'cet' AND table_name = 'learner_progress'
  ) THEN
    RAISE NOTICE 'learner_progress table exists';
  ELSE
    RAISE NOTICE 'learner_progress table does NOT exist';
  END IF;
END $$;

-- =====================================================
-- STEP 2: Add missing columns to existing table
-- =====================================================

-- The unified schema shows these existing columns:
-- - user_id (UUID, references auth.users)
-- - module_unit_standard_id (TEXT, not unit_std_id!)
-- - guide_completed (BOOLEAN)
-- - quiz_passed (BOOLEAN, not quiz_completed!)
-- - assessment_unlocked (BOOLEAN)
-- - submission_path (TEXT)
-- - submission_uploaded_at (TIMESTAMPTZ)
-- - assessment_submitted (BOOLEAN)
-- - assessment_submitted_at (TIMESTAMPTZ)

-- Add missing columns that we need for quiz completion flow
DO $$
DECLARE
  col_exists BOOLEAN;
BEGIN
  -- Add quiz_completed column (since schema has quiz_passed)
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'quiz_completed'
  ) INTO col_exists;
  
  IF NOT col_exists THEN
    ALTER TABLE cet.learner_progress ADD COLUMN quiz_completed BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added quiz_completed column';
  END IF;

  -- Add quiz_score column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'quiz_score'
  ) INTO col_exists;
  
  IF NOT col_exists THEN
    ALTER TABLE cet.learner_progress ADD COLUMN quiz_score INTEGER CHECK (quiz_score >= 0 AND quiz_score <= 100);
    RAISE NOTICE 'Added quiz_score column';
  END IF;

  -- Add quiz_completed_at column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'quiz_completed_at'
  ) INTO col_exists;
  
  IF NOT col_exists THEN
    ALTER TABLE cet.learner_progress ADD COLUMN quiz_completed_at TIMESTAMPTZ;
    RAISE NOTICE 'Added quiz_completed_at column';
  END IF;

  -- Add assessment_grade column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'assessment_grade'
  ) INTO col_exists;
  
  IF NOT col_exists THEN
    ALTER TABLE cet.learner_progress ADD COLUMN assessment_grade INTEGER CHECK (assessment_grade >= 0 AND assessment_grade <= 100);
    RAISE NOTICE 'Added assessment_grade column';
  END IF;

  -- Add assessment_feedback column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'assessment_feedback'
  ) INTO col_exists;
  
  IF NOT col_exists THEN
    ALTER TABLE cet.learner_progress ADD COLUMN assessment_feedback TEXT;
    RAISE NOTICE 'Added assessment_feedback column';
  END IF;

  -- Add assessment_graded_at column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'assessment_graded_at'
  ) INTO col_exists;
  
  IF NOT col_exists THEN
    ALTER TABLE cet.learner_progress ADD COLUMN assessment_graded_at TIMESTAMPTZ;
    RAISE NOTICE 'Added assessment_graded_at column';
  END IF;
END $$;

-- =====================================================
-- STEP 3: Create triggers for auto-unlock
-- =====================================================

CREATE OR REPLACE FUNCTION cet.auto_unlock_assessment()
RETURNS TRIGGER AS $$
BEGIN
  -- If quiz is completed and score is 70% or higher, unlock assessment
  IF NEW.quiz_completed = TRUE AND NEW.quiz_score >= 70 THEN
    NEW.assessment_unlocked = TRUE;
    -- Also update the old quiz_passed column for compatibility
    NEW.quiz_passed = TRUE;
  END IF;
  
  -- Update the updated_at timestamp
  NEW.updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_unlock_assessment ON cet.learner_progress;
CREATE TRIGGER trigger_auto_unlock_assessment
  BEFORE INSERT OR UPDATE ON cet.learner_progress
  FOR EACH ROW
  EXECUTE FUNCTION cet.auto_unlock_assessment();

-- =====================================================
-- STEP 4: Create indexes for performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_learner_progress_quiz_completed 
ON cet.learner_progress(user_id, quiz_completed);

CREATE INDEX IF NOT EXISTS idx_learner_progress_assessment_unlocked 
ON cet.learner_progress(user_id, assessment_unlocked);

CREATE INDEX IF NOT EXISTS idx_learner_progress_assessment_submitted 
ON cet.learner_progress(user_id, assessment_submitted);

-- =====================================================
-- STEP 5: Update existing data
-- =====================================================

-- Sync quiz_completed with quiz_passed for existing records
UPDATE cet.learner_progress 
SET quiz_completed = quiz_passed
WHERE quiz_completed IS NULL OR quiz_completed != quiz_passed;

-- Update existing records where quiz is completed but assessment not unlocked
UPDATE cet.learner_progress 
SET assessment_unlocked = TRUE, updated_at = NOW()
WHERE quiz_completed = TRUE 
  AND quiz_score >= 70 
  AND (assessment_unlocked IS NULL OR assessment_unlocked = FALSE);

-- =====================================================
-- VERIFICATION
-- =====================================================

DO $$
DECLARE
  progress_count INTEGER;
  quiz_completed_count INTEGER;
  assessment_unlocked_count INTEGER;
  assessment_submitted_count INTEGER;
  column_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO progress_count FROM cet.learner_progress;
  SELECT COUNT(*) INTO quiz_completed_count FROM cet.learner_progress WHERE quiz_completed = TRUE;
  SELECT COUNT(*) INTO assessment_unlocked_count FROM cet.learner_progress WHERE assessment_unlocked = TRUE;
  SELECT COUNT(*) INTO assessment_submitted_count FROM cet.learner_progress WHERE assessment_submitted = TRUE;
  
  SELECT COUNT(*) INTO column_count 
  FROM information_schema.columns 
  WHERE table_schema = 'cet' AND table_name = 'learner_progress';
  
  RAISE NOTICE '=== MIGRATION COMPLETED SUCCESSFULLY ===';
  RAISE NOTICE 'Progress Records: %', progress_count;
  RAISE NOTICE 'Quiz Completed: %', quiz_completed_count;
  RAISE NOTICE 'Assessment Unlocked: %', assessment_unlocked_count;
  RAISE NOTICE 'Assessment Submitted: %', assessment_submitted_count;
  RAISE NOTICE 'Table Columns: %', column_count;
  RAISE NOTICE '==========================================';
END $$;

COMMIT;