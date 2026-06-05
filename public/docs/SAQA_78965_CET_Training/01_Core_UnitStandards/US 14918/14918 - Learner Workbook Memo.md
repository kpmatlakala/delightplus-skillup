
---

## Activity 3 (8 marks) – Identify different logical data types.

**Logical data types (also called Boolean data types) represent truth values. Common logical data types in programming:**

1. **Boolean** – Can have only two values: TRUE or FALSE (e.g., `isLoggedIn = TRUE`).  
2. **Bit** – A single binary digit (0 or 1); often used in low‑level or embedded systems.  
3. **Flag / Indicator** – A variable that signals whether a certain condition exists (e.g., `errorFlag = FALSE`).  
4. **Ternary (three‑state) logic** – Values: TRUE, FALSE, UNKNOWN (used in some databases).  
5. **Nullable Boolean** – Can be TRUE, FALSE, or NULL (no value).  
6. **Character-based logical** – Some languages use 'Y'/'N' or 'T'/'F' as logical indicators.  
7. **Integer as logical** – 0 = FALSE, non‑zero = TRUE (common in C/C++).  
8. **Enumeration with logical meaning** – E.g., `State = {ON, OFF}`.

**Note:** The question asks for “different logical data types”. The most common answer expected is **Boolean** (True/False). Additional types like bit, flag, nullable are also acceptable.

---

## Activity 4 (7 marks) – Identify and describe different logical operators.

Logical operators are used to combine or negate Boolean expressions. Common operators (list and describe):

| Operator | Symbol(s) | Description | Example (True/False) |
|----------|-----------|-------------|----------------------|
| **AND** | `&&`, `AND`, `∧` | Returns TRUE only if **both** operands are TRUE. | (5 > 3) AND (2 < 4) → TRUE |
| **OR** | `\|\|`, `OR`, `∨` | Returns TRUE if **at least one** operand is TRUE. | (5 < 3) OR (2 < 4) → TRUE |
| **NOT** | `!`, `NOT`, `¬` | Reverses the logical value. TRUE becomes FALSE, FALSE becomes TRUE. | NOT (5 < 3) → TRUE |
| **XOR** | `^`, `XOR` | Returns TRUE if **exactly one** operand is TRUE (exclusive OR). | TRUE XOR FALSE → TRUE<br>TRUE XOR TRUE → FALSE |
| **NAND** | Not standard in most languages | AND followed by NOT. Returns FALSE only if both are TRUE. | (TRUE AND TRUE) NAND → FALSE |
| **NOR** | Not standard | OR followed by NOT. Returns TRUE only if both are FALSE. | (FALSE OR FALSE) NOR → TRUE |
| **Short‑circuit AND** | `&&` (in many languages) | Evaluates left side first; if left is FALSE, right side is not evaluated. | Used for efficiency and safety. |

**Note:** For most introductory purposes, **AND, OR, NOT** are the three essential logical operators.

---

## Activity 5 (8 marks) – Identify and describe different algorithmic structures of programming languages.

Algorithmic structures (also called **control structures**) determine the flow of execution in a program. The three fundamental structures are **sequence**, **selection**, and **iteration** (repetition). Additional structures include recursion and exception handling.

| Structure | Description | Example (pseudocode) |
|-----------|-------------|----------------------|
| **Sequence** | Instructions executed one after another, in order. | `a = 5`<br>`b = a + 2`<br>`PRINT b` |
| **Selection (branching)** | Makes a decision based on a condition. Types: IF‑THEN, IF‑THEN‑ELSE, SWITCH/CASE. | `IF age >= 18 THEN`<br>&nbsp;&nbsp;&nbsp;`PRINT "Adult"`<br>`ELSE`<br>&nbsp;&nbsp;&nbsp;`PRINT "Minor"`<br>`ENDIF` |
| **Iteration (loops)** | Repeats a block of code while a condition is true (or for a fixed number of times). Types: WHILE, DO‑WHILE, FOR. | `FOR i = 1 TO 10`<br>&nbsp;&nbsp;&nbsp;`PRINT i`<br>`NEXT i` |
| **Recursion** | A function calls itself. Used for problems that can be broken into similar sub‑problems (e.g., factorial, tree traversal). | `FUNCTION factorial(n)`<br>&nbsp;&nbsp;&nbsp;`IF n == 0 THEN RETURN 1`<br>&nbsp;&nbsp;&nbsp;`RETURN n * factorial(n-1)`<br>`END FUNCTION` |
| **Exception handling** | Intercepts runtime errors and executes special code instead of crashing. | `TRY`<br>&nbsp;&nbsp;&nbsp;`division = x / y`<br>`CATCH DivideByZero`<br>&nbsp;&nbsp;&nbsp;`PRINT "Cannot divide by zero"`<br>`END TRY` |

**Note:** The first three (Sequence, Selection, Iteration) are the core “structured programming” constructs. Recursion and exception handling are advanced but important.

---

## Activity 6 (8 marks) – Identify and describe programming quality assurance (QA) principles.

Quality Assurance (QA) in programming ensures that software meets requirements and is reliable, maintainable, and efficient. Key principles:

1. **Traceability** – Every requirement must be linked to test cases and code modules.  
2. **Verification** – Are we building the product right? (Static checks: reviews, inspections, walkthroughs).  
3. **Validation** – Are we building the right product? (Dynamic testing against user requirements).  
4. **Defect tracking** – All bugs are recorded, categorised, assigned, and tracked until closed.  
5. **Code reviews** – Peer examination of source code to find defects and improve quality.  
6. **Testing** – Systematic execution of test cases (unit, integration, system, regression).  
7. **Continuous integration** – Frequent merging of code changes with automated builds and tests.  
8. **Configuration management** – Controlled versions of source code, documentation, and environments.  
9. **Standards compliance** – Follow coding standards, naming conventions, and documentation guidelines.  
10. **Process improvement** – Use metrics (e.g., defect density, rework effort) to refine QA processes.

---

## Activity 7 (4 marks) – Distinguishes between validation and verification

| Aspect | Verification | Validation |
|--------|--------------|------------|
| **Definition** | Are we building the product **right**? (Conformance to specifications) | Are we building the **right product**? (Fulfils user needs) |
| **Focus** | Documents, design, code, and static analysis | Dynamic testing of the running system |
| **Activities** | Reviews, inspections, walkthroughs, static analysis | Unit testing, integration testing, system testing, UAT |
| **Question answered** | “Does the software meet the specification?” | “Does the software do what the user actually requires?” |
| **Timing** | Performed **before** coding (during design) and during implementation | Performed **after** coding (during testing phase) |
| **Output** | Verification report (defects in documentation/code) | Validation report (defects in functionality/performance) |

**Simple memory aid:**  
- Verification = "Did we build it correctly?"  
- Validation = "Did we build the correct thing?"

---

## Activity 8 (4 marks) – Identify methods of specifying problems in designing a computer program.

Methods to specify a problem (also called **problem definition techniques**) include:

1. **Natural language description** – Written in plain English (or other language) describing the problem, inputs, outputs, and constraints.  
2. **User stories** – Short, simple descriptions from an end‑user perspective (e.g., “As a customer, I want to reset my password so that I can log in if I forget it”).  
3. **Use cases** – Describe interactions between an actor (user) and the system to achieve a goal.  
4. **Input‑Process‑Output (IPO) charts** – Tabular representation: inputs → processing steps → outputs.  
5. **Flowcharts** – Graphical representation using symbols to show the sequence of steps.  
6. **Pseudocode** – Structured English that outlines the algorithm logic.  
7. **Mathematical specification** – Using formulas, equations, or formal logic.  
8. **Requirements specification document** – Detailed, structured document with functional and non‑functional requirements.

---

## Activity 9 (7 marks) – Identify features of a computer program that could solve a given problem.

When designing a program to solve a specific problem, the following features must be considered / included:

1. **Correctness** – The program must produce the correct output for all valid inputs.  
2. **Input handling** – How the program receives data (keyboard, file, mouse, sensor, network).  
3. **Output generation** – Displaying or saving results (screen, printer, file, database).  
4. **Data storage** – Variables, arrays, files, or databases to hold intermediate and final data.  
5. **Processing logic** – Algorithms and control structures that transform inputs into outputs.  
6. **Error handling** – Graceful handling of invalid input, missing files, hardware failures, etc.  
7. **User interface (UI)** – How the user interacts with the program (command‑line, GUI, web).  
8. **Performance** – Speed, memory usage, and responsiveness (especially for large data sets).  
9. **Security** – Protection against unauthorised access, data leaks, or malicious input.  
10. **Portability** – Ability to run on different platforms (Windows, Linux, macOS).  
11. **Maintainability** – Code is well‑structured, commented, and easy to modify.  
12. **Documentation** – User guides, technical documentation, and inline comments.  

**Note:** Not every program needs all these features; the question asks for “features that could solve a given problem” – so select features relevant to the problem.

---

## Activity 10 (5 marks) – Demonstrate understanding of carrying out an evaluation of the viability of developing computer programs to solve problems and identifies the issues in assessing the viability.

**Viability evaluation** means deciding whether it is worthwhile (feasible and beneficial) to develop a computer program for a given problem. Key aspects:

### Factors to consider (viability assessment):
1. **Technical feasibility** – Do we have the hardware, software, skills, and technology to build it?  
2. **Economic feasibility** – Will the benefits outweigh the development and maintenance costs? (Cost‑benefit analysis).  
3. **Operational feasibility** – Will users accept and be able to use the solution? Does it fit into existing workflows?  
4. **Schedule feasibility** – Can the program be completed within the required time frame?  
5. **Legal feasibility** – Does the solution comply with laws (licences, data protection, accessibility)?  
6. **Risk assessment** – What could go wrong (technical, financial, security risks) and how likely are they?

### Issues in assessing viability (common problems):
1. **Incomplete or changing requirements** – The problem may not be fully understood.  
2. **Overestimating benefits** – Users may expect more than the program can realistically deliver.  
3. **Underestimating costs** – Maintenance, training, and hardware upgrades are often forgotten.  
4. **Technology limitations** – The desired features might not be possible with current tools.  
5. **Resistance to change** – Users may prefer manual methods, reducing adoption.  
6. **Difficulty measuring ROI** – Some benefits (e.g., improved morale) are hard to quantify.  
7. **Hidden dependencies** – The program may rely on other systems that are unreliable or outdated.  

**Conclusion:** A viability study helps decide “go/no‑go” before investing in full development. It is an essential part of the problem‑solving cycle in programming.

---

**End of model answers – US 14918**