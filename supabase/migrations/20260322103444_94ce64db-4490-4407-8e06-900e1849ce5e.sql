-- DSA v1 Migration: Rename cet → dsa schema and all RPCs

-- Step 1: Rename schema
ALTER SCHEMA cet RENAME TO dsa;

-- Step 2: Drop all old cet_* and cet.* functions
DROP FUNCTION IF EXISTS cet.set_updated_at CASCADE;
DROP FUNCTION IF EXISTS cet.get_my_role CASCADE;
DROP FUNCTION IF EXISTS public.cet_enrolled_learners CASCADE;
DROP FUNCTION IF EXISTS public.cet_modules CASCADE;
DROP FUNCTION IF EXISTS public.cet_get_or_create_attendance_session CASCADE;
DROP FUNCTION IF EXISTS public.cet_get_attendance_records CASCADE;
DROP FUNCTION IF EXISTS public.cet_check_in CASCADE;
DROP FUNCTION IF EXISTS public.cet_check_out CASCADE;
DROP FUNCTION IF EXISTS public.cet_self_register_learner CASCADE;
DROP FUNCTION IF EXISTS public.cet_get_my_profile CASCADE;
DROP FUNCTION IF EXISTS public.cet_get_my_profile_v2 CASCADE;
DROP FUNCTION IF EXISTS public.cet_update_my_profile_v2 CASCADE;
DROP FUNCTION IF EXISTS public.cet_get_all_module_progress CASCADE;
DROP FUNCTION IF EXISTS public.cet_upsert_module_progress CASCADE;
DROP FUNCTION IF EXISTS public.cet_get_module_flow CASCADE;
DROP FUNCTION IF EXISTS public.cet_upsert_module_flow CASCADE;
DROP FUNCTION IF EXISTS public.cet_get_announcements CASCADE;
DROP FUNCTION IF EXISTS public.cet_post_announcement CASCADE;
DROP FUNCTION IF EXISTS public.cet_pin_announcement CASCADE;
DROP FUNCTION IF EXISTS public.cet_delete_announcement CASCADE;
DROP FUNCTION IF EXISTS public.cet_list_learners_for_messaging CASCADE;
DROP FUNCTION IF EXISTS public.cet_send_message CASCADE;
DROP FUNCTION IF EXISTS public.cet_get_my_conversations CASCADE;
DROP FUNCTION IF EXISTS public.cet_get_conversation_messages CASCADE;
DROP FUNCTION IF EXISTS public.cet_mark_conversation_read CASCADE;
DROP FUNCTION IF EXISTS public.cet_get_facilitator_user_id CASCADE;
DROP FUNCTION IF EXISTS public.cet_generate_assessment_otp CASCADE;
DROP FUNCTION IF EXISTS public.cet_get_active_otp CASCADE;
DROP FUNCTION IF EXISTS public.cet_revoke_assessment_otp CASCADE;
DROP FUNCTION IF EXISTS public.cet_validate_assessment_otp CASCADE;
DROP FUNCTION IF EXISTS public.cet_get_module_assessment_status CASCADE;
DROP FUNCTION IF EXISTS public.cet_admin_clear_learner_progress CASCADE;
DROP FUNCTION IF EXISTS public.cet_clear_my_module_progress CASCADE;

-- Step 3: Create dsa_* functions

CREATE OR REPLACE FUNCTION dsa.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN new.updated_at = now(); RETURN new; END;
$$;

CREATE OR REPLACE FUNCTION dsa.get_my_role()
RETURNS dsa.user_role LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, dsa AS $$
  SELECT CASE coalesce(u.role, 'user')
    WHEN 'admin' THEN 'admin'::dsa.user_role
    WHEN 'moderator' THEN 'lecturer'::dsa.user_role
    ELSE 'learner'::dsa.user_role
  END FROM public.users u WHERE u.id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.dsa_enrolled_learners()
RETURNS TABLE (id uuid, learner_code text, full_name text, email text, phone text, status text, progress integer)
LANGUAGE sql STABLE SET search_path = public, dsa AS $$
  SELECT DISTINCT l.id, l.learner_code, l.full_name, l.email, l.phone, l.status, l.progress
  FROM dsa.enrollments e JOIN dsa.learners l ON l.id = e.learner_id
  WHERE e.status = 'Active' ORDER BY l.full_name;
$$;

CREATE OR REPLACE FUNCTION public.dsa_modules()
RETURNS TABLE (id uuid, title text, day_label text, block_no integer)
LANGUAGE sql STABLE SET search_path = public, dsa AS $$
  SELECT m.id, m.title, m.day_label, m.block_no FROM dsa.modules m
  ORDER BY m.block_no, m.day_label NULLS LAST, m.title;
$$;

CREATE OR REPLACE FUNCTION public.dsa_get_or_create_attendance_session(
  p_module_id uuid, p_session_date date, p_created_by uuid DEFAULT NULL, p_session_label text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SET search_path = public, dsa AS $$
DECLARE v_session_id uuid;
BEGIN
  SELECT id INTO v_session_id FROM dsa.attendance_sessions WHERE module_id = p_module_id AND session_date = p_session_date LIMIT 1;
  IF v_session_id IS NOT NULL THEN RETURN v_session_id; END IF;
  INSERT INTO dsa.attendance_sessions (module_id, session_date, session_label, created_by)
  VALUES (p_module_id, p_session_date, coalesce(p_session_label, 'Session ' || p_session_date::text), p_created_by)
  ON CONFLICT (module_id, session_date) DO UPDATE SET session_label = coalesce(dsa.attendance_sessions.session_label, EXCLUDED.session_label)
  RETURNING id INTO v_session_id;
  RETURN v_session_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_get_attendance_records(p_session_id uuid)
RETURNS TABLE (learner_id uuid, present boolean, check_in_at timestamptz, check_out_at timestamptz)
LANGUAGE sql STABLE SET search_path = public, dsa AS $$
  SELECT ar.learner_id, ar.present, ar.check_in_at, ar.check_out_at FROM dsa.attendance_records ar WHERE ar.session_id = p_session_id;
$$;

CREATE OR REPLACE FUNCTION public.dsa_check_in(p_session_id uuid, p_learner_id uuid, p_marked_by uuid DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SET search_path = public, dsa AS $$
BEGIN
  INSERT INTO dsa.attendance_records (session_id, learner_id, present, check_in_at, marked_by, marked_at)
  VALUES (p_session_id, p_learner_id, true, now(), p_marked_by, now())
  ON CONFLICT (session_id, learner_id) DO UPDATE SET present = true, check_in_at = coalesce(dsa.attendance_records.check_in_at, now()), marked_by = EXCLUDED.marked_by, marked_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_check_out(p_session_id uuid, p_learner_id uuid, p_marked_by uuid DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SET search_path = public, dsa AS $$
BEGIN
  UPDATE dsa.attendance_records SET present = true, check_out_at = now(), marked_by = p_marked_by, marked_at = now()
  WHERE session_id = p_session_id AND learner_id = p_learner_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_self_register_learner(p_full_name text DEFAULT NULL, p_email text DEFAULT NULL, p_phone text DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
#variable_conflict use_column
DECLARE v_user_id uuid := auth.uid(); v_public_role text; v_learner_id uuid; v_program_id uuid; v_display_name text; v_email text; v_phone text;
BEGIN
  IF v_user_id IS NULL THEN RETURN NULL; END IF;
  SELECT role INTO v_public_role FROM public.users WHERE id = v_user_id;
  IF coalesce(v_public_role, 'user') <> 'user' THEN RETURN NULL; END IF;
  v_display_name := coalesce(nullif(trim(p_full_name), ''), 'Learner');
  v_email := nullif(trim(coalesce(p_email, '')), '');
  v_phone := nullif(trim(coalesce(p_phone, '')), '');
  INSERT INTO dsa.learners (user_id, learner_code, full_name, email, phone, status, progress)
  VALUES (v_user_id, 'L-' || upper(substr(replace(v_user_id::text, '-', ''), 1, 8)), v_display_name, v_email, v_phone, 'Active', 0)
  ON CONFLICT (user_id) DO UPDATE SET full_name = coalesce(EXCLUDED.full_name, dsa.learners.full_name), email = coalesce(EXCLUDED.email, dsa.learners.email), phone = coalesce(EXCLUDED.phone, dsa.learners.phone), updated_at = now()
  RETURNING id INTO v_learner_id;
  SELECT p.id INTO v_program_id FROM dsa.programs p WHERE p.is_active = true ORDER BY p.created_at ASC LIMIT 1;
  IF v_program_id IS NULL THEN
    INSERT INTO dsa.programs (title, saqa_id, nqf_level, total_credits, provider, is_active)
    VALUES ('FET Certificate: IT Systems Development', '78965', 4, 131, 'Data Science Academy', true)
    ON CONFLICT (saqa_id) DO UPDATE SET is_active = true, updated_at = now()
    RETURNING id INTO v_program_id;
  END IF;
  INSERT INTO dsa.enrollments (learner_id, program_id, status) VALUES (v_learner_id, v_program_id, 'Active') ON CONFLICT (learner_id, program_id) DO NOTHING;
  RETURN v_learner_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_get_my_profile()
RETURNS TABLE (id uuid, username text, display_name text, bio text, avatar_url text, location text, website text, role text, reputation integer, created_at timestamptz, updated_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT u.id, u.username::text, u.display_name::text, u.bio, u.avatar_url, u.location::text, u.website::text, u.role::text, u.reputation, u.created_at, u.updated_at
  FROM public.users u WHERE u.id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.dsa_get_my_profile_v2()
RETURNS TABLE (id uuid, username text, display_name text, bio text, avatar_url text, location text, website text, role text, reputation integer, phone text, created_at timestamptz, updated_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, dsa AS $$
  SELECT u.id, u.username::text, u.display_name::text, u.bio, u.avatar_url, u.location::text, u.website::text, u.role::text, u.reputation, l.phone, u.created_at, u.updated_at
  FROM public.users u LEFT JOIN dsa.learners l ON l.user_id = u.id WHERE u.id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.dsa_update_my_profile_v2(
  p_username text, p_display_name text, p_bio text, p_avatar_url text, p_location text, p_website text, p_phone text DEFAULT NULL
) RETURNS TABLE (id uuid, username text, display_name text, bio text, avatar_url text, location text, website text, role text, reputation integer, phone text, created_at timestamptz, updated_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
#variable_conflict use_column
DECLARE v_user_id uuid := auth.uid(); v_username text; v_email text; v_existing_role text; v_phone text;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  v_username := nullif(trim(coalesce(p_username, '')), '');
  IF v_username IS NULL THEN SELECT split_part(au.email, '@', 1) INTO v_email FROM auth.users au WHERE au.id = v_user_id; v_username := lower(coalesce(v_email, 'user')) || '_' || substr(replace(v_user_id::text, '-', ''), 1, 6); END IF;
  SELECT u.role INTO v_existing_role FROM public.users u WHERE u.id = v_user_id;
  v_phone := nullif(trim(coalesce(p_phone, '')), '');
  INSERT INTO public.users (id, username, display_name, bio, avatar_url, location, website, role, reputation, app_metadata, created_at, updated_at)
  VALUES (v_user_id, v_username, nullif(trim(coalesce(p_display_name,'')), ''), nullif(trim(coalesce(p_bio,'')), ''), nullif(trim(coalesce(p_avatar_url,'')), ''), nullif(trim(coalesce(p_location,'')), ''), nullif(trim(coalesce(p_website,'')), ''), coalesce(v_existing_role,'user'), 0, '{}'::jsonb, now(), now())
  ON CONFLICT ON CONSTRAINT users_pkey DO UPDATE SET username = EXCLUDED.username, display_name = EXCLUDED.display_name, bio = EXCLUDED.bio, avatar_url = EXCLUDED.avatar_url, location = EXCLUDED.location, website = EXCLUDED.website, updated_at = now();
  UPDATE dsa.learners SET full_name = coalesce(nullif(trim(coalesce(p_display_name,'')), ''), dsa.learners.full_name), phone = coalesce(v_phone, dsa.learners.phone), updated_at = now() WHERE user_id = v_user_id;
  RETURN QUERY SELECT u.id, u.username::text, u.display_name::text, u.bio, u.avatar_url, u.location::text, u.website::text, u.role::text, u.reputation, l.phone, u.created_at, u.updated_at FROM public.users u LEFT JOIN dsa.learners l ON l.user_id = u.id WHERE u.id = v_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_get_all_module_progress()
RETURNS TABLE (module_unit_standard_id text, guide_completed boolean, quiz_passed boolean, assessment_unlocked boolean, submission_path text, submission_uploaded_at timestamptz, assessment_submitted boolean, assessment_submitted_at timestamptz, updated_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, dsa AS $$
  SELECT lp.module_unit_standard_id, lp.guide_completed, lp.quiz_passed, lp.assessment_unlocked, lp.submission_path, lp.submission_uploaded_at, lp.assessment_submitted, lp.assessment_submitted_at, lp.updated_at
  FROM dsa.learner_progress lp WHERE lp.user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.dsa_upsert_module_progress(
  p_unit_std_id text, p_guide_completed boolean DEFAULT NULL, p_quiz_passed boolean DEFAULT NULL,
  p_assessment_unlocked boolean DEFAULT NULL, p_submission_path text DEFAULT NULL,
  p_submission_uploaded_at timestamptz DEFAULT NULL, p_assessment_submitted boolean DEFAULT NULL,
  p_assessment_submitted_at timestamptz DEFAULT NULL
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
DECLARE v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  INSERT INTO dsa.learner_progress (user_id, module_unit_standard_id, guide_completed, quiz_passed, assessment_unlocked, submission_path, submission_uploaded_at, assessment_submitted, assessment_submitted_at)
  VALUES (v_user_id, p_unit_std_id, coalesce(p_guide_completed,false), coalesce(p_quiz_passed,false), coalesce(p_assessment_unlocked,false), p_submission_path, p_submission_uploaded_at, coalesce(p_assessment_submitted,false), p_assessment_submitted_at)
  ON CONFLICT (user_id, module_unit_standard_id) DO UPDATE SET
    guide_completed = CASE WHEN p_guide_completed IS NOT NULL THEN p_guide_completed ELSE dsa.learner_progress.guide_completed END,
    quiz_passed = CASE WHEN p_quiz_passed IS NOT NULL THEN p_quiz_passed ELSE dsa.learner_progress.quiz_passed END,
    assessment_unlocked = CASE WHEN p_assessment_unlocked IS NOT NULL THEN p_assessment_unlocked ELSE dsa.learner_progress.assessment_unlocked END,
    submission_path = CASE WHEN p_submission_path IS NOT NULL THEN p_submission_path ELSE dsa.learner_progress.submission_path END,
    submission_uploaded_at = CASE WHEN p_submission_uploaded_at IS NOT NULL THEN p_submission_uploaded_at ELSE dsa.learner_progress.submission_uploaded_at END,
    assessment_submitted = CASE WHEN p_assessment_submitted IS NOT NULL THEN p_assessment_submitted ELSE dsa.learner_progress.assessment_submitted END,
    assessment_submitted_at = CASE WHEN p_assessment_submitted_at IS NOT NULL THEN p_assessment_submitted_at ELSE dsa.learner_progress.assessment_submitted_at END,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_get_module_flow(p_unit_std_id text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, dsa AS $$
  SELECT flow FROM dsa.module_content_flows WHERE unit_standard_id = p_unit_std_id LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.dsa_upsert_module_flow(p_unit_std_id text, p_flow jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
DECLARE v_role dsa.user_role := dsa.get_my_role();
BEGIN
  IF v_role NOT IN ('admin','lecturer') THEN RAISE EXCEPTION 'Only admins and lecturers can update module flows'; END IF;
  INSERT INTO dsa.module_content_flows (unit_standard_id, flow, updated_by) VALUES (p_unit_std_id, p_flow, auth.uid())
  ON CONFLICT (unit_standard_id) DO UPDATE SET flow = EXCLUDED.flow, updated_by = EXCLUDED.updated_by, updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_get_announcements()
RETURNS TABLE (id uuid, title text, message text, audience text, pinned boolean, author text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, dsa AS $$
  SELECT id, title, message, audience, pinned, author, created_at FROM dsa.announcements ORDER BY pinned DESC, created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.dsa_post_announcement(p_title text, p_message text, p_audience text DEFAULT 'All')
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
DECLARE v_id uuid; v_role text;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid();
  IF v_role NOT IN ('admin','moderator') THEN RAISE EXCEPTION 'Permission denied'; END IF;
  INSERT INTO dsa.announcements (title, message, audience) VALUES (p_title, p_message, p_audience) RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_pin_announcement(p_id uuid, p_pinned boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
DECLARE v_role text;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid();
  IF v_role NOT IN ('admin','moderator') THEN RAISE EXCEPTION 'Permission denied'; END IF;
  UPDATE dsa.announcements SET pinned = p_pinned WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_delete_announcement(p_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
DECLARE v_role text;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid();
  IF v_role NOT IN ('admin','moderator') THEN RAISE EXCEPTION 'Permission denied'; END IF;
  DELETE FROM dsa.announcements WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_list_learners_for_messaging()
RETURNS TABLE (id uuid, user_id uuid, full_name text, learner_code text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, dsa AS $$
  SELECT l.id, l.user_id, l.full_name, l.learner_code FROM dsa.learners l
  JOIN dsa.enrollments e ON e.learner_id = l.id
  WHERE l.status = 'Active' AND e.status = 'Active' AND l.user_id IS NOT NULL AND l.user_id <> auth.uid()
  ORDER BY l.full_name LIMIT 50;
$$;

CREATE OR REPLACE FUNCTION public.dsa_send_message(p_recipient_id uuid, p_body text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
DECLARE v_sender uuid := auth.uid(); v_conv_id uuid;
BEGIN
  IF v_sender IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF trim(coalesce(p_body,'')) = '' THEN RAISE EXCEPTION 'Message body cannot be empty'; END IF;
  IF p_recipient_id = v_sender THEN RAISE EXCEPTION 'Cannot send message to yourself'; END IF;
  SELECT id INTO v_conv_id FROM dsa.conversations WHERE (participant_a = v_sender AND participant_b = p_recipient_id) OR (participant_a = p_recipient_id AND participant_b = v_sender) LIMIT 1;
  IF v_conv_id IS NULL THEN INSERT INTO dsa.conversations (participant_a, participant_b) VALUES (v_sender, p_recipient_id) RETURNING id INTO v_conv_id; END IF;
  INSERT INTO dsa.messages (conversation_id, sender_id, body) VALUES (v_conv_id, v_sender, trim(p_body));
  UPDATE dsa.conversations SET updated_at = now() WHERE id = v_conv_id;
  RETURN v_conv_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_get_my_conversations()
RETURNS TABLE (conversation_id uuid, other_user_id uuid, other_name text, other_code text, other_role text, last_body text, last_sent_at timestamptz, unread_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, dsa AS $$
  WITH my_convs AS (SELECT c.id AS conv_id, CASE WHEN c.participant_a = auth.uid() THEN c.participant_b ELSE c.participant_a END AS other_id FROM dsa.conversations c WHERE c.participant_a = auth.uid() OR c.participant_b = auth.uid()),
  last_msg AS (SELECT DISTINCT ON (m.conversation_id) m.conversation_id, m.body, m.sent_at FROM dsa.messages m WHERE m.conversation_id IN (SELECT conv_id FROM my_convs) ORDER BY m.conversation_id, m.sent_at DESC),
  unread AS (SELECT m.conversation_id, count(*) AS cnt FROM dsa.messages m WHERE m.conversation_id IN (SELECT conv_id FROM my_convs) AND m.sender_id <> auth.uid() AND m.read_at IS NULL GROUP BY m.conversation_id)
  SELECT mc.conv_id, mc.other_id, coalesce(u.display_name, l.full_name, 'Unknown') AS other_name, l.learner_code AS other_code, coalesce(u.role, 'user')::text AS other_role, lm.body AS last_body, lm.sent_at AS last_sent_at, coalesce(ur.cnt, 0) AS unread_count
  FROM my_convs mc LEFT JOIN public.users u ON u.id = mc.other_id LEFT JOIN dsa.learners l ON l.user_id = mc.other_id LEFT JOIN last_msg lm ON lm.conversation_id = mc.conv_id LEFT JOIN unread ur ON ur.conversation_id = mc.conv_id ORDER BY lm.sent_at DESC NULLS LAST;
$$;

CREATE OR REPLACE FUNCTION public.dsa_get_conversation_messages(p_conversation_id uuid)
RETURNS TABLE (id uuid, sender_id uuid, body text, sent_at timestamptz, read_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, dsa AS $$
  SELECT m.id, m.sender_id, m.body, m.sent_at, m.read_at FROM dsa.messages m
  JOIN dsa.conversations c ON c.id = m.conversation_id
  WHERE m.conversation_id = p_conversation_id AND (c.participant_a = auth.uid() OR c.participant_b = auth.uid())
  ORDER BY m.sent_at ASC;
$$;

CREATE OR REPLACE FUNCTION public.dsa_mark_conversation_read(p_conversation_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM dsa.conversations WHERE id = p_conversation_id AND (participant_a = v_uid OR participant_b = v_uid)) THEN RAISE EXCEPTION 'Access denied'; END IF;
  UPDATE dsa.messages SET read_at = now() WHERE conversation_id = p_conversation_id AND sender_id <> v_uid AND read_at IS NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_get_facilitator_user_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, dsa AS $$
  SELECT id FROM public.users WHERE role IN ('admin','moderator') AND id <> coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) ORDER BY created_at ASC LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.dsa_generate_assessment_otp(p_module_id text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
DECLARE v_otp text; v_record jsonb; v_role text;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid();
  IF v_role NOT IN ('admin', 'moderator') THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  UPDATE dsa.assessment_otp SET is_active = false WHERE module_id = p_module_id AND is_active = true;
  v_otp := lpad(floor(random() * 1000000)::text, 6, '0');
  INSERT INTO dsa.assessment_otp (module_id, otp_code, created_by, expires_at)
  VALUES (p_module_id, v_otp, auth.uid(), now() + interval '8 hours')
  RETURNING jsonb_build_object('id',id,'otp_code',otp_code,'module_id',module_id,'created_at',created_at,'expires_at',expires_at,'is_active',is_active) INTO v_record;
  RETURN v_record;
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_get_active_otp(p_module_id text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
DECLARE v_record jsonb; v_role text;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid();
  IF v_role NOT IN ('admin', 'moderator') THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  SELECT jsonb_build_object('id',id,'otp_code',otp_code,'module_id',module_id,'created_at',created_at,'expires_at',expires_at,'is_active',is_active) INTO v_record
  FROM dsa.assessment_otp WHERE module_id = p_module_id AND is_active = true AND expires_at > now() ORDER BY created_at DESC LIMIT 1;
  RETURN v_record;
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_revoke_assessment_otp(p_module_id text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
DECLARE v_role text;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid();
  IF v_role NOT IN ('admin', 'moderator') THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  UPDATE dsa.assessment_otp SET is_active = false WHERE module_id = p_module_id AND is_active = true;
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_validate_assessment_otp(p_module_id text, p_otp text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM dsa.assessment_otp WHERE module_id = p_module_id AND otp_code = p_otp AND is_active = true AND expires_at > now());
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_get_module_assessment_status(p_module_id text)
RETURNS TABLE (learner_id uuid, full_name text, learner_code text, email text, assessment_submitted boolean, assessment_submitted_at timestamptz, submission_path text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
DECLARE v_role text;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid();
  IF v_role NOT IN ('admin', 'moderator') THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  RETURN QUERY SELECT l.user_id, l.full_name, l.learner_code, l.email, coalesce(lp.assessment_submitted, false), lp.assessment_submitted_at, lp.submission_path
  FROM dsa.learners l LEFT JOIN dsa.learner_progress lp ON lp.user_id = l.user_id AND lp.module_unit_standard_id = p_module_id ORDER BY l.full_name;
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_admin_clear_learner_progress(p_user_id uuid, p_module_id text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
DECLARE v_role text;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid();
  IF v_role NOT IN ('admin', 'moderator') THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  IF p_module_id IS NOT NULL THEN
    DELETE FROM dsa.learner_progress WHERE user_id = p_user_id AND module_unit_standard_id = p_module_id;
  ELSE
    DELETE FROM dsa.learner_progress WHERE user_id = p_user_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.dsa_clear_my_module_progress(p_module_id text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, dsa AS $$
BEGIN
  DELETE FROM dsa.learner_progress WHERE user_id = auth.uid() AND module_unit_standard_id = p_module_id;
END;
$$;