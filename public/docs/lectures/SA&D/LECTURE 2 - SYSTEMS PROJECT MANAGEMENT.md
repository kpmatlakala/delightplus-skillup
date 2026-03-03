# Lecture 2: Systems Project Management
## Systems Analysis and Design

> **Reference document** — content from this file covers project management fundamentals for the systems analyst. Relevant to ITSD-14924 for understanding project scope, feasibility, and planning within the SDLC.

---

## Project Management Fundamentals

Effective project management is essential for delivering information systems on time, within budget, and to specification.

### Key Project Management Activities

- **Project initiation** — identify problems and opportunities that a new system can address
- **Determining project feasibility** — assess whether the project is technically, economically, and operationally viable
- **Activity planning and control** — select team, estimate times, schedule work, monitor progress
- **Project scheduling** — sequence activities, identify dependencies, and track milestones
- **Managing systems analysis team members** — coordinate roles, resolve conflicts, keep team on track

---

## Project Initiation

Projects arise from:
- **Problems in the organisation** — inefficiencies, errors, or gaps in current systems
- **Opportunities for improvement** — upgrading, altering, or installing new systems

### Problem Definition

A problem definition includes:

| Component | Description |
|---|---|
| **Problem Statement** | One or two paragraphs stating the problem or opportunity clearly |
| **Issues** | Independent pieces pertaining to the problem or opportunity |
| **Objectives** | Goals that match the issues point-by-point |
| **Requirements** | Things that must be accomplished, along with possible solutions and constraints |

Use the problem definition to create a **preliminary test plan**.

### Problem Definition Steps

1. Find a number of points that may be included in one issue
2. State the objective for each issue
3. Determine the relative importance of the issues or objectives
4. Identify which objectives are most critical

---

## Selection of Projects

For a project to be selected, it must satisfy multiple criteria:

- Backing from management
- Appropriate timing of project commitment
- Possibility of improving attainment of organisational goals
- Practical in terms of resources for both analyst and organisation
- Worthwhile compared with other investment opportunities

### Defining Objectives

Common project objectives include:

- Speeding up a process
- Streamlining or combining processes
- Reducing errors in input or redundant storage
- Improving system and subsystem integration
- Reducing redundant output

---

## Feasibility Study

A feasibility study tests whether it is worthwhile to proceed with the proposed system. It covers three areas:

| Type | Description |
|---|---|
| **Technical Feasibility** | Can current technical resources be upgraded or added to in a manner that fulfils the request? Is the required technology available? |
| **Economic Feasibility** | Does the value of the investment exceed the time and cost? Includes analyst time, employee time, hardware, software, and development cost |
| **Operational Feasibility** | Are human resources available to operate the system once installed? User resistance can prevent operational feasibility |

---

## Identifying Benefits and Costs

### Tangible Benefits

Advantages measurable in dollars through use of the information system:
- Increase in speed of processing
- Access to otherwise inaccessible information
- Access to information on a more timely basis
- Superior calculating power
- Decreases in employee time needed for specific tasks

### Intangible Benefits

Benefits difficult to measure:
- Improving the decision-making process
- Enhancing accuracy
- Becoming more competitive in customer service
- Maintaining a good business image
- Increasing job satisfaction

### Tangible Costs

Accurately projected by analyst and accounting personnel:
- Cost of equipment and resources
- Cost of analyst and programmer time
- Employee salaries

### Intangible Costs

Difficult to estimate and may not be known:
- Losing a competitive edge
- Losing the reputation of being first
- Declining company image
- Ineffective decision making

---

## Work Breakdown Structure (WBS)

A **WBS** breaks a project down into smaller, manageable tasks or activities.

### WBS Properties

- Each task contains **one deliverable** — a tangible, measurable outcome
- Each task can be assigned to a **single individual or group**
- Each task has a responsible person monitoring and controlling performance

### Developing a WBS

- **Decomposition** — start with large ideas and break them down into manageable activities
- **Product-oriented** — focus on deliverable components (e.g., building a website broken into pages, forms, database)
- **Process-oriented** — emphasise each phase of the project

### Estimating Task Duration

Use a three-point estimation formula:

$$\text{Estimated Duration} = \frac{B + 4P + W}{6}$$

Where:
- **B** = Best-case estimate
- **P** = Probable-case estimate
- **W** = Worst-case estimate

Factors affecting duration: project size and scope, human resources, experience with similar projects, and constraints.

---

## Task Patterns

Tasks in a project depend on each other and must be performed in sequence.

| Pattern | Description |
|---|---|
| **Dependent Tasks** | One task must finish before the next can start |
| **Multiple Successor Tasks** | One task triggers two or more parallel tasks |
| **Multiple Predecessor Tasks** | One task requires two or more prior tasks to complete |
| **Concurrent Tasks** | Two or more tasks can run in parallel |

> Identify task patterns by watching for action words like *then*, *when*, or *and* in task statements — these signal sequences and dependencies.

---

## Critical Path

The **critical path** is the longest sequence of dependent tasks — it determines the minimum project duration.

### Calculating the Critical Path

1. Review task patterns and dependencies
2. Determine start and finish dates for each task
3. Identify the path with **zero slack time**

**Slack time** is the amount of time a non-critical task can be delayed without delaying the overall project.

---

## Project Scheduling Tools

### Gantt Chart

- Simple bar chart drawn to scale
- Shows task start/end dates and durations visually
- Lends itself well to end-user communication
- Does not provide detailed interdependency information for complex projects

### PERT Diagram (Programme Evaluation Review Technique)

- Useful when activities can be done in parallel
- Shows task dependencies as a network diagram
- Supports critical path analysis

### PERT Diagram Advantages

- Easy identification of the order of precedence
- Easy identification of the critical path and thus critical activities
- Easy determination of slack time

---

*End of Lecture 2 reference document.*
