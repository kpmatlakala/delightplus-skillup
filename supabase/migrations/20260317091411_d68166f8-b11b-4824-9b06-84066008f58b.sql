
-- RLS
ALTER TABLE cet.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.learners ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.learner_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.module_content_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cet.assessment_otp ENABLE ROW LEVEL SECURITY;

-- cet.get_my_role helper
CREATE OR REPLACE FUNCTION cet.get_my_role() RETURNS cet.user_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, cet AS $$ SELECT CASE COALESCE(u.role, 'user') WHEN 'admin' THEN 'admin'::cet.user_role WHEN 'moderator' THEN 'lecturer'::cet.user_role ELSE 'learner'::cet.user_role END FROM public.users u WHERE u.id = auth.uid(); $$;
GRANT EXECUTE ON FUNCTION cet.get_my_role() TO authenticated;

-- RLS Policies
CREATE POLICY "Authenticated users can read programs" ON cet.programs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and lecturers can manage programs" ON cet.programs FOR ALL USING (cet.get_my_role() IN ('admin','lecturer')) WITH CHECK (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "Authenticated users can read modules" ON cet.modules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and lecturers can manage modules" ON cet.modules FOR ALL USING (cet.get_my_role() IN ('admin','lecturer')) WITH CHECK (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "Admins and lecturers can read learners" ON cet.learners FOR SELECT USING (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "Learners can read own record" ON cet.learners FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins and lecturers can manage learners" ON cet.learners FOR ALL USING (cet.get_my_role() IN ('admin','lecturer')) WITH CHECK (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "Admins and lecturers can read enrollments" ON cet.enrollments FOR SELECT USING (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "Learners can read own enrollments" ON cet.enrollments FOR SELECT USING (EXISTS (SELECT 1 FROM cet.learners l WHERE l.id = learner_id AND l.user_id = auth.uid()));
CREATE POLICY "Admins and lecturers can manage enrollments" ON cet.enrollments FOR ALL USING (cet.get_my_role() IN ('admin','lecturer')) WITH CHECK (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "Admins and lecturers can read att sessions" ON cet.attendance_sessions FOR SELECT USING (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "Admins and lecturers can manage att sessions" ON cet.attendance_sessions FOR ALL USING (cet.get_my_role() IN ('admin','lecturer')) WITH CHECK (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "Admins and lecturers can read att records" ON cet.attendance_records FOR SELECT USING (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "Learners can read own att records" ON cet.attendance_records FOR SELECT USING (EXISTS (SELECT 1 FROM cet.learners l WHERE l.id = learner_id AND l.user_id = auth.uid()));
CREATE POLICY "Admins and lecturers can manage att records" ON cet.attendance_records FOR ALL USING (cet.get_my_role() IN ('admin','lecturer')) WITH CHECK (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "Authenticated users can read assessments" ON cet.assessments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and lecturers can manage assessments" ON cet.assessments FOR ALL USING (cet.get_my_role() IN ('admin','lecturer')) WITH CHECK (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "Admins and lecturers can read all results" ON cet.assessment_results FOR SELECT USING (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "Learners can read own assessment results" ON cet.assessment_results FOR SELECT USING (EXISTS (SELECT 1 FROM cet.learners l WHERE l.id = learner_id AND l.user_id = auth.uid()));
CREATE POLICY "Admins and lecturers can manage results" ON cet.assessment_results FOR ALL USING (cet.get_my_role() IN ('admin','lecturer')) WITH CHECK (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "admin_manage_announcements" ON cet.announcements FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin','moderator'))) WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin','moderator')));
CREATE POLICY "learner_read_announcements" ON cet.announcements FOR SELECT TO authenticated USING (audience <> 'Admin Only');
CREATE POLICY "Learners can read own progress" ON cet.learner_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Learners can insert own progress" ON cet.learner_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Learners can update own progress" ON cet.learner_progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins and lecturers can read all progress" ON cet.learner_progress FOR SELECT USING (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "Authenticated users can read module flows" ON cet.module_content_flows FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and lecturers can manage module flows" ON cet.module_content_flows FOR ALL USING (cet.get_my_role() IN ('admin','lecturer')) WITH CHECK (cet.get_my_role() IN ('admin','lecturer'));
CREATE POLICY "participants_read_conversations" ON cet.conversations FOR SELECT TO authenticated USING (participant_a = auth.uid() OR participant_b = auth.uid());
CREATE POLICY "participants_read_messages" ON cet.messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM cet.conversations c WHERE c.id = conversation_id AND (c.participant_a = auth.uid() OR c.participant_b = auth.uid())));
CREATE POLICY "Admin manages otps" ON cet.assessment_otp FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'moderator'));
CREATE POLICY "Learner validates otp" ON cet.assessment_otp FOR SELECT TO authenticated USING (is_active = true);

-- Table grants
GRANT SELECT ON TABLE cet.programs, cet.modules, cet.enrollments, cet.learners, cet.attendance_sessions, cet.attendance_records, cet.assessments, cet.assessment_results, cet.announcements, cet.learner_progress, cet.module_content_flows, cet.conversations, cet.messages TO authenticated;
GRANT INSERT ON TABLE cet.attendance_sessions, cet.attendance_records, cet.learner_progress, cet.module_content_flows TO authenticated;
GRANT UPDATE ON TABLE cet.attendance_records, cet.learner_progress, cet.module_content_flows TO authenticated;
GRANT INSERT, UPDATE, DELETE ON cet.announcements TO authenticated;
GRANT SELECT ON cet.conversations TO authenticated;
GRANT SELECT ON cet.messages TO authenticated;

-- Realtime
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'cet' AND tablename = 'announcements') THEN ALTER PUBLICATION supabase_realtime ADD TABLE cet.announcements; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'cet' AND tablename = 'conversations') THEN ALTER PUBLICATION supabase_realtime ADD TABLE cet.conversations; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'cet' AND tablename = 'messages') THEN ALTER PUBLICATION supabase_realtime ADD TABLE cet.messages; END IF;
END $$;
