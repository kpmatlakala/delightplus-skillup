# Model Answers – US 14910: Apply the principles of computer programming

**Unit Standard ID:** 14910  
**NQF Level:** 4  
**Credits:** 4  
**Qualification:** FETC: Information Technology: Systems Development (SAQA ID 78965)

---

## Activity 1 (5 marks) – Define text editor and syntax

**Text editor**  
A text editor is a software tool used to write and edit plain text, including source code. It provides features such as syntax highlighting, line numbering, auto‑indentation, and search/replace. Examples: Notepad++, VS Code, Sublime Text, IDLE (for Python).

**Syntax**  
Syntax refers to the set of rules that defines the correct structure of statements in a programming language. It dictates how keywords, operators, punctuation, and identifiers must be arranged for the code to be valid.  
Example: In Python, `print("Hello")` is syntactically correct, while `print "Hello"` (without parentheses in Python 3) is a syntax error.

---

## Activity 2 (6 marks) – Demonstrate understanding of how to operate computer programming development tools (syntax, editor or library function)

**Operating a development tool (e.g., IDE or code editor) involves the following:**

1. **Using the editor** – Create a new file, type source code, save with the correct file extension (e.g., `.py`, `.c`, `.java`). Use features like auto‑completion, indentation, and colour‑coding to write readable code.

2. **Using the syntax checker** – Most IDEs highlight syntax errors as you type (red underlines, error markers). The syntax checker analyses the code against the language’s grammar rules and reports errors (e.g., missing semicolon, unmatched brackets) before compilation/execution.

3. **Using library functions** – A library is a collection of pre‑written code (functions, classes) that can be reused. To use a library function, you must import the library (e.g., `import math` in Python) and then call the function (e.g., `math.sqrt(25)`). This saves time and promotes code reuse.

**Example workflow in Python IDLE:**
- Open editor, write `print("Hello")`.
- Syntax checker immediately validates parentheses and quotes.
- Save as `hello.py`.
- Run; the interpreter executes the code.
- Use built‑in library function: `import random; print(random.randint(1,10))`.

---

## Activity 3 (10 marks) – Distinguish between different internal representations of data types (in ASCII)

**Internal representation** means how data is stored in computer memory (binary). ASCII (American Standard Code for Information Interchange) is a character encoding that represents text characters as numbers (0–127).

### Key distinctions:

| Data type | Internal representation (example) |
|-----------|-----------------------------------|
| **Character (ASCII)** | Each character is stored as a 7‑bit (or 8‑bit) binary number. Example: `'A'` = 65 decimal = `01000001` binary. |
| **Integer** | Stored as binary (two’s complement for signed integers). Example: `25` = `00011001`. Not ASCII; arithmetic value. |
| **Floating‑point** | Stored using IEEE 754 format (sign, exponent, mantissa). Not ASCII. Example: `3.14` is not represented by ASCII codes of characters '3', '.', '1', '4' but as a binary floating‑point number. |
| **Boolean** | Usually stored as a single byte: `0` = False, `1` = True (or any non‑zero). Not ASCII. |
| **String** | A sequence of ASCII codes (or Unicode) stored consecutively. Example: `"Hi"` = `72` (H), `105` (i). |

**Comparison example:**  
- The integer 65 and the character `'A'` both have binary value `01000001`. However, the **type** determines interpretation: as integer it means the number 65; as character it means the letter 'A'. ASCII is the mapping that defines that binary pattern as 'A'.

**Unicode / UTF‑8** – Modern systems use Unicode (supports many languages). UTF‑8 is backward‑compatible with ASCII for the first 128 characters.

---

## Activity 4 (5 marks) – Demonstrate understanding of different logical data types (at least 3) in a language of choice (incl. pseudo code)

Logical data types represent truth values. Using Python as the language of choice:

| Data type | Description | Pseudocode / Python example |
|-----------|-------------|----------------------------|
| **bool (Boolean)** | Can be either `True` or `False`. | `is_adult = True`<br>`if is_adult:`<br>&nbsp;&nbsp;&nbsp;`print("Access granted")` |
| **int used as flag** | In some languages (C, old C++), `0` means false, any non‑zero means true. | `int flag = 1;`<br>`if(flag) { printf("True"); }` |
| **NoneType / null** | Represents the absence of a value; often used as a logical indicator (“no value”). | `result = None`<br>`if result is None:`<br>&nbsp;&nbsp;&nbsp;`print("No result")` |

**Pseudocode example for Boolean:**
```text
    DECLARE isRaining AS BOOLEAN
    SET isRaining = TRUE
    IF isRaining THEN
    OUTPUT "Take an umbrella"
    ENDIF
```


---

## Activity 5 (8 marks) – Describe various algorithmic structures of programming languages

Algorithmic structures (control structures) determine the flow of program execution. The three fundamental structures are **sequence**, **selection**, and **iteration**. Additional structures include **recursion** and **exception handling**.

| Structure | Description | Pseudocode example |
|-----------|-------------|--------------------|
| **Sequence** | Instructions executed one after another, in order. | `INPUT a`<br>`b = a * 2`<br>`OUTPUT b` |
| **Selection (branching)** | Decides which block to execute based on a condition. Types: IF‑THEN, IF‑THEN‑ELSE, SWITCH/CASE. | `IF mark >= 50 THEN`<br>&nbsp;&nbsp;&nbsp;`OUTPUT "Pass"`<br>`ELSE`<br>&nbsp;&nbsp;&nbsp;`OUTPUT "Fail"`<br>`ENDIF` |
| **Iteration (loops)** | Repeats a block of code. Types: `WHILE`, `DO‑WHILE`, `FOR`. | `FOR i = 1 TO 10`<br>&nbsp;&nbsp;&nbsp;`OUTPUT i`<br>`NEXT i` |
| **Recursion** | A function calls itself. Solves problems that can be broken into smaller, similar sub‑problems (e.g., factorial, tree traversal). | `FUNCTION factorial(n)`<br>&nbsp;&nbsp;&nbsp;`IF n <= 1 THEN`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`RETURN 1`<br>&nbsp;&nbsp;&nbsp;`ELSE`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`RETURN n * factorial(n-1)`<br>&nbsp;&nbsp;&nbsp;`ENDIF`<br>`END FUNCTION` |
| **Exception handling** | Intercepts runtime errors and executes a special block instead of crashing. | `TRY`<br>&nbsp;&nbsp;&nbsp;`result = x / y`<br>`CATCH DivisionByZero`<br>&nbsp;&nbsp;&nbsp;`OUTPUT "Cannot divide by zero"`<br>`END TRY` |

---
## Activity 6 (5 marks) – Describe Program Documentation Principles

Good documentation improves readability, maintainability, and usability.

| Principle | Good Practice | Bad Practice |
|---|---|---|
| **Clarity** | Use plain and concise language. Explain *why*, not just *what*. | Vague or overly technical explanations. |
| **Consistency** | Use consistent terminology and formatting throughout. | Mixed styles and inconsistent naming conventions. |
| **Completeness** | Document all functions, parameters, return values, and exceptions. | Missing information and undocumented changes. |
| **Maintainability** | Keep documentation updated with code changes. | Outdated comments or manuals. |
| **Audience Awareness** | Separate user documentation from developer documentation. | One document trying to serve everyone. |

### Example of Good Inline Comment

```python
# Calculate area of a circle. radius is a positive float.
area = 3.14159 * radius ** 2
```

### Poor Comment Example

```python
# Multiply pi by radius squared
area = 3.14159 * radius ** 2
```

The second comment is poor because it only repeats what the code already shows.

---

# Activity 7 (5 marks) – Define Constants and Variables

| Term | Definition | Example |
|---|---|---|
| **Variable** | A named memory location whose value can change during program execution. | `int age = 25;` |
| **Constant** | A named memory location whose value cannot change after assignment. | `const double PI = 3.14159;` |

---

## Variable Example

```c
int age = 25;
age = 26;
```

The value changes during execution.

---

## Constant Example

```c
const double PI = 3.14159;
PI = 3.14;   // Error
```

Constants cannot be modified after assignment.

---

## Key Differences

- Variables use declarations such as:
  - `int`
  - `float`
  - `var`

- Constants use:
  - `const`
  - `final`
  - `#define`

### Advantages of Constants
- Improve readability
- Prevent accidental changes
- Store fixed values such as:
  - tax rates
  - mathematical constants
  - configuration values

---

## Pseudocode Example

```text
CONSTANT MAX_SCORE = 100

DECLARE studentScore AS INTEGER
studentScore = 85

IF studentScore > MAX_SCORE THEN
    OUTPUT "Invalid score"
ENDIF
```

---

# Activity 8 (5 marks) – List Advantages of Modular Programming

Modular programming divides a program into smaller independent modules such as functions, classes, or libraries.

## Advantages

1. **Code Reusability**
   - Modules can be reused in multiple programs.

2. **Easier Debugging and Testing**
   - Each module can be tested independently.

3. **Improved Maintainability**
   - Changes in one module usually do not affect others.

4. **Team Development**
   - Multiple programmers can work on different modules simultaneously.

5. **Better Readability**
   - Smaller modules are easier to understand.

6. **Reduced Duplication**
   - Common code is written once and reused.
   - Supports the DRY principle (Don’t Repeat Yourself).

7. **Encapsulation**
   - Internal complexity is hidden behind clear interfaces.

---

# Activity 9 (4 marks) – Define Debugging

Debugging is the systematic process of identifying, isolating, and fixing errors (bugs) in a computer program.

## Debugging Process

1. Reproduce the error.
2. Examine the code and variables.
3. Use debugging tools.
4. Correct the code.
5. Retest the program.

---

## Common Debugging Techniques

### 1. Print Statement Debugging
Temporary print statements are added to track variable values.

### 2. Rubber Duck Debugging
The programmer explains the code line by line to identify logical errors.

### 3. Using an Integrated Debugger
Tools such as:
- breakpoints
- watches
- stack traces

help inspect program execution.

### 4. Unit Testing
Small sections of code are tested automatically.

### 5. Code Review
Another programmer examines the code for mistakes.

---

## Example of Debugging

A program calculates averages incorrectly.

### Problem

Input:

```text
10, 20
```

Expected average:

```text
15
```

Actual result:

```text
10
```

### Debugging Steps

1. Insert print statements.
2. Check values of:
   - sum
   - count
3. Discover the sum was not accumulated correctly.
4. Fix the code.
5. Retest successfully.

---

# End of Model Answers – US 14910