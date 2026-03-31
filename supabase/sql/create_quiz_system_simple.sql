-- Simple, direct creation of quiz and assessment system
-- Run this directly in Supabase SQL editor

-- 1. Add missing columns to learner_progress
ALTER TABLE cet.learner_progress 
ADD COLUMN IF NOT EXISTS quiz_completed BOOLEAN DEFAULT FALSE;

ALTER TABLE cet.learner_progress 
ADD COLUMN IF NOT EXISTS quiz_passed BOOLEAN DEFAULT FALSE;

ALTER TABLE cet.learner_progress 
ADD COLUMN IF NOT EXISTS quiz_score INTEGER DEFAULT 0;

ALTER TABLE cet.learner_progress 
ADD COLUMN IF NOT EXISTS quiz_completed_at TIMESTAMPTZ;

-- 2. Create quiz_answers table
CREATE TABLE IF NOT EXISTS cet.quiz_answers (
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
  UNIQUE(learner_id, module_unit_standard_id, question_id)
);

-- 3. Create assessment_submissions_detailed table
CREATE TABLE IF NOT EXISTS cet.assessment_submissions_detailed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL REFERENCES cet.learners(id) ON DELETE CASCADE,
  module_unit_standard_id TEXT NOT NULL,
  submission_content TEXT NOT NULL,
  submission_path TEXT,
  file_name TEXT,
  file_size BIGINT,
  learner_info JSONB NOT NULL DEFAULT '{}'::JSONB,
  assessment_answers JSONB NOT NULL DEFAULT '{}'::JSONB,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  assessment_grade DECIMAL(5,2),
  assessment_feedback TEXT,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(learner_id, module_unit_standard_id)
);

-- 4. Enable RLS
ALTER TABLE cet.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.assessment_submissions_detailed ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
CREATE POLICY "Learners can manage own quiz answers" ON cet.quiz_answers
  FOR ALL USING (learner_id = (
    SELECT id FROM cet.learners WHERE user_id = auth.uid()
  ));

CREATE POLICY "Learners can manage own assessment submissions" ON cet.assessment_submissions_detailed
  FOR ALL USING (learner_id = (
    SELECT id FROM cet.learners WHERE user_id = auth.uid()
  ));

-- 6. Create functions
CREATE OR REPLACE FUNCTION save_quiz_answers(
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
  SELECT id INTO v_learner_id FROM cet.learners WHERE user_id = auth.uid();
  IF v_learner_id IS NULL THEN
    RAISE EXCEPTION 'Learner profile not found';
  END IF;

  DELETE FROM cet.quiz_answers 
  WHERE learner_id = v_learner_id AND module_unit_standard_id = p_module_id;
  
  FOR answer_record IN SELECT * FROM jsonb_each_text(p_answers) LOOP
    question_id := answer_record.key::INTEGER;
    selected_answer := answer_record.value;
    correct_answer := (p_correct_answers->>question_id::TEXT);
    
    INSERT INTO cet.quiz_answers (
      learner_id, module_unit_standard_id, question_id,
      selected_answer, correct_answer, is_correct
    ) VALUES (
      v_learner_id, p_module_id, question_id,
      selected_answer, correct_answer, selected_answer = correct_answer
    );
  END LOOP;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION get_quiz_answers(p_module_id TEXT)
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
  SELECT id INTO v_learner_id FROM cet.learners WHERE user_id = auth.uid();
  IF v_learner_id IS NULL THEN
    RAISE EXCEPTION 'Learner profile not found';
  END IF;

  RETURN QUERY
  SELECT qa.question_id, qa.selected_answer, qa.correct_answer, qa.is_correct
  FROM cet.quiz_answers qa
  WHERE qa.learner_id = v_learner_id AND qa.module_unit_standard_id = p_module_id
  ORDER BY qa.question_id;
END;
$$;

CREATE OR REPLACE FUNCTION save_assessment_submission(
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
  SELECT id INTO v_learner_id FROM cet.learners WHERE user_id = auth.uid();
  IF v_learner_id IS NULL THEN
    RAISE EXCEPTION 'Learner profile not found';
  END IF;

  INSERT INTO cet.assessment_submissions_detailed (
    learner_id, module_unit_standard_id, submission_content,
    submission_path, file_name, file_size, learner_info, assessment_answers
  ) VALUES (
    v_learner_id, p_module_id, p_submission_content,
    p_submission_path, p_file_name, p_file_size, p_learner_info, p_assessment_answers
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

CREATE OR REPLACE FUNCTION get_assessment_submission(p_module_id TEXT)
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
  SELECT id INTO v_learner_id FROM cet.learners WHERE user_id = auth.uid();
  IF v_learner_id IS NULL THEN
    RAISE EXCEPTION 'Learner profile not found';
  END IF;

  RETURN QUERY
  SELECT s.id, s.submission_content, s.submission_path, s.file_name, s.file_size,
         s.learner_info, s.assessment_answers, s.submitted_at, s.assessment_grade,
         s.assessment_feedback, s.graded_at
  FROM cet.assessment_submissions_detailed s
  WHERE s.learner_id = v_learner_id AND s.module_unit_standard_id = p_module_id;
END;
$$;