# BLOCK 2 SUMMATIVE ASSESSMENT — MEMORANDUM

**DATA SCIENCE ACADEMY**
FETC: Information Technology — Systems Development
**SAQA ID:** 78965 · **NQF Level:** 4

> Use this memorandum with `Block2_Summative_Test.md`.
>
> **General marking guidance:**
> - Accept equivalent wording where the meaning is correct.
> - For **select / choose one** items, mark only the required option.
> - Do **not** award marks for distractor options.
> - For pseudocode tasks, assess logic and structure — exact syntax is not required.
> - Answers in bold below are the correct responses.

---

## Section 1 · Module 14910 — Apply Principles of Computer Programming `[40 marks]`

### Section A — Multiple Choice `[20 marks — 2 marks each]`

| Q | Correct Answer | Mark |
|---|---|---|
| 1 | **C — integer** | 2 |
| 2 | **B — Pass** | 2 |
| 3 | **B — FOR loop** | 2 |
| 4 | **C — Logic error** | 2 |
| 5 | **C — AND** | 2 |
| 6 | **B — 11** | 2 |
| 7 | **B — It is a comment** | 2 |
| 8 | **A — Binary** | 2 |
| 9 | **B — They help avoid code duplication** | 2 |
| 10 | **C — It causes a runtime error** | 2 |

> **Q6 working:** Operator precedence — multiplication before addition: `3 * 2 = 6`, then `5 + 6 = 11`.

---

### Section B — Short-Answer Questions `[20 marks]`

#### B1 — Pseudocode Line Builder `[10 marks — 2 marks per line]`

The pseudocode must loop from 1 to 5, add each number to a running total, and display the result.

| Line | Correct Answer |
|---|---|
| Line 1 | **SET total = 0** |
| Line 2 | **FOR i = 1 TO 5** |
| Line 3 | **SET total = total + i** *(accept `total = total + i`)* |
| Line 4 | **END FOR** |
| Line 5 | **OUTPUT i** *(accept `PRINT total`)* |

> **Marking:** 2 marks per correct line. Accept logically equivalent alternatives. The key requirement is: initialise total, loop 1–5, accumulate, end loop, output.

**Model pseudocode:**
```
SET total = 0
FOR i = 1 TO 5
  SET total = total + i
END FOR
OUTPUT total
```

---

#### B2 — Error Detection `[4 marks]`

Given pseudocode:
```
IF average > 50 THEN
  PRINT "PASS"
ELSE
  PRINT "FAIL"
END IF
```

**a)** What is wrong with the logic? *(2 marks)*

> **Correct answer:** The condition uses `>` instead of `≥`, so a student with exactly 50 will incorrectly get FAIL.

**b)** Rewrite the correct condition. *(2 marks)*

> **Correct answer:** `IF average ≥ 50 THEN`

---

#### B3 — Desk-Checking `[4 marks]`

**1)** What is desk-checking? *(2 marks)*

> **Correct answer:** **a) Manually tracing program logic using sample data without running the code.**

**2)** How would it help? Choose ONE error it could detect. *(2 marks)*

> **Correct answer:** **a) Incorrect loop counter causing wrong number of iterations.**

---

#### B4 — Code Tracing and Debugging `[4 marks]`

Given code:
```python
total = 0
for i in range(2):   # repeats 2 times
    total = total + 10
print(total)
```

**1)** What value will be printed? *(2 marks)*

> **Correct answer:** **20**
> *(range(2) iterates i = 0 and i = 1 — two iterations. total = 0 + 10 + 10 = 20)*

**2a)** What is the mistake in the code? *(1 mark)*

> **Correct answer:** **c) The loop runs 2 times instead of 5.**

**2b)** Rewrite the incorrect line to fix the program. *(1 mark)*

> **Correct answer:** `for i in range(5):`

---

## Section 2 · Module 14933 — Create Web Applications Using Scripting `[40 marks]`

### Section A — Multiple Choice `[20 marks — 2 marks each]`

| Q | Correct Answer | Mark |
|---|---|---|
| 1 | **C — `<body>`** | 2 |
| 2 | **B — `p { color: red; }`** | 2 |
| 3 | **D — Both B and C are correct** | 2 |
| 4 | **C — `const`** | 2 |
| 5 | **B — The form is submitted or handled by a submit event** | 2 |
| 6 | **B — color** | 2 |
| 7 | **B — Websites combining media types with interaction** | 2 |
| 8 | **B — `<a>`** | 2 |
| 9 | **B — Cascading Style Sheets** | 2 |
| 10 | **C — Use optimised images and thumbnails for large content** | 2 |

---

### Section B — Short-Answer Questions `[20 marks]`

#### B1 — Form Submission Behaviour `[6 marks — 2 marks each]`

**a)** Why does the page refresh when the form is submitted? *(2 marks)*

> **Correct answer:** The browser reloads the page automatically when a form is submitted.

**b)** How can `preventDefault()` fix this? *(2 marks)*

> **Correct answer:** Stop the page from refreshing when the form is submitted.

**c)** Where should this fix be applied? *(2 marks)*

> **Correct answer:** In the JavaScript that runs when the form is submitted.

---

#### B2 — Two-Page Web App Design `[6 marks — 2 marks each]`

**a)** Page 1 — purpose and main features *(2 marks)*

> **Correct answer:** Home / Login page — form with username and password fields, submit button, link to register.

**b)** Page 2 — purpose and main features *(2 marks)*

> **Correct answer:** Support request page — form with name, email, message fields, submit button, and confirmation message.

**c)** Navigation flow between the pages *(2 marks)*

> **Correct answer:** User clicks "Get support" link on page 1 → navigates to page 2; page 2 has a "Back to home" link.

---

#### B3 — Form Validation `[4 marks — 1 mark each]`

| Field | Correct Validation Rule |
|---|---|
| Name | **1 — Must not be empty and contain letters only** |
| Email | **5 — Must contain @ symbol and a valid domain** |
| Contact Number | **2 — Must be digits only and exactly 10 characters** |
| Message | **3 — Must be at least 10 characters long** |

> **Marking:** 1 mark per correct rule. Accept rule 6 (Can accept any value) for Message only if the learner provides a valid justification.

---

#### B4 — Client-Side Scripting UX `[4 marks — 2 marks each]`

**Way 1** *(2 marks)*

> **Correct answer:** Instant validation feedback without a page reload.
> *(Also accept: Disabling the submit button until all fields are valid.)*

**Way 2** *(2 marks)*

> **Correct answer:** Auto-formatting input fields (e.g. phone numbers).

---

#### B5 — Flowchart Diagram `[6 marks]`

**a)** What type of diagram is shown? *(1 mark)*

> **Correct answer:** **2 — Flowchart**

**b)** Complete labels A–E *(5 marks — 1 mark each)*

| Label | Correct Answer |
|---|---|
| Label A | **Waiter takes the order** |
| Label B | **No** *(the "No" branch from the "Complete?" decision diamond)* |
| Label C | **Order** *(the data/document representing the order)* |
| Label D | **Kitchen prepares the meal** |
| Label E | **Meal served to customer** |

> **Marking:** 1 mark per correct label. The flowchart flow is: Start → Customer arrives and is seated → **A (Waiter takes the order)** → **B (Complete? — No loops back)** → Yes → **D (Kitchen prepares the meal)** → **E (Meal served to customer)** → Customer pays & leaves. **C (Order)** is the data object passed between steps.

---

## Section 3 · Module 14930 — Developing Software for Internet Technologies `[20 marks]`

### Section A — Multiple Choice `[20 marks — 2 marks each]`

| Q | Correct Answer | Mark |
|---|---|---|
| 1 | **C — Client** | 2 |
| 2 | **B — The protocol used to transfer data securely** | 2 |
| 3 | **D — SMTP** | 2 |
| 4 | **B — It translates human-readable domain names into IP addresses** | 2 |
| 5 | **B — A page whose content is fixed in the HTML file and looks the same for every visitor** | 2 |
| 6 | **C — SFTP** | 2 |
| 7 | **B — To store and serve web content to clients** | 2 |
| 8 | **D — 600 Page Reload** | 2 |
| 9 | **B — Uniform Resource Locator** | 2 |
| 10 | **B — Router** | 2 |

---

### Section B — Short-Answer Questions `[9 marks]`

#### B1 — Static vs Dynamic Classification `[5 marks]`

> **Reason pool reference:**
> - a) Content is fixed in the HTML file and never changes
> - b) Content changes per user based on database queries
> - c) JavaScript modifies the DOM in response to user actions
> - d) The page is styled with CSS
> - e) The server sends the same HTML to every visitor

| Scenario | Expected Type | Correct Reason |
|---|---|---|
| About Us page with fixed content | **Static** | **a** or **e** |
| Learner portal showing each user's own marks | **Dynamic** | **b** |
| A page where JavaScript changes text after button click | **Dynamic** | **c** |

> **Marking:**
> - 1 mark per correct type classification (3 marks)
> - 1 mark per valid reason for any TWO scenarios (2 marks)
> - **Total = 5 marks**
>
> **Note on scenario 3:** The JavaScript DOM manipulation makes this Dynamic (client-side). Accept Static only if the learner provides a compelling argument that no server request is made — but the preferred answer is Dynamic.

---

## Total Marks Summary

| Section | Module | Total |
|---|---|---|
| Section 1 | 14910 — Apply Principles of Computer Programming | 40 |
| Section 2 | 14933 — Create Web Applications Using Scripting | 40 |
| Section 3 | 14930 — Developing Software for Internet Technologies | 20 |
| | **OVERALL TOTAL** | **100** |

---

*This memorandum is aligned to SAQA ID 78965 — FETC: IT Systems Development, NQF Level 4.*

*Prepared by Data Science Academy · Facilitator: Kabelo Matlakala · Block 2 Assessment*
