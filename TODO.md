# CET Testing Chat 12 - UX UPDATE PENDING

**Current:**
```
Header: Always shows both docs (not conditional)
Quiz pass → "Next: Summative Assessment" → Routes to AssessmentsPage (no module-specific)
Mobile: Sidebar hidden → docs only in header

**Requested Changes:**
1. **Header doc count conditional:**
   - Pre-quiz: "1 Document [Download Guide]"
   - Post-quiz: "2 Documents [Download Guide] [Download Assessment]"
   
2. **Quiz CTA update (no assessment platform flow):**
   - Replace "Next: Summative Assessment" → "Download Assessment" 
   - OR: [← Back to Lessons] [Download Assessment] buttons

**Next Step:** Update ModuleDetailPage.tsx header rendering + quiz footer CTAs

