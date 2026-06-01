# Courses_Actual Directory

This directory contains the full, accredited qualification programmes available on the platform. Each course is stored as a self-contained folder with all modules, metadata, and supporting documentation.

## Structure

- One subfolder per full qualification (e.g., Systems_Development, Cloud_Computing, End_User_Computing)
- Each course folder should include:
  - `README.md` (course overview, SAQA ID, NQF Level, credits, provider, module list)
  - Module/unit standard files (e.g., Module_14924.md)
  - Assessment guides, PoE templates, and supporting docs

## Example

```
Courses_Actual/
  Systems_Development/
    README.md
    Module_14924.md
    ...
  Cloud_Computing/
    README.md
    ...
```

## Adding a New Course

1. Create a new subfolder for the course.
2. Add a `README.md` with course metadata and module list.
3. Add all module/unit standard files and supporting documentation.

## Notes on Courses vs Interventions

- Courses are canonical, standalone accredited programmes. Store them under `Courses_Actual/` and include metadata in the course `README.md`.
- Interventions are delivery variants (short programmes, bundled courses, train-the-trainer tracks). Keep intervention content in `public/docs/Interventions/` and reference course modules as needed.
- For a quick mission brief, see `public/docs/Objectives.md`.
