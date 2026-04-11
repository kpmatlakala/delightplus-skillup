# Archived Migrations (001–015) — Historical Reference

## Status
🔴 **DO NOT RUN** these migrations sequentially on a fresh database.  
✅ **These are preserved for audit and version control purposes only.**

All functionality is now consolidated in `../000_unified_schema.sql`.

---

## What's Here

Fifteen sequential migration files from **February 25 — March 2, 2026**:

### Initial Schema (001–004)
- `001_initial_schema_and_rls.sql` — Core tables, RLS policies, triggers
- `002_attendance_checkin_checkout.sql` — Attendance tracking tables
- `003_public_rpc_bridge_for_cet.sql` — First 7 core RPCs
- `004_grant_cet_table_privileges.sql` — Role-based access control

### Profile & Learner Management (005–010)
- `005_auto_register_learner_on_login.sql` — `cet_self_register_learner` RPC (v1)
- `006_profile_rpc.sql` — `cet_get_my_profile` (v1, **legacy/superseded**)
- `007_profile_v2_and_phone_support.sql` — `cet_get_my_profile_v2`, phone column
- `008_fix_profile_role_ambiguity.sql` — Profile RPC role logic fix
- `009_fix_profile_id_ambiguity.sql` — Profile RPC id handling fix
- `010_backfill_and_harden_enrollments.sql` — Enrollment integrity, re-definition of `005`

### Progress & Content (011–012)
- `011_learner_progress.sql` — `learner_progress` table + progress RPCs
- `012_module_content_flows.sql` — `module_content_flows` table + flow RPCs

### Communications (013–015)
- `013_announcements.sql` — Announcements table + announcement RPCs
- `014_list_learners_for_messaging.sql` — Learner picker RPC
- `015_messages.sql` — Conversations & messages tables + messaging RPCs

---

## Why Archived?

1. **Consolidation**: All objects are now in `000_unified_schema.sql` with idempotent definitions
2. **Removed conflicts**: March 16–23 overlap and duplicate definitions have been removed
3. **Simplified deployment**: Single file deploy vs. 15+ sequential runs
4. **Version control**: Kept for historical tracking and git archaeology

---

## If You Need to Reference

To understand the development history of a specific feature, check the relevant file:
- **Learner authentication**: `005`, `010`
- **Profile management**: `006`, `007`, `008`, `009`, `010`
- **Progress tracking**: `011`
- **Module flows**: `012`
- **Announcements**: `013`
- **Messaging**: `014`, `015`

---

## Recovery (If Needed)

If you need to inspect the old migration logic:
  ```bash
  git log --oneline -- supabase/migrations/archive/
  git show <commit>:supabase/migrations/archive/001_initial_schema_and_rls.sql
  ```

---

Last Updated: April 1, 2026
