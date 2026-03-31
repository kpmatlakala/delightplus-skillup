-- =====================================================
-- CET Connect Portal - Safe Database Migration
-- This version includes extensive checks before making changes
-- =====================================================

-- Start transaction
BEGIN;

-- =====================================================
-- PRE-MIGRATION CHECKS
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '=== STARTING SAFE MIGRATION ===';
  RAISE NOTICE 'Checking current database state...';
END $$;

-- Check if cet schema exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'cet') THEN
    RAISE NOTICE 'Creating cet schema...';
    CREATE SCHEMA cet;
  ELSE
    RAISE NOTICE 'CET schema already exists';
  END IF;
END $$;

-- =====================================================
-- MIGRATION 1: Ensure learners table exists
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'cet' AND table_name = 'learners'
  ) THEN
    RAISE NOTICE 'Creating learners table...';
    CREATE TABLE cet.learners (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      full_name TEXT NOT NULL,
      id_number TEXT,
      phone TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id)
    );
    
    -- Enable RLS
    ALTER TABLE cet.learners ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Users can view their own learner record" ON cet.learners
      FOR SELECT USING (user_id = auth.uid());
    
    CREATE POLICY "Users can update their own learner record" ON cet.learners
      FOR UPDATE USING (user_id = auth.uid());
    
    CREATE POLICY "Admins can view all learner records" ON cet.learners
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM auth.users 
          WHERE id = auth.uid() 
          AND raw_user_meta_data->>'role' IN ('admin', 'lecturer')
        )
      );
      
    RAISE NOTICE 'Learners table created successfully';
  ELSE
    RAISE NOTICE 'Learners table already exists';
  END IF;
END $$;

-- =====================================================
-- MIGRATION 2: Create/Update learner_progress table
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'cet' AND table_name = 'learner_progress'
  ) THEN
    RAISE NOTICE 'Creating learner_progress table...';
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
    RAISE NOTICE 'Learner_progress table created successfully';
  ELSE
    RAISE NOTICE 'Learner_progress table already exists, checking for missing columns...';
  END IF;
END $$;

-- Add missing columns to existing learner_progress table
DO $$
DECLARE
  col_name TEXT;
  col_names TEXT[] := ARRAY[
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
BEGIN
  FOREACH col_name IN ARRAY col_names
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'cet' 
      AND table_name = 'learner_progress' 
      AND column_name = col_name
    ) THEN
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
-- MIGRATION 3: Create assessment audit table
-- =====================================================

CREATE TABLE IF NOT EXISTS cet.assessment_submissions_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  learner_id UUID NOT NULL REFERENCES cet.learners(id) ON DELETE CASCADE,
  unit_std_id TEXT NOT NULL,
  submission_path TEXT NOT NULL,
  file_size_bytes BIGINT,
  file_type TEXT,
  submission_method TEXT DEFAULT 'web_upload',
  ip_address INET,
  user_agent TEXT,
  submission_timestamp TIMESTAMPTZ DEFAULT NOW(),
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processed', 'failed')),
  error_details JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MIGRATION 4: Create functions and triggers
-- =====================================================

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

-- Create function to log assessment submissions
CREATE OR REPLACE FUNCTION cet.log_assessment_submission(
  p_learner_id UUID,
  p_unit_std_id TEXT,
  p_submission_path TEXT,
  p_file_size_bytes BIGINT DEFAULT NULL,
  p_file_type TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO cet.assessment_submissions_audit (
    learner_id,
    unit_std_id,
    submission_path,
    file_size_bytes,
    file_type,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    p_learner_id,
    p_unit_std_id,
    p_submission_path,
    p_file_size_bytes,
    p_file_type,
    p_ip_address,
    p_user_agent,
    p_metadata
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MIGRATION 5: Create indexes
-- =====================================================

-- Create indexes for better performance
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

-- Audit table indexes
CREATE INDEX IF NOT EXISTS idx_assessment_audit_learner_id 
ON cet.assessment_submissions_audit(learner_id);

CREATE INDEX IF NOT EXISTS idx_assessment_audit_unit_std_id 
ON cet.assessment_submissions_audit(unit_std_id);

CREATE INDEX IF NOT EXISTS idx_assessment_audit_timestamp 
ON cet.assessment_submissions_audit(submission_timestamp);

-- =====================================================
-- MIGRATION 6: Enable RLS and create policies
-- =====================================================

-- Enable RLS on the tables
ALTER TABLE cet.learner_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.assessment_submissions_audit ENABLE ROW LEVEL SECURITY;

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

-- Create RLS policies for audit table
DROP POLICY IF EXISTS "Admins can view all audit logs" ON cet.assessment_submissions_audit;
CREATE POLICY "Admins can view all audit logs" ON cet.assessment_submissions_audit
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' IN ('admin', 'lecturer')
    )
  );

DROP POLICY IF EXISTS "System can insert audit logs" ON cet.assessment_submissions_audit;
CREATE POLICY "System can insert audit logs" ON cet.assessment_submissions_audit
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- MIGRATION 7: Update existing data
-- =====================================================

-- Update existing records where quiz is completed but assessment not unlocked
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE cet.learner_progress 
  SET assessment_unlocked = TRUE, updated_at = NOW()
  WHERE quiz_completed = TRUE 
    AND quiz_score >= 70 
    AND (assessment_unlocked IS NULL OR assessment_unlocked = FALSE);
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE 'Updated % records to unlock assessments', updated_count;
END $$;

-- =====================================================
-- MIGRATION COMPLETE - Verification
-- =====================================================

DO $$
DECLARE
  progress_count INTEGER;
  audit_count INTEGER;
  quiz_completed_count INTEGER;
  assessment_unlocked_count INTEGER;
  assessment_submitted_count INTEGER;
  learners_count INTEGER;
BEGIN
  -- Count records
  SELECT COUNT(*) INTO learners_count FROM cet.learners;
  SELECT COUNT(*) INTO progress_count FROM cet.learner_progress;
  SELECT COUNT(*) INTO quiz_completed_count FROM cet.learner_progress WHERE quiz_completed = TRUE;
  SELECT COUNT(*) INTO assessment_unlocked_count FROM cet.learner_progress WHERE assessment_unlocked = TRUE;
  SELECT COUNT(*) INTO assessment_submitted_count FROM cet.learner_progress WHERE assessment_submitted = TRUE;
  SELECT COUNT(*) INTO audit_count FROM cet.assessment_submissions_audit;
  
  RAISE NOTICE '=== MIGRATION COMPLETED SUCCESSFULLY ===';
  RAISE NOTICE 'Learners: %', learners_count;
  RAISE NOTICE 'Progress Records: %', progress_count;
  RAISE NOTICE 'Quiz Completed: %', quiz_completed_count;
  RAISE NOTICE 'Assessment Unlocked: %', assessment_unlocked_count;
  RAISE NOTICE 'Assessment Submitted: %', assessment_submitted_count;
  RAISE NOTICE 'Audit Records: %', audit_count;
  RAISE NOTICE '==========================================';
END $$;

COMMIT;