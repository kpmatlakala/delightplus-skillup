export type Module14933SpeakerNotes = {
  title: string;
  objectives: string;
  activityIndividual: string;
  activityGroup: string;
  summary: string;
};

export type Module14933SlideListItem = {
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

export const module14933SpeakerNotes: Module14933SpeakerNotes = {
  title:
    "Create Web Applications with Scripting.\n\n" +
    "Teach this unit as a calm two-day practical journey. Keep examples close to CET life: a learner profile page, a notice board, a lab booking form, or a community event page.\n\n" +
    "The goal is not a complicated website. The goal is that every learner can plan, build, and test one small page with confidence.",
  objectives:
    "Keep the learner guide content, but teach it in a cleaner session flow:\n\n" +
    "• Day 1 covers Sessions 1–3: define the web, website, multimedia, and web-based multimedia; plan and design the page; then build the first HTML structure with media tags.\n" +
    "• Day 2 covers Sessions 4–5: improve the page with CSS and JavaScript, then test, fix, and finalise it.\n" +
    "• Keep theory short, clear, and self-explanatory on the projector.\n" +
    "• Use practical work at the end of each day so understanding becomes visible.",
  activityIndividual:
    "Use short, visible tasks.\n\n" +
    "Let learners choose a simple page idea, sketch it, prepare legal and suitable content, then build it one piece at a time. Stop often so they can explain what they just changed.",
  activityGroup:
    "Use pair work and peer review.\n\n" +
    "Pairs can compare layouts, test each other's pages, spot broken links or unclear text, and suggest one improvement for usability or accessibility.",
  summary:
    "End with a small showcase and checklist. Ask learners to explain the page purpose, the target audience, which tags they used, what the script does, and how they tested the final page.",
};

export const module14933SlideList: Module14933SlideListItem[] = [
  {
    slideNumber: 1,
    id: "14933-title",
    title: "Create Web Applications with Scripting",
    type: "title",
    content:
      "A 2-day practical unit where Day 1 covers Sessions 1–3 and Day 2 finishes Sessions 4–5 with stronger hands-on work.",
    notes: module14933SpeakerNotes.title,
    duration: 5,
    phaseCards: ["Session 1", "Session 2", "Session 3", "Session 4", "Session 5"],
  },
  {
    slideNumber: 2,
    id: "14933-session-roadmap",
    title: "Unit Structure — Day 1 and Day 2",
    type: "content",
    content:
      "This unit is organised by sessions again\n" +
      "• Day 1 = Session 1 to Session 3\n" +
      "• Session 1 explains the web, websites, multimedia, and why it matters\n" +
      "• Session 2 focuses on planning, audience, layout, and design\n" +
      "• Session 3 introduces text, graphics, and the HTML tags that place media on a page\n" +
      "• Day 2 = Session 4 and Session 5, with more practical work for styling, scripting, testing, and finishing",
    notes: module14933SpeakerNotes.objectives,
    duration: 6,
    cards: ["Day 1: Sessions 1–3", "Day 2: Sessions 4–5"],
  },
  {
    slideNumber: 3,
    id: "14933-session1-overview",
    title: "Start with the Web, Website, and Multimedia",
    type: "content",
    content:
      "Before learners can build a page, they must understand the basic words used in the guide\n" +
      "• What is the Web?\n" +
      "• What is a website?\n" +
      "• What is multimedia?\n" +
      "• What is web-based multimedia?\n" +
      "• Why should a developer think about the user before building anything?",
    notes:
      "This is the opening teaching frame for Session 1. Slow down here so the rest of the unit makes sense.",
    duration: 6,
    cards: ["Web", "Website", "Multimedia", "User thinking"],
  },
  {
    slideNumber: 4,
    id: "14933-what-is-web",
    title: "What Is the Web?",
    type: "content",
    content:
      "Definition: The Web is the part of the Internet that allows people to open and move through linked information in a browser.\n" +
      "• A browser such as Chrome or Edge is used to view it\n" +
      "• Links connect one page to another\n" +
      "• URLs are the addresses used to find pages\n" +
      "• The information is stored on servers and shown when the user requests it",
    notes:
      "Make the difference between internet and web clear and simple. The web is one service people use on the internet.",
    duration: 6,
    cards: ["Browser", "Links", "URL", "Server"],
  },
  {
    slideNumber: 5,
    id: "14933-what-is-website",
    title: "What Is a Website?",
    type: "content",
    content:
      "Definition: A website is a collection of related web pages under one name or address.\n" +
      "• It usually begins with a home page\n" +
      "• It may include pages such as About, Contact, Products, Services, or Forms\n" +
      "• It is stored on a server and opened through a browser\n" +
      "• A website may be simple, informative, or interactive depending on its purpose",
    notes:
      "Use everyday examples such as a school site, a shop site, or a college notice page.",
    duration: 6,
    cards: ["Home page", "Related pages", "Browser", "Purpose"],
  },
  {
    slideNumber: 6,
    id: "14933-what-is-multimedia",
    title: "What Is Multimedia?",
    type: "content",
    content:
      "Definition: Multimedia refers to using more than one type of media to present information.\n" +
      "1. Text = written words that explain the message\n" +
      "2. Images = photos, graphics, and illustrations that make content visual\n" +
      "3. Audio = sound, music, or voice that people can hear\n" +
      "4. Video or animation = moving visuals that show action or change",
    notes:
      "This should read clearly from the projector. Let learners point out examples they already know from websites or apps.",
    duration: 7,
    cards: ["Text", "Images", "Audio", "Video/Animation"],
  },
  {
    slideNumber: 7,
    id: "14933-web-based-multimedia",
    title: "What Is Web-Based Multimedia?",
    type: "content",
    content:
      "Definition: Web-based multimedia means a website uses multiple forms of media to present information and allow interaction.\n" +
      "• Text gives the message\n" +
      "• Images make the message more visual\n" +
      "• Audio, video, or animation make the page more engaging\n" +
      "• The user can often click, type, choose, or control what happens next",
    notes:
      "Emphasise the link between the earlier ideas: a website becomes web-based multimedia when it uses several media types together.",
    duration: 7,
    cards: ["Text", "Images", "Audio/Video", "Interaction"],
  },
  {
    slideNumber: 8,
    id: "14933-session1-demo",
    title: "Demo — Media on a Website Is Placed with HTML Tags",
    type: "content",
    content:
      "When we demonstrate a webpage, we can show that the media is placed using HTML tags\n" +
      "• <h1> creates the heading text\n" +
      "• <p> adds a paragraph\n" +
      "• <img> places an image on the page\n" +
      "• <a> creates a clickable link\n" +
      "• <audio> and <video> can add sound and video when needed",
    notes:
      "This directly connects the guide's multimedia ideas to the coding learners will see later. It answers the question: how does multimedia appear inside a website?",
    duration: 8,
    cards: ["<h1>", "<p>", "<img>", "<a>", "<audio>/<video>"],
  },
  {
    slideNumber: 9,
    id: "14933-advantages-multimedia",
    title: "Advantages of Using Multimedia",
    type: "content",
    content:
      "Using multimedia can make a website more effective when it is used properly\n" +
      "• It supports different learning styles: visual, auditory, and practical\n" +
      "• It can explain difficult ideas more clearly than text alone\n" +
      "• It keeps users more interested and involved\n" +
      "• It can help the message reach more people in a more memorable way",
    notes:
      "This is a key learner-guide idea. Emphasise that multimedia is useful because it helps different kinds of users understand the same message.",
    duration: 7,
    cards: ["Different learning styles", "Clearer meaning", "More interest", "Better communication"],
  },
  {
    slideNumber: 10,
    id: "14933-advantages-example",
    title: "Example: Why Multimedia Can Teach Better",
    type: "content",
    content:
      "Think about teaching someone how to do a practical task\n" +
      "• Text-only instructions may be hard for some people to follow\n" +
      "• Pictures can show the steps more clearly\n" +
      "• Audio can explain the steps aloud\n" +
      "• Video or animation can show the action as it happens\n" +
      "• This makes learning faster and easier for many users",
    notes:
      "Use a simple real-life example, such as a craft, recipe, form-filling task, or lab activity.",
    duration: 7,
    cards: ["Text only", "Pictures", "Audio", "Video", "Easier learning"],
  },
  {
    slideNumber: 11,
    id: "14933-disadvantages-multimedia",
    title: "Disadvantages of Using Multimedia",
    type: "content",
    content:
      "Multimedia is helpful, but it can also create problems if it is not planned well\n" +
      "• It may take more time, money, and skill to create\n" +
      "• Large files can load slowly on weak internet connections\n" +
      "• Some media may not work well on all browsers or devices\n" +
      "• Too many effects can confuse the user instead of helping them",
    notes:
      "Keep this balanced so learners understand both the value and the caution. Good multimedia supports the message; poor multimedia gets in the way.",
    duration: 7,
    cards: ["Cost and time", "Slow loading", "Compatibility", "Too many effects"],
  },
  {
    slideNumber: 12,
    id: "14933-intended-audience",
    title: "Determining the Intended Audience",
    type: "content",
    content:
      "Definition: The intended audience is the group of people the website is being created for.\n" +
      "• The audience affects the style, colours, words, and layout used on the page\n" +
      "• A page for children may look different from a page for professionals\n" +
      "• The audience also affects the amount and type of multimedia used\n" +
      "• A good developer always asks: who will use this page, and what do they need from it?",
    notes:
      "This belongs nicely at the end of Session 1 because it moves the discussion from definitions into the user's real needs.",
    duration: 7,
    cards: ["Who is it for?", "Design choices", "Media choices", "User needs"],
  },
  {
    slideNumber: 13,
    id: "14933-objectives",
    title: "Determining the Objectives of the Website",
    type: "content",
    content:
      "Definition: Objectives are the goals the website must achieve.\n" +
      "• The page may need to inform, teach, advertise, register, book, or collect contact details\n" +
      "• The objective decides what content should appear on the page\n" +
      "• If the objective is unclear, the design will also become unclear\n" +
      "• A developer should not continue building until the purpose and objectives make sense",
    notes:
      "This wraps Session 1 well: after understanding the web and multimedia, learners must think about the real goal of the page.",
    duration: 7,
    cards: ["Goal", "Content choice", "Clear purpose", "Build with intention"],
  },
  {
    slideNumber: 14,
    id: "14933-session1-wrap",
    title: "Wrap-Up — Before We Build, We Must Understand",
    type: "summary",
    content:
      "By the end of Session 1, learners should understand that\n" +
      "• a website is more than just code — it is built for real users\n" +
      "• multimedia can help communication when it is used well\n" +
      "• multimedia can also cause problems if it is badly planned\n" +
      "• audience and objectives must be clear before design and development begin",
    notes:
      "Use this slide to close Session 1 strongly before moving into planning and design.",
    duration: 6,
    cards: ["Users", "Multimedia value", "Possible problems", "Clear objectives"],
  },
  {
    slideNumber: 15,
    id: "14933-session2-title",
    title: "Session 2 — Design a Multimedia / Web-Based Computer Application",
    type: "content",
    content:
      "Session 2 now starts directly with the design task from the guide\n" +
      "Learning outcomes for this session:\n" +
      "• Generate the application design according to user specifications\n" +
      "• Design a storyboard and flow-diagram so the developer and user understand the same idea\n" +
      "• Apply effective communication principles so the page is interesting and easy to use",
    notes:
      "Open Session 2 with the exact purpose of the session. Learners must feel that this is the design session, not a side discussion.",
    duration: 6,
    cards: ["User specifications", "Storyboard", "Flow-diagram", "Design principles"],
  },
  {
    slideNumber: 16,
    id: "14933-session2-specifications",
    title: "Session 2 — Start with User Specifications",
    type: "content",
    content:
      "The design begins with clear user specifications\n" +
      "• Topic = what the application is about\n" +
      "• Purpose = why it is being created\n" +
      "• Target audience = who will use it\n" +
      "• Objectives = what the user should be able to do or learn\n" +
      "• If these are unclear, the design will also be unclear",
    notes:
      "Link this directly to the range statement in the guide: topic, purpose, target audience, and objectives.",
    duration: 7,
    cards: ["Topic", "Purpose", "Target audience", "Objectives"],
  },
  {
    slideNumber: 17,
    id: "14933-multimedia-web-design",
    title: "Session 2 — What Is Multimedia Web Site Design?",
    type: "content",
    content:
      "Definition: Multimedia web design is the process of planning what the site will look like and how it will work\n" +
      "• It covers layout, structure, media, and interaction\n" +
      "• The same thinking applies to websites, apps, CDs, and kiosks\n" +
      "• Good planning happens before development begins\n" +
      "• Time spent designing on paper saves trouble later",
    notes:
      "Use the learner-guide wording here: planning what the website will look like and how it will work.",
    duration: 7,
    cards: ["Look", "Behaviour", "Structure", "Plan first"],
  },
  {
    slideNumber: 18,
    id: "14933-planning-matters",
    title: "Session 2 — Why Planning Matters",
    type: "content",
    content:
      "Careful planning cannot be overemphasised\n" +
      "• It saves time during development\n" +
      "• It reduces errors and expensive redesign\n" +
      "• It improves communication between developer and user\n" +
      "• It leads to a better final product\n" +
      "• Design on paper first before building on the computer",
    notes:
      "Make this practical: poor planning usually means confusion, rework, and weak final pages.",
    duration: 6,
    cards: ["Save time", "Reduce errors", "Better communication", "Better quality"],
  },
  {
    slideNumber: 19,
    id: "14933-basic-design-principles",
    title: "Session 2 — Two Basic Design Principles",
    type: "content",
    content:
      "When designing a multimedia website, keep two principles in mind\n" +
      "1. Make it interesting and valuable to the target audience\n" +
      "2. Make it easy to use, fast enough, and simple to understand\n" +
      "• Users enjoy exciting applications\n" +
      "• Users have little patience with slow-loading or hard-to-use applications",
    notes:
      "This is the heart of the section. Always balance engagement with usability.",
    duration: 7,
    cards: ["Interesting", "Useful", "Easy to use", "Fast enough"],
  },
  {
    slideNumber: 20,
    id: "14933-keep-users-interested",
    title: "Session 2 — Keeping Users Interested",
    type: "content",
    content:
      "A site stays interesting when it continues to reward the user\n" +
      "• Provide useful and relevant content\n" +
      "• Use multimedia to support the message, not to distract\n" +
      "• Refresh the content regularly with new information\n" +
      "• If the same content stays there week after week, boredom sets in",
    notes:
      "Explain that good content is the first reason people return to a site.",
    duration: 6,
    cards: ["Useful content", "Relevant media", "Updates", "Keep interest alive"],
  },
  {
    slideNumber: 21,
    id: "14933-avoid-user-frustration",
    title: "Session 2 — Avoiding User Frustration",
    type: "content",
    content:
      "Users leave a site quickly when it becomes frustrating\n" +
      "Common problems:\n" +
      "• Slow-loading pages\n" +
      "• Confusing navigation\n" +
      "• Hard-to-read content\n" +
      "Good design keeps the layout simple, intuitive, and clear",
    notes:
      "This slide should feel direct and practical. Ask learners what makes them leave a website quickly.",
    duration: 6,
    cards: ["Slow pages", "Confusing navigation", "Poor readability", "Simple design"],
  },
  {
    slideNumber: 22,
    id: "14933-page-size-performance",
    title: "Session 2 — Page Size, Performance, and Large Content",
    type: "content",
    content:
      "Large pages and large media can make websites feel slow\n" +
      "• Keep total page size as small as possible\n" +
      "• Optimise images and choose efficient formats\n" +
      "• Use thumbnails so users choose when to open large pictures\n" +
      "• Stream large audio or video where possible instead of forcing a full download\n" +
      "• A page should load quickly enough that the user does not give up waiting",
    notes:
      "Link this to real-life low-data and low-speed contexts. This matters in CET environments.",
    duration: 7,
    cards: ["Smaller pages", "Optimised images", "Thumbnails", "Streaming"],
  },
  {
    slideNumber: 23,
    id: "14933-device-browser-plugin",
    title: "Session 2 — Device, Browser, and Plug-In Considerations",
    type: "content",
    content:
      "Not all users visit the site with the same setup\n" +
      "• Screen sizes differ across desktops, laptops, tablets, and phones\n" +
      "• Browsers do not always support the same features in the same way\n" +
      "• Avoid unusual or browser-specific features where possible\n" +
      "• Use widely supported media tools and provide alternatives if extra software is needed",
    notes:
      "Bring the design back to reality: different devices, different browsers, different user conditions.",
    duration: 7,
    cards: ["Different devices", "Different browsers", "Avoid rare features", "Use common tools"],
  },
  {
    slideNumber: 24,
    id: "14933-flowchart-definition",
    title: "What Is a Flowchart?",
    type: "content",
    content:
      "A flowchart shows how the pages of a website connect to one another\n" +
      "• Each box usually represents a web page or screen\n" +
      "• The lines show the links or logical path between pages\n" +
      "• It helps the developer and the user see the structure of the site before it is built\n" +
      "• It is useful for planning clear navigation",
    notes:
      "Keep this close to the guide: a flowchart shows how pages in the site relate to one another.",
    duration: 7,
    cards: ["Boxes = pages", "Lines = links", "Site structure", "Navigation planning"],
  },
  {
    slideNumber: 25,
    id: "14933-flowchart-example",
    title: "Flowchart Example (Cont.)",
    type: "content",
    content:
      "This example shows what a simple website flowchart and page layout can look like before coding begins\n" +
      "",
    notes:
      "Use this slide visually. Point at the boxes and links while explaining the structure.",
    duration: 7,
    cards: ["Page boxes", "Logical links", "Home page layout", "Plan before build"],
    imageUrl:
      "/docs/SAQA_78965_CET_Training/01_Core_UnitStandards/US 14933/14933 - Learner Guide_images/image-014.jpeg",
    imageAlt: "Example of a website flowchart and page layout from the learner guide",
  },
  {
    slideNumber: 26,
    id: "14933-storyboard-layout",
    title: "Session 2 — Storyboard and Page Layout Design",
    type: "content",
    content:
      "A storyboard is a sequence of sketches that shows how each screen or page will look\n" +
      "• It is often used for multimedia and interactive applications\n" +
      "• A page layout shows where the heading, text, menu, images, and buttons will go\n" +
      "• It is common to plan one layout for the home page and one for the other pages\n" +
      "• These sketches improve understanding between the developer and the user",
    notes:
      "This directly supports the learning outcome about effective communication between developer and user understanding.",
    duration: 7,
    cards: ["Storyboard", "Page layout", "Home page design", "Shared understanding"],
  },
  {
    slideNumber: 27,
    id: "14933-storyboard-example",
    title: "Session 2 — Storyboard Example",
    type: "content",
    content:
      "This storyboard example shows how a developer can sketch the planned screens before development\n" +
      "",
    notes:
      "Remind learners that a storyboard can be quick and simple as long as it clearly communicates the idea.",
    duration: 7,
    cards: ["Screen sequence", "Content planning", "User journey", "Clear communication"],
    imageUrl: "/docs/SAQA_78965_CET_Training/images/14933-storyboard-example.svg",
    imageAlt: "Simple storyboard example showing three planned website screens before development",
  },
  {
    slideNumber: 28,
    id: "14933-navigation-design",
    title: "Session 2 — Navigation Design and Long Pages",
    type: "content",
    content:
      "Good navigation helps users move through the site without confusion\n" +
      "• Keep menus simple and in the same place on every page\n" +
      "• Use clear tools such as navigation bars, hyperlinks, search bars, and site maps\n" +
      "• Long pages may need a table of contents, Next/Back buttons, or Back to Top links\n" +
      "• Every page should clearly identify itself and include a route back home",
    notes:
      "Stress consistency. Users should not have to re-learn the page each time they click.",
    duration: 7,
    cards: ["Consistency", "Clear tools", "Long-page support", "Back home"],
  },
  {
    slideNumber: 29,
    id: "14933-access-considerations",
    title: "Session 2 — Access Considerations and Assistive Technology",
    type: "content",
    content:
      "A good multimedia site must consider both compatibility and accessibility\n" +
      "• Device compatibility = the page should work on different screen sizes and systems\n" +
      "• Accessibility = the page should still be usable by people with disabilities\n" +
      "• Assistive technologies include screen readers, voice input, Braille displays, and alternative input devices\n" +
      "• Good design tries to include all users, not only the easiest users",
    notes:
      "This is an important professionalism point: the web should be usable by everyone.",
    duration: 7,
    cards: ["Compatibility", "Accessibility", "Assistive technology", "Inclusive design"],
  },
  {
    slideNumber: 30,
    id: "14933-designing-accessibility",
    title: "Session 2 — Designing for Accessibility",
    type: "content",
    content:
      "Practical accessibility rules improve the page for many users\n" +
      "• Add alt text to images so screen readers can describe them\n" +
      "• Use clear and meaningful link text\n" +
      "• Avoid complicated navigation or hidden actions\n" +
      "• Provide text alternatives for important audio or video content\n" +
      "• The web should be usable by all users, regardless of ability",
    notes:
      "End the theory part of Session 2 with a strong accessibility message and simple rules learners can actually apply.",
    duration: 7,
    cards: ["Alt text", "Meaningful links", "Simple navigation", "Text alternatives"],
  },
  {
    slideNumber: 31,
    id: "14933-session2-wrap",
    title: "Session 2 Wrap-Up — What a Good Design Must Show",
    type: "summary",
    content:
      "By the end of Session 2, the learner should be able to show that\n" +
      "• the design follows the user specifications\n" +
      "• the flowchart and storyboard communicate the idea clearly\n" +
      "• the page is being planned to be interesting, usable, and easy to understand\n" +
      "• the design also considers speed, devices, navigation, and accessibility",
    notes:
      "Use this to close the theory before the class moves into the practical design task.",
    duration: 6,
    cards: ["Specifications", "Communication", "Usability", "Accessibility"],
  },
  {
    slideNumber: 32,
    id: "14933-day1-practical-a",
    title: "Day 1 Practical A — Create the Design Brief, Flowchart, and Storyboard",
    type: "activity",
    content:
      "Use the end of Session 2 for direct practical work\n" +
      "• Choose a simple page idea such as a learner profile, notice board, event page, or booking form\n" +
      "• Write the topic, purpose, target audience, and objectives\n" +
      "• Draw a basic flowchart showing the main pages or screens\n" +
      "• Sketch one page layout or storyboard frame\n" +
      "• Explain how the design will be easy to use and suitable for the user",
    notes: module14933SpeakerNotes.activityIndividual,
    duration: 12,
  },
  {
    slideNumber: 33,
    id: "14933-session3-overview",
    title: "Session 3 — Text, Graphics, and Basic HTML Structure",
    type: "content",
    content:
      "Session 3 moves from planning into the first actual page structure\n" +
      "• Text, graphics, and media must be chosen and saved properly\n" +
      "• HTML gives the page its structure\n" +
      "• Tags tell the browser where each item should appear\n" +
      "• This is where learners begin turning the plan into a working page",
    notes:
      "This is the bridge from theory to building. Make it feel exciting but manageable.",
    duration: 6,
    cards: ["Content", "Structure", "Tags", "First page"],
  },
  {
    slideNumber: 34,
    id: "14933-html-media-tags",
    title: "Session 3 — HTML Tags for Text, Images, Links, and Media",
    type: "content",
    content:
      "These tags are enough for the first working version of the page\n" +
      "• <h1> to <h3> = headings and titles\n" +
      "• <p> = paragraph text\n" +
      "• <img src=\"photo.jpg\" alt=\"description\"> = image\n" +
      "• <a href=\"page.html\">Link text</a> = hyperlink\n" +
      "• <audio controls> and <video controls> = sound or video when needed",
    notes:
      "This directly answers the user's point that multimedia becomes part of the website through HTML tags. Keep the examples large and readable.",
    duration: 8,
    cards: ["Headings", "Paragraphs", "Images", "Links", "Audio/Video"],
  },
  {
    slideNumber: 35,
    id: "14933-live-demo-page",
    title: "Session 3 — Live Demo: Build the First Page Structure",
    type: "content",
    content:
      "Show a very small example while learners watch the result change in the browser\n" +
      "• <h1>CET Notice Board</h1>\n" +
      "• <p>Welcome to our practice web page.</p>\n" +
      "• <img src=\"lab.jpg\" alt=\"Computer lab\">\n" +
      "• <a href=\"#\">Read More</a>\n" +
      "• Save, refresh, and show how the tags become visible content on the page",
    notes:
      "Use the edit-save-refresh cycle so learners clearly connect the code to the visible output.",
    duration: 8,
  },
  {
    slideNumber: 36,
    id: "14933-day1-practical-b",
    title: "Day 1 Practical B — Create the First Working Page",
    type: "activity",
    content:
      "Use the end of Day 1 to complete the first version of the page\n" +
      "• Create the heading and paragraph text with HTML\n" +
      "• Add one image and one link\n" +
      "• Save the files with clear names and in the correct folder\n" +
      "• Preview the page in the browser and explain what each tag is doing",
    notes: module14933SpeakerNotes.activityGroup,
    duration: 12,
  },
  {
    slideNumber: 37,
    id: "14933-session4-overview",
    title: "Session 4 — Day 2: Improve the Page with CSS and JavaScript",
    type: "content",
    content:
      "Day 2 starts by improving the page that was created on Day 1\n" +
      "• CSS makes the page clearer and more attractive\n" +
      "• JavaScript makes the page react to the user\n" +
      "• The goal is simple improvement, not complicated code\n" +
      "• Every improvement should help the user understand or use the page better",
    notes:
      "Frame Day 2 as improvement, not starting over. Learners build confidence by improving what already works.",
    duration: 6,
    cards: ["CSS", "JavaScript", "Improve", "Usefulness"],
  },
  {
    slideNumber: 38,
    id: "14933-css-basics",
    title: "Session 4 — CSS Makes the Page Easier to Read",
    type: "content",
    content:
      "Definition: CSS controls how the page looks and feels.\n" +
      "• It changes colours, spacing, fonts, and alignment\n" +
      "• It makes the page look neat and more professional\n" +
      "• It improves readability instead of only decoration\n" +
      "• Good styling should still work on different screens",
    notes:
      "Keep the styling examples practical, readable, and relevant to the page purpose.",
    duration: 6,
    cards: ["Colour", "Spacing", "Fonts", "Readability"],
  },
  {
    slideNumber: 39,
    id: "14933-javascript-basics",
    title: "Session 4 — JavaScript Makes the Page Respond",
    type: "content",
    content:
      "Definition: JavaScript gives the web page behaviour.\n" +
      "• A click can show a message\n" +
      "• A form can check whether required fields were completed\n" +
      "• A section can appear, disappear, or change\n" +
      "• The script should stay simple and work in common browsers",
    notes:
      "Use a small visible example such as a button response or form check. Keep the experience successful and low-pressure.",
    duration: 7,
    cards: ["Click", "Validate", "Change", "Simple behaviour"],
  },
  {
    slideNumber: 40,
    id: "14933-day2-practical",
    title: "Day 2 Practical — Style, Validate, and Improve the Page",
    type: "activity",
    content:
      "Most of Day 2 should now be practical\n" +
      "• Add CSS to improve colours, spacing, and layout\n" +
      "• Add one JavaScript action such as validation or a welcome message\n" +
      "• Test whether the page still looks clear and works properly\n" +
      "• Work in pairs to help each other fix small mistakes and improve the result",
    notes: module14933SpeakerNotes.activityGroup,
    duration: 12,
  },
  {
    slideNumber: 41,
    id: "14933-session5-testing",
    title: "Session 5 — Test, Fix, and Finalise the Page",
    type: "summary",
    content:
      "The final session focuses on testing and finishing the work properly\n" +
      "• Click every link and button\n" +
      "• Check spelling, grammar, layout, and readability\n" +
      "• Let another learner test the page and point out confusion\n" +
      "• Fix the page before final submission\n" +
      "• A small page that works well is better than a complicated page that fails",
    notes: module14933SpeakerNotes.summary,
    duration: 6,
    cards: ["Test", "Fix", "Peer review", "Finalise"],
  },
];
