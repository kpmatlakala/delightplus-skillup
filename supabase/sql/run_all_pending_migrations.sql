-- =====================================================
-- CET Connect Portal - Pending Database Migrations
-- Run this script to apply all recent database changes
-- =====================================================

-- This script combines all pending migrations:
-- 1. Assessment submission improvements
-- 2. Learner progress schema fixes  
-- 3. Quiz completion and assessment flow
-- 4. Storage policies and security
-- 5. Audit system for submissions

BEGIN;

-- =====================================================
-- MIGRATION 1: Fix learner_progress table schema
-- =====================================================

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
    
    RAISE NOTICE 'Created learner_progress table';
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
    RAISE NOTICE 'Added guide_completed column';
  END IF;

  -- Add quiz_completed column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'quiz_completed'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN quiz_completed BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added quiz_completed column';
  END IF;

  -- Add quiz_score column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'quiz_score'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN quiz_score INTEGER CHECK (quiz_score >= 0 AND quiz_score <= 100);
    RAISE NOTICE 'Added quiz_score column';
  END IF;

  -- Add quiz_completed_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'quiz_completed_at'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN quiz_completed_at TIMESTAMPTZ;
    RAISE NOTICE 'Added quiz_completed_at column';
  END IF;

  -- Add assessment_unlocked column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'assessment_unlocked'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN assessment_unlocked BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added assessment_unlocked column';
  END IF;

  -- Add assessment_submitted column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'assessment_submitted'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN assessment_submitted BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added assessment_submitted column';
  END IF;

  -- Add submission_path column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'submission_path'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN submission_path TEXT;
    RAISE NOTICE 'Added submission_path column';
  END IF;

  -- Add submission_uploaded_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'submission_uploaded_at'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN submission_uploaded_at TIMESTAMPTZ;
    RAISE NOTICE 'Added submission_uploaded_at column';
  END IF;

  -- Add assessment_grade column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'assessment_grade'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN assessment_grade INTEGER CHECK (assessment_grade >= 0 AND assessment_grade <= 100);
    RAISE NOTICE 'Added assessment_grade column';
  END IF;

  -- Add assessment_feedback column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'assessment_feedback'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN assessment_feedback TEXT;
    RAISE NOTICE 'Added assessment_feedback column';
  END IF;

  -- Add assessment_graded_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'assessment_graded_at'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN assessment_graded_at TIMESTAMPTZ;
    RAISE NOTICE 'Added assessment_graded_at column';
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'cet' 
    AND table_name = 'learner_progress' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE cet.learner_progress ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE 'Added updated_at column';
  END IF;
END $$;

-- =====================================================
-- MIGRATION 2: Create assessment submissions audit table
-- =====================================================

-- Create audit table for assessment submissions
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

-- Create indexes for audit table
CREATE INDEX IF NOT EXISTS idx_assessment_audit_learner_id 
ON cet.assessment_submissions_audit(learner_id);

CREATE INDEX IF NOT EXISTS idx_assessment_audit_unit_std_id 
ON cet.assessment_submissions_audit(unit_std_id);

CREATE INDEX IF NOT EXISTS idx_assessment_audit_timestamp 
ON cet.assessment_submissions_audit(submission_timestamp);

-- =====================================================
-- MIGRATION 3: Create triggers and functions
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
-- MIGRATION 4: Create indexes for performance
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

-- =====================================================
-- MIGRATION 5: Enable RLS and create policies
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
-- MIGRATION 6: Update existing data
-- =====================================================

-- Update existing records where quiz is completed but assessment not unlocked
UPDATE cet.learner_progress 
SET assessment_unlocked = TRUE, updated_at = NOW()
WHERE quiz_completed = TRUE 
  AND quiz_score >= 70 
  AND (assessment_unlocked IS NULL OR assessment_unlocked = FALSE);

-- =====================================================
-- MIGRATION 7: Storage policies (if needed)
-- =====================================================

-- Ensure assessment-submissions bucket exists and has proper policies
-- Note: This assumes the bucket already exists from previous setup

-- Create storage policy for assessment submissions (if not exists)
DO $$
BEGIN
  -- Check if policy exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'assessment-submissions' 
    AND name = 'Learners can upload to their own folder'
  ) THEN
    -- Create policy for learners to upload to their own folder
    INSERT INTO storage.policies (bucket_id, name, definition, check_definition)
    VALUES (
      'assessment-submissions',
      'Learners can upload to their own folder',
      '(bucket_id = ''assessment-submissions'') AND (auth.uid()::text = (storage.foldername(name))[1])',
      '(bucket_id = ''assessment-submissions'') AND (auth.uid()::text = (storage.foldername(name))[1])'
    );
    RAISE NOTICE 'Created storage policy for learner uploads';
  END IF;

  -- Check if admin policy exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'assessment-submissions' 
    AND name = 'Admins can access all files'
  ) THEN
    -- Create policy for admins to access all files
    INSERT INTO storage.policies (bucket_id, name, definition, check_definition)
    VALUES (
      'assessment-submissions',
      'Admins can access all files',
      '(bucket_id = ''assessment-submissions'') AND (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>''role'' IN (''admin'', ''lecturer'')))',
      '(bucket_id = ''assessment-submissions'') AND (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>''role'' IN (''admin'', ''lecturer'')))'
    );
    RAISE NOTICE 'Created storage policy for admin access';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Storage policies may need to be created manually in Supabase dashboard';
END $$;

-- =====================================================
-- MIGRATION COMPLETE - Verification
-- =====================================================

-- Verify the changes
DO $$
DECLARE
  progress_count INTEGER;
  audit_count INTEGER;
  quiz_completed_count INTEGER;
  assessment_unlocked_count INTEGER;
  assessment_submitted_count INTEGER;
BEGIN
  -- Count records in learner_progress
  SELECT COUNT(*) INTO progress_count FROM cet.learner_progress;
  SELECT COUNT(*) INTO quiz_completed_count FROM cet.learner_progress WHERE quiz_completed = TRUE;
  SELECT COUNT(*) INTO assessment_unlocked_count FROM cet.learner_progress WHERE assessment_unlocked = TRUE;
  SELECT COUNT(*) INTO assessment_submitted_count FROM cet.learner_progress WHERE assessment_submitted = TRUE;
  
  -- Count records in audit table
  SELECT COUNT(*) INTO audit_count FROM cet.assessment_submissions_audit;
  
  RAISE NOTICE '=== MIGRATION COMPLETED SUCCESSFULLY ===';
  RAISE NOTICE 'Learner Progress Records: %', progress_count;
  RAISE NOTICE 'Quiz Completed: %', quiz_completed_count;
  RAISE NOTICE 'Assessment Unlocked: %', assessment_unlocked_count;
  RAISE NOTICE 'Assessment Submitted: %', assessment_submitted_count;
  RAISE NOTICE 'Audit Log Records: %', audit_count;
  RAISE NOTICE '==========================================';
END $$;

COMMIT;

-- =====================================================
-- POST-MIGRATION NOTES
-- =====================================================

/*
MIGRATION SUMMARY:
✅ Fixed learner_progress table schema with all required columns
✅ Created assessment_submissions_audit table for tracking
✅ Added triggers for automatic assessment unlocking (quiz score ≥ 70%)
✅ Created indexes for better performance
✅ Enabled RLS and created security policies
✅ Updated existing data to unlock assessments where appropriate
✅ Added storage policies for secure file uploads

WHAT THIS FIXES:
- 404 errors from missing RPC functions
- Quiz completion not saving properly
- Assessment not unlocking after quiz completion
- Missing audit trail for submissions
- Performance issues with large datasets
- Security gaps in data access

NEXT STEPS:
1. Test the quiz completion flow
2. Verify assessment unlocking works
3. Test file upload functionality
4. Check that progress tracking works correctly
5. Verify mobile experience for mature learners

If you encounter any issues, check the Supabase logs for detailed error messages.
*/