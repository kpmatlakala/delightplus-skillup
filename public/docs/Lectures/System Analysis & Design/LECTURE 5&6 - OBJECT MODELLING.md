# Lecture 5 & 6: Object Modelling
## Systems Analysis and Design

> **Reference document** — content from this file enriches the ITSD-14924 session-2 lesson flow (OO analysis concepts, UML diagrams, use cases, sequence diagrams, activity diagrams).

---

## Overview of Object-Oriented Analysis

**Object-oriented (OO) analysis** sees a system from the viewpoint of the objects themselves as they function and interact. OO analysis works well in situations where complex systems undergo continuous maintenance, adaptation, and redesign.

### Why Object-Oriented?

- **Reusability** — objects and classes can be recycled across projects, reducing development cost
- **Modularity** — a change in one object has minimal impact on other objects
- **Industry standard** — the **Unified Modeling Language (UML)** is the standard for modelling OO systems

---

## Key OO Concepts

| Concept | Definition |
|---|---|
| **Object** | A person, place, or thing relevant to the system (e.g. customer, order, product). May also be GUI elements like windows or buttons |
| **Class** | Defines the set of shared attributes and behaviours found in each object. Objects are *instantiated* from a class |
| **Attribute** | A property possessed by all objects of a class (similar to an adjective describing the object) |
| **Method** | An action that can be requested from any object of the class (similar to a verb — describes what the object can do) |
| **Message** | A request from one object to another to perform a method. Enables objects to interact |
| **Inheritance** | When a derived (child) class inherits all attributes and behaviours of the base (parent) class. Reduces programming labour by reusing common objects |
| **Encapsulation** | Hiding the internal details of an object so other objects interact only through defined messages (the "black box" principle) |
| **Polymorphism** | The ability for different objects to respond to the same message in different ways |

### Inheritance Example

A `Car` class and a `Truck` class both inherit from a `Vehicle` class — they share the vehicle's common attributes (make, speed) but each adds its own (payload for truck, number of doors for car).

---

## UML Class Diagrams

A **class diagram** shows the static features of the system — classes, their attributes, methods, and relationships.

Each class is represented as a rectangle with three compartments:
1. **Class name** (top)
2. **Attributes** (middle) — with visibility: `-` private, `+` public, `#` protected
3. **Methods** (bottom) — standard and custom

### Class Diagram Relationships

| Relationship | Symbol | Description |
|---|---|---|
| **Association** | Solid line | Structural link between two classes |
| **Aggregation** | Hollow diamond | Whole-part relationship (the part can exist independently) |
| **Composition** | Filled diamond | Strong whole-part relationship (the part cannot exist without the whole) |
| **Inheritance / Generalisation** | Line with hollow triangle arrowhead | Child class inherits from parent class |

**Cardinality** shows the number of instances involved in a relationship (e.g. one-to-many, many-to-many).

### Types of Classes

| Type | Description |
|---|---|
| **Entity Class** | Represents real-world items — corresponds to entities on an ERD |
| **Interface / Boundary Class** | Provides the means for users to interact with the system (windows, forms, dialogue boxes) |
| **Abstract Class** | Linked to concrete classes in a generalisation/specialisation relationship; cannot be directly instantiated |
| **Control Class** | Controls the flow of activities; many small control classes create reusable, modular behaviour |

### Three-Layer Architecture

| Layer | Description | Corresponds To |
|---|---|---|
| **Presentation Layer** | What the user sees | Interface / Boundary classes |
| **Business Layer** | The unique rules for this application | Control classes |
| **Persistence / Data Access Layer** | Obtaining and storing data | Entity classes |

---

## Use Case Modelling

A **use case** describes what the system does from the perspective of the actor — *without* describing how the system does it. Use cases capture user requirements as scenarios.

### Key Elements

| Element | Description |
|---|---|
| **Actor** | An idealisation of an external person, process, or thing that interacts with the system. Represented as a stick figure with a name |
| **Use Case** | A set of scenarios describing an interaction between a user and the system. Represented as an oval with a label |
| **System Boundary** | A rectangle around all use cases that defines the scope of the system |

### Use Case Relationships

| Relationship | Notation | Meaning |
|---|---|---|
| **Association** | Solid line | Communication between an actor and a use case |
| **Generalisation** | Line with triangular arrowhead toward parent | One use case is a special version of another |
| **Include** | Dashed line with `<<include>>` label | Base use case **must** include the behaviour of another |
| **Extend** | Dashed line with `<<extend>>` label toward base case | Extending use case **may** add optional behaviour to the base |

### Drawing a Use Case Diagram

1. List all actors (who uses the system?)
2. List all use cases (what does each actor want to achieve?)
3. Draw the system boundary
4. Place use cases inside the boundary, actors outside
5. Add relationships (association, include, extend, generalisation)
6. Consider exception and extension scenarios for each use case

---

## Sequence Diagrams

A **sequence diagram** illustrates a succession of interactions between classes or object instances over time.

- Used to show the processing described in use case scenarios
- Emphasises the **time ordering** of messages
- Symbols: classes, **lifelines** (dashed vertical lines), **messages** (horizontal arrows), **focuses** (activation boxes)

---

## State Transition Diagrams

A **state transition diagram** shows the states an object can be in and the events or actions that cause transitions between states.

- Initial state: filled circle (left)
- Final state: filled circle with hollow border (right)
- Transitions: arrows with labels describing the event or action

---

## Activity Diagrams

An **activity diagram** shows the sequence of activities in a process, including sequential and parallel activities, and decisions.

### Symbols

| Symbol | Meaning |
|---|---|
| Rounded rectangle | Activity / action |
| Arrow | Flow direction |
| Diamond | Decision point |
| Long flat rectangle (**swimlane**) | Divides activities by responsible role or system |
| Filled circle | Start state |
| Filled circle with hollow border | End state |

### Swimlanes

Swimlanes divide the activity diagram horizontally or vertically to show **which actor or system component** performs each activity. They are useful for showing data transmission and team task division.

### When to Use Activity Diagrams

- When the flow of control within a use case is complex
- When there is a need to model workflow
- When all scenarios for a use case need to be visualised

---

## Organising the Object Model

1. Develop an **object relationship diagram** for a system overview
2. Link use cases and use case diagrams to the appropriate class, state transition, sequence, and activity diagrams
3. Use **CASE tools** to speed up diagramming and maintain consistency — creating diagrams by hand is time-consuming; errors are much cheaper to fix in diagrams than in software

---

*End of Lecture 5 & 6 reference document.*
