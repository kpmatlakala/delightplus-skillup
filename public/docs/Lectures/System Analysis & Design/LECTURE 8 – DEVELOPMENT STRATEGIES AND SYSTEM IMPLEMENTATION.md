# Lecture 8: Development Strategies and System Implementation
## Systems Analysis and Design

> **Reference document** — content from this file relates to ITSD-14924 (development approaches) and ITSD-14910 (implementation and testing). Use selectively based on the unit being taught.

---

## Development Strategies Overview

Selecting the best development path requires companies to consider three key topics:
- The **impact of the Internet** on software delivery
- **Software outsourcing** options
- **In-house software development** alternatives

---

## The Impact of the Internet

### Software as a Service (SaaS)

SaaS delivers software over the Internet — users access applications via a browser rather than installing them locally. The SaaS model has grown significantly and is now a primary delivery method for business software.

### Traditional vs Web-Based Development

| Approach | Characteristics |
|---|---|
| **Traditional** | Systems run on local/wide-area company networks; internet features are treated as enhancements |
| **Web-based** | Systems developed and delivered in an internet framework (e.g. .NET, cloud platforms); internet is core to the design |

---

## Outsourcing

**Outsourcing** means contracting an external service provider to handle IT development or operations.

| Type | Description |
|---|---|
| **Application Service Provider (ASP)** | Hosts and manages software applications on behalf of the company |
| **Internet Business Services (IBS)** | Also called managed hosting; third-party manages infrastructure |
| **Offshore Outsourcing** | IT work sent to overseas providers for lower costs; involves unique risks (time zones, communication, data sovereignty) |

> Mission-critical systems should only be outsourced if the result is a cost-attractive, reliable solution that fits the company's long-term strategy.

---

## In-House Software Development

### Make-or-Buy Decision

| Build In-House | Purchase a Package |
|---|---|
| Satisfies unique business requirements | Lower costs |
| Minimises changes to business procedures | Faster to implement |
| Meets constraints of existing systems | Proven reliability |
| Develops internal capabilities | Vendor provides future upgrades |

### Software Acquisition Process (6 Steps)

1. **Evaluate Information System Requirements** — identify key features, estimate volume, specify constraints, prepare RFP/RFQ
2. **Identify Potential Vendors or Outsourcing Options** — use internet, consulting firms, and industry forums
3. **Evaluate the Alternatives** — benchmark testing, existing user references, match against RFP
4. **Perform Cost-Benefit Analysis** — calculate TCO for each option; review software licensing models
5. **Prepare a Recommendation** — document alternatives with costs, benefits, advantages, and disadvantages
6. **Implement the Solution** — load, configure, test, train users, convert data files

---

## Transition to Systems Design

### Logical vs Physical Design

| Design Type | Description |
|---|---|
| **Logical Design** | Defines the functions, features, and relationships among system components — *what* the system does |
| **Physical Design** | A plan for actual implementation — *how* the system will be built |

### Systems Design Guidelines

An effective system must be:
- **Effective** — supports business requirements and meets user needs
- **Reliable** — handles input errors, processing errors, hardware failures, and human mistakes
- **Maintainable** — flexible, scalable, and easily modified

Key design considerations:
- **User**: design every input/output point carefully; anticipate future needs; provide flexibility
- **Data**: enter data as early as possible; verify as entered; use automated entry; enforce audit trail
- **Architecture**: use modular design; each module should perform a single function

---

## Application Development

### Structured Development

- Review all SDLC documentation
- Create structure charts (control modules, subordinate modules, data/control couples)
- Apply **cohesion** (each module does one thing) and **loose coupling** (modules minimally dependent on each other)

### Object-Oriented Development

- Application structure is represented by the object model
- Translate object methods into program code modules
- Classes should be **loosely coupled**; methods should be **loosely coupled and highly cohesive**

### Agile Development

- Development team in constant communication with the customer
- Very small teams, intense communication, rapid iteration
- Extreme Programming (XP): user stories → release plan → iteration cycles → test-driven design
- Risk: may lack discipline or produce systems of questionable quality if not managed carefully

### Development Tools

- Entity-relationship diagrams, flowcharts, pseudocode, decision tables and trees
- **IDEs** (Integrated Development Environments) for coding and code generation

---

## Testing

| Test Level | Description |
|---|---|
| **Unit Testing** | Test individual modules or components in isolation |
| **Integration Testing** | Test modules working together |
| **System Testing** | Full system test against all specifications |

> Thorough testing is a cost-effective way to deliver a quality product.

---

## Documentation

| Type | Audience | Purpose |
|---|---|---|
| **Program Documentation** | Developers | Explains program logic, structure, and design |
| **System Documentation** | IT staff | Overall system design, architecture, and flow |
| **Operations Documentation** | IT operations | Procedures for running and maintaining the system |
| **User Documentation** | End users | Help files, procedure manuals, FAQs, online documentation |

---

## System Installation and Evaluation

### Training

Three groups must be trained: **users**, **managers**, and **IT staff**. Vendor training often gives the best return on investment.

### Data Conversion

- Export data from the old system (ASCII, ODBC, or custom extract)
- Convert data formats, add missing fields (sometimes requiring manual entry)
- Ensure all control measures are in place; load the new system with accurate, error-free data

### System Changeover Methods

| Method | Description | Pros / Cons |
|---|---|---|
| **Direct Cutover** | Switch to new system immediately, old system decommissioned | Risky, but fast and cost-efficient |
| **Parallel Operation** | Both systems run simultaneously for a period | Safer verification; burdens operations; impractical if systems are incompatible |
| **Pilot Operation** | New system deployed to one group first; rest follow after success | Balances risk and speed; good for large organisations |

---

*End of Lecture 8 reference document.*
