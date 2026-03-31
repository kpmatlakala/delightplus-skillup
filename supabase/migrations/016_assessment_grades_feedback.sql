-- Add assessment grade and feedback columns to learner_progress table
ALTER TABLE cet.learner_progress 
ADD COLUMN IF NOT EXISTS assessment_grade INTEGER CHECK (assessment_grade >= 0 AND assessment_grade <= 100),
ADD COLUMN IF NOT EXISTS assessment_feedback TEXT,
ADD COLUMN IF NOT EXISTS graded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS graded_by UUID REFERENCES auth.users(id);

-- Create index for faster queries on graded assessments
CREATE INDEX IF NOT EXISTS idx_learner_progress_graded 
ON cet.learner_progress(assessment_grade) 
WHERE assessment_grade IS NOT NULL;

-- Add RPC function for facilitators to grade assessments
CREATE OR REPLACE FUNCTION cet_grade_assessment(
  p_learner_id UUID,
  p_unit_std_id TEXT,
  p_grade INTEGER,
  p_feedback TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_role cet.user_role;
BEGIN
  -- Check if user has permission to grade (admin or lecturer)
  current_role := cet.get_my_role();
  IF current_role NOT IN ('admin', 'lecturer') THEN
    RAISE EXCEPTION 'Only facilitators can grade assessments';
  END IF;

  -- Validate grade range
  IF p_grade < 0 OR p_grade > 100 THEN
    RAISE EXCEPTION 'Grade must be between 0 and 100';
  END IF;

  -- Update the learner's progress with grade and feedback
  UPDATE cet.learner_progress 
  SET 
    assessment_grade = p_grade,
    assessment_feedback = p_feedback,
    graded_at = NOW(),
    graded_by = auth.uid(),
    updated_at = NOW()
  WHERE learner_id = p_learner_id 
    AND unit_std_id = p_unit_std_id
    AND assessment_submitted = true;

  -- Return true if a row was updated
  RETURN FOUND;
END;
$$;

-- Add RPC function to get assessment submissions for grading (facilitator view)
CREATE OR REPLACE FUNCTION cet_get_assessment_submissions(
  p_unit_std_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  learner_id UUID,
  learner_name TEXT,
  unit_std_id TEXT,
  submission_path TEXT,
  submitted_at TIMESTAMPTZ,
  assessment_grade INTEGER,
  assessment_feedback TEXT,
  graded_at TIMESTAMPTZ,
  graded_by UUID,
  grader_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_role cet.user_role;
BEGIN
  -- Check if user has permission to view submissions (admin or lecturer)
  current_role := cet.get_my_role();
  IF current_role NOT IN ('admin', 'lecturer') THEN
    RAISE EXCEPTION 'Only facilitators can view assessment submissions';
  END IF;

  RETURN QUERY
  SELECT 
    lp.learner_id,
    l.full_name as learner_name,
    lp.unit_std_id,
    lp.submission_path,
    lp.submission_uploaded_at as submitted_at,
    lp.assessment_grade,
    lp.assessment_feedback,
    lp.graded_at,
    lp.graded_by,
    COALESCE(
      (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = lp.graded_by),
      'Unknown'
    ) as grader_name
  FROM cet.learner_progress lp
  JOIN cet.learners l ON l.id = lp.learner_id
  WHERE lp.assessment_submitted = true
    AND (p_unit_std_id IS NULL OR lp.unit_std_id = p_unit_std_id)
  ORDER BY lp.submission_uploaded_at DESC;
END;
$$;

-- Add RPC function to get learner's own assessment status
CREATE OR REPLACE FUNCTION cet_get_my_assessment_status(
  p_unit_std_id TEXT
)
RETURNS TABLE (
  unit_std_id TEXT,
  assessment_submitted BOOLEAN,
  submission_path TEXT,
  submitted_at TIMESTAMPTZ,
  assessment_grade INTEGER,
  assessment_feedback TEXT,
  graded_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  learner_record RECORD;
BEGIN
  -- Get the learner record for the current user
  SELECT id INTO learner_record FROM cet.learners WHERE user_id = auth.uid();
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Learner profile not found';
  END IF;

  RETURN QUERY
  SELECT 
    lp.unit_std_id,
    lp.assessment_submitted,
    lp.submission_path,
    lp.submission_uploaded_at as submitted_at,
    lp.assessment_grade,
    lp.assessment_feedback,
    lp.graded_at
  FROM cet.learner_progress lp
  WHERE lp.learner_id = learner_record.id
    AND lp.unit_std_id = p_unit_std_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION cet_grade_assessment TO authenticated;
GRANT EXECUTE ON FUNCTION cet_get_assessment_submissions TO authenticated;
GRANT EXECUTE ON FUNCTION cet_get_my_assessment_status TO authenticated;