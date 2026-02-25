grant usage on schema cet to authenticated;

grant select on table
  cet.modules,
  cet.enrollments,
  cet.learners,
  cet.attendance_sessions,
  cet.attendance_records
to authenticated;

grant insert on table
  cet.attendance_sessions,
  cet.attendance_records
to authenticated;

grant update on table
  cet.attendance_records
to authenticated;
