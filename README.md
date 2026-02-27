# CET Connect Portal

## Overview

Full-stack learner/facilitator portal for the **FET Certificate: IT Systems Development**
delivered by the Data Science Academy (DSA) at CET Venda.

| Field | Value |
|---|---|
| Qualification | FET Certificate: IT Systems Development |
| SAQA ID | 78965 |
| NQF Level | 4 |
| Total Credits | 131 |
| Provider | Data Science Academy |
| Delivery site | CET Venda |
| Blocks | 3 (Block 1: Feb–Mar 2026) |

---

## Tech Stack

| Layer | Library / Tool |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| Routing | React Router v6 |
| State / data | TanStack Query + Supabase Realtime |
| Backend | Supabase (PostgreSQL 15, Auth, Realtime) |
| Testing | Vitest + Testing Library |
| Package manager | Bun |

Supabase project ID: `ebzsvbbmahvqlshydkxg`

---

## User Roles

| Role (`public.users.role`) | Portal | Notes |
|---|---|---|
| `admin` | Admin / Facilitator portal | Full access; same person as course facilitator |
| `moderator` | Admin / Facilitator portal | Alternative facilitator account |
| `user` (default) | Learner portal | Auto-registered on first login via `cet_self_register_learner` |

Role is set manually in Supabase Dashboard → Authentication → Users → edit user metadata.

---

## App Routes

### Admin / Facilitator (roles: admin, moderator)

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Program stats, module overview, block summary |
| `/modules` | Modules | List with type + block filters |
| `/modules/:id` | Module Detail | Objectives, content, activities, resources, lesson plan, facilitator guide, quiz, assessment |
| `/learners` | Learners | Enrolled learner list with progress bars |
| `/lesson-plans` | Lesson Plans | Per-module lesson plan cards |
| `/assessments` | Assessments | Matrix of all formative + summative assessments |
| `/programs` | Programs | Program metadata summary |
| `/compliance` | Compliance | Checklist grouped by category |
| `/communications` | Communications | Announcements (post/pin/delete) + Direct messages |
| `/profile` | Profile | Display name, bio, avatar, phone |

### Learner (role: user)

| Route | Page | Description |
|---|---|---|
| `/learner` | Learner Portal | Module cards with Guide → Quiz → Assessment stepper |
| `/learner/modules/:id` | Module Detail | Same page as admin; learner-specific mission flow |
| `/communications` | Communications | Announcement feed + Direct messages |
| `/profile` | Profile | Display name, bio, avatar, phone |

### Auth

| Route | Page |
|---|---|
| `/auth/login` | Login |
| `/auth/signup` | Signup |

---

## Features Implemented

### Core
- Dashboard: program banner, credit coverage indicator, block-based module stats
- Module detail: objectives, content, activities, resources, assessment matrix per module
- Lesson plans linked to modules
- Compliance checklist with toggle

### Authentication & Profiles
- Supabase email/password auth with role-based routing
- Auto-registration: first login as `user` → creates `cet.learners` row + enrolment
- Profile v2 with phone number (synced to `cet.learners.phone`)
- Avatar upload

### Learner Portal
- Mission flow stepper: Guide → Quiz → Assessment
- Session progress persisted via `cet.learner_progress` (DB)
- Quiz questions loaded from `courseData.ts` (static) or `cet.module_content_flows` (DB)
- Assessment submission tracker with file upload path
- `highestSessionReached` guard: stepper never regresses on back-navigation

### Communications (unified `/communications` page)
- **Updates tab**: realtime announcement feed, pinned items at top, audience filtering
  - Admin can post / pin / unpin / delete announcements
  - Audience options: All, Block 1, Block 2, Block 3, Admin Only
  - Learners see all except "Admin Only"
- **Messages tab**: direct messaging with realtime delivery
  - Learner contacts: Facilitator/Admin (DB lookup), Site Coordinator (local)
  - Admin contacts: Site Coordinator, PoE Moderator, Lead Assessor, All Learners (local), + Other learner picker
  - "Other" picker fetches DB learner directory (`cet_list_learners_for_messaging`)
  - DB-backed threads via `cet.conversations` + `cet.messages`
  - Unread badge on Messages tab + header Mail icon (live via `useUnreadCount` hook)
  - Realtime subscription on `cet.messages INSERT`

### Header
- Bell icon → `/communications` (Updates tab) with unread announcements badge
- Mail icon → `/communications?tab=messages` with unread messages badge (live)
- Both icons visible for all roles (admin sidebar + learner headerless layout)

---

## Database Schema (`cet` schema)

### Tables

| Table | Purpose |
|---|---|
| `cet.programs` | Qualification metadata (SAQA 78965) |
| `cet.modules` | Unit standards (18 modules across 3 blocks) |
| `cet.learners` | Learner profiles; `user_id` links to `auth.users` |
| `cet.enrollments` | Learner ↔ Program enrolment |
| `cet.attendance_sessions` | Per-module, per-date sessions |
| `cet.attendance_records` | Per-learner attendance with check-in/out timestamps |
| `cet.assessments` | Assessment definitions per module |
| `cet.assessment_results` | Learner scores + feedback |
| `cet.announcements` | Platform announcements with audience + pin |
| `cet.learner_progress` | Per-learner, per-unit-standard guide/quiz/assessment progress |
| `cet.module_content_flows` | JSONB lesson flow content (admin-editable, single source of truth) |
| `cet.conversations` | Direct message conversation pairs |
| `cet.messages` | Individual messages with `read_at` for unread tracking |

### Role helper

```sql
cet.get_my_role() → cet.user_role
-- admin → 'admin', moderator → 'lecturer', user → 'learner'
```

### Public RPC Bridge

All DB access from the frontend goes through `security definer` RPCs in the `public` schema
(prefixed `cet_*`). Direct table writes are blocked; all inserts/updates happen inside RPCs.

| RPC | Description |
|---|---|
| `cet_enrolled_learners()` | Active enrolled learners |
| `cet_modules()` | Module list |
| `cet_get_or_create_attendance_session(module_id, date, ...)` | Upsert session |
| `cet_get_attendance_records(session_id)` | Records for a session |
| `cet_check_in / cet_check_out` | Mark attendance |
| `cet_self_register_learner(name, email, phone)` | Register learner on first login |
| `cet_get_my_profile / cet_get_my_profile_v2` | Profile read |
| `cet_update_my_profile_v2(...)` | Profile write (syncs learner phone) |
| `cet_get_all_module_progress()` | All progress rows for caller |
| `cet_upsert_module_progress(unit_std_id, ...)` | Merge progress row |
| `cet_get_module_flow(unit_std_id)` | Fetch flow JSONB |
| `cet_upsert_module_flow(unit_std_id, flow)` | Admin updates flow |
| `cet_get_announcements()` | Ordered announcements (RLS filters "Admin Only") |
| `cet_post_announcement(title, msg, audience)` | Admin posts announcement |
| `cet_pin_announcement(id, pinned)` | Admin pin/unpin |
| `cet_delete_announcement(id)` | Admin delete |
| `cet_list_learners_for_messaging()` | Recipient picker directory |
| `cet_send_message(recipient_id, body)` | Send / start conversation |
| `cet_get_my_conversations()` | Inbox list with unread counts |
| `cet_get_conversation_messages(conv_id)` | Messages in a conversation |
| `cet_mark_conversation_read(conv_id)` | Mark received messages read |
| `cet_get_facilitator_user_id()` | Facilitator user_id for learner → admin messages |

---

## Realtime Subscriptions

| Channel | Table | Used by |
|---|---|---|
| `cet-announcements-{userId}` | `cet.announcements` INSERT/UPDATE/DELETE | `useAnnouncements` hook |
| `cet-messages-realtime` | `cet.messages` INSERT | `useMessages` hook |
| `cet-unread-count-{userId}` | `cet.messages` INSERT | `useUnreadCount` hook (header badge) |

---

## Migration History

Individual files in `supabase/migrations/` are kept for audit. A single
**idempotent** file consolidating all 15 migrations is at:

```
supabase/migrations/000_unified_schema.sql
```

Use this file to bootstrap a fresh Supabase project or any compatible PostgreSQL 15+ instance.

| File | Date | Description |
|---|---|---|
| `001_initial_schema_and_rls.sql` | 2026-02-25 | Core tables, ENUMs, triggers, RLS policies |
| `002_attendance_checkin_checkout.sql` | 2026-02-25 | Add check_in/out columns to attendance_records |
| `003_public_rpc_bridge_for_cet.sql` | 2026-02-25 | First public RPC functions for attendance |
| `004_grant_cet_table_privileges.sql` | 2026-02-25 | Re-apply table grants (idempotent patch) |
| `005_auto_register_learner_on_login.sql` | 2026-02-25 | `cet_self_register_learner` v1 |
| `006_profile_rpc.sql` | 2026-02-25 | `cet_get_my_profile` / `cet_update_my_profile` v1 |
| `007_profile_v2_and_phone_support.sql` | 2026-02-25 | Profile v2 + learner phone sync |
| `008_fix_profile_role_ambiguity.sql` | 2026-02-25 | Fix column ambiguity in profile update |
| `009_fix_profile_id_ambiguity.sql` | 2026-02-25 | Fix id ambiguity + backfill enrollments |
| `010_backfill_and_harden_enrollments.sql` | 2026-02-25 | Harden self-registration + enrolment backfill |
| `011_learner_progress.sql` | 2026-02-25 | `cet.learner_progress` table + RPCs |
| `012_module_content_flows.sql` | 2026-02-25 | `cet.module_content_flows` JSONB table + RPCs |
| `013_announcements.sql` | 2026-02-27 | Announcements table (audience/pinned) + realtime + seed |
| `014_list_learners_for_messaging.sql` | 2026-02-27 | Learner directory RPC (superseded by 015) |
| `015_messages.sql` | 2026-02-27 | Conversations + messages tables + 6 RPCs + realtime |
| **`000_unified_schema.sql`** | 2026-02-27 | **All-in-one idempotent schema for fresh installs** |

---

## Deploying to a New Supabase Project

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `supabase/migrations/000_unified_schema.sql` in full.
3. Update `src/integrations/supabase/client.ts` with the new project URL and anon key.
4. Update `supabase/config.toml` with the new `project_id`.
5. In Supabase Dashboard → Authentication → URL Configuration, add your app URL.
6. Create your admin user and set role via Dashboard → Authentication → Users
   → select user → User metadata → add `"role": "admin"`.

---

## Local Development

### Prerequisites

- Node.js 18+ or Bun
- Supabase account / project

### Setup

```sh
bun install
```

Create `.env.local`:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

### Run

```sh
bun run dev        # http://localhost:5173
```

### Quality checks

```sh
bun run lint
bun run test
bun run build
```

---

## Key Source Files

| File | Purpose |
|---|---|
| `src/hooks/useAuth.ts` | Auth state + role |
| `src/hooks/useAnnouncements.ts` | Announcement CRUD + realtime |
| `src/hooks/useMessages.ts` | Direct messaging + realtime |
| `src/hooks/useUnreadCount.ts` | Live unread message badge count |
| `src/pages/CommunicationsPage.tsx` | Unified announcements + messaging UI |
| `src/pages/ModuleDetailPage.tsx` | Learner mission flow + admin content view |
| `src/components/AppLayout.tsx` | Header with Bell/Mail badges |
| `src/data/courseData.ts` | Static course content (Block 1 modules) |
| `src/integrations/supabase/client.ts` | Supabase client init |

---

## Pending / Deferred

- Block 2 and Block 3 lesson plan + quiz content (facilitator to provide)
- Dedicated `moderator` facilitator account (no code changes needed — create user, set role)
- Attendance tracker page (preserved on disk, to be reinstated)
- Offline / PWA packaging for low-connectivity delivery sites
