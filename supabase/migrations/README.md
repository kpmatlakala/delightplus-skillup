# Supabase Migrations — CET Connect Portal

## Architecture

This directory contains the **single source of truth** for the CET Connect Portal database schema.

### Active Schema
- **`000_unified_schema.sql`** — ✅ **USE THIS FOR ALL NEW INSTANCES**
  - Comprehensive, idempotent schema definition (872 lines)
  - Includes all 13 tables, 25 RPCs, 2 ENUMs, RLS policies, triggers, seed data
  - Uses `IF NOT EXISTS` and `CREATE OR REPLACE` for full idempotence
  - Supports both admin (`public.*`) and learner (`cet.*`) layers
  - **Safe to re-run** on any Supabase instance

### Archive (Historical Reference Only)
- **`archive/20260225_001–015_*`** — Old sequential migrations (audit trail)
  - Preserved for historical reference and version control
  - Do NOT run these sequentially on a fresh database
  - Consolidated into `000_unified_schema.sql`

### Deleted (Superseded)
- **`020260304_016–018_*`** (assessment attempts)
- **`20260316_016–017_*`** (profile field fixes)
- **`20260317_018–023_*`** (overlapping fixes)
- **`20260323_024_*`** (final attempt)
- All conflicting variants with number collisions and duplicate definitions have been removed
- All functionality is now in `000_unified_schema.sql`

---

## How to Deploy

### Fresh Supabase Instance
1. Create a new Supabase project
2. Navigate to **SQL Editor**
3. Copy and paste the full contents of **`000_unified_schema.sql`**
4. Execute
5. Schema is complete and ready to use

### Existing Instance
- No action needed — `000_unified_schema.sql` is idempotent (includes all `IF NOT EXISTS` checks)
- Safe to re-run if schema needs verification or rollback

---

## Migration Lifecycle

| Phase | Status | Files | Action |
|---|---|---|---|
| **Old Sequential (001–015)** | ✅ Archived | `archive/` | Reference only; do not run |
| **Conflicting Fixes (016–024)** | ❌ Deleted | (removed) | Superseded by `000` |
| **Current Unified Schema** | ✅ Active | `000_unified_schema.sql` | Use for all deployments |

---

## Schema Highlights

### Tables (13 total)
- `cet.programs`, `cet.modules`, `cet.learners`, `cet.enrollments`
- `cet.learner_progress` — Assessment & quiz progress tracking
- `cet.module_content_flows` — Learner module content sequence
- `cet.announcements`, `cet.conversations`, `cet.messages` — Communications
- `cet.attendance_sessions`, `cet.attendance_records` — Facilitator tracking

### RPCs (25 total, all public. schema)
**Core data access:**
- `cet_enrolled_learners()`, `cet_modules()`
- `cet_self_register_learner()`, `cet_get_my_profile_v2()`, `cet_update_my_profile_v2()`
- `cet_get_all_module_progress()`, `cet_upsert_module_progress()`

**Assessment & content:**
- `cet_get_module_flow()`, `cet_upsert_module_flow()`
- `cet_get_or_create_attendance_session()`, `cet_check_in()`, `cet_check_out()`

**Communications:**
- `cet_get_announcements()`, `cet_post_announcement()`, `cet_pin_announcement()`, `cet_delete_announcement()`
- `cet_send_message()`, `cet_list_learners_for_messaging()`, `cet_mark_conversation_read()`
- `cet_get_my_conversations()`, `cet_get_conversation_messages()`

### ENUMs
- `cet.user_role`: `'admin'`, `'lecturer'`, `'learner'`
- `cet.module_type`, `cet.record_status`, `cet.assessment_type`

### Realtime Publications
- `announcements`, `conversations`, `messages` — Published for real-time listeners

---

## Troubleshooting

**Schema outdated after upgrade?**
- Re-run `000_unified_schema.sql` in SQL Editor (safe; uses `IF NOT EXISTS`)

**RPC not found?**
- Verify RPC is listed in `000_unified_schema.sql` (search for `CREATE OR REPLACE FUNCTION public.cet_*`)
- Run `000_unified_schema.sql` again to ensure RPC is registered

**Table has wrong columns?**
- Check `000_unified_schema.sql` for the correct column definition
- Run schema and verify via `SELECT * FROM cet.table_name LIMIT 0` to inspect structure

---

## Git & Version Control

- **Archive folder**: Committed to git for historical tracking
- **Old migrations (001–015)**: Preserved in archive; never delete
- **Deleted migrations (016–024)**: Removed from repository; not recoverable from this branch
- **Commit message for consolidation**: "refactor: consolidate Supabase migrations into single unified schema (000_unified_schema.sql)"

---

Last Updated: April 1, 2026
