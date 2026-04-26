# Sample ERD — Simple Payroll System

> Sample resource demonstrating how supplementary content is shipped alongside a
> module. Referenced from US 14924 (Systems Analysis & Design), Lecture 4.

## Entities

- **Employee** (`employee_id`, `full_name`, `id_number`, `bank_account`, `start_date`)
- **Department** (`department_id`, `name`, `cost_centre`)
- **Payslip** (`payslip_id`, `employee_id`, `period`, `gross`, `paye`, `uif`, `net`)
- **LeaveRequest** (`leave_id`, `employee_id`, `type`, `from_date`, `to_date`, `status`)

## Relationships

- Employee **belongs to** one Department (many-to-one).
- Employee **has many** Payslips (one-to-many, period-keyed).
- Employee **has many** LeaveRequests.

## Discussion prompts

1. Where would you enforce that `net = gross - paye - uif`?
2. Which attributes are candidates for a separate `EmployeeContact` entity?
3. How would you model a salary change without losing history?
