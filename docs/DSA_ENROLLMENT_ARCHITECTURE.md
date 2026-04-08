# DSA Registration & Course Application Flow — Architecture Document

> **Version**: v1.0  
> **Date**: 2026-04-08  
> **Status**: Approved for implementation

---

## 1. Overview

Transition from single-program auto-enrollment to a **hybrid multi-program** model:

- **Register → Auto-enroll in default program** (foundation/free tier)
- **Browse catalog → Apply for additional programs**
- **Hybrid approval**: Open courses auto-approve; accredited OCs require admin review

---

## 2. Current State

### Signup Flow (as-is)
1. User signs up via `/auth/signup`
2. `handle_new_user` trigger creates `public.users` row
3. `dsa_self_register_learner` RPC:
   - Creates `dsa.learners` row
   - Finds first active program in `dsa.programs`
   - Auto-enrolls in `dsa.enrollments`

### Existing Tables (dsa schema)
- `dsa.programs` — program catalog (has `is_active`, `saqa_id`)
- `dsa.learners` — learner profiles
- `dsa.enrollments` — links learners ↔ programs (status: Active/Inactive)

---

## 3. Proposed Schema Changes

### 3.1 Extend `dsa.programs`

```sql
ALTER TABLE dsa.programs
  ADD COLUMN IF NOT EXISTS approval_required boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_default boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS program_type text DEFAULT 'FET Certificate',
  ADD COLUMN IF NOT EXISTS description text;
```

| Column | Purpose |
|---|---|
| `approval_required` | `false` = auto-approve on apply; `true` = admin must approve |
| `is_default` | `true` = auto-enroll on signup (only one should be true) |
| `category` | Filter group: "AI & Data Science", "Software Development", etc. |
| `program_type` | "FET Certificate", "Occupational Certificate", "Short Course" |
| `description` | Public-facing program description |

### 3.2 New Table: `dsa.applications`

```sql
CREATE TABLE dsa.applications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id  uuid NOT NULL REFERENCES dsa.learners(id),
  program_id  uuid NOT NULL REFERENCES dsa.programs(id),
  status      text NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  applied_at  timestamptz NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES public.users(id),
  reviewed_at timestamptz,
  review_note text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (learner_id, program_id)
);
```

### 3.3 Update `dsa_self_register_learner`

Change: Instead of enrolling in "first active program", enroll in the program where `is_default = true`.

```sql
SELECT p.id INTO v_program_id
FROM dsa.programs p
WHERE p.is_default = true AND p.is_active = true
LIMIT 1;
```

---

## 4. New RPCs

### 4.1 `dsa_apply_for_program(p_program_id uuid)`

**Who**: Any authenticated learner  
**Logic**:
1. Look up learner by `auth.uid()`
2. Check not already enrolled or applied
3. Insert into `dsa.applications` with status `'pending'`
4. If program has `approval_required = false`:
   - Auto-set status to `'approved'`
   - Insert into `dsa.enrollments` with status `'Active'`
5. Return application ID

### 4.2 `dsa_get_my_applications()`

**Who**: Authenticated learner  
**Returns**: List of applications with program title, status, applied_at

### 4.3 `dsa_get_pending_applications()`

**Who**: Admin/moderator only  
**Returns**: All applications with status `'pending'`, including learner name, program title

### 4.4 `dsa_review_application(p_application_id uuid, p_decision text, p_note text)`

**Who**: Admin/moderator only  
**Logic**:
1. Validate `p_decision` is `'approved'` or `'rejected'`
2. Update `dsa.applications` with decision, reviewer, timestamp, note
3. If approved: insert into `dsa.enrollments`
4. (Future) Send notification to learner

---

## 5. Frontend Changes

### 5.1 Programs Catalog Page (`/programs`)

- Render all programs from `dsa.programs` (or static catalog initially)
- Filter by category, program type
- Each card shows: title, NQF level, credits, status badge
- **"Apply" button** for non-enrolled programs
  - If `approval_required = false`: instant enrollment, toast "You're enrolled!"
  - If `approval_required = true`: toast "Application submitted — pending review"
- **"Enrolled" badge** for already-enrolled programs
- **"Pending" badge** for pending applications

### 5.2 Learner Dashboard

- Show "My Programs" section listing enrolled programs
- Show "Pending Applications" if any

### 5.3 Admin: Applications Review Page

- Table of pending applications
- Approve / Reject buttons with optional note
- Filter by program, date

---

## 6. Program Seed Data

Mark the FET Certificate: IT Systems Development as `is_default = true, approval_required = false`.

All Occupational Certificates: `is_default = false, approval_required = true`.

| Program | Type | Default | Approval |
|---|---|---|---|
| FET Certificate: IT Systems Development | FET Certificate | ✅ | Auto |
| FET Certificate: Telecom Network Ops | FET Certificate | ❌ | Auto |
| OC: Cloud Administrator | Occupational Certificate | ❌ | Admin |
| OC: AI Software Developer | Occupational Certificate | ❌ | Admin |
| OC: Cyber Security Analyst | Occupational Certificate | ❌ | Admin |
| OC: IoT Developer | Occupational Certificate | ❌ | Admin |
| OC: Front-End Web Designer | Occupational Certificate | ❌ | Admin |
| OC: Python Programmer | Occupational Certificate | ❌ | Admin |
| OC: Systems Developer | Occupational Certificate | ❌ | Admin |

---

## 7. Implementation Order

1. **Migration**: Extend `dsa.programs`, create `dsa.applications`, update `dsa_self_register_learner`
2. **Seed data**: Insert/update programs with new columns
3. **RPCs**: `dsa_apply_for_program`, `dsa_get_my_applications`, `dsa_get_pending_applications`, `dsa_review_application`
4. **Frontend — Programs Page**: Filterable catalog with Apply buttons
5. **Frontend — Admin Applications Page**: Review queue
6. **Frontend — Dashboard**: My Programs + Pending section

---

## 8. Security Considerations

- All application writes go through `SECURITY DEFINER` RPCs
- Admin-only RPCs check `public.users.role IN ('admin', 'moderator')`
- RLS on `dsa.applications`: learners see only their own; admins see all
- Unique constraint `(learner_id, program_id)` prevents duplicate applications
- `approval_required` flag is server-side only — cannot be overridden from client

---

## 9. Future Enhancements

- Email/push notifications on application status change
- Application form with motivation/prerequisites
- Batch approve/reject
- Program prerequisites (must complete Program A before applying to B)
- Waitlist for capacity-limited programs
