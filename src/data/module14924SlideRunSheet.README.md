# Module 14924 Slide Run Sheet

This file explains where to get the full numbered slide list for the 14924 presentation flow.

## Source
- `src/data/module14924SlideRunSheet.ts`

## What it contains
- `module14924SlideRunSheet`: Full `Slide 1..N` array with:
  - slide number
  - title
  - subtitle
  - what learners see (subtitle/body/bullets/phase cards/highlight)
  - facilitator notes block (`Slide X of Y`, title, learner-view summary, and script)
- `module14924SlideRunSheetMarkdown`: Markdown-formatted version of the same run sheet.

## Why this helps
This gives a single place to personalize and review the exact presentation sequence without tracing builder logic across files.
