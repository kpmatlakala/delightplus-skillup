# Lecture 10: System Support and Security
## Systems Analysis and Design

> **Reference document** — content from this file relates primarily to **ITSD-14908** (IT Support). Use selectively for ITSD-14924's final SDLC phase content.

---

## Phase Description

**Systems Operation, Support, and Security** is the final phase of the SDLC. This phase begins when a system becomes operational and continues until end-of-life.

The deliverable is an **operational system that is properly maintained, supported, and secured**.

Key concerns:
- User expectations
- System performance
- Security requirements

> In most organisations, more than half of all IT department effort goes into supporting existing systems.

---

## User Support

After implementation, users continue to need support:
- **New employee training** — users must learn company systems as part of onboarding
- **Change training** — when systems are updated, users must be retrained
- **User training package** — materials, guides, and procedures to help users leverage the system effectively

---

## Maintenance Tasks

| Type | Description |
|---|---|
| **Corrective Maintenance** | Diagnoses and corrects errors in an operational system. Worst case: system failure requiring root cause analysis and permanent fix |
| **Adaptive Maintenance** | Adds enhancements to make the system easier to use. Can be harder than new development because changes must fit within existing constraints |
| **Perfective Maintenance** | Changes the system to make it more efficient, reliable, and maintainable. Good candidate for reengineering when a program has accumulated many changes |
| **Preventive Maintenance** | Proactive analysis of areas likely to cause trouble. Initiated by IT; reduces downtime and total cost of ownership (TCO) |

---

## System Performance Management

### Fault Management

The more complex the system, the harder it is to diagnose problems. The best strategy is **prevention through monitoring**.

### Performance Metrics

| Metric | Description |
|---|---|
| **Response time** | Time between a user request and system response |
| **Bandwidth** | Maximum data transfer rate of the network |
| **Throughput** | Actual data transmitted (Kbps, Mbps, Gbps) |
| **Turnaround time** | Total time from input submission to output delivery |
| **Benchmark testing** | Standardised tests to compare performance before/after changes |

IT uses performance data as input for **capacity planning**.

---

## System Security Overview

### The CIA Triangle

Security is built around three principles:

| Principle | Meaning |
|---|---|
| **Confidentiality** | Data is accessible only to authorised users |
| **Integrity** | Data is accurate and protected from unauthorised modification |
| **Availability** | Systems and data are accessible when needed |

A **security policy** defines the organisation's approach to protecting these three properties.

### Risk Management

Absolute security is not realistic. A risk management approach involves:

1. **Risk Identification** — what threats exist? (exploits, vulnerabilities)
2. **Risk Assessment** — how likely is each threat, and what is the impact?
3. **Risk Control** — choose a strategy:
   - **Avoidance** — eliminate the risk
   - **Mitigation** — reduce the likelihood or impact
   - **Transference** — transfer risk to a third party (e.g. insurance)
   - **Acceptance** — acknowledge and accept the residual risk

---

## Security Levels

Security must be addressed at six interrelated levels:

### 1. Physical Security

- Control physical access to operations centres, servers, and desktop computers
- Notebook computers require special consideration (portable = high theft risk)

### 2. Network Security

- **Encryption** of network traffic
- **Firewalls** — filter incoming and outgoing traffic based on rules
- **Virtual Private Networks (VPNs)** — secure tunnels over public networks
- **Wireless security** — WPA2/WPA3, separate guest networks
- Close unused **ports and services**

### 3. Application Security

- **Hardening** — remove unnecessary services, apply least privilege
- **Input validation** — prevent injection attacks
- **Application permissions** — restrict what each application can access
- **Patches and updates** — keep software current
- **Software logs** — record all significant application events

### 4. File Security

| Permission | Description |
|---|---|
| Read file | View file contents |
| Write file | Create or modify file |
| Execute file | Run the file as a program |
| Read directory | List directory contents |
| Write directory | Create, delete, or rename files in a directory |

Use **User Groups** to manage permissions at scale.

### 5. User Security

- **Privilege escalation prevention** — users should not be able to gain unauthorised elevated permissions
- **Identity management** — centralised control of user accounts and access rights
- **Password protection** — strong passwords, rotation policies, MFA
- **Social engineering awareness** — users trained to resist phishing and manipulation
- **Security tokens** — hardware or software-based second-factor authentication

### 6. Procedural Security

- **Operational security** — follow defined procedures for all sensitive tasks
- **Dumpster diving prevention** — paper shredders, secure disposal of printed documents and old media

---

## Backup and Disaster Recovery

### Backup Policies

- Define **backup media**, **rotation schedules**, and **offsiting** (storing backups off-premises)
- **Backup types**: full, incremental, differential
- Define **retention periods** for each backup type

### Business Continuity

| Concept | Description |
|---|---|
| **Business Continuity Plan (BCP)** | Documents how the organisation continues operating during and after a disaster |
| **Test plan** | Regular drills to validate that the BCP actually works |
| **Hot site** | A fully equipped backup facility ready to take over operations immediately |
| **Data replication** | Real-time or near-real-time copying of data to a secondary location |

---

*End of Lecture 10 reference document.*
