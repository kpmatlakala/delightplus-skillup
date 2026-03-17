
-- CET Schema + Enums + Tables + Indexes + Triggers
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS cet;
GRANT USAGE ON SCHEMA cet TO authenticated;
GRANT USAGE ON SCHEMA cet TO service_role;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'cet')) THEN
    CREATE TYPE cet.user_role AS ENUM ('admin', 'lecturer', 'learner');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'module_type' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'cet')) THEN
    CREATE TYPE cet.module_type AS ENUM ('Knowledge', 'Practical');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'record_status' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'cet')) THEN
    CREATE TYPE cet.record_status AS ENUM ('Ready', 'In Progress', 'Not Started');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assessment_type' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'cet')) THEN
    CREATE TYPE cet.assessment_type AS ENUM ('Formative', 'Summative');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION cet.set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN new.updated_at = now(); RETURN new; END; $$;

-- Tables
CREATE TABLE IF NOT EXISTS cet.programs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, saqa_id text UNIQUE NOT NULL, nqf_level integer NOT NULL CHECK (nqf_level >= 1 AND nqf_level <= 10), total_credits integer NOT NULL CHECK (total_credits >= 0), provider text NOT NULL, is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE IF NOT EXISTS cet.modules (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), program_id uuid NOT NULL REFERENCES cet.programs(id) ON DELETE CASCADE, unit_standard_id text, code text, title text NOT NULL, type cet.module_type NOT NULL, credits integer NOT NULL CHECK (credits >= 0), duration_minutes integer NOT NULL CHECK (duration_minutes > 0), block_no integer NOT NULL CHECK (block_no > 0), day_label text, status cet.record_status NOT NULL DEFAULT 'Not Started', objectives text[] NOT NULL DEFAULT '{}', content text[] NOT NULL DEFAULT '{}', activities text[] NOT NULL DEFAULT '{}', resources text[] NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE (program_id, code));

CREATE TABLE IF NOT EXISTS cet.learners (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL, learner_code text UNIQUE NOT NULL, full_name text NOT NULL, email text, phone text, status text NOT NULL DEFAULT 'Active', progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE IF NOT EXISTS cet.enrollments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), learner_id uuid NOT NULL REFERENCES cet.learners(id) ON DELETE CASCADE, program_id uuid NOT NULL REFERENCES cet.programs(id) ON DELETE CASCADE, enrolled_at timestamptz NOT NULL DEFAULT now(), status text NOT NULL DEFAULT 'Active', UNIQUE (learner_id, program_id));

CREATE TABLE IF NOT EXISTS cet.attendance_sessions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), module_id uuid NOT NULL REFERENCES cet.modules(id) ON DELETE CASCADE, session_date date NOT NULL, session_label text, created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE (module_id, session_date));

CREATE TABLE IF NOT EXISTS cet.attendance_records (session_id uuid NOT NULL REFERENCES cet.attendance_sessions(id) ON DELETE CASCADE, learner_id uuid NOT NULL REFERENCES cet.learners(id) ON DELETE CASCADE, present boolean NOT NULL, check_in_at timestamptz, check_out_at timestamptz, marked_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, marked_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (session_id, learner_id));

CREATE TABLE IF NOT EXISTS cet.assessments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), module_id uuid NOT NULL REFERENCES cet.modules(id) ON DELETE CASCADE, title text NOT NULL, type cet.assessment_type NOT NULL, max_marks integer CHECK (max_marks IS NULL OR max_marks >= 0), weight integer NOT NULL CHECK (weight >= 0), status cet.record_status NOT NULL DEFAULT 'Not Started', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE IF NOT EXISTS cet.assessment_results (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), assessment_id uuid NOT NULL REFERENCES cet.assessments(id) ON DELETE CASCADE, learner_id uuid NOT NULL REFERENCES cet.learners(id) ON DELETE CASCADE, score numeric, feedback text, submitted_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE (assessment_id, learner_id));

CREATE TABLE IF NOT EXISTS cet.announcements (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, message text NOT NULL, audience text NOT NULL DEFAULT 'All' CHECK (audience IN ('All','Block 1','Block 2','Block 3','Admin Only')), pinned boolean NOT NULL DEFAULT false, author text NOT NULL DEFAULT 'Admin', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE IF NOT EXISTS cet.learner_progress (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, module_unit_standard_id text NOT NULL, guide_completed boolean NOT NULL DEFAULT false, quiz_passed boolean NOT NULL DEFAULT false, assessment_unlocked boolean NOT NULL DEFAULT false, submission_path text, submission_uploaded_at timestamptz, assessment_submitted boolean NOT NULL DEFAULT false, assessment_submitted_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE (user_id, module_unit_standard_id));

CREATE TABLE IF NOT EXISTS cet.module_content_flows (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), unit_standard_id text UNIQUE NOT NULL, flow jsonb NOT NULL, updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE IF NOT EXISTS cet.conversations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), participant_a uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, participant_b uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), CONSTRAINT no_self_conversation CHECK (participant_a <> participant_b));

CREATE TABLE IF NOT EXISTS cet.messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), conversation_id uuid NOT NULL REFERENCES cet.conversations(id) ON DELETE CASCADE, sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, body text NOT NULL CHECK (length(trim(body)) > 0), sent_at timestamptz NOT NULL DEFAULT now(), read_at timestamptz);

CREATE TABLE IF NOT EXISTS cet.assessment_otp (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), module_id text NOT NULL, otp_code text NOT NULL, created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL, is_active boolean NOT NULL DEFAULT true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cet_modules_program_id ON cet.modules(program_id);
CREATE INDEX IF NOT EXISTS idx_cet_modules_block_no ON cet.modules(block_no);
CREATE INDEX IF NOT EXISTS idx_cet_learners_user_id ON cet.learners(user_id);
CREATE INDEX IF NOT EXISTS idx_cet_enrollments_learner_id ON cet.enrollments(learner_id);
CREATE INDEX IF NOT EXISTS idx_cet_enrollments_program_id ON cet.enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_cet_attendance_sessions_mod_id ON cet.attendance_sessions(module_id);
CREATE INDEX IF NOT EXISTS idx_cet_attendance_records_chkin ON cet.attendance_records(check_in_at);
CREATE INDEX IF NOT EXISTS idx_cet_attendance_records_chkout ON cet.attendance_records(check_out_at);
CREATE INDEX IF NOT EXISTS idx_cet_attendance_records_lrn_id ON cet.attendance_records(learner_id);
CREATE INDEX IF NOT EXISTS idx_cet_assessments_module_id ON cet.assessments(module_id);
CREATE INDEX IF NOT EXISTS idx_cet_assessment_results_lrn_id ON cet.assessment_results(learner_id);
CREATE INDEX IF NOT EXISTS idx_cet_learner_progress_user_id ON cet.learner_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_cet_module_content_flows_std ON cet.module_content_flows(unit_standard_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON cet.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON cet.messages(sent_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_pair ON cet.conversations (least(participant_a::text, participant_b::text), greatest(participant_a::text, participant_b::text));

-- Triggers
DO $$ DECLARE tbl text; BEGIN FOREACH tbl IN ARRAY array['programs','modules','learners','assessments','assessment_results','announcements','learner_progress','module_content_flows','conversations'] LOOP EXECUTE format('DROP TRIGGER IF EXISTS set_%s_updated_at ON cet.%I', tbl, tbl); EXECUTE format('CREATE TRIGGER set_%s_updated_at BEFORE UPDATE ON cet.%I FOR EACH ROW EXECUTE FUNCTION cet.set_updated_at()', tbl, tbl); END LOOP; END $$;
