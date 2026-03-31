-- SAFE ASSESSMENT TABLE CREATION
-- This script only CREATES new tables and functions without modifying existing ones
-- It's safe to run on production as it only adds new functionality

-- 1. Create assessment submissions table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS cet.assessment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL,
  unit_std_id TEXT NOT NULL,
  submission_text TEXT NOT NULL,
  file_path TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  grade INTEGER CHECK (grade >= 0 AND grade <= 100),
  feedback TEXT,
  graded_at TIMESTAMPTZ,
  graded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint to prevent duplicate submissions
  CONSTRAINT unique_learner_unit_submission 
    UNIQUE (learner_id, unit_std_id)
);

-- 2. Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_learner_id 
ON cet.assessment_submissions(learner_id);

CREATE INDEX IF NOT EXISTS idx_assessment_submissions_unit_std_id 
ON cet.assessment_submissions(unit_std_id);

-- 3. Enable RLS (safe to run multiple times)
ALTER TABLE cet.assessment_submissions ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies (only if they don't exist)
DO $$
BEGIN
  -- Learners can read their own submissions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'cet' 
    AND tablename = 'assessment_submissions' 
    AND policyname = 'Learners can read own assessment submissions'
  ) THEN
    CREATE POLICY "Learners can read own assessment submissions"
    ON cet.assessment_submissions FOR SELECT
    TO authenticated
    USING (
      learner_id = (
        SELECT id FROM cet.learners 
        WHERE user_id = auth.uid()
      )
    );
  END IF;

  -- Learners can insert their own submissions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'cet' 
    AND tablename = 'assessment_submissions' 
    AND policyname = 'Learners can insert own assessment submissions'
  ) THEN
    CREATE POLICY "Learners can insert own assessment submissions"
    ON cet.assessment_submissions FOR INSERT
    TO authenticated
    WITH CHECK (
      learner_id = (
        SELECT id FROM cet.learners 
        WHERE user_id = auth.uid()
      )
    );
  END IF;

  -- Admins can read all submissions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'cet' 
    AND tablename = 'assessment_submissions' 
    AND policyname = 'Admins can read all assessment submissions'
  ) THEN
    CREATE POLICY "Admins can read all assessment submissions"
    ON cet.assessment_submissions FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
      )
    );
  END IF;

  -- Admins can update submissions (for grading)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'cet' 
    AND tablename = 'assessment_submissions' 
    AND policyname = 'Admins can update assessment submissions'
  ) THEN
    CREATE POLICY "Admins can update assessment submissions"
    ON cet.assessment_submissions FOR UPDATE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
      )
    );
  END IF;
END $$;

-- 5. Create RPC function to submit assessment (safe to run multiple times)
CREATE OR REPLACE FUNCTION cet_submit_assessment(
  p_unit_std_id TEXT,
  p_submission_text TEXT,
  p_file_path TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_learner_id UUID;
  v_submission_id UUID;
BEGIN
  -- Get the learner ID for the current user
  SELECT id INTO v_learner_id 
  FROM cet.learners 
  WHERE user_id = auth.uid();
  
  IF v_learner_id IS NULL THEN
    RAISE EXCEPTION 'Learner profile not found for user';
  END IF;

  -- Insert or update the assessment submission
  INSERT INTO cet.assessment_submissions (
    learner_id,
    unit_std_id,
    submission_text,
    file_path,
    submitted_at
  ) VALUES (
    v_learner_id,
    p_unit_std_id,
    p_submission_text,
    p_file_path,
    NOW()
  )
  ON CONFLICT (learner_id, unit_std_id) 
  DO UPDATE SET
    submission_text = EXCLUDED.submission_text,
    file_path = EXCLUDED.file_path,
    submitted_at = EXCLUDED.submitted_at,
    updated_at = NOW()
  RETURNING id INTO v_submission_id;

  -- Also update the existing learner_progress table (if it exists)
  INSERT INTO cet.learner_progress (
    learner_id,
    unit_std_id,
    assessment_submitted,
    submission_path,
    submission_uploaded_at
  ) VALUES (
    v_learner_id,
    p_unit_std_id,
    true,
    p_file_path,
    NOW()
  )
  ON CONFLICT (learner_id, unit_std_id)
  DO UPDATE SET
    assessment_submitted = true,
    submission_path = EXCLUDED.submission_path,
    submission_uploaded_at = EXCLUDED.submission_uploaded_at,
    updated_at = NOW();

  RETURN v_submission_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION cet_submit_assessment TO authenticated;

-- Success message
SELECT 'Assessment submission table and functions created successfully!' as result;