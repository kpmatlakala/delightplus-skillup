-- Fresh migration that adapts to existing structure
-- This will work regardless of what currently exists

BEGIN;

-- =====================================================
-- STEP 1: Understand what we have
-- =====================================================

DO $$
DECLARE
  has_cet_schema BOOLEAN;
  has_learners_table BOOLEAN;
  has_progress_table BOOLEAN;
  progress_columns TEXT[];
  learners_columns TEXT[];
BEGIN
  -- Check schema
  SELECT EXISTS (
    SELECT 1 FROM information_schema.schemata WHERE schema_name = 'cet'
  ) INTO has_cet_schema;
  
  -- Check tables
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'cet' AND table_name = 'learners'
  ) INTO has_learners_table;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'cet' AND table_name = 'learner_progress'
  ) INTO has_progress_table;
  
  RAISE NOTICE '=== CURRENT STATE ===';
  RAISE NOTICE 'CET Schema: %', CASE WHEN has_cet_schema THEN 'EXISTS' ELSE 'MISSING' END;
  RAISE NOTICE 'Learners Table: %', CASE WHEN has_learners_table THEN 'EXISTS' ELSE 'MISSING' END;
  RAISE NOTICE 'Progress Table: %', CASE WHEN has_progress_table THEN 'EXISTS' ELSE 'MISSING' END;
END $$;

-- =====================================================
-- STEP 2: Create schema if needed
-- =====================================================

CREATE SCHEMA IF NOT EXISTS cet;

-- =====================================================
-- STEP 3: Create or fix learners table
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
    RAISE NOTICE 'Learners table created';
  ELSE
    RAISE NOTICE 'Learners table already exists';
  END IF;
END $$;

-- =====================================================
-- STEP 4: Handle learner_progress table
-- =====================================================

-- First, let's see what columns exist in learner_progress
DO $$
DECLARE
  col_exists BOOLEAN;
  table_exists BOOLEAN;
BEGIN
  -- Check if table exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'cet' AND table_name = 'learner_progress'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    RAISE NOTICE 'Creating learner_progress table from scratch...';
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
    RAISE NOTICE 'Created learner_progress table with all required columns';
  ELSE
    RAISE NOTICE 'Learner_progress table exists, checking columns...';
    
    -- Check for learner_id column specifically
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'cet' 
      AND table_name = 'learner_progress' 
      AND column_name = 'learner_id'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
      RAISE NOTICE 'Adding missing learner_id column...';
      -- Add learner_id column with a default value first
      ALTER TABLE cet.learner_progress 
      ADD COLUMN learner_id UUID;
      
      -- Try to populate it if there's a user_id column
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'cet' 
        AND table_name = 'learner_progress' 
        AND column_name = 'user_id'
      ) THEN
        RAISE NOTICE 'Found user_id column, converting to learner_id...';
        UPDATE cet.learner_progress 
        SET learner_id = (
          SELECT l.id FROM cet.learners l 
          WHERE l.user_id = cet.learner_progress.user_id
        )
        WHERE learner_id IS NULL;
      END IF;
      
      -- Make it NOT NULL after populating
      ALTER TABLE cet.learner_progress 
      ALTER COLUMN learner_id SET NOT NULL;
      
      -- Add foreign key constraint
      ALTER TABLE cet.learner_progress 
      ADD CONSTRAINT fk_learner_progress_learner_id 
      FOREIGN KEY (learner_id) REFERENCES cet.learners(id) ON DELETE CASCADE;
      
      RAISE NOTICE 'Added learner_id column and constraints';
    ELSE
      RAISE NOTICE 'learner_id column already exists';
    END IF;
  END IF;
END $$;

-- =====================================================
-- STEP 5: Add all other missing columns
-- =====================================================

DO $$
DECLARE
  columns_to_add TEXT[] := ARRAY[
    'guide_completed:BOOLEAN:FALSE',
    'quiz_completed:BOOLEAN:FALSE', 
    'quiz_score:INTEGER:NULL',
    'quiz_completed_at:TIMESTAMPTZ:NULL',
    'assessment_unlocked:BOOLEAN:FALSE',
    'assessment_submitted:BOOLEAN:FALSE',
    'submission_path:TEXT:NULL',
    'submission_uploaded_at:TIMESTAMPTZ:NULL',
    'assessment_grade:INTEGER:NULL',
    'assessment_feedback:TEXT:NULL',
    'assessment_graded_at:TIMESTAMPTZ:NULL',
    'updated_at:TIMESTAMPTZ:NOW()'
  ];
  col_info TEXT[];
  col_name TEXT;
  col_type TEXT;
  col_default TEXT;
  col_exists BOOLEAN;
BEGIN
  FOREACH col_info[1] IN ARRAY columns_to_add
  LOOP
    col_info := string_to_array(col_info[1], ':');
    col_name := col_info[1];
    col_type := col_info[2];
    col_default := col_info[3];
    
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
-- STEP 6: Create audit table
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
-- STEP 7: Create functions and triggers
-- =====================================================

CREATE OR REPLACE FUNCTION cet.auto_unlock_assessment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quiz_completed = TRUE AND NEW.quiz_score >= 70 THEN
    NEW.assessment_unlocked = TRUE;
  END IF;
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
-- STEP 8: Create indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_learner_progress_learner_id ON cet.learner_progress(learner_id);
CREATE INDEX IF NOT EXISTS idx_learner_progress_unit_std_id ON cet.learner_progress(unit_std_id);
CREATE INDEX IF NOT EXISTS idx_learner_progress_quiz_completed ON cet.learner_progress(learner_id, quiz_completed);
CREATE INDEX IF NOT EXISTS idx_learner_progress_assessment_unlocked ON cet.learner_progress(learner_id, assessment_unlocked);
CREATE INDEX IF NOT EXISTS idx_learner_progress_assessment_submitted ON cet.learner_progress(learner_id, assessment_submitted);

-- =====================================================
-- STEP 9: Enable RLS and policies
-- =====================================================

ALTER TABLE cet.learners ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.learner_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.assessment_submissions_audit ENABLE ROW LEVEL SECURITY;

-- Learners policies
DROP POLICY IF EXISTS "Users can view their own learner record" ON cet.learners;
CREATE POLICY "Users can view their own learner record" ON cet.learners
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own learner record" ON cet.learners;
CREATE POLICY "Users can update their own learner record" ON cet.learners
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all learner records" ON cet.learners;
CREATE POLICY "Admins can view all learner records" ON cet.learners
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' IN ('admin', 'lecturer')
    )
  );

-- Progress policies
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

DROP POLICY IF EXISTS "Admins can view all progress" ON cet.learner_progress;
CREATE POLICY "Admins can view all progress" ON cet.learner_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' IN ('admin', 'lecturer')
    )
  );

-- =====================================================
-- STEP 10: Final verification
-- =====================================================

DO $$
DECLARE
  learners_count INTEGER;
  progress_count INTEGER;
  progress_columns INTEGER;
BEGIN
  SELECT COUNT(*) INTO learners_count FROM cet.learners;
  SELECT COUNT(*) INTO progress_count FROM cet.learner_progress;
  
  SELECT COUNT(*) INTO progress_columns 
  FROM information_schema.columns 
  WHERE table_schema = 'cet' AND table_name = 'learner_progress';
  
  RAISE NOTICE '=== MIGRATION COMPLETED ===';
  RAISE NOTICE 'Learners: %', learners_count;
  RAISE NOTICE 'Progress records: %', progress_count;
  RAISE NOTICE 'Progress table columns: %', progress_columns;
  RAISE NOTICE '==========================';
END $$;

COMMIT;