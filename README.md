# CET Connect Portal (DSA Course Manager)

## Deduction (Current App State)

This project is a frontend-first course management portal for the DSA delivery of:

- **Qualification:** FET Certificate: IT Systems Development
- **SAQA ID:** 78965
- **NQF Level:** 4
- **Provider shown in app:** Data Science Academy

Based on the current codebase, this is an **MVP UI/admin tracker** that already supports navigation and core teaching operations views, but it is still mostly powered by **local in-memory mock data** (no persistent backend flows implemented yet).

## What is implemented

- Dashboard with program banner, credit coverage indicator, module stats, and block-based module overview.
- Modules listing with filters by module type (`All`, `Knowledge`, `Practical`) and block (`All`, `1`, `2`, `3`).
- Module detail pages with objectives, content, activities, resources, status, and metadata.
- Learners table with learner list and progress bars.
- Attendance screen with per-session learner checkboxes and present count.
- Lesson plans list linked to module details.
- Assessments matrix generated from module metadata.
- Programs summary page.
- Compliance checklist grouped by category with toggleable completion.
- Announcements page with seeded notices.
- Messages placeholder page indicating backend integration is pending.

## What is not implemented yet (inferred)

- No persistent database writes for attendance, compliance, messages, or learner progress.
- No authentication/authorization or role separation.
- No API integration currently wired into page flows.
- No real messaging system (page is a placeholder).
- No robust test coverage yet (only a basic sample test exists).

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui + Radix UI
- React Router
- TanStack Query (installed and provider configured)
- Vitest + Testing Library (minimal test scaffolding)
- Supabase client folder exists but is not yet actively used in feature flows

## App routes

- `/` Dashboard
- `/modules` Modules list
- `/modules/:id` Module detail
- `/learners` Learners
- `/attendance` Attendance
- `/lesson-plans` Lesson plans
- `/assessments` Assessments
- `/programs` Programs
- `/compliance` Compliance
- `/announcements` Announcements
- `/messages` Messages

## Local development

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Run

```sh
npm install
npm run dev
```

### Quality checks

```sh
npm run lint
npm run test
npm run build
```

## Documentation status

This README now reflects the app behavior currently present in code (deduction pass 1).

Once you share supporting docs, we can expand this with:

- business requirements mapping,
- user roles and permissions,
- data model + API contract,
- deployment and offline operations guide,
- QA/UAT checklist and release notes.

## Immediate next implementation

See the execution guide in:

- [supabase/NEXT_STEPS_AUTH_AND_DASHBOARDS.md](supabase/NEXT_STEPS_AUTH_AND_DASHBOARDS.md)
