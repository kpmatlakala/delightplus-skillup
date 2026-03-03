# Lecture 9: User Interface Design
## Systems Analysis and Design

> **Reference document** — content from this file relates primarily to **ITSD-14910** and **ITSD-14933** (UI/UX and software development). Use selectively for ITSD-14924's design phase content.

---

## Phase Description

Systems Design is the third of five SDLC phases. The deliverable is a **system design specification** that covers:
- **User interface design**
- **Data design**
- **System architecture**

---

## What is a User Interface?

A **User Interface (UI)** consists of all hardware, software, screens, menus, functions, outputs, and features that affect two-way communication between the user and the computer.

### Types of User Interfaces

| Type | Description |
|---|---|
| Natural-language interfaces | Accept commands in plain English or other human languages |
| Question-and-answer | System asks questions; user provides answers |
| Menus | Users select from predefined lists of options |
| Form-fill interfaces | Users complete on-screen forms |
| Command-language interfaces | Users type specific commands (e.g. terminal/CLI) |
| Graphical User Interface (GUI) | Visual elements — windows, icons, buttons, menus |
| Web interfaces | Browser-based; accessible from any device |

---

## User-Centred Design Principles

**Human-Computer Interaction (HCI)** describes the relationship between people and the computers they use to perform their jobs. The main objective is a user-friendly design that is easy to learn and use.

### Eight Principles of User-Centred Design

1. **Understand the Business** — know the tasks users perform and why
2. **Maximise Graphical Effectiveness** — use visuals to enhance understanding, not decoration
3. **Think Like a User** — design from the user's perspective
4. **Use Models and Prototypes** — test designs before full implementation
5. **Focus on Usability** — make every function accessible and efficient
6. **Invite Feedback** — involve users in testing and review
7. **Document Everything** — maintain clear records of design decisions

---

## Designing the User Interface: Eight Guidelines

1. **Design a transparent interface** — facilitate task objectives without calling attention to the interface itself; write commands and responses that are consistent and predictable
2. **Create an interface that is easy to learn and use** — clearly label all controls, buttons, and icons; provide concise on-screen instructions
3. **Enhance user productivity** — organise tasks in groups that match business operations; provide shortcuts for experienced users; use default values
4. **Make it easy to obtain help or correct errors** — always-available Help, user-selected and context-sensitive Help
5. **Minimise input data problems** — use input masks, event-driven reminders, predefined value lists, data integrity rules
6. **Provide feedback** — display messages at logical places; alert users to long processes; confirm success or failure
7. **Create an attractive layout** — use colour to highlight areas; use hyperlinks; group related objects
8. **Use familiar terms and images** — red = stop, green = go; Windows look-and-feel for Windows users; keyboard shortcuts for every command

---

## Output Design

Before designing output, answer:
- What is the purpose? Who needs it, and how will it be used?
- What information will be included?
- Printed, on-screen, or both? What device?
- When provided, how often updated?
- Are there security or confidentiality concerns?

### Types of Reports

| Type | Description |
|---|---|
| **Detail report** | Shows all records; high-volume; used for audit or reference |
| **Exception report** | Shows only records that fall outside normal parameters |
| **Summary report** | Aggregated data; totals, averages, and high-level metrics |

### Output Technology

- Internet delivery, webcasts, email, blogs, instant messaging
- Wireless devices, podcasts, digital media
- Specialised output: POS terminals, ATMs, special-purpose printers

---

## Input Design

> "The quality of the output is only as good as the quality of the input." (GIGO — Garbage In, Garbage Out)

The objective of input design is to ensure **quality, accuracy, and timeliness** of input data.

### Data Entry Screen Guidelines (15 Rules)

1. Restrict user access to data-entry areas only
2. Provide a descriptive caption for every field
3. Display a sample format for structured fields (dates, phone numbers)
4. Require an ending keystroke for every field
5. Do not require leading zeroes for numeric fields
6. Do not require trailing zeroes for decimal numbers
7. Display default values; user presses Enter to accept
8. Use defaults for values constant across multiple records
9. Display acceptable values; provide meaningful error messages
10. Allow exiting without committing the current record
11. Confirm accuracy before submitting
12. Allow users to move freely between fields
13. Match screen layout to source document layout
14. Allow add, change, delete, and view operations
15. Provide a search function

### Input Masks

Templates or patterns that **restrict data entry**, preventing format errors (e.g. `(###) ###-####` for phone numbers).

### Validation Rules (8 Types)

1. **Sequence check** — data entered in expected order
2. **Existence check** — required fields not left blank
3. **Data type check** — numbers in number fields, text in text fields
4. **Range/Limit check** — values within acceptable bounds
5. **Reasonableness check** — values are plausible (e.g. salary not $1 billion)
6. **Validity check** — referential integrity: foreign key must match existing record
7. **Combination check** — multiple fields valid in combination
8. **Batch controls** — hash totals verify batch completeness

### Input Volume Reduction

- Input only necessary data
- Do not input data that can be retrieved or calculated from existing data
- Do not input constant data — use defaults
- Use codes instead of full descriptions where possible

---

## Security and Control Issues

### Output Security

- IT department responsible for output control
- Diskless workstations, port protectors limit data export risks

### Input Security and Control

- **Audit trail** — every piece of information traceable back to original input
- **Data security** — restrict who can enter or modify data
- **Records retention policy** — define how long input records are kept
- **Encryption** — protect sensitive data in transit and at rest

---

*End of Lecture 9 reference document.*
