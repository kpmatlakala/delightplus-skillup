export type Module14930SpeakerNotes = {
  title: string;
  objectives: string;
  activityIndividual: string;
  activityGroup: string;
  summary: string;
};

export type Module14930SlideListItem = {
  slideNumber: number;
  id: string;
  title: string;
  type: "title" | "content" | "activity" | "summary" | "qa";
  content: string;
  notes: string;
  duration: number;
  phaseCards?: string[];
  cards?: string[];
  imageUrl?: string;
  imageAlt?: string;
};

export const module14930SpeakerNotes: Module14930SpeakerNotes = {
  title:
    "Developing Software for the Internet.\n\n" +
    "Use the learner guide as the main source and explain each idea in plain everyday language. Start with the message that internet software is not magic: it works because computers follow rules, exchange data in an organised way, and use extra methods to remember users and protect information.\n\n" +
    "This module should feel friendly and practical even for older learners or complete beginners. Define terms slowly, use real examples, and connect every concept to a familiar website or online service.",
  objectives:
    "Guide learners through the unit step by step:\n\n" +
    "• Introduce the learner guide, purpose, and assessment expectations.\n" +
    "• Explain network protocols, TCP/IP, RFC, ISO OSI, and the meaning of session-less communication.\n" +
    "• Show how state is maintained using session IDs, cookies, and related methods.\n" +
    "• Cover bandwidth, user-interface methods, ASP, copyright, ownership, royalties, version control, and internet security.",
  activityIndividual:
    "Use short explanation and matching tasks. Learners should define protocol, bandwidth, copyright, and session ID in their own words and connect each one to a simple internet example they already know.",
  activityGroup:
    "Use group discussion with common scenarios such as online banking, a school portal, a shopping site, or a login page. Ask learners to explain what protocol rules are being followed, how the site remembers the user, and what might go wrong if security is weak.",
  summary:
    "Close with the big idea: developing software for the internet is about far more than making a page appear on a screen. It also includes communication rules, performance, security, user experience, ownership, and responsible use of digital material.",
};

export const module14930SlideList: Module14930SlideListItem[] = [
  {
    slideNumber: 1,
    id: "14930-title",
    title: "Developing Software for the Internet",
    type: "title",
    content:
      "A learner-friendly guide to how internet applications communicate, remember users, deliver content, and stay secure.",
    notes: module14930SpeakerNotes.title,
    duration: 5,
    phaseCards: ["Guide", "Protocols", "Sessions", "Interfaces", "Security"],
  },
  {
    slideNumber: 2,
    id: "14930-guide-intro",
    title: "Learner Guide Introduction",
    type: "content",
    content:
      "This learner guide gives a full overview of the principles of developing software for the internet\n" +
      "• It forms part of the FETC: Information Technology: Systems Development qualification\n" +
      "• The modules are designed to build skills and knowledge step by step\n" +
      "• Learners are expected to attend workshops, participate, ask questions, and gather evidence for their PoE",
    notes:
      "Explain that this is not just theory. The guide prepares learners for practical activities, assessment tasks, and workplace evidence collection.",
    duration: 6,
    cards: ["Overview", "Qualification", "Workshops", "PoE"],
  },
  {
    slideNumber: 3,
    id: "14930-purpose-overview",
    title: "Purpose, Outcomes, and Assessment",
    type: "content",
    content:
      "Purpose of the unit standard\n" +
      "• Demonstrate an understanding of the principles of developing software for the internet\n" +
      "• Competence is shown through assessment activities, assignments, tasks, and workplace evidence\n" +
      "• A registered assessor checks the learner's portfolio of evidence to confirm competence",
    notes:
      "Make it clear that the assessment is about showing understanding with evidence, not only memorising terms.",
    duration: 6,
    cards: ["Purpose", "Outcomes", "Assessment", "Competence"],
  },
  {
    slideNumber: 4,
    id: "14930-unit-standard",
    title: "Unit Standard Snapshot",
    type: "content",
    content:
      "Learning Unit 1 summary\n" +
      "• Unit Standard Number: 14930\n" +
      "• NQF Level: 4\n" +
      "• Credits: 3\n" +
      "• Field: Physical, Mathematical, Computer and Life Sciences\n" +
      "• Sub-field: Construction, Information Technology and Computer Sciences",
    notes:
      "This slide gives the formal identity of the unit. Keep it brief but visible so learners know exactly which standard they are studying.",
    duration: 5,
  },
  {
    slideNumber: 5,
    id: "14930-assumed-learning",
    title: "What Learners Should Already Know",
    type: "content",
    content:
      "Learning assumed to be in place\n" +
      "• Fundamental English at about NQF Level 3\n" +
      "• Basic PC competency skills\n" +
      "• Willingness to ask questions and seek help from the facilitator when needed",
    notes:
      "Reassure learners that they do not need to be networking experts. Basic English, computer familiarity, and active participation are the main starting points.",
    duration: 5,
  },
  {
    slideNumber: 6,
    id: "14930-session-1-overview",
    title: "Session 1 — Network Issues Related to Internet Applications",
    type: "content",
    content:
      "Session 1 learning outcomes\n" +
      "• The internet uses a session-less network protocol\n" +
      "• Session-less design has important implications for developers\n" +
      "• The internet uses limited bandwidth\n" +
      "• Slow bandwidth affects application design and user experience",
    notes:
      "Tell learners that Session 1 answers four important questions: How do computers talk? Why does the website forget me? Why is the page slow? What should a developer do about it?",
    duration: 6,
    cards: ["Protocol", "State", "Bandwidth", "Design"],
  },
  {
    slideNumber: 7,
    id: "14930-protocols",
    title: "What Is a Protocol? What Is a Service?",
    type: "content",
    content:
      "Important definitions from the learner guide\n" +
      "• Protocol = a set of rules or a language used by computers and network devices to communicate\n" +
      "• Service = a function used by computer and network devices, such as file or print services\n" +
      "• Without protocols, devices would not understand one another properly",
    notes:
      "Pause here and let learners repeat the definition in their own words. A protocol is simply the agreed rulebook for communication.",
    duration: 6,
    cards: ["Rules", "Language", "Service", "Understanding"],
  },
  {
    slideNumber: 8,
    id: "14930-tcpip",
    title: "Networking Protocols — TCP/IP",
    type: "content",
    content:
      "TCP/IP stands for Transmission Control Protocol / Internet Protocol\n" +
      "• It is the main family of communication protocols used on the Internet\n" +
      "• The two best-known parts are TCP and IP\n" +
      "• It became the de facto standard for transmitting data over networks",
    notes:
      "Keep this slide simple: TCP/IP is the main internet family, and it helps computers send and receive data reliably.",
    duration: 6,
    cards: ["TCP", "IP", "Internet", "Standard"],
  },
  {
    slideNumber: 9,
    id: "14930-standards",
    title: "Introduction to Network Protocol Standards",
    type: "content",
    content:
      "Internet communication is guided by standards\n" +
      "• RFCs (Requests for Comment) describe many internet standards\n" +
      "• ISO standardised the ISO OSI network model\n" +
      "• ITU also publishes communication standards\n" +
      "• IEEE, RIPE, and PKCS are also important in networking and security",
    notes:
      "The learner guide mentions several standards bodies. Learners do not need to memorise every acronym, but they should know that internet communication follows agreed standards rather than random behaviour.",
    duration: 7,
    cards: ["RFC", "ISO", "ITU", "IEEE"],
  },
  {
    slideNumber: 10,
    id: "14930-analogy",
    title: "Why Network Communication Uses Layers",
    type: "content",
    content:
      "Use the simple translator example\n" +
      "• Two foreigners cannot speak directly to each other\n" +
      "• They use translators to help the message move correctly\n" +
      "• The message then travels through a real medium such as sound or a phone line\n" +
      "• Computer networks also use layers so messages can be passed correctly from one level to the next",
    notes:
      "This is the learner-guide explanation behind Figure 1.1. It is the best beginner-friendly way to show why layered communication exists.",
    duration: 7,
    cards: ["Speaker", "Translator", "Medium", "Receiver"],
  },
  {
    slideNumber: 11,
    id: "14930-virtual-real",
    title: "Virtual Communication vs Real Communication",
    type: "content",
    content:
      "The learner guide distinguishes two directions of communication\n" +
      "• Horizontal / virtual communication = the message appears to move across matching layers\n" +
      "• Vertical / real communication = each layer passes information to the next real layer below or above it\n" +
      "• This is why network models are shown as stacked layers",
    notes:
      "Do not overcomplicate this. The main point is that layered systems organise communication into smaller, manageable jobs.",
    duration: 6,
  },
  {
    slideNumber: 12,
    id: "14930-osi-vs-tcpip",
    title: "TCP/IP vs ISO OSI",
    type: "content",
    content:
      "The two models are related but not identical\n" +
      "• TCP/IP uses 4 layers\n" +
      "• ISO OSI uses 7 layers\n" +
      "• They are especially similar in the network and transport areas\n" +
      "• On the Internet, some lower-level link and physical work still relates to OSI-style ideas",
    notes:
      "Learners mainly need to know that OSI is a 7-layer reference model and TCP/IP is the internet family used in practice.",
    duration: 7,
    cards: ["4 layers", "7 layers", "Reference", "Practice"],
  },
  {
    slideNumber: 13,
    id: "14930-stateless",
    title: "The Internet Uses a Session-Less Protocol",
    type: "content",
    content:
      "Web communication often happens through HTTP\n" +
      "• HTTP is session-less or stateless\n" +
      "• The server does not automatically remember the user from one request to the next\n" +
      "• Every new request can look like a fresh visit unless the application adds a memory method",
    notes:
      "This is one of the most important outcomes in the guide. Say it simply: HTTP does not naturally remember the user after each click.",
    duration: 7,
    cards: ["HTTP", "Stateless", "No memory", "New request"],
  },
  {
    slideNumber: 14,
    id: "14930-implications-state",
    title: "Implications of Session-Less Application Development",
    type: "content",
    content:
      "Because HTTP does not remember the user automatically\n" +
      "• Developers must create ways to track the visitor\n" +
      "• The most common approach is to use a unique session ID\n" +
      "• If the session method is weak, a site can become insecure or easy to hijack\n" +
      "• Good session management supports both usability and security",
    notes:
      "Connect this to online banking, shopping, or school portals. If the system cannot keep track of the user correctly, the experience becomes frustrating or unsafe.",
    duration: 7,
  },
  {
    slideNumber: 15,
    id: "14930-maintaining-state",
    title: "Maintaining State in a Web Application",
    type: "content",
    content:
      "A session ID is often used as the system's memory token\n" +
      "• It identifies the client browser or authenticated user\n" +
      "• It lets the user move between pages without logging in again every time\n" +
      "• The server uses background processes to link the session ID with permissions and access",
    notes:
      "Call the session ID a 'temporary identity tag' for the user's visit. That simple phrase helps many learners understand the concept immediately.",
    duration: 7,
    cards: ["Session ID", "Browser", "User access", "Temporary memory"],
  },
  {
    slideNumber: 16,
    id: "14930-session-methods",
    title: "Three Main Ways to Send Session IDs",
    type: "content",
    content:
      "Developers commonly send session information in three ways\n" +
      "• In the URL through HTTP GET requests\n" +
      "• In hidden form fields sent through HTTP POST\n" +
      "• Through cookies stored and returned by the browser",
    notes:
      "Learners do not need deep implementation detail yet, but they should recognise these three methods and know that each has strengths and weaknesses.",
    duration: 6,
    cards: ["URL", "POST fields", "Cookies"],
  },
  {
    slideNumber: 17,
    id: "14930-session-methods-compare",
    title: "URL, Hidden Fields, and Cookies — Simple Comparison",
    type: "content",
    content:
      "Quick comparison\n" +
      "• URL-based IDs are easy to share but can appear in browser history and logs\n" +
      "• Hidden fields are less obvious but depend on proper form handling\n" +
      "• Cookies are widely used and convenient, but some users disable them and poor handling can create risk",
    notes:
      "This slide condenses a long learner-guide section into a classroom-friendly comparison. Focus on idea, not memorising every technical detail.",
    duration: 7,
  },
  {
    slideNumber: 18,
    id: "14930-session-strength",
    title: "A Good Session ID Must Be Strong",
    type: "content",
    content:
      "The learner guide highlights two critical qualities\n" +
      "• Randomness = it must look unpredictable and not follow an easy pattern\n" +
      "• Length = it should be long enough to make guessing difficult\n" +
      "• Do not build session IDs from obvious things like time, date, or IP address alone",
    notes:
      "Explain that if an attacker can predict the next session ID, they may be able to impersonate another user. Strong randomness and sufficient length reduce that risk.",
    duration: 7,
    cards: ["Randomness", "Length", "Hard to guess", "Safer design"],
  },
  {
    slideNumber: 19,
    id: "14930-session-hijacking",
    title: "Session Hijacking and Basic Protection",
    type: "content",
    content:
      "Session hijacking happens when an attacker steals or guesses another user's session ID\n" +
      "• Observation / sniffing can happen on unencrypted HTTP traffic\n" +
      "• Brute force can happen if the session ID is weak or too short\n" +
      "• HTTPS and strong session design help reduce this risk",
    notes:
      "This slide should feel practical and serious. It shows why session management is not just a technical detail — it protects real users.",
    duration: 7,
    cards: ["Observation", "Brute force", "Hijack risk", "HTTPS"],
  },
  {
    slideNumber: 20,
    id: "14930-bandwidth-intro",
    title: "What Is Network Bandwidth?",
    type: "content",
    content:
      "Bandwidth is a major measure of network speed\n" +
      "• It means how much data can pass through a connection over time\n" +
      "• It is usually measured in bits per second (bps)\n" +
      "• More bandwidth usually means better performance, but real speed is also affected by latency and overhead",
    notes:
      "Keep the explanation concrete: bandwidth is like the width of a road for data. A wider road usually lets more traffic pass.",
    duration: 6,
    cards: ["Speed", "Capacity", "bps", "Performance"],
  },
  {
    slideNumber: 21,
    id: "14930-bandwidth-design",
    title: "Implications of Slow Bandwidth on Design",
    type: "content",
    content:
      "Slow bandwidth affects user experience\n" +
      "• Large images and large amounts of code increase waiting time\n" +
      "• Heavy pages feel slow and frustrating to users\n" +
      "• Older computers and slower browsers may struggle even more\n" +
      "• Good application design keeps pages lighter and easier to load",
    notes:
      "Use the words 'perceived performance' if needed, but explain it simply: users dislike waiting too long for a page to load.",
    duration: 6,
  },
  {
    slideNumber: 22,
    id: "14930-session-2-overview",
    title: "Session 2 — User Interface Methods for Internet Applications",
    type: "content",
    content:
      "This session focuses on how internet applications present themselves to the user\n" +
      "• Identify different user interface methods\n" +
      "• Explain each method\n" +
      "• Understand the implications of each approach for users and developers",
    notes:
      "Frame this as a design choice: the way an application is presented changes usability, maintenance, security, and performance.",
    duration: 5,
    cards: ["UI methods", "Benefits", "Drawbacks", "Design choice"],
  },
  {
    slideNumber: 23,
    id: "14930-asp-intro",
    title: "ASP — Active Server Pages",
    type: "content",
    content:
      "ASP stands for Active Server Pages\n" +
      "• It was developed by Microsoft for interactive web applications\n" +
      "• ASP pages can show different content depending on the user, database, or settings\n" +
      "• ASP runs on the server side, not directly in the client's browser",
    notes:
      "Make sure learners understand the phrase 'server side': the web server does the main work and then sends the result back to the browser.",
    duration: 7,
    cards: ["ASP", "Dynamic pages", "Server-side", "Database links"],
  },
  {
    slideNumber: 24,
    id: "14930-asp-objects",
    title: "The Basic Objects of Active Server Pages",
    type: "content",
    content:
      "The learner guide lists seven main ASP objects\n" +
      "• Application\n" +
      "• ObjectContext\n" +
      "• Request\n" +
      "• Response\n" +
      "• Server\n" +
      "• Session\n" +
      "• ASPError",
    notes:
      "Do not expect learners to memorise every object in depth. The aim is recognition and awareness that server-side environments provide built-in objects to manage requests, responses, sessions, and errors.",
    duration: 7,
    cards: ["Request", "Response", "Session", "ASPError"],
  },
  {
    slideNumber: 25,
    id: "14930-rich-browser",
    title: "Rich Clients and Browser-Based Clients",
    type: "content",
    content:
      "Two common interface styles\n" +
      "• Browser-based clients rely heavily on the web browser and the server\n" +
      "• Rich clients often install more functionality locally on the user's device\n" +
      "• The best choice depends on network reliability, security, and the tasks the user must perform",
    notes:
      "Tell learners that browser clients are thinner and more universal, while rich clients may offer stronger local features but need more installation and maintenance.",
    duration: 7,
    cards: ["Browser", "Rich client", "Thin", "Installed features"],
  },
  {
    slideNumber: 26,
    id: "14930-browser-guidelines",
    title: "Design Issues for Browser Clients",
    type: "content",
    content:
      "Browser clients are popular because they are familiar and widely available\n" +
      "• They are easy to deploy and update\n" +
      "• They can be less responsive when latency is high\n" +
      "• Client-side validation can improve user experience but must not replace server-side validation\n" +
      "• Browsers mainly communicate with the server using HTTP GET and HTTP POST",
    notes:
      "This slide condenses the long learner-guide discussion on network, security, platform, validation, and communication with the server.",
    duration: 7,
  },
  {
    slideNumber: 27,
    id: "14930-session-3-overview",
    title: "Session 3 — Copyright, Ownership, and Royalties",
    type: "content",
    content:
      "This session helps learners use internet material responsibly\n" +
      "• Show awareness of copyright issues\n" +
      "• Show awareness of ownership issues\n" +
      "• Show awareness of royalty issues related to internet development",
    notes:
      "Make it practical: when building websites, learners often reuse images, text, logos, code, and media. They must understand the rules.",
    duration: 5,
    cards: ["Copyright", "Ownership", "Royalties"],
  },
  {
    slideNumber: 28,
    id: "14930-copyright-plagiarism",
    title: "What Are Copyright and Plagiarism?",
    type: "content",
    content:
      "Copyright protects original works of authorship\n" +
      "• It applies to both published and unpublished work\n" +
      "• Public-domain material is not covered in the same way\n" +
      "• Plagiarism means using another person's ideas or words as if they were your own",
    notes:
      "Use school-style examples here: copying text into a project without credit is plagiarism, and copying protected media without permission can also be a copyright issue.",
    duration: 7,
    cards: ["Original work", "Protection", "Public domain", "Plagiarism"],
  },
  {
    slideNumber: 29,
    id: "14930-web-copyright",
    title: "What You Can and Cannot Do on a Web Page",
    type: "content",
    content:
      "When creating a web page\n" +
      "• You can link to other websites and use clearly free materials correctly\n" +
      "• You should cite your sources when quoting or paraphrasing\n" +
      "• You should not copy and paste another site's full content, logos, graphics, or emails without permission\n" +
      "• When in doubt, ask permission or use copyright-safe resources",
    notes:
      "This is one of the most useful practical slides in the whole module because learners often assume everything on the internet is free to use. Correct that misconception clearly.",
    duration: 7,
  },
  {
    slideNumber: 30,
    id: "14930-ownership-royalty",
    title: "Ownership and Royalty Issues",
    type: "content",
    content:
      "Ownership and licensing matter in internet development\n" +
      "• Domain names, content, code, and databases can involve ownership questions\n" +
      "• If something is important to a site, the owner may need clear rights or a broad licence\n" +
      "• Royalty-free means material can often be used without paying for each use\n" +
      "• Contracts should clearly define who owns adapted software and how profit-sharing or royalties will work",
    notes:
      "Keep it business-focused: ownership must be discussed at the start of a project, not only after the work is finished.",
    duration: 7,
    cards: ["Domain names", "Licensing", "Royalty-free", "Contracts"],
  },
  {
    slideNumber: 31,
    id: "14930-session-4-overview",
    title: "Session 4 — Version Control and Security Issues",
    type: "content",
    content:
      "The final session looks at protecting internet applications\n" +
      "• Identify version-control issues related to internet development\n" +
      "• Identify security issues related to internet development\n" +
      "• Explain practical ways of handling those security issues",
    notes:
      "Introduce this session as the protection layer of internet development: track the changes, defend the system, and protect user information.",
    duration: 5,
    cards: ["Track changes", "Protect systems", "Protect users"],
  },
  {
    slideNumber: 32,
    id: "14930-version-control-security",
    title: "Version Control and Internet Security Basics",
    type: "content",
    content:
      "Version control helps teams manage changes to code and recover earlier work\n" +
      "• It supports collaboration and rollback when mistakes happen\n" +
      "• Internet security uses rules and measures to reduce attacks over the internet\n" +
      "• Encryption, careful authentication, and secure design all play a role",
    notes:
      "If learners know Git, connect version control to that. If not, explain it simply as a reliable system for tracking and restoring changes.",
    duration: 6,
    cards: ["Track", "Compare", "Restore", "Secure"],
  },
  {
    slideNumber: 33,
    id: "14930-firewall-token",
    title: "Security Tokens and Firewalls",
    type: "content",
    content:
      "Two common security controls mentioned in the guide\n" +
      "• Security tokens can generate short-lived codes to confirm a user's identity\n" +
      "• Firewalls control traffic between networks and block dangerous or unauthorised traffic\n" +
      "• Firewalls also create checkpoints between private systems and the public internet",
    notes:
      "Use familiar examples like banking apps sending a one-time code and school or company networks using firewalls to protect internal systems.",
    duration: 6,
    cards: ["Token", "6-digit code", "Firewall", "Checkpoint"],
  },
  {
    slideNumber: 34,
    id: "14930-security-risks",
    title: "Key Internet Security Risks",
    type: "content",
    content:
      "The learner guide mentions several important risk areas\n" +
      "• Information privacy and personal data leakage\n" +
      "• Denial of service and disruption of services\n" +
      "• E-commerce fraud and financial harm\n" +
      "• Attacks on critical systems and infrastructure\n" +
      "• Abuse of server logs and confidential usage data",
    notes:
      "This slide helps learners see that internet security is not only about passwords. It also affects services, business trust, and personal privacy.",
    duration: 7,
  },
  {
    slideNumber: 35,
    id: "14930-security-handling",
    title: "How to Handle Security Issues",
    type: "content",
    content:
      "Simple handling methods\n" +
      "• Use HTTPS to protect data in transit\n" +
      "• Use strong authentication and strong session IDs\n" +
      "• Validate input and limit unnecessary data exposure\n" +
      "• Use firewalls, access controls, and careful logging policies\n" +
      "• Respect personal information and do not publish identifiable data without permission",
    notes:
      "The user asked to make this understandable for everyone. Keep the main idea simple: protect the data, protect the session, protect the user, and protect the organisation.",
    duration: 7,
    cards: ["HTTPS", "Authentication", "Validation", "Privacy"],
  },
  {
    slideNumber: 36,
    id: "14930-practical",
    title: "Guided Practical — Explain the Internet in Plain Language",
    type: "activity",
    content:
      "Small-group knowledge check\n" +
      "• Define protocol, bandwidth, and copyright in your own words\n" +
      "• Explain why HTTP is session-less\n" +
      "• Name one way a website remembers a user\n" +
      "• Give one example of a security risk and one way to reduce it\n" +
      "• Share your answer so another learner could understand it easily",
    notes: module14930SpeakerNotes.activityGroup,
    duration: 9,
  },
  {
    slideNumber: 37,
    id: "14930-summary",
    title: "14930 Wrap-Up",
    type: "summary",
    content:
      "Key takeaways\n" +
      "• Internet applications depend on protocols and standards to communicate\n" +
      "• HTTP is session-less, so developers must manage user state carefully\n" +
      "• Bandwidth, interface choice, and security affect the quality of the user experience\n" +
      "• Copyright, ownership, royalties, and privacy are part of responsible internet development",
    notes: module14930SpeakerNotes.summary,
    duration: 4,
  },
];
