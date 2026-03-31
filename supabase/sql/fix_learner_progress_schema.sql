-- Fix learner_progress table schema to support quiz completion and assessment flow
-- This script ensures all necessary columns exist and creates proper constraints

-- Ensure the learner_progress table exists with all required columns
DO $$
BEGIN
  -- Check if table exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress'
  ) THEN
    CREATE TABLE cet.learner_progress (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      learner_id UUID NOT NULL REFERENCES cet.learners(id) ON DELETE CASCADE,
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
      UNIQUE(learner_id, unit_std_id)
    );
    
    -- Create indexes
    CREATE INDEX idx_learner_progress_learner_id ON cet.learner_progress(learner_id);
    CREATE INDEX idx_learner_progress_unit_std_id ON cet.learner_progress(unit_std_id);
    CREATE INDEX idx_learner_progress_quiz_completed ON cet.learner_progress(learner_id, quiz_completed);
    CREATE INDEX idx_learner_progress_assessment_unlocked ON cet.learner_progress(learner_id, assessment_unlocked);
  END IF;
END $$;

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Add guide_completed column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'guide_completed'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN guide_completed BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add quiz_completed column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'quiz_completed'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN quiz_completed BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add quiz_score column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'quiz_score'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN quiz_score INTEGER CHECK (quiz_score >= 0 AND quiz_score <= 100);
  END IF;

  -- Add quiz_completed_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'quiz_completed_at'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN quiz_completed_at TIMESTAMPTZ;
  END IF;

  -- Add assessment_unlocked column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'assessment_unlocked'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN assessment_unlocked BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add assessment_submitted column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'assessment_submitted'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN assessment_submitted BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add submission_path column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'submission_path'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN submission_path TEXT;
  END IF;

  -- Add submission_uploaded_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'submission_uploaded_at'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN submission_uploaded_at TIMESTAMPTZ;
  END IF;

  -- Add assessment_grade column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'assessment_grade'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN assessment_grade INTEGER CHECK (assessment_grade >= 0 AND assessment_grade <= 100);
  END IF;

  -- Add assessment_feedback column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'assessment_feedback'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN assessment_feedback TEXT;
  END IF;

  -- Add assessment_graded_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'assessment_graded_at'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN assessment_graded_at TIMESTAMPTZ;
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Create or replace trigger function to automatically unlock assessment when quiz is passed
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

-- Create trigger to automatically unlock assessment
DROP TRIGGER IF EXISTS trigger_auto_unlock_assessment ON cet.learner_progress;
CREATE TRIGGER trigger_auto_unlock_assessment
  BEFORE INSERT OR UPDATE ON cet.learner_progress
  FOR EACH ROW
  EXECUTE FUNCTION cet.auto_unlock_assessment();

-- Update existing records where quiz is completed but assessment not unlocked
UPDATE cet.learner_progress 
SET assessment_unlocked = TRUE, updated_at = NOW()
WHERE quiz_completed = TRUE 
  AND quiz_score >= 70 
  AND (assessment_unlocked IS NULL OR assessment_unlocked = FALSE);

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_learner_progress_learner_id 
ON cet.learner_progress(learner_id);

CREATE INDEX IF NOT EXISTS idx_learner_progress_unit_std_id 
ON cet.learner_progress(unit_std_id);

CREATE INDEX IF NOT EXISTS idx_learner_progress_quiz_completed 
ON cet.learner_progress(learner_id, quiz_completed);

CREATE INDEX IF NOT EXISTS idx_learner_progress_assessment_unlocked 
ON cet.learner_progress(learner_id, assessment_unlocked);

CREATE INDEX IF NOT EXISTS idx_learner_progress_assessment_submitted 
ON cet.learner_progress(learner_id, assessment_submitted);

-- Enable RLS on the table
ALTER TABLE cet.learner_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for learner_progress
DROP POLICY IF EXISTS "Learners can view their own progress" ON cet.learner_progress;
CREATE POLICY "Learners can view their own progress" ON cet.learner_progress
  FOR SELECT USING (
    learner_id IN (
      SELECT id FROM cet.learners WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Learners can update their own progress" ON cet.learner_progress;
CREATE POLICY "Learners can update their own progress" ON cet.learner_progress
  FOR ALL USING (
    learner_id IN (
      SELECT id FROM cet.learners WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins and lecturers can view all progress" ON cet.learner_progress;
CREATE POLICY "Admins and lecturers can view all progress" ON cet.learner_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' IN ('admin', 'lecturer')
    )
  );

DROP POLICY IF EXISTS "Admins and lecturers can update all progress" ON cet.learner_progress;
CREATE POLICY "Admins and lecturers can update all progress" ON cet.learner_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' IN ('admin', 'lecturer')
    )
  );

-- Verify the changes
SELECT 
  'learner_progress table schema updated successfully' as status,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE quiz_completed = TRUE) as quiz_completed_count,
  COUNT(*) FILTER (WHERE assessment_unlocked = TRUE) as assessment_unlocked_count,
  COUNT(*) FILTER (WHERE assessment_submitted = TRUE) as assessment_submitted_count
FROM cet.learner_progress;