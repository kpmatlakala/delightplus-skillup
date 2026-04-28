# BLOCK 2 SUMMATIVE ASSESSMENT — MEMORANDUM

**DATA SCIENCE ACADEMY**
FETC: Information Technology — Systems Development
**SAQA ID:** 78965 · **NQF Level:** 4

> Use this memorandum with `Block2_Summative_Test.md`.
>
> **General marking guidance:**
> - Accept equivalent wording where the meaning is correct.
> - For **match / select** items, mark only the required number of responses.
> - Do **not** award marks for distractor options.
> - For pseudocode tasks, assess logic and structure — exact syntax is not required.

---

## Section 1 · Module 14910 — Apply Principles of Computer Programming `[40 marks]`

### Section A — Multiple Choice `[20 marks]`

| Question | Correct answer | Mark |
| --- | --- | --- |
| 1A1 | **C** — integer | 2 |
| 1A2 | **B** — Pass | 2 |
| 1A3 | **B** — FOR loop | 2 |
| 1A4 | **C** — Logic error | 2 |
| 1A5 | **C** — AND | 2 |
| 1A6 | **B** — 11 | 2 |
| 1A7 | **C** — Array/List | 2 |
| 1A8 | **A** — Binary | 2 |
| 1A9 | **B** — They help avoid code duplication | 2 |
| 1A10 | **C** — It causes a runtime error | 2 |

### Section B — Memorandum `[20 marks]`

#### 1B1 — Pseudocode Line Builder `[6 marks]`

**Correct sequence in order (6 marks):**

Candidates must select the correct line for each position. Sequencing is critical.

| Line | Correct answer |
| --- | --- |
| 1 | SET total = 0 |
| 2 | FOR count = 1 TO 5 |
| 3 | INPUT mark; WHILE mark < 0 OR mark > 100 DO INPUT mark; END WHILE |

**Marking:** 2 marks per correct line = **6 marks total**. Accept equivalent logic where input is validated to range 0..100 before accumulation and final average output is shown.

---

#### 1B2 — Error Detection `[6 marks]`

Given:

```text
IF average > 50 THEN
	PRINT "PASS"
ELSE
	PRINT "FAIL"
END IF
```

**Expected response:**
- (a) Error: condition excludes average = 50 (`>` used instead of `>=`) — 2 marks
- (b) Correct condition: `IF average >= 50 THEN` — 2 marks

---

#### 1B3 — Scenario-Based Desk-Checking `[4 marks]`

**Expected response:**
- (a) Select: "Manually tracing code logic with sample inputs before execution" — 2 marks
- (b) Select any valid combination of help explanation + error example — 2 marks

---

#### 1B4 — Code Tracing and Debugging `[4 marks]`

Given:

```text
SET total = 0
FOR i = 1 TO 5
	total = total + i
END FOR
PRINT average
```

**Expected response:**
- (a) Logic errors: Both the loop sums 1-5 instead of accepting marks AND average is printed before calculation — 2 marks
- (b) Corrected final lines: `SET average = total / 5; PRINT average` — 2 marks

---

---

## Section 2 · Module 14933 — Create Web Applications Using Scripting `[45 marks]`

### Section A — Multiple Choice `[20 marks]`

| Question | Correct answer | Mark |
| --- | --- | --- |
| 2A1 | **C** — `<body>` | 2 |
| 2A2 | **B** — `p { color: red; }` | 2 |
| 2A3 | **D** — Both B and C are correct | 2 |
| 2A4 | **C** — `const` | 2 |
| 2A5 | **B** — Form data is submitted to the server or handled by onsubmit | 2 |
| 2A6 | **B** — color | 2 |
| 2A7 | **B** — A website that uses multiple media types and allows user interaction | 2 |
| 2A8 | **B** — `<a>` | 2 |
| 2A9 | **B** — Cascading Style Sheets | 2 |
| 2A10 | **A** — push() | 2 |

### Section B — Memorandum `[20 marks]`

#### 2B1 `[4 marks]`

**Expected response:**
- (a) Select: "The default form submission behavior causes a page reload" — 1 mark
- (b) Select: "It stops the default form submission and page reload" — 1 mark
- (c) Select: "In the form's onsubmit event handler" — 2 marks

---

#### 2B2 `[6 marks]`

**Expected response:** Design and document two web application pages.

- Page 1: Select any logical learner support page design (e.g., "Dashboard showing enrolled courses and progress overview") — 2 marks
- Page 2: Select any complementary page design (e.g., "Support ticket status and chat with facilitator") — 2 marks
- Navigation: Select appropriate flow (e.g., "Page 1 has 'Get Support' button → Page 2; Page 2 has 'Back to Dashboard' button") — 2 marks

---

#### 2B3 `[6 marks]`

**Expected response:** Select one practical validation rule for each field:
- Name: "Required field - cannot be empty" OR "Minimum length of 2 characters" — 1.5 marks
- Email: "Must contain @ symbol" OR "Must have valid domain format" — 1.5 marks
- Contact number: "Must contain only digits" OR "Must be exactly 10 digits" — 1.5 marks
- Message: "Required field - cannot be empty" OR "Minimum length of 10 characters" — 1.5 marks

---

#### 2B4 `[4 marks]`

**Expected response:**
- Way 1: Select "Immediate validation feedback without page reload" — 2 marks
- Way 2: Select "Dynamic content updates without full page refresh" — 2 marks

---

#### 2B5 `[5 marks]`

**Expected response:**
- (a) Select: "Flowchart" — 1 mark
- (b) Select: "Customer Arrives" — 1 mark
- (c) Select: "Menu Given" — 1 mark
- (d) Select: "Order Taken" — 1 mark
- (e) Select: "Food Served" — 1 mark
- (f) Select: "Pay" — 1 mark

---

---

## Section 3 · Module 14930 — Developing Software for Internet Technologies `[20 marks]`

### Section A — Multiple Choice `[20 marks]`

| Question | Correct answer | Mark |
| --- | --- | --- |
| 3A1 | **C** — Client | 2 |
| 3A2 | **B** — The protocol used to transfer data securely | 2 |
| 3A3 | **D** — SMTP | 2 |
| 3A4 | **B** — Translates domain names into IP addresses | 2 |
| 3A5 | **B** — Content is fixed in the HTML file | 2 |
| 3A6 | **C** — SFTP | 2 |
| 3A7 | **B** — To store and serve web content to clients | 2 |
| 3A8 | **D** — 600 Page Reload | 2 |
| 3A9 | **B** — Uniform Resource Locator | 2 |
| 3A10 | **B** — Router | 2 |

### Section B — Memorandum `[10 marks]`

#### 3B1 `[5 marks]`

| Service | Correct protocol | Mark |
| --- | --- | --- |
| File transfer | FTP | 1 |
| Sending email | SMTP | 1 |
| Receiving email (download) | POP3 | 1 |
| Receiving and syncing email | IMAP | 1 |
| Secure website browsing | HTTPS | 1 |

**Marking:** 1 mark per correct match = **5 marks**

---

#### 3B3 — Static vs Dynamic `[5 marks]`

| Scenario | Expected type |
| --- | --- |
| About Us page with fixed content | Static |
| Learner portal showing each user's marks | Dynamic |
| Page where JavaScript changes text after button click | Static *(accept Dynamic with valid reasoning)* |

**Marking:**
- 1 mark per correct type (3 marks)
- 1 mark per valid reason for any TWO scenarios (2 marks)
- Total = **5 marks**

---

> **Note on scenario 3:** Accept **Dynamic** if the learner justifies interactivity driven by script. The intent is to distinguish client-side scripting (no new server request) from true server-side dynamic content — award marks for sound reasoning.

---

## Total Marks

| Section | Total |
| --- | ---: |
| Section 1 | 40 |
| Section 2 | 45 |
| Section 3 | 20 |
| **Overall Total** | **105** |
