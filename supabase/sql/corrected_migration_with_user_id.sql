-- Corrected migration using user_id (not learner_id)
-- This matches your actual schema structure

BEGIN;

-- =====================================================
-- STEP 1: Create schema if needed
-- =====================================================

CREATE SCHEMA IF NOT EXISTS cet;

-- =====================================================
-- STEP 2: Create or update learner_progress table with user_id
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'cet' AND table_name = 'learner_progress'
  ) THEN
    RAISE NOTICE 'Creating learner_progress table with user_id...';
    CREATE TABLE cet.learner_progress (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      unit_std_id TEXT NOT NULL,
      guide_completed BOOLEAN DEFAULT FALSE,
      quiz_completed BOOLEAN DEFAULT FALSE,
      quiz_score INTEGER CHECK (quiz_score >= 0 AND quiz_score <= 100),
      quiz_completed_at TIMESTAMPTZ,
      assessment_unlocked BOOLEAN DEFAULT FALSE,
      assessment_submitted BOOLEAN DEFAULT FALSE,
      submission_path TEXT,
      submission_uploaded_at TIMESTAMPTZ,
      assessment_grade INTEGER CHECK (assessment_grade >= 0 AND assessment_grade <= 100),
      assessment_feedback TEXT,
      assessment_graded_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, unit_std_id)
    );
    RAISE NOTICE 'Created learner_progress table with user_id';
  ELSE
    RAISE NOTICE 'Learner_progress table already exists';
  END IF;
END $$;

-- =====================================================
-- STEP 3: Add missing columns to existing table
-- =====================================================

DO $$
DECLARE
  columns_to_add TEXT[] := ARRAY[
    'guide_completed',
    'quiz_completed', 
    'quiz_score',
    'quiz_completed_at',
    'assessment_unlocked',
    'assessment_submitted',
    'submission_path',
    'submission_uploaded_at',
    'assessment_grade',
    'assessment_feedback',
    'assessment_graded_at',
    'updated_at'
  ];
  col_name TEXT;
  col_exists BOOLEAN;
BEGIN
  FOREACH col_name IN ARRAY columns_to_add
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'cet' 
      AND table_name = 'learner_progress' 
      AND column_name = col_name
    ) INTO col_exists;
    
    IF NOT col_exists THEN
      CASE col_name
        WHEN 'guide_completed' THEN
          ALTER TABLE cet.learner_progress ADD COLUMN guide_completed BOOLEAN DEFAULT FALSE;
        WHEN 'quiz_completed' THEN
          ALTER TABLE cet.learner_progress ADD COLUMN quiz_completed BOOLEAN DEFAULT FALSE;
        WHEN 'quiz_score' THEN
          ALTER TABLE cet.learner_progress ADD COLUMN quiz_score INTEGER CHECK (quiz_score >= 0 AND quiz_score <= 100);
        WHEN 'quiz_completed_at' THEN
          ALTER TABLE cet.learner_progress ADD COLUMN quiz_completed_at TIMESTAMPTZ;
        WHEN 'assessment_unlocked' THEN
          ALTER TABLE cet.learner_progress ADD COLUMN assessment_unlocked BOOLEAN DEFAULT FALSE;
        WHEN 'assessment_submitted' THEN
          ALTER TABLE cet.learner_progress ADD COLUMN assessment_submitted BOOLEAN DEFAULT FALSE;
        WHEN 'submission_path' THEN
          ALTER TABLE cet.learner_progress ADD COLUMN submission_path TEXT;
        WHEN 'submission_uploaded_at' THEN
          ALTER TABLE cet.learner_progress ADD COLUMN submission_uploaded_at TIMESTAMPTZ;
        WHEN 'assessment_grade' THEN
          ALTER TABLE cet.learner_progress ADD COLUMN assessment_grade INTEGER CHECK (assessment_grade >= 0 AND assessment_grade <= 100);
        WHEN 'assessment_feedback' THEN
          ALTER TABLE cet.learner_progress ADD COLUMN assessment_feedback TEXT;
        WHEN 'assessment_graded_at' THEN
          ALTER TABLE cet.learner_progress ADD COLUMN assessment_graded_at TIMESTAMPTZ;
        WHEN 'updated_at' THEN
          ALTER TABLE cet.learner_progress ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
      END CASE;
      RAISE NOTICE 'Added column: %', col_name;
    END IF;
  END LOOP;
END $$;

-- =====================================================
-- STEP 4: Create triggers for auto-unlock
-- =====================================================

CREATE OR REPLACE FUNCTION cet.auto_unlock_assessment()
RETURNS TRIGGER AS $$
BEGIN
  -- If quiz is completed and score is 70% or higher, unlock assessment
  IF NEW.quiz_completed = TRUE AND NEW.quiz_score >= 70 THEN
    NEW.assessment_unlocked = TRUE;
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
-- STEP 5: Create indexes for performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_learner_progress_user_id 
ON cet.learner_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_learner_progress_unit_std_id 
ON cet.learner_progress(unit_std_id);

CREATE INDEX IF NOT EXISTS idx_learner_progress_quiz_completed 
ON cet.learner_progress(user_id, quiz_completed);

CREATE INDEX IF NOT EXISTS idx_learner_progress_assessment_unlocked 
ON cet.learner_progress(user_id, assessment_unlocked);

CREATE INDEX IF NOT EXISTS idx_learner_progress_assessment_submitted 
ON cet.learner_progress(user_id, assessment_submitted);

-- =====================================================
-- STEP 6: Enable RLS and create policies
-- =====================================================

ALTER TABLE cet.learner_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies using user_id
DROP POLICY IF EXISTS "Users can view their own progress" ON cet.learner_progress;
CREATE POLICY "Users can view their own progress" ON cet.learner_progress
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own progress" ON cet.learner_progress;
CREATE POLICY "Users can update their own progress" ON cet.learner_progress
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all progress" ON cet.learner_progress;
CREATE POLICY "Admins can view all progress" ON cet.learner_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' IN ('admin', 'lecturer')
    )
  );

DROP POLICY IF EXISTS "Admins can update all progress" ON cet.learner_progress;
CREATE POLICY "Admins can update all progress" ON cet.learner_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' IN ('admin', 'lecturer')
    )
  );

-- =====================================================
-- STEP 7: Update existing data
-- =====================================================

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