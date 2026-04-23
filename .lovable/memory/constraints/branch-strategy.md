---
name: Branch Strategy — Three Dedicated Apps
description: Project split into 3 role-dedicated branches/apps; current branch is learner-only
type: constraint
---

The project will be split into **at least 3 dedicated branches/apps**, one per role:

1. **Admin** — dedicated app for administrators
2. **Staff** — dedicated app for facilitators, moderators, assessors, etc.
3. **Students (Learners)** — dedicated app for learners

**Current focus: Learner branch only.**

Rules for this branch:
- Every authenticated user is treated **strictly as a learner**, regardless of their actual role in the database (admin, moderator, lecturer, etc.).
- No admin or staff UI, routing, or features should exist or be re-introduced here.
- LMIS / admin / lecturer routes must remain disabled and redirect to `/learner`.
- Do NOT add role-based branching that sends users anywhere other than the learner portal.

**How to apply:** Only switch focus to another branch (Admin or Staff) when the user explicitly says so. Until then, build features exclusively for the learner experience.
