# Block Assessment Diagrams

## Required Diagrams for Block 1 Summative Assessment

### 1. DFD Fragment (Section 1 B3 - US 14924)
**Spec:** Label 4 parts of DFD:
- External Entity  
- Process
- Data Flow
- Data Store

**File:** `block1-dfd-template.svg` or `.png`
**Interactive:** Dropdown labels or drag/drop
**Answers:** External Entity → Process → Data Flow → Data Store

### 2. Fishbone/Ishikawa (Section 4 - US 14927)
**Spec:** Complete for workplace problem (CET timetabling conflicts)
**Categories:** People, Process, Environment, Equipment
**File:** `fishbone-template.svg`
**Interactive:** Fill categories + sub-causes

### 3. Program Design Diagrams (Section 5 - US 14915)
**a. Decision Tree**
```
Pass/Fail Logic: attendance < 80% AND mark < 50%
```
**File:** `decision-tree-template.svg`

**b. Structure Diagram**
**Hierarchical modules:** Main → ValidateInput → Calculate → Output
**File:** `structure-diagram-template.svg`

**c. Flowchart**
**Simple algorithm** (mark validation)
**File:** `flowchart-template.svg`

## Implementation Notes
```
AssessmentForm support:
- Image component + overlay blanks
- Drag/drop or dropdown labels
- Submission: annotated image + JSON coords
- Admin grading: visual diff/overlay validator
```

**Next:** Create SVG templates → AssessmentForm diagram mode

