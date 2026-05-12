# Qualification Structures — Reference for LMIS & Database Design

> Purpose: A single reference describing how the different certificate / programme
> types we offer at DSA are structured, so the **LMIS data model**, the
> **`dsa` schema** in Supabase, and the **learner UI** can represent each one
> correctly without forcing them all into the same shape.

Last updated: 2026-05-12 · Status: Draft v1 (guiding doc, not yet implemented)

---

## 1. The four shapes we actually deal with

Despite the official labels ("Skills Programme", "Occupational Certificate",
"FET Certificate", etc.), in practice the **structure of the curriculum** falls
into one of four shapes. The official label and the structural shape do **not**
always line up — some Skills Programmes follow the Occupational shape, and some
QCTO products are delivered as short Skills Programmes.

| # | Structural shape          | Typical official label(s)                          | Awarding body  | Example in our catalog                  |
|---|---------------------------|----------------------------------------------------|----------------|------------------------------------------|
| 1 | **Unit-Standard based**   | FET Certificate, National Certificate              | SAQA / SETA    | SAQA 78965 — IT: Systems Development     |
| 2 | **Occupational (KM/PM/WM + EISA)** | Occupational Certificate, full QCTO qualification | QCTO           | OC: Cloud Administrator (planned)        |
| 3 | **Skills Programme (Occupational subset)** | Skills Programme registered against an OC | QCTO           | SP-230375 — Python Programmer            |
| 4 | **Short Course / CPD**    | Short Course, Micro-credential                     | DSA internal   | Future short courses                     |

**Key insight:** shape #3 (Skills Programme that follows Occupational structure)
is the awkward one. It is officially a Skills Programme but its modules use the
**KM / PM / WM** language of a full Occupational Certificate, because it is
carved out of one. We must store the *structural shape*, not just the label.

---

## 2. Shape #1 — Unit-Standard based (SAQA / SETA)

**Example:** SAQA 78965 — FETC: IT Systems Development (NQF 4, 165 credits)

### Structure

```
Qualification (SAQA ID, NQF Level, Total Credits)
└── Unit Standards
    ├── Fundamental    (compulsory, e.g. communication, maths literacy)
    ├── Core           (compulsory subject matter)
    └── Elective       (choose-from list to make up credits)
```

- Each **Unit Standard** has its own SAQA ID, credits, NQF level, specific
  outcomes, and assessment criteria.
- SAQA does **not** classify USs as "Knowledge" vs "Practical" — every US
  is meant to integrate both. We may *internally* tag a US as
  knowledge-leaning or practical-leaning for UI hints, but this is **not**
  part of the official spec.
- Assessment is per-US (formative + summative), plus an integrated
  Portfolio of Evidence (PoE).
- Delivery format (block release, distance, self-paced, etc.) is a
  **delivery layer** decision and is independent of the curriculum.

### LMIS / DB implications

- Group modules by **Fundamental / Core / Elective**.
- `qualification_type = 'unit_standard'`.
- Optional soft tag `module.emphasis ∈ {'knowledge','practical','integrated'}`.
- "Blocks" / "Interventions" live in a **separate `delivery_plan`** table —
  they are not part of the curriculum.

---

## 3. Shape #2 — Occupational Certificate (QCTO, full)

**Example:** Future "Occupational Certificate: Cloud Administrator" etc.

### Structure

```
Occupational Qualification (QCTO Curriculum Code, OFO Code, NQF, Credits)
├── Knowledge Modules        (KM-01, KM-02, …)   — theory
├── Practical Skills Modules (PM-01, PM-02, …)   — applied tasks
├── Work Experience Modules  (WM-01, WM-02, …)   — workplace exposure
└── EISA — External Integrated Summative Assessment
        (single national exit assessment, set & moderated by QCTO/AQP)
```

- Every module has an explicit **type tag** (KM / PM / WM) — this is part of
  the official spec, not a soft tag.
- Each module has its own credits + notional hours, often with a split
  between contact, self-study, and workplace hours.
- **Internal assessments** per module are formative + summative (gatekeeping
  for the EISA).
- **EISA** is the single externally-set assessment that confers the
  qualification — modules alone do not.

### LMIS / DB implications

- `qualification_type = 'occupational_full'`.
- Module table needs a `module_kind ∈ {'KM','PM','WM'}` enum (required, not nullable).
- Need an `eisa` entity (one per qualification) with status tracking
  (eligible → registered → sat → result).
- Workplace component (WM) needs **employer / mentor / logbook** entities
  that the unit-standard shape doesn't have.

---

## 4. Shape #3 — Skills Programme on Occupational structure

**Example:** SP-230375 — Python Programmer (NQF 4, 60 credits, SDP: Beyond Capital)

This is the awkward in-between. Officially it is a **Skills Programme**
(shorter, no EISA, may not lead to a full qualification on its own), but the
modules it contains are **carved out of a full Occupational Certificate**
and so they keep the **KM / PM / WM** structure.

### Structure (as supplied to us so far)

```
Skills Programme (SP code, parent OC reference, NQF, Credits)
├── Knowledge Modules      (KM-01 … KM-05 for Python)
├── Practical Skills Modules (PM-… — supplied later)
├── Work Experience Modules  (WM-… — supplied later)
└── (No EISA — exit is the SP completion certificate, not the OC qualification)
```

For SP-230375 specifically, we currently only have the 5 KM modules
(20 credits). PM and WM materials are still to be supplied by the SDP to
reach the 60-credit total.

### LMIS / DB implications

- `qualification_type = 'skills_programme_occupational'`.
- Same `module_kind` enum as shape #2 (KM/PM/WM).
- **No** EISA entity required.
- Optional `parent_occupational_qualification_id` foreign key — useful so a
  learner who completes the SP can later RPL into the parent OC.
- Renders in the UI almost identically to shape #2, just without the EISA
  card.

---

## 5. Shape #4 — Short Course / CPD (DSA internal)

For internal short courses, masterclasses, or micro-credentials that are
not registered with SAQA/QCTO.

### Structure

```
Short Course
└── Lessons / Topics (flat or grouped)
    └── Optional internal assessment + DSA certificate of completion
```

### LMIS / DB implications

- `qualification_type = 'short_course'`.
- No SAQA ID, no NQF level required (both nullable).
- No Fundamental/Core/Elective and no KM/PM/WM grouping — just an ordered
  list of lessons.
- Certificate is internal, no external moderation entity.

---

## 6. Cross-cutting: what every shape needs

Regardless of shape, the LMIS needs to capture:

1. **Programme metadata** — title, code, NQF, credits, provider, status.
2. **Modules / units** — title, code, credits, ordering, status, content links.
3. **Enrolment** — learner ↔ programme, with date, cohort, status.
4. **Progress per learner per module** — not started / in progress / complete.
5. **Assessments** — formative and summative, per module + (where applicable) per qualification (EISA).
6. **Delivery plan (separate from curriculum)** — cohorts, blocks, sessions,
   facilitators, venues. *This is where "block-based intervention" lives —
   never inside the curriculum table.*
7. **Evidence / PoE** — file uploads, mentor sign-offs, moderation records.
8. **Awards** — certificates issued (internal or external), date, verifier.

---

## 7. Recommended schema-level discriminator

On the `programs` table (or `dsa.programs`):

```sql
qualification_type text not null check (qualification_type in (
  'unit_standard',                  -- Shape 1
  'occupational_full',              -- Shape 2
  'skills_programme_occupational',  -- Shape 3
  'short_course'                    -- Shape 4
))
```

On the `modules` table:

```sql
-- Used by Shape 1
us_category text check (us_category in ('fundamental','core','elective'))

-- Used by Shapes 2 & 3
module_kind text check (module_kind in ('KM','PM','WM'))

-- Optional soft tag for Shape 1
emphasis text check (emphasis in ('knowledge','practical','integrated'))
```

Validation rules (enforce in a trigger or app layer):

- `qualification_type = 'unit_standard'` → `us_category` required, `module_kind` null.
- `qualification_type IN ('occupational_full','skills_programme_occupational')` → `module_kind` required, `us_category` null.
- `qualification_type = 'occupational_full'` → exactly one row in `eisa` table for the programme.
- `qualification_type = 'short_course'` → both `us_category` and `module_kind` null.

---

## 8. Recommended UI templates (ProgramDetailPage)

Drive rendering off `qualification_type`:

| `qualification_type`                | Template                                                   |
|-------------------------------------|------------------------------------------------------------|
| `unit_standard`                     | Group by Fundamental / Core / Elective. Show soft K/P chip if `emphasis` is set. |
| `occupational_full`                 | Group by Knowledge / Practical / Work Experience. Add EISA card at the end. |
| `skills_programme_occupational`     | Same as above, **without** EISA card. Show "Articulates to: <parent OC>" if present. |
| `short_course`                      | Flat ordered list of lessons. No grouping.                  |

The current `ProgramDetailPage.tsx` already special-cases SAQA 78965 and
SP-230375. The next refactor is to replace those `if (programId === ...)`
branches with a switch on `program.qualification_type`.

---

## 9. Where each programme in our current catalog fits

| Catalog ID            | Title                                              | Shape | Notes |
|-----------------------|----------------------------------------------------|:-----:|-------|
| `saqa-78965`          | FETC: IT Systems Development                       |  1    | Refactor away from "blocks" in curriculum; blocks → delivery plan. |
| `sp-230375-python`    | OC: Python Programmer (Skills Programme)           |  3    | KM modules supplied; PM/WM to follow. No EISA. |
| `saqa-telecom`        | FETC: Telecommunication Network Operations         |  1    | Scoping. |
| `oc-cloud-admin`      | OC: Cloud Administrator                            |  2    | Scoping — full OC, will need EISA. |
| `oc-ai-software-dev`  | OC: AI Software Developer                          |  2    | Scoping. |
| `oc-cyber-security`   | OC: Cyber Security Analyst                         |  2    | Scoping. |
| `oc-iot-dev`          | OC: Internet-of-Things Developer                   |  2    | Scoping. |
| `oc-frontend-designer`| OC: Front-End Web Designer                         |  2    | Scoping. |
| `oc-systems-dev`      | OC: Systems Developer                              |  2    | Scoping — likely the OC version of 78965. |

---

## 10. Open questions to resolve before schema migration

1. Do we ever need to represent a **single learner enrolled in multiple
   programmes simultaneously** (e.g. 78965 + Python SP)? — currently yes,
   our auto-enrol logic implies multi-enrol is the default.
2. For SP-230375, do we link it to its **parent OC** in the DB now, or
   leave that nullable until the SDP confirms the parent code?
3. For the `delivery_plan` table — should "blocks" be modelled as
   **cohort-scoped** (different cohorts can have different block schedules
   for the same curriculum) or **programme-scoped** (one block plan per
   programme)? Recommend cohort-scoped.
4. For the EISA entity — do we store it as one row per programme (template)
   plus one row per learner attempt, or only attempts? Recommend both.

---

## 11. Next steps

1. Review this doc with the academic team and confirm the four shapes are exhaustive.
2. Add `qualification_type` to `DsaProgram` interface in `src/data/dsaProgramCatalog.ts` (no DB migration yet).
3. Refactor `ProgramDetailPage.tsx` to switch on `qualification_type`.
4. Draft the `dsa` schema migration (`programs`, `modules`, `eisa`,
   `delivery_plans`, `cohorts`) in line with sections 6–7 above.
5. Backfill existing two programmes (78965, SP-230375) into the new shape
   as the first real test.
