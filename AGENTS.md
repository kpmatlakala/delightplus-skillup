# CET Connect — AI Agent Handoff & Context Document

> **Purpose**: This file exists so that GitHub Copilot or any other AI coding agent can
> pick up development on this project without regressions or wasted effort.
> Read this before modifying _any_ file in this repo.

---

## Project Identity

| Property | Value |
|---|---|
| App name | CET Connect Portal |
| Qualification | FETC: IT Systems Development — SAQA 78965, NQF Level 4 |
| Supabase project ID | `ebzsvbbmahvqlshydkxg` |
| Supabase URL | `https://ebzsvbbmahvqlshydkxg.supabase.co` |
| Package manager | **Bun** (not npm/yarn) — always use `bun run <script>` |
| Framework | React 18 + TypeScript + Vite |
| UI library | shadcn/ui + Tailwind CSS |
| Router | React Router v6 |

---

## Role System — Exact Strings

The `role` field in `public.users` (Supabase meta) only ever contains three values:

| DB value | Who | Portal shown |
|---|---|---|
| `'admin'` | Facilitator / Administrator | Admin portal |
| `'moderator'` | PoE Moderator / second facilitator | Admin portal |
| `'user'` | Learner | Learner portal |

**Do NOT use `'learner'` as a role string in frontend code.**  
`learner` only appears as a `cet.user_role` ENUM value inside the DB.

In React, the role is accessed via:
```tsx
const { role } = useAuth(); // returns 'admin' | 'moderator' | 'user' | null
```

Admin portal is shown when `role === 'admin' || role === 'moderator'`.  
Learner portal is shown when `role === 'user'`.

---

## Database Access Rules — CRITICAL

### 1. All DB writes go through public RPCs

The entire `cet` schema (13 tables) is accessed exclusively via `security definer` RPCs
in the `public` schema with `set search_path = public, cet`.

**Never write direct Supabase `.from('cet.table').insert()` calls in frontend code.**  
Every insert/update/delete must flow through a `public.cet_*` RPC.

Reads via `.from()` may sometimes work due to RLS SELECT policies, but prefer the RPC pattern.

### 2. Typed RPC call pattern

Because `cet_*` RPCs are not in the generated Supabase types, cast the client:

```ts
const supabaseAny = supabase as unknown as {
  rpc: (fn: string, params?: Record<string, unknown>) => PromiseLike<{
    data: unknown; error: unknown;
  }>;
};
const { data, error } = await supabaseAny.rpc('cet_my_rpc', { param1: value });
```

See `src/hooks/useMessages.ts` or `src/hooks/useAnnouncements.ts` for working examples.

### 3. All 25 existing RPCs

| RPC | Key params | Returns |
|---|---|---|
| `cet_enrolled_learners` | — | Learner rows |
| `cet_modules` | — | Module rows |
| `cet_get_or_create_attendance_session` | `module_id, session_date, session_label` | Session row |
| `cet_get_attendance_records` | `p_session_id` | Attendance records |
| `cet_check_in` | `p_session_id, p_learner_id` | void |
| `cet_check_out` | `p_session_id, p_learner_id` | void |
| `cet_self_register_learner` | `p_full_name, p_email, p_phone` | Learner row |
| `cet_get_my_profile` | — | Profile row (legacy) |
| `cet_get_my_profile_v2` | — | Profile row (current) |
| `cet_update_my_profile_v2` | `p_display_name, p_bio, p_avatar_url, p_phone` | void |
| `cet_get_all_module_progress` | — | Progress rows for caller |
| `cet_upsert_module_progress` | `p_module_unit_standard_id, p_guide_completed, p_quiz_completed, p_assessment_submitted` | void |
| `cet_get_module_flow` | `p_unit_standard_id` | `{ flow: jsonb }` |
| `cet_upsert_module_flow` | `p_unit_standard_id, p_flow` | void |
| `cet_get_announcements` | — | Announcement rows (RLS hides Admin Only from learners) |
| `cet_post_announcement` | `p_title, p_message, p_audience` | Announcement row |
| `cet_pin_announcement` | `p_id, p_pinned` | void |
| `cet_delete_announcement` | `p_id` | void |
| `cet_list_learners_for_messaging` | — | `{ user_id, full_name, learner_code, email }[]` |
| `cet_send_message` | `p_recipient_id, p_body` | Message row |
| `cet_get_my_conversations` | — | `{ conversation_id, other_user_id, other_display_name, other_role, unread_count, last_message_body, last_message_at }[]` |
| `cet_get_conversation_messages` | `p_conversation_id` | Message rows |
| `cet_mark_conversation_read` | `p_conversation_id` | void |
| `cet_get_facilitator_user_id` | — | `{ user_id: string }` |
| `cet.get_my_role` *(schema-qualified)* | — | ENUM `cet.user_role` |

---

## Hook Architecture

### Existing hooks — do not duplicate

| Hook | File | Purpose |
|---|---|---|
| `useAuth` | `src/hooks/useAuth.ts` | Auth state: `user`, `role`, `loading` |
| `useAnnouncements` | `src/hooks/useAnnouncements.ts` | CRUD + realtime for announcements |
| `useMessages` | `src/hooks/useMessages.ts` | Conversation list, message send, realtime delivery |
| `useUnreadCount` | `src/hooks/useUnreadCount.ts` | Scalar unread message count for header badge |
| `useMobile` | `src/hooks/use-mobile.tsx` | Responsive breakpoint |

### Hook pattern (Supabase realtime)

All realtime hooks follow this shape:
1. On mount, fetch initial data
2. Subscribe to Supabase realtime channel
3. On relevant INSERT/UPDATE/DELETE, call `refresh()` (re-run the RPC)
4. On unmount, `supabase.removeChannel(channel)`

Realtime tables enabled in `supabase_realtime` publication:
- `cet.announcements`
- `cet.conversations`
- `cet.messages`

---

## Page & Component Map

| File | Owns |
|---|---|
| `src/pages/CommunicationsPage.tsx` | Unified `/communications` — announcements tab + messages tab. Both roles. |
| `src/pages/ModuleDetailPage.tsx` | Learner mission flow stepper + admin content view. Role-aware. |
| `src/pages/Index.tsx` | Admin dashboard |
| `src/pages/LearnersPage.tsx` | Admin learner list |
| `src/components/AppLayout.tsx` | Admin shell: header (Bell/Mail badges) + sidebar wrapper |
| `src/components/AppSidebar.tsx` | Admin nav links — only one "Communications" item → `/communications` |
| `src/data/courseData.ts` | Static course content for Block 1 modules |
| `src/integrations/supabase/client.ts` | Supabase client (URL + anon key) |

---

## Navigation / Routing Rules

### Communications
- There is **one route**: `/communications`
- It has **two tabs** controlled by `?tab=updates` (default) and `?tab=messages`
- `AppSidebar.tsx` points to `/communications`
- Bell icon in header → `/communications` (updates tab)
- Mail icon in header → `/communications?tab=messages`
- **Do NOT re-add** `/announcements` or `/messages` as separate routes

### Learner layout
- Learner portal uses a **headerless** layout
- Bell + Mail icons appear in the **admin AppLayout header** (not in learner layout)
- Both icons are visible for ALL roles (`role && ...` guard, not `role === 'user'`)

### Route protection
```tsx
// Admin + moderator only
<ProtectedRoute allowedRoles={['admin', 'moderator']}>

// Learner only
<ProtectedRoute allowedRoles={['user']}>

// All authenticated users (no allowedRoles prop)
<ProtectedRoute>
```
`/communications` uses a bare `<ProtectedRoute>` — accessible by all roles.

---

## Communications: Thread System Detail

`useMessages.ts` manages two thread types in the same list:

### DbThread — DB-backed (has `conversation_id`)
```ts
{
  id: string;           // = conversation_id UUID
  name: string;
  initials: string;
  role: string;         // "Admin" | "Learner" | "Moderator" | "User"
  otherUserId: string;  // used for cet_send_message
  unread: number;
  messages: Message[];
}
```
`other_role` from `cet_get_my_conversations` maps:
- `'admin'` → `"Admin"`
- `'moderator'` → `"Moderator"`
- `'user'` → `"Learner"` ← **this was a bug fix in 5o, do not revert**

### LocalThread — local only (no DB, no `conversation_id`)
Used for Site Coordinator, PoE Moderator, Lead Assessor contacts that are not on the platform.
```ts
{
  id: string;           // stable client-side ID like "contact-site-coordinator"
  name: string;
  initials: string;
  role: string;
  otherUserId: null;    // null = not a DB user
  unread: 0;
  messages: Message[];  // session-only, not persisted
}
```
When `otherUserId` is `null`, `cet_send_message` is NOT called — only local state updates.

### Contact tiles in MessagesPanel
- **Learner contacts**: Facilitator (fetched via `cet_get_facilitator_user_id`), Site Coordinator (local)
- **Admin contacts**: Site Coordinator (local), PoE Moderator (local), Lead Assessor (local), All Learners (local group), + "Other" → learner DB picker using `cet_list_learners_for_messaging`
- New contact tiles are rendered in a 2-column grid
- "Other" tile opens a searchable learner picker panel

---

## What NOT To Do

### Migration / DB
- **Use `000_unified_schema.sql` only for schema deployment.** Old migrations (001–015) have been archived; conflicting variants (016–024) have been deleted.
- **Do NOT attempt to run migrations sequentially.** The schema is consolidated into a single idempotent file.
- **Do NOT add new non-RPC DB access** (raw `.from('cet.*').insert()`) from the frontend.

### Frontend
- **Do NOT re-add mock/seed data to hooks.** `useAnnouncements.ts` and `useMessages.ts` have had all static fallback arrays removed. Empty state is intentional — surface empty state UI instead.
- **Do NOT add separate `/announcements` or `/messages` sidebar items.** The single `/communications` route handles both.
- **Do NOT guard Bell/Mail icons to learner-only.** They are intentionally shown for all authenticated roles.
- **Do NOT hardcode `unreadMessages = 0`** anywhere in `AppLayout.tsx` or `CommunicationsPage.tsx`. It is driven by `useUnreadCount`.

---

## Unified Schema File (April 1, 2026 Consolidation)

The migration architecture has been consolidated:
```
supabase/migrations/000_unified_schema.sql       ← Use ONLY this
supabase/migrations/archive/                    ← Historical reference only (001–015)
supabase/sql/                                   ← Diagnostic scripts, never deploy
```

### `000_unified_schema.sql` — Source of Truth
This 872-line idempotent file:
- Creates the `cet` schema + all 13 tables (all `IF NOT EXISTS`)
- Creates all ENUMs, triggers, indexes
- Drops + recreates all RLS policies (fully idempotent)
- Registers all 3 realtime publications
- Defines all 25 public RPCs (`CREATE OR REPLACE`)
- Inserts seed data (`ON CONFLICT DO NOTHING`)
- **Safe to re-run** on any Supabase instance

### `archive/` — Old Sequential Migrations (001–015)
- Preserved for git history and audit trail only
- **Do NOT run** these sequentially
- All functionality consolidated into `000_unified_schema.sql`

### Deleted Files (016–024 Variants)
- Conflicting overlapping migrations that had number collisions (016, 017, 018 appeared twice)
- All duplicate definitions consolidated into `000`
- See `supabase/migrations/README.md` for details

### To Bootstrap a New Supabase Instance
1. Create new Supabase project
2. Go to SQL Editor
3. Copy and paste full contents of `000_unified_schema.sql`
4. Execute
5. Done — schema is complete

---

## Pending Work (with context to continue)

### 1. Block 2 & Block 3 lesson plan content
- **Status**: Skeletons + lesson plan `.md` files exist in `public/docs/SAQA_78965_CET_Training/`
- **Files**: `Block-2-LessonPlan.md`, `Block-3-LessonPlan.md`
- **Action**: Facilitator provides content → populate `courseData.ts` following the same
  pattern as Block 1 entries, or upsert via `cet_upsert_module_flow` for DB-driven content
- **No schema changes needed**

### 2. Attendance tracker page
- **Status**: Page exists on disk at `src/pages/AttendancePage.tsx`
- **Action**: Re-add nav item to `AppSidebar.tsx` (admin only), add route in `App.tsx`
- **RPC ready**: `cet_get_or_create_attendance_session`, `cet_get_attendance_records`,
  `cet_check_in`, `cet_check_out` are all live in the DB

### 3. Dedicated `moderator` facilitator account
- **Status**: Code fully supports `moderator` role (same admin portal as `admin`)
- **Action**: Create user in Supabase Dashboard → Auth → Users, then set
  `raw_user_meta_data.role = "moderator"` via the Supabase admin API or Dashboard
- **No code changes needed**

### 4. PWA / offline packaging
- **Status**: Not started
- **Action**: Add `vite-plugin-pwa`, configure service worker + manifest, test on mobile
- `index.html` and `public/robots.txt` are the relevant entry points

### 5. Assessment PoE file upload
- **Status**: UI placeholder exists in `ModuleDetailPage.tsx`
- **Action**: Wire to Supabase Storage bucket, call `cet_upsert_module_progress` with
  `p_assessment_submitted = true` after successful upload

---

## TypeScript / Build Checks

After any structural change, run:
```sh
bun run build
```

Known acceptable warnings (not errors):
- Supabase `rpc()` calls cast via `as unknown as { rpc: ... }` — intentional, no types for `cet_*`

After adding new RPCs to the DB, add the typed wrapper to the relevant hook file.
Do NOT attempt to regenerate Supabase types (`supabase gen types`) without updating
`src/integrations/supabase/types.ts` carefully — the `cet_*` RPCs are NOT in generated types by design.

---

## Key Invariants Summary (Quick Reference)

| Rule | Reason |
|---|---|
| Use Bun, not npm | `bun.lockb` present; npm will create lockfile conflicts |
| RPCs only for DB writes | RLS blocks direct inserts from anon/user roles |
| `role === 'user'` means Learner | not `'learner'` |
| `/communications` = one page, two tabs | sidebar + header links point here |
| `000_unified_schema.sql` for fresh DB | Old migrations archived; overlapping variants deleted (Apr 1) |
| No mock data in hooks | Empty state = real empty data |
| `other_role === 'user'` → `"Learner"` label | Fixed in session 5o |
| Bell + Mail visible for all roles | Intentional — admin also uses messaging |
