# Courses

Publish-ready learner material, one folder per course.

## Adding a new course

1. Copy `_template/` to `<course-slug>/` (use the SAQA ID if there is one).
2. Fill in `course.json` with the qualification metadata.
3. Drop files into the appropriate subfolder — each has a README explaining
   what belongs there and the naming convention.
4. Add a cover image to `/catalog/covers/<course-slug>.jpg`.
5. Register the course in `src/data/dsaProgramCatalog.ts`.

## Live courses

| Slug | Title | Status |
|---|---|---|
| `saqa-78965` | FETC: IT Systems Development (NQF 4) | Active demo |
