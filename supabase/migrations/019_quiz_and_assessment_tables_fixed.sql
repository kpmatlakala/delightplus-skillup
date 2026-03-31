-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Learners can view own quiz answers" ON cet.quiz_answers;
DROP POLICY IF EXISTS "Learners can insert own quiz answers" ON cet.quiz_answers;
DROP POLICY IF EXISTS "Learners can update own quiz answers" ON cet.quiz_answers;
DROP POLICY IF EXISTS "Admins can view all quiz answers" ON cet.quiz_answers;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS cet.quiz_answers CASCADE;
DROP TABLE IF EXISTS cet.assessment_submissions_detailed CASCADE;

-- Create table for storing quiz answers
CREATE TABLE cet.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL REFERENCES cet.learners(id) ON DELETE CASCADE,
  module_unit_standard_id TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  selected_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one answer per learner per module per question
  UNIQUE(learner_id, module_unit_standard_id, question_id)
);

-- Create table for storing assessment submissions with full content
CREATE TABLE cet.assessment_submissions_detailed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL REFERENCES cet.learners(id) ON DELETE CASCADE,
  module_unit_standard_id TEXT NOT NULL,
  submission_content TEXT NOT NULL, -- Full formatted assessment text
  submission_path TEXT, -- File path in storage (optional)
  file_name TEXT,
  file_size BIGINT,
  learner_info JSONB NOT NULL DEFAULT '{}'::JSONB, -- Store learner information
  assessment_answers JSONB NOT NULL DEFAULT '{}'::JSONB, -- Store all answers as JSON
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  assessment_grade DECIMAL(5,2),
  assessment_feedback TEXT,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one submission per learner per module (allow resubmission by updating)
  UNIQUE(learner_id, module_unit_standard_id)
);

-- Add missing columns to learner_progress table
ALTER TABLE cet.learner_progress 
ADD COLUMN IF NOT EXISTS quiz_completed BOOLEAN DEFAULT FALSE;

ALTER TABLE cet.learner_progress 
ADD COLUMN IF NOT EXISTS quiz_passed BOOLEAN DEFAULT FALSE;

ALTER TABLE cet.learner_progress 
ADD COLUMN IF NOT EXISTS quiz_score INTEGER DEFAULT 0;

ALTER TABLE cet.learner_progress 
ADD COLUMN IF NOT EXISTS quiz_completed_at TIMESTAMPTZ;

-- Enable RLS on both tables
ALTER TABLE cet.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.assessment_submissions_detailed ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz_answers
CREATE POLICY "Learners can view own quiz answers" ON cet.quiz_answers
  FOR SELECT USING (learner_id = (
    SELECT id FROM cet.learners WHERE user_id = auth.uid()
  ));

CREATE POLICY "Learners can insert own quiz answers" ON cet.quiz_answers
  FOR INSERT WITH CHECK (learner_id = (
    SELECT id FROM cet.learners WHERE user_id = auth.uid()
  ));

CREATE POLICY "Learners can update own quiz answers" ON cet.quiz_answers
  FOR UPDATE USING (learner_id = (
    SELECT id FROM cet.learners WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all quiz answers" ON cet.quiz_answers
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'moderator')
  ));

-- RLS Policies for assessment_submissions_detailed
CREATE POLICY "Learners can view own assessment submissions" ON cet.assessment_submissions_detailed
  FOR SELECT USING (learner_id = (
    SELECT id FROM cet.learners WHERE user_id = auth.uid()
  ));

CREATE POLICY "Learners can insert own assessment submissions" ON cet.assessment_submissions_detailed
  FOR INSERT WITH CHECK (learner_id = (
    SELECT id FROM cet.learners WHERE user_id = auth.uid()
  ));

CREATE POLICY "Learners can update own assessment submissions" ON cet.assessment_submissions_detailed
  FOR UPDATE USING (learner_id = (
    SELECT id FROM cet.learners WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all assessment submissions" ON cet.assessment_submissions_detailed
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'moderator')
  ));

CREATE POLICY "Admins can update assessment submissions for grading" ON cet.assessment_submissions_detailed
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'moderator')
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_answers_learner_module ON cet.quiz_answers(learner_id, module_unit_standard_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_submitted_at ON cet.quiz_answers(submitted_at);
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_detailed_learner_module ON cet.assessment_submissions_detailed(learner_id, module_unit_standard_id);
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_detailed_submitted_at ON cet.assessment_submissions_detailed(submitted_at);
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_detailed_graded_at ON cet.assessment_submissions_detailed(graded_at);

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.save_quiz_answers(TEXT, JSONB, JSONB, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS public.get_quiz_answers(TEXT);
DROP FUNCTION IF EXISTS public.save_assessment_submission(TEXT, TEXT, TEXT, TEXT, BIGINT, JSONB, JSONB);
DROP FUNCTION IF EXISTS public.get_assessment_submission(TEXT);

-- Create function to save quiz answers
CREATE OR REPLACE FUNCTION public.save_quiz_answers(
  p_module_id TEXT,
  p_answers JSONB,
  p_correct_answers JSONB,
  p_score INTEGER,
  p_total INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  answer_record RECORD;
  question_id INTEGER;
  selected_answer TEXT;
  correct_answer TEXT;
  v_learner_id UUID;
BEGIN
  -- Get the learner ID for the current user
  SELECT id INTO v_learner_id 
  FROM cet.learners 
  WHERE user_id = auth.uid();
  
  IF v_learner_id IS NULL THEN
    RAISE EXCEPTION 'Learner profile not found for user';
  END IF;

  -- Clear existing answers for this learner and module
  DELETE FROM cet.quiz_answers 
  WHERE learner_id = v_learner_id AND module_unit_standard_id = p_module_id;
  
  -- Insert new answers
  FOR answer_record IN SELECT * FROM jsonb_each_text(p_answers)
  LOOP
    question_id := answer_record.key::INTEGER;
    selected_answer := answer_record.value;
    correct_answer := (p_correct_answers->>question_id::TEXT);
    
    INSERT INTO cet.quiz_answers (
      learner_id,
      module_unit_standard_id,
      question_id,
      selected_answer,
      correct_answer,
      is_correct
    ) VALUES (
      v_learner_id,
      p_module_id,
      question_id,
      selected_answer,
      correct_answer,
      selected_answer = correct_answer
    );
  END LOOP;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Create function to get quiz answers
CREATE OR REPLACE FUNCTION public.get_quiz_answers(p_module_id TEXT)
RETURNS TABLE(
  question_id INTEGER,
  selected_answer TEXT,
  correct_answer TEXT,
  is_correct BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_learner_id UUID;
BEGIN
  -- Get the learner ID for the current user
  SELECT id INTO v_learner_id 
  FROM cet.learners 
  WHERE user_id = auth.uid();
  
  IF v_learner_id IS NULL THEN
    RAISE EXCEPTION 'Learner profile not found for user';
  END IF;

  RETURN QUERY
  SELECT 
    qa.question_id,
    qa.selected_answer,
    qa.correct_answer,
    qa.is_correct
  FROM cet.quiz_answers qa
  WHERE qa.learner_id = v_learner_id 
    AND qa.module_unit_standard_id = p_module_id
  ORDER BY qa.question_id;
END;
$$;

-- Create function to save assessment submission
CREATE OR REPLACE FUNCTION public.save_assessment_submission(
  p_module_id TEXT,
  p_submission_content TEXT,
  p_submission_path TEXT DEFAULT NULL,
  p_file_name TEXT DEFAULT NULL,
  p_file_size BIGINT DEFAULT NULL,
  p_learner_info JSONB DEFAULT '{}'::JSONB,
  p_assessment_answers JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  submission_id UUID;
  v_learner_id UUID;
BEGIN
  -- Get the learner ID for the current user
  SELECT id INTO v_learner_id 
  FROM cet.learners 
  WHERE user_id = auth.uid();
  
  IF v_learner_id IS NULL THEN
    RAISE EXCEPTION 'Learner profile not found for user';
  END IF;

  -- Insert or update assessment submission
  INSERT INTO cet.assessment_submissions_detailed (
    learner_id,
    module_unit_standard_id,
    submission_content,
    submission_path,
    file_name,
    file_size,
    learner_info,
    assessment_answers
  ) VALUES (
    v_learner_id,
    p_module_id,
    p_submission_content,
    p_submission_path,
    p_file_name,
    p_file_size,
    p_learner_info,
    p_assessment_answers
  )
  ON CONFLICT (learner_id, module_unit_standard_id)
  DO UPDATE SET
    submission_content = EXCLUDED.submission_content,
    submission_path = EXCLUDED.submission_path,
    file_name = EXCLUDED.file_name,
    file_size = EXCLUDED.file_size,
    learner_info = EXCLUDED.learner_info,
    assessment_answers = EXCLUDED.assessment_answers,
    submitted_at = NOW(),
    updated_at = NOW()
  RETURNING id INTO submission_id;
  
  RETURN submission_id;
END;
$$;

-- Create function to get assessment submission
CREATE OR REPLACE FUNCTION public.get_assessment_submission(p_module_id TEXT)
RETURNS TABLE(
  id UUID,
  submission_content TEXT,
  submission_path TEXT,
  file_name TEXT,
  file_size BIGINT,
  learner_info JSONB,
  assessment_answers JSONB,
  submitted_at TIMESTAMPTZ,
  assessment_grade DECIMAL(5,2),
  assessment_feedback TEXT,
  graded_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_learner_id UUID;
BEGIN
  -- Get the learner ID for the current user
  SELECT id INTO v_learner_id 
  FROM cet.learners 
  WHERE user_id = auth.uid();
  
  IF v_learner_id IS NULL THEN
    RAISE EXCEPTION 'Learner profile not found for user';
  END IF;

  RETURN QUERY
  SELECT 
    s.id,
    s.submission_content,
    s.submission_path,
    s.file_name,
    s.file_size,
    s.learner_info,
    s.assessment_answers,
    s.submitted_at,
    s.assessment_grade,
    s.assessment_feedback,
    s.graded_at
  FROM cet.assessment_submissions_detailed s
  WHERE s.learner_id = v_learner_id 
    AND s.module_unit_standard_id = p_module_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.save_quiz_answers TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_quiz_answers TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_assessment_submission TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_assessment_submission TO authenticated;