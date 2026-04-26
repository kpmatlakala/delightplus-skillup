# Public Assets — Demo Content Convention

Static, learner-facing material is served directly from `public/`. Anything dropped
in here is reachable at the same path on the deployed site (e.g.
`public/courses/saqa-78965/workbooks/foo.pdf` → `/courses/saqa-78965/workbooks/foo.pdf`).

## Folder layout

```
public/
├── docs/         # Markdown / source documents (current SAQA 78965 pack lives here)
├── courses/      # Per-course publish-ready material (workbooks, assessments, slides)
│   ├── _template/        # Copy this when adding a new course
│   └── saqa-78965/       # FET Cert: IT Systems Development (live demo course)
├── catalog/      # Course catalog assets (cover images, brochures)
│   └── covers/
├── resources/    # Cross-course downloads (templates, policies, guides)
│   ├── templates/
│   ├── policies/
│   └── guides/
├── media/        # Shared video/audio assets used across modules
│   ├── video/
│   └── audio/
├── logos/        # Brand assets
└── poe-template.html
```

## Conventions

- **Course slugs** use the SAQA ID where applicable (`saqa-78965`), otherwise
  kebab-case (`data-literacy-foundations`).
- **File naming** follows the publish convention from
  `docs/SAQA_78965_CET_Training/RELATION_WORKAROUND.md`:
  `FG_<US>_…`, `LW_<US>_…`, `SA_<US>_…`, `LP_<US>_…`.
- Each subfolder has its own `README.md` describing what belongs there.
- Source `.docx` / `.md` stays under `docs/`. The `courses/` tree holds the
  published `.pdf` (or other learner-ready) versions only.
