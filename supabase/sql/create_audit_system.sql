-- COMPREHENSIVE DATABASE AUDIT SYSTEM
-- This script creates tables and functions for comprehensive assessment submission auditing
-- Safe to run on production - only creates new tables and functions

-- 1. Create assessment submissions audit table
CREATE TABLE IF NOT EXISTS cet.assessment_submissions_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  module_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  submission_timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  error_details TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create email receipts tracking table
CREATE TABLE IF NOT EXISTS cet.email_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  submission_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  module_title TEXT,
  file_path TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create submission audit log table
CREATE TABLE IF NOT EXISTS cet.submission_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  module_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_audit_user_id 
ON cet.assessment_submissions_audit(user_id);

CREATE INDEX IF NOT EXISTS idx_assessment_submissions_audit_module_id 
ON cet.assessment_submissions_audit(module_id);

CREATE INDEX IF NOT EXISTS idx_assessment_submissions_audit_timestamp 
ON cet.assessment_submissions_audit(submission_timestamp);

CREATE INDEX IF NOT EXISTS idx_email_receipts_user_email 
ON cet.email_receipts(user_email);

CREATE INDEX IF NOT EXISTS idx_email_receipts_status 
ON cet.email_receipts(status);

CREATE INDEX IF NOT EXISTS idx_submission_audit_log_user_id 
ON cet.submission_audit_log(user_id);

CREATE INDEX IF NOT EXISTS idx_submission_audit_log_module_id 
ON cet.submission_audit_log(module_id);

-- 5. Enable RLS on all audit tables
ALTER TABLE cet.assessment_submissions_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.email_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.submission_audit_log ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for audit tables
DO $$
BEGIN
  -- Admins can view all audit records
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'cet' 
    AND tablename = 'assessment_submissions_audit' 
    AND policyname = 'Admins can view all audit records'
  ) THEN
    CREATE POLICY "Admins can view all audit records"
    ON cet.assessment_submissions_audit FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
      )
    );
  END IF;

  -- Users can view their own audit records
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'cet' 
    AND tablename = 'assessment_submissions_audit' 
    AND policyname = 'Users can view own audit records'
  ) THEN
    CREATE POLICY "Users can view own audit records"
    ON cet.assessment_submissions_audit FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
  END IF;

  -- System can insert audit records
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'cet' 
    AND tablename = 'assessment_submissions_audit' 
    AND policyname = 'System can insert audit records'
  ) THEN
    CREATE POLICY "System can insert audit records"
    ON cet.assessment_submissions_audit FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
  END IF;

  -- Email receipts policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'cet' 
    AND tablename = 'email_receipts' 
    AND policyname = 'Admins can manage email receipts'
  ) THEN
    CREATE POLICY "Admins can manage email receipts"
    ON cet.email_receipts FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
      )
    );
  END IF;

  -- Submission audit log policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'cet' 
    AND tablename = 'submission_audit_log' 
    AND policyname = 'Admins can view submission audit log'
  ) THEN
    CREATE POLICY "Admins can view submission audit log"
    ON cet.submission_audit_log FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
      )
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'cet' 
    AND tablename = 'submission_audit_log' 
    AND policyname = 'System can insert audit log'
  ) THEN
    CREATE POLICY "System can insert audit log"
    ON cet.submission_audit_log FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- 7. Create RPC function to log assessment submission
CREATE OR REPLACE FUNCTION cet_log_assessment_submission(
  p_module_id TEXT,
  p_file_path TEXT,
  p_file_name TEXT,
  p_file_size BIGINT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_status TEXT DEFAULT 'submitted'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_audit_id UUID;
BEGIN
  -- Insert audit record
  INSERT INTO cet.assessment_submissions_audit (
    user_id,
    module_id,
    file_path,
    file_name,
    file_size,
    ip_address,
    user_agent,
    status
  ) VALUES (
    auth.uid(),
    p_module_id,
    p_file_path,
    p_file_name,
    p_file_size,
    p_ip_address::INET,
    p_user_agent,
    p_status
  )
  RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$;

-- 8. Create RPC function to get submission statistics
CREATE OR REPLACE FUNCTION cet_get_submission_stats(
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  total_submissions BIGINT,
  successful_submissions BIGINT,
  failed_submissions BIGINT,
  last_submission_date TIMESTAMPTZ,
  most_active_module TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If no user_id provided, use current user
  IF p_user_id IS NULL THEN
    p_user_id := auth.uid();
  END IF;

  -- Check if user can access these stats (admin or own stats)
  IF NOT (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'moderator')
    ) OR p_user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*) as total_submissions,
    COUNT(*) FILTER (WHERE status = 'submitted') as successful_submissions,
    COUNT(*) FILTER (WHERE status != 'submitted') as failed_submissions,
    MAX(submission_timestamp) as last_submission_date,
    (
      SELECT module_id 
      FROM cet.assessment_submissions_audit 
      WHERE user_id = p_user_id 
      GROUP BY module_id 
      ORDER BY COUNT(*) DESC 
      LIMIT 1
    ) as most_active_module
  FROM cet.assessment_submissions_audit
  WHERE user_id = p_user_id;
END;
$$;

-- 9. Create RPC function for admin dashboard stats
CREATE OR REPLACE FUNCTION cet_get_admin_submission_stats()
RETURNS TABLE (
  total_submissions_today BIGINT,
  total_submissions_week BIGINT,
  total_submissions_month BIGINT,
  success_rate NUMERIC,
  most_active_module TEXT,
  recent_errors BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'moderator')
  ) THEN
    RAISE EXCEPTION 'Access denied - admin role required';
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE submission_timestamp >= CURRENT_DATE) as total_submissions_today,
    COUNT(*) FILTER (WHERE submission_timestamp >= CURRENT_DATE - INTERVAL '7 days') as total_submissions_week,
    COUNT(*) FILTER (WHERE submission_timestamp >= CURRENT_DATE - INTERVAL '30 days') as total_submissions_month,
    ROUND(
      (COUNT(*) FILTER (WHERE status = 'submitted')::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 
      2
    ) as success_rate,
    (
      SELECT module_id 
      FROM cet.assessment_submissions_audit 
      WHERE submission_timestamp >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY module_id 
      ORDER BY COUNT(*) DESC 
      LIMIT 1
    ) as most_active_module,
    COUNT(*) FILTER (
      WHERE status != 'submitted' 
      AND submission_timestamp >= CURRENT_DATE - INTERVAL '7 days'
    ) as recent_errors
  FROM cet.assessment_submissions_audit;
END;
$$;

-- 10. Grant execute permissions
GRANT EXECUTE ON FUNCTION cet_log_assessment_submission TO authenticated;
GRANT EXECUTE ON FUNCTION cet_get_submission_stats TO authenticated;
GRANT EXECUTE ON FUNCTION cet_get_admin_submission_stats TO authenticated;

-- 11. Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION cet.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to audit table
DROP TRIGGER IF EXISTS update_assessment_submissions_audit_updated_at ON cet.assessment_submissions_audit;
CREATE TRIGGER update_assessment_submissions_audit_updated_at
  BEFORE UPDATE ON cet.assessment_submissions_audit
  FOR EACH ROW
  EXECUTE FUNCTION cet.update_updated_at_column();

-- Success message
SELECT 'Assessment audit system created successfully!' as result;