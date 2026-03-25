-- Migration 016: Add ID number, department, school to cet.learners
-- Date: 2026-03-16

alter table cet.learners
  add column if not exists id_number text,
  add column if not exists department text,
  add column if not exists school text;

-- Block 1 venue: Vhembe Campus
-- (For attendance/session records, reference as needed)

-- To revert:
-- alter table cet.learners drop column if exists id_number;
-- alter table cet.learners drop column if exists department;
-- alter table cet.learners drop column if exists school;
