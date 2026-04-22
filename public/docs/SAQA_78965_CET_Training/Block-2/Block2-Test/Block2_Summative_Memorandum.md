# BLOCK 2 SUMMATIVE ASSESSMENT - MEMORANDUM

FETC: Information Technology - Systems Development

SAQA ID: 78965 - NQF Level 4

Unit Standards: US 14910, US 14933, US 14930

Total: 100 marks

---

## Section 1 - Module 14910 [40 marks]

### 1A. Core Concepts [10]

1. Variable definition + practical example. (2)
- Expected: named storage location in memory and relevant example such as learnerMark or learnerCount.

2. if/else vs switch. (3)
- if/else for ranges and complex boolean conditions.
- switch for one expression compared against fixed options.

3. Two function benefits. (2)
- Any two: reuse, readability, easier testing, modularity, easier maintenance.

4. Input validation importance. (3)
- Prevents invalid data, improves reliability, supports security, avoids faulty calculations.

### 1B. Trace and Fix [10]

Award for identifying and correcting two logic errors.

Expected error examples:
- Invalid condition (should reject values outside 0-100, not accept >100).
- Average division uses 4 instead of correct divisor.

Mark split:
- Correct error identification (2 x 2) = 4
- Corrected logic/pseudocode quality (2 x 3) = 6

### 1C. Practical Programming Task [20]

Rubric:
1. Captures 5 inputs with loop structure (4)
2. Validation range handling 0-100 (4)
3. Correct total and average logic (4)
4. PASS/FAIL logic with threshold 50 (4)
5. Final summary output clarity (4)

---

## Section 2 - Module 14933 [40 marks]

### 2A. Planning and Design [10]

1. Wireframe vs storyboard distinction. (4)
- Wireframe = layout and placement.
- Storyboard = sequence/journey of screens and actions.

2. Two reasons to plan flow before coding. (4)
- Any two: fewer reworks, clearer logic, improved stakeholder alignment, better test planning.

3. Accessibility practice. (2)
- Any one valid example: labels, keyboard access, contrast, alt text, clear error messages.

### 2B. Script Understanding [10]

1. Role of e. (2)
- Event object for the submit action.

2. Problem in script. (4)
- Missing preventDefault() allows form submit even when name is empty.

3. Corrected line. (4)
- e.preventDefault();
- Accept equivalent logic preventing submit until validation passes.

### 2C. Applied Build Task [20]

Rubric:
1. Clear two-page structure and navigation flow (5)
2. Validation rules are practical and relevant (5)
3. Feedback/confirmation mechanism implemented logically (5)
4. UX explanation linked to script behavior (5)

---

## Section 3 - Module 14930 [20 marks]

### 3A. Internet Foundations [8]

1. Client-side vs server-side. (4)
- Client-side executes in browser/device.
- Server-side executes on backend/server resources.

2. HTTP status codes usefulness. (4)
- Standardized diagnostics, troubleshooting speed, API/site monitoring clarity.

### 3B. Security and Quality [6]

1. Two safe input practices. (4)
- Any two: validation, sanitization, parameterized queries, output encoding.

2. Why not expose sensitive credentials in front-end code. (2)
- Public visibility creates compromise risk and unauthorized access risk.

### 3C. Deployment Awareness [6]

1. Two pre-production checks. (4)
- Any two: cross-browser checks, env var validation, security scan, performance check, rollback readiness.

2. One version-control benefit. (2)
- Any one: traceability, rollback, controlled collaboration, audit history.

---

## Moderation Guidance

- Accept equivalent technical wording where concepts are accurate.
- Award partial marks where method is mostly correct.
- Prioritize logic correctness and applied understanding over strict syntax.
- Section 3 (US 14930) is intentionally included in Block 2 evidence to maintain integrated internet competency coverage.
