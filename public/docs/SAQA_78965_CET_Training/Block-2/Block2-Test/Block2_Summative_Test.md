# DATA SCIENCE ACADEMY

FETC: Information Technology - Systems Development

SAQA ID: 78965 - NQF Level 4

| BLOCK 2 SUMMATIVE ASSESSMENT - Applied Programming and Systems Design |
| --- |

| Candidate Name: |  |
| --- | --- |
| Student Number: |  |
| Campus: |  |
| Date: |  |
| Assessor: | Kabelo Matlakala |
| Qualification: | FETC: IT Systems Development - NQF L4 |

| TIME ALLOWED: 3 Hours   TOTAL MARKS: 100   PASS MARK: 60 marks (60%)   INSTRUCTIONS:   1. Answer ALL questions in ALL sections.   2. Where pseudocode or script is requested, write clearly and logically.   3. Support short answers with practical examples where possible.   4. For Section C (US 14930), answer using internet software principles even if coverage was integrated in other sessions.   5. No calculators, notes, or electronic assistance is permitted unless instructed by assessor.   6. Manage your time and attempt all items. |
| --- |

| Section | Module | Total | Mark Awarded |
| --- | --- | --- | --- |
| 1 | 14910 - Apply Principles of Computer Programming | 40 |  |
| 2 | 14933 - Create Web Applications with Scripting | 40 |  |
| 3 | 14930 - Principles of Developing Software for the Internet | 20 |  |
|  | TOTAL | 100 |  |

| Section 1 - Module 14910 | [40 marks] |
| --- | --- |

### Section 1A: Core Concepts [10 marks]

1. Define a variable and give one practical example from a learner system. (2)
2. Explain the difference between if/else and switch structures. (3)
3. State two benefits of using functions in code. (2)
4. Explain why input validation is important in registration forms. (3)

### Section 1B: Trace and Fix [10 marks]

Given this pseudocode, identify and correct two logic errors.

```text
START
SET total = 0
FOR i = 1 TO 5
  INPUT mark
  IF mark > 100 THEN
    total = total + mark
  ENDIF
NEXT i
PRINT "Average:", total / 4
END
```

### Section 1C: Practical Programming Task [20 marks]

Write pseudocode for a mini marks processor that:
1. Accepts five learner marks,
2. Rejects marks outside 0-100,
3. Calculates total and average,
4. Displays PASS/FAIL per learner using pass mark 50,
5. Outputs a final summary line.

| Section 2 - Module 14933 | [40 marks] |
| --- | --- |

### Section 2A: Planning and Design [10 marks]

1. Distinguish between a wireframe and a storyboard. (4)
2. Give two reasons why page-flow planning is done before coding. (4)
3. State one accessibility practice for web forms. (2)

### Section 2B: Script Understanding [10 marks]

Review the snippet and answer the questions.

```html
<form id="contactForm">
  <input id="name" />
  <button type="submit">Send</button>
</form>
<script>
document.getElementById('contactForm').addEventListener('submit', function(e) {
  if (document.getElementById('name').value === '') {
    alert('Name required');
  }
});
</script>
```

1. What is the role of e in this function? (2)
2. What problem can occur when this form is submitted? (4)
3. Write one corrected line that prevents invalid submission. (4)

### Section 2C: Applied Build Task [20 marks]

Design and script a two-page learner support web app concept. Include:
1. Page list and navigation flow,
2. One form with validation rules,
3. One feedback or confirmation mechanism,
4. Notes explaining how your scripting decisions improve user experience.

| Section 3 - Module 14930 | [20 marks] |
| --- | --- |

### Section 3A: Internet Foundations [8 marks]

1. Explain the difference between client-side and server-side processing. (4)
2. Why are HTTP status codes useful in troubleshooting web systems? (4)

### Section 3B: Security and Quality [6 marks]

1. Give two safe practices for handling user input on internet-facing systems. (4)
2. Why should sensitive credentials never be exposed in front-end code? (2)

### Section 3C: Deployment Awareness [6 marks]

1. State two checks to perform before publishing a site to production. (4)
2. Give one reason version control is essential in internet software projects. (2)

---

Prepared by Data Science Academy - Facilitator: Kabelo Matlakala - Block 2 Assessment
