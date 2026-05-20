# SAQA 78965 Content Relation Workaround

This folder can be used immediately without waiting for PDF conversion.

## What is now in place

- `program.json` - qualification metadata + core/elective module IDs.
- `module.template.json` - per-module JSON shape and naming targets.
- `modules.catalog.json` - discovered module folders and document sets from your current files.

## Workaround strategy (DOCX-first)

1. Keep existing `.docx` files as source-of-truth.
2. Use `sourcePath` fields for portal links now.
3. Add `targetName` fields to standardize future PDF exports.
4. When a PDF is produced, keep the same module JSON and only update the `sourcePath` to the PDF.

## Relation model

- Program (SAQA 78965) -> many modules (`ITSD-14910`, `ITSD-14915`, ...).
- Module -> many content artifacts (`facilitatorGuide`, `learnerWorkbook`, `memo`, `summativeAssessment`, `lessonPlan`).
- Module `ITSD-14933` is marked as `reference_pending` and linked to `ITSD-14930` until dedicated files are added.

## Naming normalization (publish names)

- Facilitator Guide: `FG_[US-ID]_FacilitatorGuide_CET.pdf`
- Learner Workbook: `LW_[US-ID]_LearnerWorkbook_CET.pdf`
- Workbook Memo: `LW_[US-ID]_Memo_CET.pdf`
- Summative Assessment: `SA_[US-ID]_SummativeAssessment_CET.pdf`
- Assessment Memo: `SA_[US-ID]_Memo_CET.pdf`
- Lesson Plan DOCX: `LP_[US-ID]_[ShortTitle]_CET.docx`
- Lesson Plan PDF: `LP_[US-ID]_[ShortTitle]_CET.pdf`
- Module JSON: `ITSD-[US-ID].json`

## Notes

- Some source files contain spelling variations (e.g., `Assessement`, `Assesement`, `Workbooka`). Keep them unchanged in source folders for traceability, and normalize only target names.
- `03_POE_Templates` is currently empty and can be populated later without changing this relation model.
