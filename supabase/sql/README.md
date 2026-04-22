# Diagnostic & Debug SQL Scripts — Troubleshooting Only

## ⚠️ Status
🔴 **DO NOT RUN** these scripts in production.  
✅ **For local development and debugging only.**

These are ad-hoc SQL utilities used during development for schema inspection, testing, and troubleshooting. They are **not migrations** and **not part of the deployment pipeline**.

---

## What's Here

### Schema Inspection & Verification
- `check_actual_table_structure.sql` — Inspect current table columns and constraints
- `check_current_database_schema.sql` — List all tables, types, functions
- `check_current_storage_policies.sql` — List storage bucket policies
- `verify_quiz_tables.sql` — Verify quiz table structure exists

### Data Cleanup & Reset
- `clear_learner_progress.sql` — Wipe learner progress records (dev only)
- `fresh_migration_from_scratch.sql` — Nuke and rebuild schema from scratch

### Schema Fixes (Deprecated)
- `fix_learner_progress_schema.sql` — Old fix for learner_progress table
- `fix_announcements_rpc.sql` — Old fix for announcements RPC
- `fix_quiz_integration.sql` — Old fix for quiz integration
- `corrected_migration_with_actual_columns.sql` — Old debugging attempt
- `corrected_migration_with_user_id.sql` — Old debugging attempt

### Assessment & Storage
- `safe_assessment_table_creation.sql` — Create assessment tables (safe)
- `safe_storage_policy_fix.sql` — Fix storage policies (safe)
- `safe_migration_with_checks.sql` — Safe migration checks
- `minimal_storage_policy_fix.sql` — Minimal storage policy fix
- `debug_assessment_upload.sql` — Debug assessment upload flow

### One-Off Utilities
- `bootstrap_first_super_admin.sql` — Create initial admin user
- `create_audit_system.sql` — Create audit logging tables
- `create_quiz_system_simple.sql` — Create quiz tracking (old)
- `refresh_schema_cache.sql` — Refresh materialized views if used
- `run_all_pending_migrations.sql` — Legacy migration runner (do not use)

---

## How to Use

### For Local Development
1. Copy a script that matches your issue
2. Modify as needed for your context
3. Run in Supabase **local dev** environment only (via `supabase db execute` or SQL Editor on a dev instance)
4. Never push changes from these scripts back to the repository

### For Production Debugging
1. Use **Supabase Dashboard** SQL Editor on production
2. Only read data (SELECT queries)
3. Do not modify schema
4. If schema needs fixing, create a new migration file in `supabase/migrations/`

---

## When to Ignore These

✅ You should **ignore** these scripts if:
- Your schema is working correctly (use `000_unified_schema.sql` instead)
- You're deploying to production (never use dev scripts)
- You're onboarding to a new environment (run `000_unified_schema.sql` only)

---

## Git & Version Control

These scripts are:
- ✅ Committed to repo for reference
- ❌ Never auto-run by CI/CD
- ❌ Not referenced by Supabase CLI
- ⚠️ Safe to delete if space becomes an issue

---

## Migration Path

**If you have a repeatable schema fix**:
1. Extract the working SQL from this directory
2. Create a new file in `supabase/migrations/` (not in `sql/`)
3. Use the pattern `<ISO_TIMESTAMP>_<description>.sql`
4. Test on a dev instance
5. Commit and deploy via normal migration process

---

Last Updated: April 1, 2026
