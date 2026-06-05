# Model Answers – US 14930: Demonstrate an understanding of the principles of developing software for the internet

**Unit Standard ID:** 14930  
**NQF Level:** 4  
**Credits:** 3  
**Qualification:** FETC: Information Technology: Systems Development (SAQA ID 78965)

---

## Activity 1 (5 marks) – Define a network protocol

A **network protocol** is a set of rules and conventions that govern how data is transmitted, formatted, and interpreted between devices on a network. Protocols ensure that different hardware and software can communicate reliably.

**Key points:**
- Define message formats (e.g., headers, data payload).
- Establish error handling, sequencing, and flow control.
- Examples: HTTP (web), TCP (reliable transmission), IP (addressing), FTP (file transfer).

**Implication for internet development:**  
Developers must understand protocols like HTTP (request‑response, stateless) to build web applications that correctly send and receive data.

---

## Activity 2 (4 marks) – Distinguish between TCP/IP and ISO OSI network models

| Feature | TCP/IP Model | ISO OSI Model |
|---------|--------------|----------------|
| **Number of layers** | 4 layers (Application, Transport, Internet, Network Access) | 7 layers (Physical, Data Link, Network, Transport, Session, Presentation, Application) |
| **Origin** | Developed by the US Department of Defense (ARPANET) | Developed by ISO (International Organization for Standardization) as a theoretical framework |
| **Practical use** | The actual model used for the Internet and most modern networks | Primarily a reference model for teaching and understanding network concepts |
| **Layer functions** | Combines OSI’s Session, Presentation, and Application into one “Application” layer; combines Physical and Data Link into “Network Access” | Separates functions into distinct layers (e.g., session management, data formatting) |
| **Protocol examples** | TCP, UDP, IP, HTTP, FTP | Not directly implemented; each layer maps to protocols (e.g., IP at Network, TCP at Transport) |

**Conclusion:** TCP/IP is the *practical* model; OSI is the *theoretical* reference.

---

## Activity 3 (4 marks) – What is network bandwidth?

**Network bandwidth** is the maximum amount of data that can be transmitted over a network connection in a given amount of time. It is usually measured in **bits per second** (bps), e.g., Mbps (megabits per second).

**Key points:**
- Higher bandwidth allows more data to be sent simultaneously (e.g., streaming video, large file downloads).
- Bandwidth is often shared among users; actual throughput may be lower due to congestion, latency, or network overhead.
- For internet applications, limited bandwidth can cause slow page loads, buffering, and poor user experience.

**Example:** A 10 Mbps connection can theoretically download 10 million bits per second, but real speed depends on many factors.

---

## Activity 4 (5 marks) – Implications of slow bandwidth to application design

When bandwidth is slow or limited, application designers must adapt to ensure usability. Key implications include:

1. **Minimise data transfer** – Reduce the size of HTML, CSS, JavaScript, and images. Use compression (gzip, Brotli) and minification.
2. **Optimise images** – Use modern formats (WebP, AVIF), responsive images, lazy loading, and appropriate resolution.
3. **Use caching** – Store static assets (CSS, JS, images) on the client or CDN to avoid repeated downloads.
4. **Reduce the number of requests** – Combine files (CSS sprites, bundling), use HTTP/2 multiplexing, and limit third‑party scripts.
5. **Implement progressive loading** – Show basic content first, then load additional resources as bandwidth allows.
6. **Use adaptive streaming** – Adjust video quality based on available bandwidth (e.g., HLS, DASH).
7. **Provide offline capabilities** – Use service workers to cache core resources so the app works offline or with intermittent connectivity.

**Example:** A news site for rural areas might serve a text‑only version with small images and use lazy loading.

---

## Activity 5 (8 marks) – Explain the benefits and drawbacks of rich clients and browser-based clients as deployed in a typical Java EE application

**Rich client (e.g., desktop Java Swing/JavaFX, or applet – historical):**  
A rich client runs on the user’s machine, often with full access to local resources.

| Aspect | Benefits | Drawbacks |
|--------|----------|-----------|
| **Installation** | Can work offline; full access to local hardware (file system, printers) | Requires installation and updates on each user’s machine; platform‑dependent |
| **Performance** | Faster response; can use local processing power | Heavy; consumes local resources; may need high‑spec machines |
| **User experience** | Richer UI controls, drag‑and‑drop, real‑time feedback | More complex to develop and maintain; inconsistent look across OS |
| **Security** | Can be sandboxed (e.g., Java applets) but often perceived as risky | More attack surface; updates may be neglected by users |

**Browser-based client (web client – HTML/CSS/JS, Java servlets/JSP on server):**  
Runs inside a web browser; logic executes on server (or client‑side via JavaScript).

| Aspect | Benefits | Drawbacks |
|--------|----------|-----------|
| **Deployment** | Zero installation; instant updates (server side) | Requires internet connection; browser compatibility issues |
| **Performance** | Lightweight on client; heavy load on server | Network latency; bandwidth dependent |
| **User experience** | Consistent across devices (if responsive); easy to link/share | Limited offline capability; fewer UI controls than desktop |
| **Maintenance** | Centralised; no client updates | Server must handle scalability and security |
| **Security** | Sandboxed by browser; reduced risk of client compromise | New risks: XSS, CSRF, SQL injection (server side) |

**In a Java EE context:**  
- Browser‑based clients are the standard (JSF, JSP, Servlets). Rich clients are rarely used except for internal tools (Java Web Start is obsolete).  
- Modern “rich” web apps (SPAs with React/Angular) blur the line, offering rich UX while being browser‑based.

---

## Activity 6 (12 marks) – Demonstrate an awareness of the implications of copyright, ownership and royalties

This activity requires a broad understanding of intellectual property (IP) issues in internet software development.

### 1. Copyright implications

**What is copyright?**  
Copyright protects original works of authorship (code, design, text, images, audio, video) from being copied, distributed, or adapted without permission.

**Implications for internet development:**
- **Using third‑party libraries** – Must comply with their licences (e.g., MIT, GPL, Apache). Some licences require you to release your own source code.
- **Copying code from websites** – Even small snippets may be copyrighted. Always check licence terms.
- **User‑generated content** – Websites that host user content (forums, social media) must respect the copyright of users and have processes to handle DMCA/takedown notices.
- **Open source vs proprietary** – Developers must not mix incompatible licences (e.g., GPL code with proprietary code).
- **Derivative works** – Modifying someone else’s software may create a derivative work; you need permission unless the licence allows it.

### 2. Ownership implications

**Who owns the software?**  
- **Employer vs employee** – In most jurisdictions, code written during employment belongs to the employer (unless a contract says otherwise).
- **Contractors and freelancers** – Ownership defaults to the creator unless a written agreement assigns rights to the client.
- **Joint ownership** – When multiple parties contribute, they may co‑own the copyright. This can complicate licensing and commercialisation.

**Implications:**
- **Clear contracts** – Always have written agreements specifying ownership of source code, designs, and other IP.
- **Contributor Licence Agreements (CLA)** – Open source projects often require contributors to grant the project the right to distribute the code.
- **Forking and distribution** – If you own the code, you can control its distribution. If you don’t, you may be limited.

### 3. Royalties implications

**Royalties** are payments made to the owner of a work for ongoing use (e.g., per copy sold, per user, or subscription).

**Implications for internet development:**
- **SaaS and subscription models** – Customers pay for access, not for the software itself. The developer (or company) collects revenue without per‑copy royalties.
- **Licensing fees** – When using a paid library or API, you may pay a royalty (one‑time or recurring). Example: a mapping API charges per 1000 requests.
- **Affiliate commissions** – If your site sells others’ products, you may earn a commission (a form of royalty).
- **Royalty‑free images/music** – “Royalty‑free” means you pay a one‑time fee, not per use. Still, you must respect the licence terms.

**Practical advice for developers:**
- Always read and understand licences for third‑party components.
- Keep records of all licences used (including open source).
- When selling a web application, clarify who owns the code (you or client) and what usage rights each party has.
- For mobile apps sold on stores, the platform takes a percentage (30% typical) – a form of royalty.

---

## Activity 7 (10 marks) – Identify security issues related to Internet development, and explain ways of handling each

| Security Issue | Description | Handling / Mitigation |
|----------------|-------------|----------------------|
| **1. Cross‑Site Scripting (XSS)** | Attacker injects malicious scripts into web pages viewed by other users. | – Sanitise and escape all user input.<br>– Use Content Security Policy (CSP).<br>– Output encode data based on context (HTML, JS, attribute). |
| **2. SQL Injection** | Attacker sends crafted SQL commands through input fields to manipulate the database. | – Use parameterised queries / prepared statements.<br>– Validate and sanitise inputs.<br>– Use stored procedures with limited permissions.<br>– Apply least‑privilege database accounts. |
| **3. Cross‑Site Request Forgery (CSRF)** | Attacker tricks a user into submitting an unwanted request (e.g., changing password) while authenticated. | – Use anti‑CSRF tokens in forms.<br>– Set SameSite cookie attribute.<br>– Require re‑authentication for sensitive actions. |
| **4. Broken Authentication** | Weak password policies, session fixation, insecure credential storage. | – Enforce strong password policies.<br>– Use multi‑factor authentication (MFA).<br>– Store passwords hashed (bcrypt, Argon2).<br>– Secure session management (random IDs, HTTPS, timeout). |
| **5. Sensitive Data Exposure** | Data (passwords, credit cards) transmitted or stored without encryption. | – Enforce HTTPS (TLS) everywhere.<br>– Encrypt sensitive data at rest.<br>– Do not log sensitive information.<br>– Use secure headers (HSTS). |
| **6. Security Misconfiguration** | Default passwords, unnecessary features enabled, verbose error messages. | – Harden server configurations.<br>– Disable directory listing, default accounts.<br>– Use automated scanners to detect misconfigurations.<br>– Keep software updated. |
| **7. Insecure File Uploads** | Users upload executable files that could be run on the server. | – Validate file type (magic bytes, not just extension).<br>– Store uploaded files outside web root.<br>– Scan for malware.<br>– Rename files to random names. |
| **8. Using Components with Known Vulnerabilities** | Libraries, frameworks, or plugins with unpatched security holes. | – Maintain an inventory of all dependencies.<br>– Regularly update components.<br>– Monitor vulnerability databases (e.g., CVE, NVD).<br>– Use dependency checkers (OWASP Dependency Check). |
| **9. Insufficient Logging & Monitoring** | Cannot detect or respond to attacks. | – Implement centralised logging.<br>– Log authentication attempts, access control failures, input validation errors.<br>– Set up alerting for suspicious patterns (e.g., brute force). |
| **10. Insecure API Endpoints** | APIs that expose data or allow unauthorised actions. | – Use proper authentication (OAuth2, API keys).<br>– Rate limiting.<br>– Validate input and output.<br>– Use HTTPS and avoid exposing internal details. |

**General best practices:**
- Follow the **OWASP Top 10** guidelines.
- Perform regular security testing (static analysis, penetration testing).
- Adopt a “security by design” mindset – consider security from the start of development.

---

**End of model answers – US 14930**