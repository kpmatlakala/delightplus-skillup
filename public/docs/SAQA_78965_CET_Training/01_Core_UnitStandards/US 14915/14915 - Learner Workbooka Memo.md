
---

## Activity 8 (5 marks) – Outline steps and techniques of program maintenance

**Steps (phases) of program maintenance:**

1. **Problem identification / request** – User reports a bug, requests an enhancement, or identifies a need for change.  
2. **Analysis** – Determine the root cause, impact on existing system, and required changes.  
3. **Design** – Plan the modification (update design documents, algorithms, data structures).  
4. **Implementation** – Write and test the code changes in a development environment.  
5. **Testing** – Unit test, integration test, regression test to ensure no new defects are introduced.  
6. **Deployment** – Release the updated program to the production environment.  
7. **Review and documentation** – Update user manuals, technical documentation, and close the maintenance request.

**Techniques of program maintenance:**

1. **Corrective maintenance** – Fixing bugs and errors identified by users or automated testing.  
2. **Adaptive maintenance** – Modifying the program to work in a changed environment (new OS, new hardware, updated libraries).  
3. **Perfective maintenance** – Improving performance, adding new features, or enhancing usability.  
4. **Preventive maintenance** – Refactoring code, improving documentation, and adding safeguards to prevent future problems.  
5. **Impact analysis** – Assessing which parts of the system will be affected by a proposed change.  
6. **Regression testing** – Re‑running previous test cases to verify that existing functionality still works.  
7. **Configuration management** – Managing versions of the code, keeping a history of changes, and enabling rollback.

---

## Activity 9 (5 marks) – Distinguish between Desk‑checking and Translating

| Aspect | Desk‑checking | Translating |
|--------|---------------|-------------|
| **Definition** | Manual, mental or paper‑based simulation of a program’s logic using sample inputs. | Process of converting source code into machine language (or intermediate code) using a compiler or interpreter. |
| **Performed by** | Programmer / analyst (human). | Compiler, interpreter, or assembler (software tool). |
| **When done** | Before compilation, during algorithm design or coding. | After writing source code, before execution. |
| **Purpose** | Verify the correctness of logic and algorithms without running the program. | Produce an executable form that the computer can run. |
| **Tools** | Pen, paper, sample data, calculator. | Compiler (e.g., gcc, javac), interpreter (e.g., Python), assembler. |
| **Detects** | Logical errors (e.g., off‑by‑one, incorrect formula, infinite loops). | Syntax errors, type errors, and generates machine code. |
| **Output** | A trace table showing values of variables at each step. | Object code, bytecode, or executable file (plus error messages). |
| **Repeatability** | Can be repeated with different test data manually. | Translating the same source code gives the same binary each time (deterministic). |

**Example:**  
- Desk‑checking a loop that sums numbers: you manually compute on paper what the loop will do for input 5.  
- Translating the same loop code using a C compiler produces an executable that can be run on a computer.

---

**End of model answers – US 14915**