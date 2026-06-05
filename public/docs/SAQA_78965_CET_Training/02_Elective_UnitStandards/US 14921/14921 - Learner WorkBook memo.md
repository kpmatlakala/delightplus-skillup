# Model Answers – US 14921: Describe the types of computer systems and associated hardware configurations

**Unit Standard ID:** 14921  
**NQF Level:** 4  
**Credits:** 6  
**Qualification:** FETC: Information Technology: Systems Development (SAQA ID 78965)

---

## Activity 1 (4 marks) – Explain the difference between a Stand‑Alone Computer and a Networked Computer

| Feature | Stand‑Alone Computer | Networked Computer |
|---------|----------------------|--------------------|
| **Definition** | A computer that operates independently without being connected to any other computer or network. | A computer that is connected to other computers or devices via a network (LAN, WAN, or the Internet). |
| **Resource sharing** | Cannot share files, printers, or internet connections with other computers unless physically moved or using removable media. | Can share resources such as files, printers, scanners, and internet bandwidth. |
| **Communication** | No direct communication with other computers. | Can communicate instantly via email, messaging, network drives, and shared applications. |
| **Security risks** | Lower risk of external attacks (no network exposure), but still vulnerable to physical or media‑based malware. | Higher risk – must have firewalls, antivirus, and access controls to protect against network‑borne threats. |
| **Management** | Each computer must be managed and updated individually. | Centralised management via servers (e.g., updates, user accounts, backups). |
| **Cost** | Lower initial cost (no networking hardware required). | Higher initial cost (requires network interface, cables/switches, server infrastructure). |

---

## Activity 2 (5 marks) – Write an explanation of midrange computers, or midrange systems and client–server model

**Midrange computers** (also called midrange systems) are a class of computer systems that fall between mainframe computers and small servers or workstations in terms of processing power, storage capacity, and cost.

**Characteristics:**
- More powerful than a typical file server or desktop PC, but less powerful than a mainframe.
- Often used as **enterprise servers** for medium‑sized businesses.
- Support multiple users simultaneously (typically dozens to a few hundred).
- Examples: IBM AS/400 (now IBM i), HP 3000, older DEC VAX systems.

**Client–Server Model:**  
The client–server model is a distributed computing architecture where tasks are split between service providers (servers) and service requesters (clients).

- **Server** – A powerful computer (often a midrange or high‑end system) that provides services such as file storage, databases, email, web hosting, or printing.
- **Client** – A user’s workstation (PC, laptop, thin client) that requests services from the server and displays the results.

**How they work together:**
1. The client sends a request (e.g., “open file”, “query database”) to the server over a network.
2. The server processes the request and sends back the response.
3. The client presents the result to the user.

**Why midrange computers are often used as servers:**
- They offer a good balance of performance, reliability, and cost.
- They support multiuser operating systems with robust security and resource management.
- They can handle heavy I/O (disk and network) required for business databases and transaction processing.

**Example in a college:**  
A midrange server might run the student registration system. Lecturers’ and admin PCs (clients) connect to it via the network to register students, view class lists, and update marks.

---

## Activity 3 (6 marks) – Give the description of characteristics of the configurations

*This activity refers to describing the characteristics of different computer system configurations (past, present, and future). Based on the unit standard’s learning outcomes, the following characteristics apply to each era:*

### Past configurations (e.g., 1970s–1990s mainframes and early PCs)

| Characteristic | Description |
|----------------|-------------|
| **Size** | Very large (mainframes filled rooms) or bulky desktop/tower cases. |
| **Processing power** | Low by modern standards (MHz clock speeds, single core). |
| **Memory** | Very limited (KB to a few MB of RAM). |
| **Storage** | Magnetic tape, floppy disks, small hard drives (tens of MB). |
| **User interface** | Command line (CLI) or simple text‑based menus. |
| **Networking** | Proprietary networks (e.g., SNA for IBM) or early Ethernet. |
| **Power consumption** | High (mainframes required special cooling and power). |

### Present configurations (current typical systems)

| Characteristic | Description |
|----------------|-------------|
| **Size** | Desktops, laptops, tablets, smartphones – compact and portable. |
| **Processing power** | Multi‑core CPUs (2–16 cores), clock speeds 2–5 GHz. |
| **Memory** | 4GB to 64GB or more of RAM. |
| **Storage** | SSDs (fast), HDDs (large capacity), cloud storage. |
| **User interface** | GUI (Windows, macOS, Linux GUI), touch, voice. |
| **Networking** | Gigabit Ethernet, Wi‑Fi 5/6, Bluetooth, 4G/5G. |
| **Power consumption** | Energy‑efficient designs (low‑power CPUs, sleep modes). |

### Future configurations (emerging trends)

| Characteristic | Description |
|----------------|-------------|
| **Size** | Wearable (watches, glasses), implantable, embedded in everyday objects (IoT). |
| **Processing power** | Quantum computing, neuromorphic chips, AI accelerators. |
| **Memory** | Persistent memory (e.g., MRAM, ReRAM), terabytes of RAM in consumer devices. |
| **Storage** | DNA‑based storage, holographic storage, ultra‑fast NVMe over fabrics. |
| **User interface** | Brain‑computer interfaces (BCI), augmented reality (AR), natural language conversation. |
| **Networking** | Tbps wireless (terahertz), satellite internet (Starlink), mesh networks. |
| **Power consumption** | Ultra‑low‑power, energy harvesting (solar, RF, motion). |

---

## Activity 4 (4 marks) – Write an understanding of the environmental requirements of the configurations

Environmental requirements refer to the physical conditions that computer systems need to operate reliably and safely.

**Key environmental factors:**

1. **Temperature**  
   - Ideal range: 18°C – 24°C (desktops/servers); wider range for industrial or mobile devices.  
   - Too hot: overheating, component failure, thermal throttling.  
   - Too cold: condensation, hard drive lubrication issues.

2. **Humidity**  
   - Ideal relative humidity: 40% – 60%.  
   - Too dry: increased risk of electrostatic discharge (ESD) damage.  
   - Too humid: condensation causing short circuits and corrosion.

3. **Power supply**  
   - Clean, stable voltage (within ±5% of nominal).  
   - Protection against surges, spikes, and brownouts using UPS (uninterruptible power supply) and surge protectors.  
   - Backup power for critical systems (generators, redundant power supplies).

4. **Ventilation and cooling**  
   - Adequate airflow around equipment.  
   - Server rooms require precision air conditioning (CRAC units).  
   - Dust filters prevent clogging of fans and heatsinks.

5. **Physical security**  
   - Locked server rooms, racks, and data centres to prevent unauthorised access or theft.  
   - Fire suppression systems (e.g., inert gas, not water sprinklers) for server rooms.

6. **Space and mounting**  
   - Rack‑mountable servers require standard 19‑inch racks with proper spacing for airflow.  
   - Floor loading for heavy mainframes or storage arrays.

7. **Noise and vibration**  
   - Server rooms are noisy – personnel should wear hearing protection if entering frequently.  
   - Vibration can damage hard drives (especially spinning disks).

**South African context:**  
- Unstable power grid requires UPS and surge protection for all critical systems.  
- High ambient temperatures (especially in summer) may need additional cooling.  
- Dusty rural environments may require dust‑filtered cabinets.

---

## Activity 5 (6 marks) – Describe categories of computer system applications

Computer system applications can be grouped into several broad categories based on their purpose, scale, and user interaction.

| Category | Description | Examples |
|----------|-------------|----------|
| **Personal productivity** | Software used by individuals to perform daily tasks. | Word processors, spreadsheets, email clients, web browsers. |
| **Enterprise applications** | Systems used by organisations to manage business processes. | ERP (SAP, Oracle), CRM (Salesforce), HRMS, accounting software. |
| **Communication and collaboration** | Tools that enable people to work together. | Email servers, instant messaging (Slack, Teams), video conferencing (Zoom, Meet). |
| **Data management** | Applications for storing, retrieving, and analysing data. | Database management systems (MySQL, Oracle, SQL Server), data warehouses. |
| **E‑commerce** | Systems that support buying and selling online. | Online storefronts (Shopify, Magento), payment gateways, shopping cart software. |
| **Scientific and engineering** | Specialised applications for research and design. | CAD (AutoCAD), simulation (MATLAB), statistical analysis (SPSS, R). |
| **Multimedia and content creation** | Applications for creating and editing media. | Graphics (Photoshop), video editing (Premiere Pro), audio (Audacity). |
| **Operating systems and utilities** | Software that manages hardware and provides a platform for other applications. | Windows, Linux, macOS, antivirus, backup tools, file managers. |
| **Web and cloud services** | Applications delivered over the Internet, often with a browser interface. | Google Docs, Netflix, Dropbox, Office 365. |
| **Embedded and real‑time systems** | Software built into devices to control hardware in real time. | Car engine control unit, medical monitors, smart thermostat. |

---

## Activity 6 (5 marks) – Explain the Information Systems and Computer Applications

**Information System (IS)** – An integrated set of components (hardware, software, databases, networks, people, and procedures) that collects, processes, stores, and distributes information to support decision‑making, coordination, and control in an organisation.

**Computer Application** – A software program (or suite) designed to perform specific tasks for a user or another program. Computer applications are one component of an information system.

### Relationship between IS and computer applications:

- An **information system** is a broader concept that includes not only computer applications but also the people, processes, and infrastructure that make the system work.
- **Computer applications** are the software tools that users interact with to input, process, or retrieve data from the information system.

**Example – Student Registration System:**  
- **Computer application(s):** The registration website, the mobile app, the database management software.  
- **Information system:** The entire registration system includes the applications, the database server, the network, the IT staff who maintain it, the policies for course registration, and the lecturers/admins who use the system.

### Types of Information Systems (in an organisational context):

| Type | Purpose | Users | Example Application |
|------|---------|-------|---------------------|
| **TPS (Transaction Processing System)** | Process routine transactions | Clerks, cashiers | Point‑of‑sale (POS), payroll |
| **MIS (Management Information System)** | Produce summary reports for middle management | Department managers | Sales report generator |
| **DSS (Decision Support System)** | Help managers make semi‑structured decisions | Analysts, managers | Financial modelling tool |
| **ESS (Executive Support System)** | Support strategic decisions at top level | Executives | Dashboard with KPIs |
| **OAS (Office Automation System)** | Automate office tasks | All employees | Email, word processing |
| **KMS (Knowledge Management System)** | Capture and share knowledge | Employees | Company wiki, intranet |

---

## Activity 7 (4 marks) – Explain the categories of computer system applications

*(This activity overlaps with Activity 5 but can be answered more concisely.)*

Computer system applications fall into the following main categories based on how they are used and who uses them:

1. **End‑user applications (productivity tools)** – Software used directly by individuals for everyday tasks. Examples: word processors, spreadsheets, presentation software, web browsers.

2. **Back‑end enterprise applications** – Run on servers and support business operations. Examples: ERP, CRM, supply chain management, accounting systems.

3. **Communication and collaboration applications** – Enable people to share information and work together. Examples: email servers, instant messaging platforms, video conferencing tools, shared calendars.

4. **Data storage and management applications** – Organise, store, and retrieve structured or unstructured data. Examples: database management systems (DBMS), data warehouses, file systems.

5. **Real‑time and embedded applications** – Run on specialised hardware to control physical processes. Examples: anti‑lock braking system (ABS) software, medical device firmware, industrial PLCs.

6. **Web and cloud applications** – Hosted on remote servers and accessed via a browser or thin client. Examples: Google Docs, Salesforce, Dropbox, online banking.

7. **Scientific and engineering applications** – Perform complex calculations, simulations, or design tasks. Examples: CAD, finite element analysis, computational fluid dynamics.

8. **Multimedia applications** – Create or play audio, video, images, and animations. Examples: media players, editing software, streaming apps.

Each category has distinct performance requirements (e.g., real‑time needs low latency; data management needs high I/O throughput; web apps need scalability).  

---

**End of model answers – US 14921**