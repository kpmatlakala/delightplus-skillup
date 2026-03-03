# Lecture 3: Requirements Modelling
## Systems Analysis and Design

> **Reference document** — content from this file enriches the ITSD-14924 session-2 lesson flow (JAD, RAD, Agile methods, requirements modelling, fact-finding).

---

## Systems Analysis Phase Overview

The overall objective of the systems analysis phase is to understand the proposed project, ensure that it will support business requirements, and build a solid foundation for system development. Models and documentation tools are used to visualise and describe the proposed system.

### Systems Analysis Activities

| Activity | Description |
|---|---|
| Requirements Modelling | Define outputs, inputs, processes, performance, and security requirements |
| Data and Process Modelling | DFDs, data dictionaries, process specifications |
| Object Modelling | UML diagrams, class diagrams, use cases |
| Development Strategies | Select the appropriate approach (JAD, RAD, Agile, etc.) |
| System Requirements Document | Final output capturing all requirements |

### Systems Analysis Skills

- Analytical skills — breaking down complex problems
- Interpersonal skills — working with users and stakeholders
- Team-oriented techniques — JAD, RAD, Agile methods

---

## Joint Application Development (JAD)

JAD is a team-based approach that involves key users as active participants throughout the development process.

### Key Principles

- Users have a vital stake in an information system and must participate fully
- Successful systems must be user-oriented; users need to be involved
- JAD uses a structured team workshop facilitated by a trained analyst

### Advantages and Disadvantages

| Advantage | Disadvantage |
|---|---|
| Allows key users to participate effectively | More expensive and can be cumbersome if the group is too large |
| Results in more accurate statement of system requirements | Requires significant time commitment from busy stakeholders |
| Builds stronger commitment to the success of the new system | Not suitable for very small projects |
| Improves understanding of common goals | Requires skilled facilitation |

---

## Rapid Application Development (RAD)

RAD is a team-based technique that speeds up information systems development and produces a functioning information system quickly.

### How RAD Works

- Relies heavily on **prototyping** and user involvement
- Interactive process continues until the system is completely developed and users are satisfied
- RAD team must have strong IT resources, skills, and management support

### RAD Objectives

- Cut development time and expense by involving users in every phase
- Helps design systems requiring highly interactive or complex user interfaces
- Encourages iterative refinement rather than big-bang delivery

### RAD Advantages and Disadvantages

| Advantage | Disadvantage |
|---|---|
| Systems developed more quickly with cost savings | Emphasises mechanics, may miss strategic business needs |
| Continuous user involvement improves fit | May allow less time for quality, consistency, and design standards |
| Flexible and responsive to change | Requires highly skilled, committed team |

---

## Agile Methods

Agile methods attempt to develop a system incrementally, emphasising continuous feedback and user collaboration.

### The Four Agile Values

- **Communication** — talk to users and team constantly
- **Simplicity** — do the simplest thing that works
- **Feedback** — build, test, respond to results
- **Courage** — make hard decisions quickly

### The 12 Basic Principles of Agile Modeling

1. Satisfy the customer through early and continuous delivery of working software
2. Embrace change, even if introduced late in development
3. Deliver functioning software incrementally and frequently
4. Encourage customers and analysts to work together daily
5. Trust motivated individuals to get the job done
6. Promote face-to-face conversation
7. Concentrate on getting software to work
8. Encourage continuous, regular, and sustainable development
9. Adopt agility with attention to mindful design
10. Support self-organising teams
11. Review and adjust behaviour at regular intervals
12. Adopt simplicity — maximise the amount of work not done

### Four Basic Activities of Agile Modeling

- **Coding** — the most valuable output; code communicates ideas and drives learning
- **Testing** — automated testing validates coding, functionality, performance, and conformance
- **Listening** — active listening with partners and customers; developers assume they know nothing about the business
- **Designing** — evolutionary; good design is simple, flexible, and keeps logic near the data

### Scrum

> Scrum begins the project with a high-level plan that can be changed on the fly. The success of the **project** is most important; individual success is secondary. Teams work within a strict time frame (sprint). The project leader has some — but not much — influence on the detail; the self-organising team drives the work.

### Agile Advantages and Disadvantages

| Advantage | Disadvantage |
|---|---|
| Very flexible and efficient in dealing with change | Team members need high technical and interpersonal skills |
| Frequent deliverables constantly validate the project | May be subject to significant change in scope |
| Reduces risk through short feedback loops | Less suited for large, complex, fixed-requirement projects |

---

## Modelling Tools and Techniques

Modelling involves graphical methods and non-technical language to represent the system at various stages of development.

| Tool | Description |
|---|---|
| **Functional Decomposition Diagrams (FDD)** | Model business functions and show how they are organised into lower-level processes |
| **Business Process Model (BPM / BPMN)** | Diagrams using pools and swim lanes to represent business processes |
| **Data Flow Diagrams (DFD)** | Show how the system stores, processes, and transforms data across levels |
| **Unified Modeling Language (UML)** | Widely-used standard for visualising software design — use case diagrams, sequence diagrams, class diagrams |

---

## System Requirements Checklist

When documenting requirements, cover all five areas:

| Area | Example |
|---|---|
| **Outputs** | "The inventory system must produce a daily report showing part number, description, quantity on hand, unit cost, sorted by part number" |
| **Inputs** | "Manufacturing employees must swipe ID cards into online terminals that record labour costs and calculate production efficiency" |
| **Processes** | "The student records system must calculate the GPA at the end of each semester" |
| **Performance** | "The system must support 25 users online simultaneously; response time must not exceed 4 seconds" |
| **Controls** | "An employee record must be added, changed, or deleted only by a member of the HR department" |

---

## Fact-Finding

Fact-finding is the systematic process of collecting information about a system.

### Fact-Finding Plan

The analyst must first identify the information needed, then develop a plan. Key questions: **Who, What, Where, When, How, and Why?**

Distinguish between what *is* being done and what *could or should* be done.

### Fact-Finding Methods

- **Interviews** — direct discussion with users and stakeholders
- **Document Review** — examine existing reports, forms, and records
- **Observation** — watch users perform tasks in their actual environment
- **Questionnaires and Surveys** — gather structured input from many respondents
- **Research** — review industry standards, benchmarks, and similar systems

### Documentation Best Practices

- Record information as soon as you obtain it
- Use the simplest recording method available
- Record findings so they can be understood by someone else
- Organise documentation so that related material is located easily

---

*End of Lecture 3 reference document.*
