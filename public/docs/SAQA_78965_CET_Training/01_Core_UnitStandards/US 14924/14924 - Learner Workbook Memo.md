# 📘 LEARNER WORKBOOK: SAQA 14924
## Demonstrate an Understanding of Information Systems Analysis

> **Qualification:** FETC: Information Technology: Systems Development  
> **SAQA ID:** 78965 | **NQF Level:** 4  
> **Unit Standard:** 14924 | **Credits:** 3  
> **Total Marks:** 41 | **Pass Mark:** 80% (33 marks)

---

## 📋 Learner Information Template

| Field | Entry |
|-------|-------|
| **Name & Surname** | _________________________ |
| **Organisation** | _________________________ |
| **Unit/Dept** | _________________________ |
| **Facilitator Name** | _________________________ |
| **Date Started** | ___/___/2026 |
| **Date Completed** | ___/___/2026 |

---

## 🔹 ACTIVITY 1: Distinguish between Systems Analysis and Requirements Analysis  
**[5 marks]**

| Aspect | **Systems Analysis** | **Requirements Analysis** |
|--------|---------------------|---------------------------|
| **Definition** | Comprehensive study of an existing or proposed system to understand components, processes, interactions, and business context | Detailed phase within systems analysis focused on eliciting, documenting, validating, and managing specific functional and non-functional requirements |
| **Scope** | Broad: Examines entire system context including business processes, data flows, user needs, technical constraints, organisational goals | Narrow: Focuses specifically on what the system must do (functional) and how well it must perform (non-functional) |
| **Primary Focus** | Understanding the "what" and "why" of the current system; defining scope and feasibility | Defining specific, measurable, testable requirements that the system must satisfy |
| **Key Activities** | Feasibility studies, process mapping, stakeholder identification, high-level modelling, gap analysis | Interviews, workshops, use case development, requirement prioritisation, acceptance criteria definition |
| **Typical Outputs** | System specifications, feasibility reports, high-level design documents, business case | Requirements specification document, user stories, use cases, acceptance test criteria, traceability matrix |

> ✅ **Key Distinction:** Systems Analysis is the overarching investigative process; Requirements Analysis is the detailed refinement of user and system needs within that process.

---

## 🔹 ACTIVITY 2: Describe the functions of the information systems analyst  
**[9 marks]**

1. **Requirements Elicitation & Documentation** *(2 marks)*
   - Conduct interviews, workshops, and observations with stakeholders to gather business and technical requirements
   - Document requirements in clear, unambiguous formats (use cases, user stories, functional specifications)

2. **Systems Modelling & Design Support** *(2 marks)*
   - Create models such as Data Flow Diagrams (DFDs), Entity-Relationship Diagrams (ERDs), and process maps
   - Assist technical teams in translating business requirements into technical specifications

3. **Feasibility Analysis** *(1 mark)*
   - Evaluate technical, operational, economic, and schedule feasibility of proposed solutions
   - Recommend viable options based on cost-benefit analysis and risk assessment

4. **Stakeholder Communication & Liaison** *(1 mark)*
   - Act as bridge between business users and technical development teams
   - Facilitate clear communication to ensure alignment on system objectives and deliverables

5. **Testing & Validation Support** *(1 mark)*
   - Develop test plans and acceptance criteria based on documented requirements
   - Participate in User Acceptance Testing (UAT) to verify system meets business needs

6. **Change Management & Continuous Improvement** *(1 mark)*
   - Support implementation through training, documentation, and change management activities
   - Gather post-implementation feedback to identify areas for system enhancement

7. **Compliance & Standards Adherence** *(1 mark)*
   - Ensure system designs comply with organisational policies, industry standards, and legislative requirements (e.g., POPIA)

---

## 🔹 ACTIVITY 3: Outline information gathering techniques used by information systems analysts  
**[12 marks]**

| Technique | Description | Advantages | Disadvantages | Best Used When |
|-----------|-------------|------------|---------------|----------------|
| **1. Interviews** | Structured/semi-structured conversations with stakeholders | Allows probing for depth; builds rapport; flexible | Time-consuming; subject to interviewer bias; scheduling challenges | Gathering detailed insights from key stakeholders; exploring complex issues |
| **2. Questionnaires/Surveys** | Standardised forms distributed to large groups | Efficient for large samples; anonymous responses; quantitative data | Low response rates; limited depth; cannot probe follow-ups | Collecting data from many users; measuring satisfaction or preferences |
| **3. Observation (Job Shadowing)** | Directly watching users perform tasks in work environment | Captures real-world behaviour; identifies undocumented processes | Hawthorne effect (people change behaviour when observed); time-intensive | Understanding actual workflows; validating stated processes |
| **4. Document Analysis** | Reviewing existing documentation (policies, reports, manuals) | Provides historical context; non-intrusive; cost-effective | Documents may be outdated, incomplete, or inconsistent | Understanding legacy systems; gathering baseline information |
| **5. Workshops/Focus Groups** | Facilitated group sessions to brainstorm and build consensus | Encourages collaboration; generates diverse ideas; resolves conflicts quickly | Dominant personalities may influence outcomes; requires skilled facilitation | Resolving conflicting requirements; building stakeholder buy-in |
| **6. Prototyping** | Creating early, simplified versions of system to elicit feedback | Visual and interactive; clarifies ambiguous requirements; reduces rework | May create unrealistic expectations; additional development effort | Validating UI/UX requirements; exploring complex interactions |
| **7. Joint Application Development (JAD)** | Structured workshops with stakeholders, analysts, developers | Accelerates requirement gathering; improves stakeholder alignment | Requires significant preparation; high participant commitment | Time-critical projects; complex multi-stakeholder requirements |
| **8. Use Case Modelling** | Describing system interactions from user perspective through scenarios | User-focused; clarifies system boundaries; supports testing | May overlook non-functional requirements; requires training | Capturing functional requirements; defining system scope |
| **9. Brainstorming Sessions** | Open, creative group discussions to generate ideas | Encourages innovation; uncovers hidden needs; low barrier to entry | Ideas may be impractical; requires follow-up validation | Early discovery phase; generating solution options |
| **10. Benchmarking** | Comparing current systems/processes with industry best practices | Identifies improvement opportunities; provides external perspective | May not account for organisational context; data may be proprietary | Strategic planning; justifying system upgrades |
| **11. Business Process Modelling** | Mapping "as-is" and "to-be" processes using BPMN or similar | Visualises workflow; identifies inefficiencies; supports automation | Can become complex; requires modelling expertise | Process re-engineering; system integration projects |
| **12. Sampling & Statistical Analysis** | Collecting and analysing representative data samples | Data-driven insights; supports quantitative decision-making | Requires statistical knowledge; sampling errors possible | Validating requirements with empirical data; performance analysis |

---

## 🔹 ACTIVITY 4: Describe different systems analysis techniques used in the industry  
**[15 marks]**

### A. Techniques for Describing Data Structures *(4 marks)*

1. **Entity-Relationship Diagrams (ERDs)**
   - Visual representation of entities (objects), attributes, and relationships
   - Used in database design to model data requirements
   - Notation examples: Crow's foot, Chen notation
   - *Example: Modelling a student registration system with entities: Student, Course, Enrollment*

2. **Data Dictionaries**
   - Centralised repository describing data elements, meanings, formats, constraints
   - Ensures consistency and clarity across development teams
   - *Example: Defining "StudentID" as: alphanumeric, 8 characters, unique, mandatory*

3. **Class Diagrams (UML)**
   - Object-oriented modelling showing classes, attributes, methods, relationships
   - Useful for designing object-oriented systems and documenting architecture
   - *Example: Class "Student" with attributes (name, ID) and methods (enroll(), dropCourse())*

4. **Normalisation Techniques**
   - Process of organising data to reduce redundancy and improve integrity
   - Forms: 1NF, 2NF, 3NF, BCNF
   - *Example: Separating student contact details into a separate table to avoid duplication*

### B. Techniques for Documenting Business Process Flows *(4 marks)*

5. **Flowcharts**
   - Graphical representation of steps, decisions, and control flow
   - Simple, widely understood; useful for high-level documentation
   - *Symbols: Oval (start/end), Rectangle (process), Diamond (decision)*

6. **Business Process Model and Notation (BPMN)**
   - Standardised notation for modelling business processes with events, activities, gateways
   - Supports complex logic and is executable in BPM tools
   - *Elements: Events (circles), Activities (rounded rectangles), Gateways (diamonds)*

7. **Swimlane Diagrams**
   - Flowcharts divided into lanes representing roles, departments, or systems
   - Clarifies responsibilities and handoffs in multi-actor processes
   - *Example: Order processing with lanes for Customer, Sales, Warehouse, Finance*

8. **Use Case Diagrams (UML)**
   - Shows actors and their interactions with system through use cases
   - Focuses on functional requirements from user perspective
   - *Example: Actor "Lecturer" with use cases: "Mark Attendance", "Upload Grades"*

### C. Techniques for Documenting Data Flows *(4 marks)*

9. **Data Flow Diagrams (DFDs)**
   - Illustrates how data moves: processes, data stores, external entities, data flows
   - Levels: Context (Level 0), Level 1, Level 2 for increasing detail
   - *Example: Student registration DFD showing data flow between Student, System, Registrar*

10. **Structured English/Pseudocode**
    - Semi-formal language combining natural language with programming constructs
    - Bridges gap between business users and developers
    - *Example: IF student_age >= 18 THEN allow_enrollment ELSE require_guardian_consent*

11. **Decision Tables and Trees**
    - Tabular or tree-based representations of complex business rules and conditions
    - Ensures completeness and consistency in rule specification
    - *Example: Discount eligibility table based on student type, course load, payment method*

12. **Sequence Diagrams (UML)**
    - Shows interactions between objects over time in a specific scenario
    - Useful for understanding dynamic behaviour and message flow
    - *Example: Sequence of messages for "Submit Assignment": Student→System→Database→Confirmation*

### D. Analysis Tools to Assist with Documentation *(3 marks)*

13. **Computer-Aided Software Engineering (CASE) Tools**
    - Software applications (Lucidchart, Visual Paradigm, Enterprise Architect) supporting modelling, documentation, code generation
    - Enhances consistency, collaboration, traceability
    - *Benefit: Auto-generate documentation from models; version control integration*

14. **Requirements Management Tools**
    - Tools like Jira, ReqView, IBM DOORS for capturing, tracing, managing requirements
    - Supports change control, impact analysis, compliance reporting
    - *Benefit: Trace requirement from elicitation through testing to deployment*

15. **Prototyping & Wireframing Tools**
    - Tools like Figma, Balsamiq, Axure for creating interactive mock-ups
    - Reduces ambiguity; enables early validation with stakeholders
    - *Benefit: Stakeholders can "experience" requirements before development begins*

---

## 📊 MARKING GUIDE (For Assessor Use)

| Activity | Max Marks | Key Criteria for Full Marks |
|----------|-----------|---------------------------|
| **Activity 1** | 5 | Clear distinction between scope, focus, activities, outputs of both concepts; accurate definitions |
| **Activity 2** | 9 | 7+ distinct functions described with relevant detail; alignment to SAQA 14924 outcomes |
| **Activity 3** | 12 | 10+ techniques outlined with description, advantages, disadvantages, application context |
| **Activity 4** | 15 | 12+ techniques described across all 4 categories with examples and industry relevance |
| **TOTAL** | **41** | **Pass Mark: 33 (80%)** |

---

## ✍️ Learner Declaration

> I confirm that the answers provided in this workbook are my own work, completed in accordance with the instructions provided. I understand the assessment criteria and accept that my work may be moderated for quality assurance purposes.

| Signature | Date |
|-----------|------|
| **Learner:** _________________________ | ___/___/2026 |
| **Facilitator:** _________________________ | ___/___/2026 |

> ℹ️ *This workbook forms part of the Portfolio of Evidence (PoE) for Unit Standard 14924. Retain with formative assessment activities for submission.*

---
