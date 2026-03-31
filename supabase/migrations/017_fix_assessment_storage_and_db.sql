-- Fix assessment storage policies and create database storage for assessments

-- 1. Drop existing conflicting policies
DROP POLICY IF EXISTS "Learner can upload own submission" ON storage.objects;
DROP POLICY IF EXISTS "Learner can read own submission" ON storage.objects;
DROP POLICY IF EXISTS "Learner can update own submission" ON storage.objects;
DROP POLICY IF EXISTS "Admin can read all submissions" ON storage.objects;

-- 2. Create new storage policies that work with our folder structure
-- Allow learners to upload to their own folder (learner-{userId}/...)
CREATE POLICY "Learners can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'assessment-submissions'
  AND (storage.foldername(name))[1] = 'learner-' || auth.uid()::text
);

-- Allow learners to read their own submissions
CREATE POLICY "Learners can read own submissions"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'assessment-submissions'
  AND (storage.foldername(name))[1] = 'learner-' || auth.uid()::text
);

-- Allow admins to read all submissions
CREATE POLICY "Admins can read all submissions"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'assessment-submissions'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'moderator')
  )
);

-- Allow admins to delete submissions if needed
CREATE POLICY "Admins can delete submissions"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'assessment-submissions'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'moderator')
  )
);

-- 3. Create assessment submissions table for database storage
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
  graded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Foreign key to learners table
  CONSTRAINT fk_assessment_submissions_learner 
    FOREIGN KEY (learner_id) 
    REFERENCES cet.learners(id) 
    ON DELETE CASCADE,
    
  -- Unique constraint to prevent duplicate submissions
  CONSTRAINT unique_learner_unit_submission 
    UNIQUE (learner_id, unit_std_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_learner_id 
ON cet.assessment_submissions(learner_id);

CREATE INDEX IF NOT EXISTS idx_assessment_submissions_unit_std_id 
ON cet.assessment_submissions(unit_std_id);

CREATE INDEX IF NOT EXISTS idx_assessment_submissions_graded 
ON cet.assessment_submissions(grade) 
WHERE grade IS NOT NULL;

-- 4. Enable RLS on assessment submissions table
ALTER TABLE cet.assessment_submissions ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for assessment submissions
-- Learners can read their own submissions
CREATE POLICY "Learners can read own assessment submissions"
ON cet.assessment_submissions FOR SELECT
TO authenticated
USING (
  learner_id = (
    SELECT id FROM cet.learners 
    WHERE user_id = auth.uid()
  )
);

-- Learners can insert their own submissions
CREATE POLICY "Learners can insert own assessment submissions"
ON cet.assessment_submissions FOR INSERT
TO authenticated
WITH CHECK (
  learner_id = (
    SELECT id FROM cet.learners 
    WHERE user_id = auth.uid()
  )
);

-- Admins can read all submissions
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

-- Admins can update submissions (for grading)
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

-- 6. Create RPC function to submit assessment
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

  -- Also update the learner_progress table
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

-- 7. Create RPC function to get assessment submissions for grading
CREATE OR REPLACE FUNCTION cet_get_assessment_submissions_for_grading(
  p_unit_std_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  submission_id UUID,
  learner_id UUID,
  learner_name TEXT,
  unit_std_id TEXT,
  submission_text TEXT,
  file_path TEXT,
  submitted_at TIMESTAMPTZ,
  grade INTEGER,
  feedback TEXT,
  graded_at TIMESTAMPTZ,
  graded_by UUID,
  grader_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has permission to view submissions (admin or lecturer)
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'moderator')
  ) THEN
    RAISE EXCEPTION 'Only facilitators can view assessment submissions';
  END IF;

  RETURN QUERY
  SELECT 
    s.id as submission_id,
    s.learner_id,
    l.full_name as learner_name,
    s.unit_std_id,
    s.submission_text,
    s.file_path,
    s.submitted_at,
    s.grade,
    s.feedback,
    s.graded_at,
    s.graded_by,
    COALESCE(
      (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = s.graded_by),
      'Unknown'
    ) as grader_name
  FROM cet.assessment_submissions s
  JOIN cet.learners l ON l.id = s.learner_id
  WHERE (p_unit_std_id IS NULL OR s.unit_std_id = p_unit_std_id)
  ORDER BY s.submitted_at DESC;
END;
$$;

-- 8. Create RPC function to grade assessment
CREATE OR REPLACE FUNCTION cet_grade_assessment_submission(
  p_submission_id UUID,
  p_grade INTEGER,
  p_feedback TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_learner_id UUID;
  v_unit_std_id TEXT;
BEGIN
  -- Check if user has permission to grade (admin or lecturer)
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'moderator')
  ) THEN
    RAISE EXCEPTION 'Only facilitators can grade assessments';
  END IF;

  -- Validate grade range
  IF p_grade < 0 OR p_grade > 100 THEN
    RAISE EXCEPTION 'Grade must be between 0 and 100';
  END IF;

  -- Update the assessment submission with grade and feedback
  UPDATE cet.assessment_submissions 
  SET 
    grade = p_grade,
    feedback = p_feedback,
    graded_at = NOW(),
    graded_by = auth.uid(),
    updated_at = NOW()
  WHERE id = p_submission_id
  RETURNING learner_id, unit_std_id INTO v_learner_id, v_unit_std_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Assessment submission not found';
  END IF;

  -- Also update the learner_progress table
  UPDATE cet.learner_progress 
  SET 
    assessment_grade = p_grade,
    assessment_feedback = p_feedback,
    graded_at = NOW(),
    graded_by = auth.uid(),
    updated_at = NOW()
  WHERE learner_id = v_learner_id 
    AND unit_std_id = v_unit_std_id;

  RETURN TRUE;
END;
$$;

-- 9. Grant execute permissions
GRANT EXECUTE ON FUNCTION cet_submit_assessment TO authenticated;
GRANT EXECUTE ON FUNCTION cet_get_assessment_submissions_for_grading TO authenticated;
GRANT EXECUTE ON FUNCTION cet_grade_assessment_submission TO authenticated;