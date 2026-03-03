# Lecture 7: Data Design
## Systems Analysis and Design

> **Reference document** — this content relates primarily to the **ITSD-14910** (Database) unit standard. Use as supplementary context only within ITSD-14924; do not add as primary session content for that unit.

---

## Data Storage

Effective data storage must satisfy four objectives:

- Data must be **available** when users need it
- Data must be **accurate and consistent** across the system
- **Efficient** storage, updating, and retrieval
- **Purposeful** information retrieval — only what is needed

### Two Approaches to Data Storage

| Approach | Description |
|---|---|
| **Individual files** | Each application has its own unique file. Efficient in some situations but leads to data redundancy and integrity problems |
| **Database** | A formally defined and centrally controlled store of data intended for use in many different applications |

### Database Effectiveness Objectives

- Ensure data can be **shared** among users for a variety of applications
- Maintain data that are both **accurate and consistent**
- Ensure data required for future applications will be **readily available**
- Allow the database to **evolve** as user needs grow
- Allow users to construct their **personal view** of data without concern for physical storage

---

## Data Design Concepts and Terminology

### Types of Files

| File Type | Description |
|---|---|
| **Master file** | Contains all information about a data entity; the primary store of records |
| **Table file** | Contains data used to calculate other data or performance measures; usually read-only |
| **Transaction file** | Used to enter changes that update the master file and produce reports |
| **Report file** | Used when printing is not immediately possible; output can be sent to another system |
| **Work file** | Temporary file used during processing |
| **Security file** | Contains backup or audit data |
| **History file** | Archives old transaction records |

### Data Design Terminology

| Term | Definition |
|---|---|
| **Entity** | Any object or event about which data is collected (person, place, thing, event, or unit of time) |
| **Table / File** | Stores data about a group of entities |
| **Field** | A single data item or attribute in a record |
| **Record / Tuple** | A collection of related fields describing one instance of an entity |

### Entity Subtype

An entity subtype is a special one-to-one relationship representing additional attributes that may not be present on every record. This eliminates null fields — for example, only students with internships need internship fields.

---

## Key Fields

| Key Type | Description |
|---|---|
| **Primary Key** | A unique attribute that identifies each record in a table; cannot be null |
| **Candidate Key** | An attribute or group of attributes that could serve as a primary key |
| **Foreign Key** | A field that links to the primary key of another table |
| **Secondary Key** | May not be unique; used to select groups of records |
| **Composite Key** | A combination of two or more attributes forming a primary key |

---

## Data Integrity

### Referential Integrity

In a relational database, referential integrity means that a foreign key value in a child table **must** have a matching primary key record in the parent table.

Implications:
- Cannot add a child record without a matching parent record
- Cannot change a primary key that has matching child records
- Cannot delete a parent record that has child records

Two implementations:
- **Restricted** — updates or deletes a key only if no matching child records exist
- **Cascaded** — automatically updates or deletes all child records when the parent is changed or deleted

### Entity Integrity

The primary key field **cannot contain a null value**. If the primary key is composite, no field within it can be null.

### Domain Integrity

Domain integrity rules validate data values. Two forms:
- **Check constraints** — defined at the table level
- **Rules** — defined as separate objects; can be reused across multiple fields

---

## Entity-Relationship Diagrams (ERDs)

An ERD visually represents entities and the relationships between them.

### Drawing an ERD

1. List all entities identified during fact-finding
2. Consider the nature of the relationships linking them
3. Represent entities as **rectangles**, relationships as **diamond shapes** (Chen notation) or lines with cardinality markers (Crow's Foot notation)

### Types of Relationships

| Type | Symbol | Meaning |
|---|---|---|
| **One-to-One (1:1)** | `|—|` | One instance of entity A relates to exactly one instance of entity B |
| **One-to-Many (1:M)** | `|—<` | One instance of entity A relates to many instances of entity B |
| **Many-to-Many (M:N)** | `>—<` | Many instances of entity A relate to many instances of entity B |

### Cardinality Notations

- **Chen notation** — `1`, `M`, `N` on relationship lines
- **Crow's Foot notation** — visual symbols (straight line, crow's foot, circle) for minimum and maximum cardinality
- **UML notation** — numbers or ranges (e.g. `1..*`) on association lines

---

## Normalisation

**Normalisation** is the transformation of complex user views and data stores into a set of smaller, stable, and easily maintainable data structures. The objective is to eliminate data redundancy and integrity problems.

### Standard Notation Format

`TABLE_NAME (PRIMARY_KEY, field1, field2, foreign_key*)`

### Normal Forms

| Normal Form | Rule |
|---|---|
| **Unnormalised (UNF)** | Contains repeating groups of fields |
| **First Normal Form (1NF)** | No repeating groups. Expand the primary key to include the key of the repeating group |
| **Second Normal Form (2NF)** | In 1NF, AND all non-key fields are **fully dependent** on the entire primary key (no partial dependency) |
| **Third Normal Form (3NF)** | In 2NF, AND no non-key field is dependent on **another non-key field** (no transitive dependency) |

> Best practice: design to **3NF** to eliminate redundancy and data integrity problems.

### Database Design Process (Step-by-Step)

1. Create an initial ERD
2. Refine and expand the ERD
3. Review all data elements
4. Review 3NF designs for all tables
5. Double-check all data dictionary entries
6. Transform the final ERD and normalised table designs into a physical database

---

## Data Storage and Access

| Strategy | Description |
|---|---|
| **Data Warehouse** | A large, centralised repository of historical data for reporting and analysis. Organised into dimensions |
| **Data Mart** | A subset of a data warehouse focused on a specific business area |
| **Data Mining** | Discovering patterns and insights in large datasets |

### Logical vs Physical Storage

| Level | Examples |
|---|---|
| **Logical storage** | Characters → Data elements → Logical records |
| **Physical storage** | Physical records (blocks) → Buffer → Blocking factor |

### Data Coding and Storage

- Binary digits (bits) → Bytes → Characters
- Encoding standards: **ASCII**, **EBCDIC**, **Unicode** (modern standard for international character support)
- Date storage: ISO date format standard (avoids Y2K-style problems)

---

## Data Control

Good data management requires controls to protect data quality and security:

- **User IDs and Passwords** — authentication
- **Permissions** — authorisation (who can read/write/delete)
- **Encryption** — protecting data in transit and at rest
- **Backup and Recovery procedures** — ensuring data can be restored after failure
- **Audit log files** — tracking who accessed or changed data and when
- **Audit fields** — fields like `created_by`, `modified_date` added to each record

---

*End of Lecture 7 reference document.*
