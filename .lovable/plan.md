## LMIS / Learner Portal Separation Plan

### Current State
- Admin/lecturer pages (Dashboard, Modules, Learners, etc.) live at `/dashboard`, `/modules`, `/learners`, etc.
- Learner pages live at `/learner`, `/learner/modules/:id`, etc.
- All share `AppLayout` component (sidebar hidden for learners)

### Proposed Structure

#### 1. Directory Restructure
```
src/
├── lmis/                          # LMIS (admin/lecturer portal)
│   ├── pages/                     # All admin pages moved here
│   │   ├── DashboardPage.tsx      # was Index.tsx
│   │   ├── ModulesPage.tsx
│   │   ├── LearnersPage.tsx
│   │   ├── LessonPlansPage.tsx
│   │   ├── AssessmentsPage.tsx
│   │   ├── BlockAssessmentAdminPage.tsx
│   │   ├── ProgramsPage.tsx
│   │   ├── CompliancePage.tsx
│   │   ├── AttendancePage.tsx
│   │   ├── PresentationLaunchPage.tsx
│   │   └── PresentationDesktopPage.tsx
│   ├── components/                # LMIS-specific components
│   │   ├── LmisSidebar.tsx        # renamed from AppSidebar
│   │   └── LmisLayout.tsx         # renamed from AppLayout (admin version)
│   └── routes.tsx                 # All /lmis/* route definitions
│
├── learner/                       # Learner portal
│   ├── pages/
│   │   ├── LearnerPortalPage.tsx
│   │   ├── ModuleDetailPage.tsx   # learner view
│   │   └── BlockAssessmentPage.tsx
│   ├── components/
│   │   └── LearnerLayout.tsx      # dedicated learner layout
│   └── routes.tsx                 # All /learner/* route definitions
│
├── pages/                         # Shared/public pages stay here
│   ├── LandingPage.tsx
│   ├── NotFound.tsx
│   ├── ProfilePage.tsx
│   ├── CommunicationsPage.tsx
│   ├── PoEPage.tsx
│   └── auth/
```

#### 2. Route Changes
| Current Route | New Route | Portal |
|---|---|---|
| `/dashboard` | `/lmis` | LMIS |
| `/modules` | `/lmis/modules` | LMIS |
| `/modules/:id` | `/lmis/modules/:id` | LMIS |
| `/learners` | `/lmis/learners` | LMIS |
| `/lesson-plans` | `/lmis/lesson-plans` | LMIS |
| `/assessments` | `/lmis/assessments` | LMIS |
| `/assessments/blocks` | `/lmis/assessments/blocks` | LMIS |
| `/programs` | `/lmis/programs` | LMIS |
| `/compliance` | `/lmis/compliance` | LMIS |
| `/present/launch` | `/lmis/present/launch` | LMIS |
| `/learner` | `/learner` | Learner (unchanged) |
| `/learner/modules/:id` | `/learner/modules/:id` | Learner (unchanged) |
| `/` | `/` | Landing (unchanged) |
| `/auth/*` | `/auth/*` | Public (unchanged) |

#### 3. Auth Redirects Updated
- Admin/lecturer login → `/lmis` (was `/dashboard`)
- Learner login → `/learner` (unchanged)

#### 4. Sidebar Updates
- `LmisSidebar.tsx` links all point to `/lmis/...`
- Branding: "DSA LMIS" instead of "DSA LMS"

#### 5. Future Separation
- When ready, `src/lmis/` becomes its own project
- Routes stay `/lmis/*` — just point that path to a different origin
- Shared code (auth, UI primitives) gets extracted to a shared package

### What stays shared (for now)
- `src/hooks/useAuth.tsx` — both portals use same auth
- `src/components/ui/` — shadcn components
- `src/integrations/supabase/` — same backend
- `CommunicationsPage`, `ProfilePage`, `PoEPage` — accessible by all roles
