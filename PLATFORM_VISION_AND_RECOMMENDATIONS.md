
# Platform Vision & Recommendations

## Vision

Transition from a CET-only intervention platform to a general, dynamic system supporting:
- Multiple full qualifications (e.g., Systems Development, Cloud Computing, End User Computing)
- Multiple interventions/skills programmes (custom module selections)
- Flexible course/intervention management and delivery

## Key Recommendations

### 1. Course Abstraction
- Refactor data models and UI to treat “course” as a dynamic entity, not hardcoded to CET.
- Store all courses in `public/Courses_Actual/`, each with its own folder, metadata, and modules.

### 2. Intervention Flexibility
- Allow interventions/skills programmes to reference any combination of modules from any course.
- Store interventions in `public/docs/Interventions/`, with clear mapping to source modules.

### 3. Dynamic Routing & Role Logic
- Update routing, menus, and permissions to support multiple programmes and interventions.
- Ensure admin/facilitator tools work for any course, not just CET.

### 4. Metadata & Indexing
- Add metadata files (e.g., README.md, course.json) in each course/intervention folder for:
  - Qualification name, SAQA ID, NQF Level, credits, description
  - List of modules/unit standards
- Build a dynamic course/intervention catalogue for selection and reporting.

### 5. Assessment & PoE
- Ensure assessment flows, PoE, and compliance features are generic and can be mapped to any course/intervention.

## Example Structure

```
public/Courses_Actual/
  Systems_Development/
    README.md
    Module_14924.md
    ...
  Cloud_Computing/
    README.md
    ...
public/docs/Interventions/
  CET_Systems_Dev_Skills_Programme.md
  Digital_Literacy_Short_Programme.md
  ...
```

## Migration Steps

1. Refactor code and data to remove CET-specific assumptions.
2. Add support for dynamic course/intervention loading and selection.
3. Update documentation and onboarding to reflect the new, general-purpose platform.

## Benefits

- Scalable to any qualification or intervention.
- Reusable for new clients, providers, or SETA/SAQA-aligned programmes.
- Easier to maintain, audit, and extend.
