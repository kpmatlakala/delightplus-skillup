# Learner Branch — Status

_Last updated: 2026-05-01_

Snapshot of the **learner branch** (TDSA Learning LMS). This branch treats every authenticated user strictly as a learner; admin/staff apps live in separate branches.

---

## ✅ Done

- **Branding**: Renamed to **TDSA Learning**, navy palette, logo + wordmark in sidebar.
- **Routing**: All authenticated users → `/learner/*`. LMIS/admin routes disabled and redirected.
- **Learner Portal Dashboard** (`LearnerPortalPage.tsx`): Cleaned up — removed the noisy "Information Systems Analysis" header block; kept Ops Feed, Next check-in, Quick Access, Module selector, and Block assessment cards.
- **Learner Sidebar**: Grouped nav (Learning / Communication / Account) with Dashboard, Catalog, My Modules, Assessments, PoE, Updates, Messages, Profile.
- **Content scaffolding under `public/`**:
  - `public/courses/_template/` + `public/courses/saqa-78965/` with `course.json`, `workbooks/`, `assessments/`, `memos/`, `slides/`, `resources/` subfolders + READMEs.
  - `public/catalog/` (covers, brochures), `public/resources/` (templates, policies, guides), `public/media/` (video, audio).
  - Sample content: ERD walkthrough + "Using the Learner Portal" guide.
- **SAQA 78965 source material**: Already in `public/docs/SAQA_78965_CET_Training/` (Block 1–3 lesson plans, unit standards, assessments, memos).
- **Catalog / My Modules / Assessments pages**: Built and wired to `/learner/catalog`, `/learner/modules`, `/learner/assessments`.

---

## 🟡 In flight / partially wired

- **Catalog page** (`/learner/catalog`) — page exists; cover art from `public/catalog/covers/` not yet rendered.
- **My Modules** (`/learner/modules`) — index page exists; still reads from `src/data/courseData.ts` rather than `public/courses/saqa-78965/course.json`.
- **Assessments** (`/learner/assessments`) — overview page exists; per-block assessment pages (`/learner/assessment/block/:blockNum`) already wired. OTP gating is UI-only.
- **Course content loading from `public/courses/<slug>/`** — folders ready, UI still reads from `src/data/*` static files. Migration pending.

---

## 🔴 Not started (next likely steps)

1. Render `dsaProgramCatalog` cards with cover art from `public/catalog/covers/`.
2. Wire **My Modules** to read `public/courses/saqa-78965/course.json` as the source of truth.
3. Wire module materials (workbooks, assessments, memos, slides, resources) to fetch from `public/courses/<slug>/…` instead of bundled TS data.
4. Implement real **OTP gating** for block assessments (facilitator-issued code → unlock).
5. **Auto-enroll on signup → SAQA 78965** (planned, not yet implemented in DB trigger).
