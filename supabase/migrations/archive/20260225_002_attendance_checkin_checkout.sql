alter table cet.attendance_records
  add column if not exists check_in_at timestamptz,
  add column if not exists check_out_at timestamptz;

create index if not exists idx_cet_attendance_records_check_in_at
  on cet.attendance_records(check_in_at);

create index if not exists idx_cet_attendance_records_check_out_at
  on cet.attendance_records(check_out_at);
