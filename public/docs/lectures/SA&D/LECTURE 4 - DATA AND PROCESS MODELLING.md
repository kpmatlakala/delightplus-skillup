# Lecture 4: Data and Process Modelling
## Systems Analysis and Design

> **Reference document** — content from this file enriches the ITSD-14924 session-2 lesson flow. Do not add content from this lecture to any other unit standard without verifying scope.

---

## Overview of Data and Process Modelling Tools

Systems analysts use many graphical techniques to describe an information system. A **data flow diagram (DFD)** uses various symbols to show how the system transforms input data into useful information. A set of DFDs provides a **logical model** that shows what the system does, not how it does it.

DFDs graphically characterise data processes and flows in a business system, depicting:
- System inputs
- Processes
- Outputs
Kendall & Kendall Copyright © 2014 Pearson
Education, Inc. Publishing as Prentice Hall 7-5


### Advantages of the Data Flow Approach

- Freedom from committing to technical implementation too early
- Understanding of the interrelatedness of systems and subsystems
- Communicating current system knowledge to users
- Provides a basis for analysing the proposed system

---

## The Four Basic DFD Symbols

| Symbol | Shape | Represents |
|---|---|---|
| **External Entity** | Double square | Outside the system boundary |
| **Data Flow** | Arrow | Movement of data from one point to another |
| **Process** | Rectangle with rounded corners | Transforms input data into output |
| **Data Store** | Open-ended rectangle | Repository of stored data |


### External Entities

**External entities** represent another department, a business, a person, or a machine. They are a source or destination of data, **outside the boundaries of the system**. Named with a noun. Also called **terminators**:
- **Source** — data enters the system from this entity
- **Sink** — data exits the system to this entity
### Processes

A **process** denotes a change in or transformation of data. It represents work being performed in the system.

**Naming conventions:**
- Use the name of the whole system for a high-level process
- For major subsystems, attach the word "subsystem"
- Use the form **verb-adjective-noun** for detailed processes (e.g. *Validate Student Record*)

The process symbol receives input data and produces output with a different content or form. Processes contain the **business logic** (business rules) and are called a **"black box"** — what goes in and out is visible, but internal logic is hidden.
### Data Stores

A **data store** is a depository for data that allows examination, addition, and retrieval. Named with a noun. Assigned a **unique reference number: D1, D2, D3…**

A data store represents:
- A database
- A computerised file
- A filing cabinet

The physical format is unimportant — DFDs are concerned only with the logical model.
### Data Flows

A **data flow** shows the movement of data from one point to another. Described with a noun. The arrowhead indicates direction of flow. Represents data about a person, place, or thing.

> **DFD errors to avoid:** Spontaneous generation (flow with no source), Black hole (process with no output), Gray hole (process receiving more input than needed).

---

## Developing a Set of DFDs
### Step 1: Create the Context Diagram

The **context diagram** is the highest level in a DFD (Level 0). It contains **exactly one process** (numbered **0**) representing the entire system, and shows all external entities and major data flows.

**Context diagram rules:**
- Must have exactly one process
- No freestanding objects
- A process must have both an input and output data flow
- A data store must connect to at least one process
- External entities must not connect directly to one another
- Must **fit on one page**
- Use the name of the information system as the process name
- Use unique names within each set of symbols
### Step 2: Draw Diagram 0

**Diagram 0** is the explosion of the context diagram. It may include up to **nine numbered processes**. All major data stores and all external entities are included.

Drawing approaches:
- Start with the data flow from an entity on the input side
- Work backward from an output data flow
- Analyse a well-defined process first
- Note any fuzzy areas
Kendall & Kendall Copyright © 2014 Pearson
Education, Inc. Publishing as Prentice Hall 7-23
### Step 3: Draw Lower-Level (Child) Diagrams

Each process on Diagram 0 may be **exploded** into a child diagram for further detail.

**Rules:**
- Child diagram is given the **same number as the parent process** (e.g. Process 3 → Diagram 3)
- Balancing: child diagram cannot produce output or receive input the parent does not also handle
- Entities are usually not shown on child diagrams below Diagram 0
- A process not exploded further is a **primitive process**

**Levelling** uses increasingly detailed DFDs (*exploding*, *partitioning*, *decomposing*).

---

## Logical vs Physical DFDs

| Type | Focus | Description |
|---|---|---|
| **Logical DFD** | What the business does | Focuses on business operations. Not concerned with technology. Used during **analysis**. |
| **Physical DFD** | How the system will be implemented | Shows programs, hardware, people, files. Used during **design**. |

> The progression moves **Logical → Physical** as the project moves from analysis into design.









