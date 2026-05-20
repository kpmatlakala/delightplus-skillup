# Learner Guide Introduction

- **About the Learner Guide…**: This Learner Guide provides a comprehensive overview of the Demonstrate an understanding of the principles of developing software for the internet,and forms part of a series of Learner Guides that have been developed for FURTHER EDUCATION AND TRAINING CERTIFICATE: INFORMATION TECHNOLOGY: SYSTEMS DEVELOPMENT ID 78965 LEVEL 4 – CREDITS 165The series of Learner Guides are conceptualized in modular’s format and developed FURTHER EDUCATION AND TRAINING CERTIFICATE: INFORMATION TECHNOLOGY: SYSTEMS DEVELOPMENT ID 78965 LEVEL 4 – CREDITS 165They are designed to improve the skills and knowledge of learners, and thus enabling them to effectively and efficiently complete specific tasks. Learners are required to attend training workshops as a group or as specified by their organization. These workshops are presented in modules, and conducted by a qualified facilitator.
- **Purpose**: The purpose of this Unit Standard is to Demonstrate an understanding of the principles of developing software for the internet
- **Outcomes**: Demonstrate an understanding of the principles of developing software for the internet
- **Assessment Criteria**: The only way to establish whether a learner is competent and has accomplished the specific outcomes is through an assessment process. Assessment involves collecting and interpreting evidence about the learner’s ability to perform a task. This guide may include assessments in the form of activities, assignments, tasks or projects, as well as workplace practical tasks. Learners are required to perform tasks on the job to collect enough and appropriate evidence for their portfolio of evidence, proof signed by their supervisor that the tasks were performed successfully.
- **To qualify**: To qualify and receive credits towards the learning programme, a registered assessor will conduct an evaluation and assessment of the learner’s portfolio of evidence and competency
- **Range of Learning**: This describes the situation and circumstance in which competence must be demonstrated and the parameters in which learners operate
- **Responsibility**: The responsibility of learning rest with the learner, so:Be proactive and ask questions,, Seek assistance and help from your facilitators, if required.

Learning Unit1

**UNIT STANDARD NUMBER :** 14930

**LEVEL ON THE NQF :** 4

**CREDITS :** 3

**FIELD :** Physical, Mathematical, Computer and Life Sciences

**SUB FIELD :**  Construction Information Technology and Computer Sciences 

- **PURPOSE:**: This unit standard is intended: to demonstrate fundamental of knowledge of the areas covered for those working in, or entering the workplace in the area of systems development People credited with this unit standard are able to: Review the requirements for a web-based computer application Design a web-based computer application Present the design of a web-based computer application The performance of all elements is to a standard that allows for further learning in this area
LEARNING ASSUMED TO BE IN PLACE:
Open. The credit value of this unit is based on a person having the prior knowledge and skills to: demonstrate an understanding of fundamental English (at least NQF level 3) demonstrate PC competency skills (End User Computing unit standards up to level 3).

SESSION 1. Explain the network issues related to Internet applications.
Learning Outcomes
1\. The explanation identifies the Internet uses a session-less network protocol. , 2. The explanation lists the implications of session-less application development. , 3. The explanation identifies the Internet uses limited band-width. , 4. The explanation lists the implications of slow wand-width to application design.

**The explanation identifies the Internet uses a session-less network protocol.**

**PROTOCOLS**

**PROTOCOL**– Set of rules or language use by computer and networking devices to communicate with one another

**SERVICE** - A service use by computer and networking devices such as file and print services

**Networking Protocols**

**TCP/IP** \- Abbreviation for ***Transmission Control Protocol/Internet Protocol****,*the suite of communications protocols used to connect hosts on the Internet. TCP/IP uses several protocols, the two main ones being TCP and IP. TCP/IP is built into the UNIX operating system and is used by the Internet, making it the de facto standard for transmitting data over networks.

**Introduction to Network Protocols**

Just as diplomats use diplomatic protocols in their meetings, computers use network protocols to communicate in computer networks. There are many network protocols in existence; TCP/IP is a family of network protocols that are used for the Internet.

A **network** **protocol** is a standard written down on a piece of paper (or, more precisely, with a text editor in a computer). The standards that are used for the Internet are called **Requests** **For** **Comment** (**RFC**). RFCs are numbered from 1 onwards. There are more than 4,500 RFCs today. Many of them have become out of date, so only a handful of the first thousand RFCs are still used today. The **International** **Standardization** **Office** (**ISO**) has standardized a system of network protocols called as **ISO** **OSI**. Another organization that issues communication standards is the **International** **Telecommunication** **Union** (**ITU**) located in Geneva. The ITU was formerly known as the CCITT and, being founded in 1865, is one of the oldest worldwide organizations (for comparison, the Red Cross was founded in 1863). Some standards are also issued by the **Institute** **of** **Electrical** **and** **Electronics** **Engineers** (**IEEE**). RFC, standards released by **RIPE** (**Réseaux** **IPEuropéens**), and **PKCS** (**Public** **Key** **Cryptography** **Standard**) are freely available on the Internet and are easy to get hold of. Other organizations (ISO, ITU, and so on) do not provide their standards free of charge—you have to pay for them. If that presents a problem, then you have to spend some time doing some library research. First of all, let's have a look at why network communication is divided into several protocols. The answer is simple although this is a very complex problem that reaches across many different professions. Most books concerning network protocols explain the problem using a metaphor of two foreigners (or philosophers, doctors, and so on) trying to communicate with each other. Each of the two can only communicate in his or her respective language. In order for them to be able to communicate with each other, they need a translator as shown in the following figure:

**Figure 1.1:** Three-layer communication architecture

The two foreigners exchange ideas, i.e., they communicate. But they only do so virtually. In reality, they are both handing over information to their interpreters, who then transmit this information by sending vibrations through the surrounding air with their vocal cords. Or if the parties are far away from each other, the interpreters communicate over the phone; thus the information is physically transmitted over phone lines. We can therefore talk about virtual communication in the horizontal direction (philosophical communication, the shared language between interpreters, and electronic signals transmitted via phone lines) and real communication in the vertical direction (foreigner-to-interpreter and interpreter-to-phone). We can thus distinguish three levels of communication:

1.  Between two foreigners
2.  Between interpreters
3.  Physical transmission of information using media (phone lines, sound waves, etc.)

Communication between the two foreigners and between the two interpreters is only virtual. In fact, the only real communication happens between the foreigner and his or her interpreter. Even more layers are used in computer networks. The number of layers depends on which system of network protocols you choose to use. The system of network protocols is sometimes referred to as the *network* *model*. You most commonly work with a system that uses the Internet, which is also referred to as the TCP/IP family. In addition to TCP/IP, we will also come across the ISO OSI model that was standardized by the ISO.

**Comparison of TCP/IP and ISO OSI network models**

The TCP/IP family uses four layers while ISO OSI uses seven layers as shown in the figure above. The TCP/IP and ISO OSI systems differ from each other significantly, although they are very similar on the network and transport layers. Except for some exceptions like SLIP or PPP, the TCP/IP family does not deal with the link and physical layers. Therefore, even on the Internet, we use the link and physical protocols of the ISO OSI model.

**1.1 ISO OSI**

Communication between two computers is shown in the following figure:

Seven-layer architecture of ISO OSI

**The explanation lists the implications of session-less application development.**

And solution developers to find other methods of uniquely tracking a visitor through a web-base application. Various methods of managing a visitor’s session have been proposed and used, but the most popular method is through the use of unique session IDs. Unfortunately, in too many cases organisations have incorrectly applied session ID management techniques that have left their “secure” application open to abuse and possible hijacking. This document reviews the common assumptions and flaws organisations have made and proposes methods to make their session management more secure and robust.

**Understanding the Situation**

Most organisations now have substantial investments in their online Internet presences. For major financial institutions and retailers, the Internet provides both a cost effective means of presenting their services and products to customer, and a method of delivering a personalised 24-7 presence. In almost all cases, the preferred method of delivering these services is over common HTTP. Due to the way this protocol works, there is no inbuilt facility to uniquely identify or track a particular customer (or session) within an application – thus the connection between the customer’s web-browser and the organisations web-service is referred to as stateless. Therefore, organisations have been forced to adopt custom methods of managing client sessions if they wish to maintain state. The most common method of tracking a customer through a web site is by assigning a unique session ID – and having this information transmitted back to the web server with every request. Unfortunately, should an attacker guess or steal this session ID information, it is normally a trivial exercise to hijack and manipulate another user’s active session. An important aspect of correctly managing state information through session IDs relates directly to authentication processes. While it is possible to insist that a client using an organisations web application provide authentication information for each “restricted” page or data submission, it would soon become tedious and untenable. Thus session IDs are not only used to follow clients throughout the web application, they are also used to uniquely identify an authenticated user – thereby indirectly regulating access to site content or information. The methods available to organisations for successfully managing sessions and preventing hijacking type attacks are largely dependant upon the answers to a number of critical questions:

1.  Where and how often are legitimate clients expected to utilise the web-based application?
2.  At what stage does the organisation really need to manage the state of a client’s session?
3.  What level of damage could be done to the legitimate client should an attacker be able to impersonate and hijack their account?
4.  How much time is someone likely to invest in breaking the session management method?
5.  How will the application identify or respond to potential or real hijacking attempts?
6.  What is the significance to application usability should it be necessary to use an encrypted version of HTTP (HTTPS)?
7.  What would be the cost to the organisations reputation should information about a security flaw in any session management be made public?

Finding answers to these questions will enable the organisation to evaluate the likelihood and financial risk of an inappropriate or poorly implemented session management solution.

**Maintaining State**

Typically, the process of managing the state of a web-based client is through the use of session IDs. Session IDs are used by the application to uniquely identify a client browser, while background (server-side) processes are used to associate the session ID with a level of access. Thus, once a client has successfully authenticated to the web application, the session ID can be used as a stored authentication voucher so that the client does not have to retype their login information with each page request.

Organisations application developers have three methods available to them to both allocate and receive session ID information:

-   Session ID information embedded in the URL, which is received by the application through HTTP GET requests when the client clicks on links embedded with a page.
-   Session ID information stored within the fields of a form and submitted to the application. Typically the session ID information would be embedded within the form as a hidden field and submitted with the HTTP POST command.
-   Through the use of cookies.

Each method has certain advantages and disadvantages, and one may be more appropriate than another. Selection of one method over another is largely dependant upon the type of service the web application is to deliver and the intended audience. Listed below is a more detailed analysis of the three methods. It is important that an organisations system developers understand the limitations and security implications of each delivery mechanism.

URL Based Session ID's
Session ID information embedded in the URL, which is received by the application through HTTP GET requests when the client clicks on links. Example: http://www.example.com/news.asp?article=27781;sessionid=IE60012219
Advantages:Can be used even if the client web-browser has high security settings and has disabled the use of cookies., Access to the information resource can be sent by the client to other users by providing them with a copy of the URL., If the Session ID is to be permanently associated with the client-browser and their computer, it is possible for the client to “Save as a favourite”., Depending upon the web browser type, URL information is commonly sent in the HTTP REFERER field. This information can be used to ensure a site visitor has followed a particular path within the web application, and subsequently used to identify some common forms of attack.
Disadvantages:Any person using the same computer will be able to review the browser history file or stored favourites and follow the same URL., URL information will be logged by intermediary systems such as firewalls and proxy servers. Thus anyone with access to these logs could observe the URL and possibly use the information in an attack., It is a trivial exercise for anyone to modify the URL and associated session ID information within a standard web browser. Thus, the skills and equipment necessary to carry out the attack are minimal – resulting in more frequent attacks., When a client navigates to a new web site, the URL containing the session information can be sent to the new site via the HTTP REFERER field.

Hidden Post Fields
Session ID information stored within the fields of a form and submitted to the application. Typically the session ID information would be embedded within the form as a hidden field and submitted with the HTTP POST command. Example: Embedded within the HTML of a page – <FORM METHOD=POST ACTION=”/cgi-bin/news.pl”> <INPUT TYPE=”hidden” NAME=”sessionid” VALUE=”IE60012219”> <INPUT TYPE=”hidden” NAME=”allowed” VALUE=”true”> <INPUT TYPE=”submit” NAME=”Read News Article”>
Advantages:Not as obvious as URL embedded session information, and consequently requires a slightly higher skill level for an attacker to carry out any manipulation or hijacking., Allows a client to safely store or transmit URL information relating to the site without providing access to their session information., Can also be used even if the client web-browser has high security settings and has disabled the use of cookies.
Disadvantages:While it requires a slightly higher skill level to perform, attacks can be carried out using commonly available tools such as Telnet or via personal proxy services., The web application page content tends to be more complex – relying upon embedded form information, client-side scripting such as JavaScript, or embedded within active content such as Macromedia Flash. In addition - pages tend to be larger, requiring more time for the client to download and thus perceiving the site as slower and more unresponsive., Due to poor coding practices, a failure to check the submission type (i.e. GET or POST) at the server side may allow the POST content to be reformed into a URL that could be submitted via the HTTP GET method.

Cookies
Each time a client web browser accesses content from a particular domain or URL, if a cookie exists, the client browser is expected to submit any relevant cookie information as part of the HTTP request. Thus cookies can be used to preserve knowledge of the client browser across many pages and over periods of time. Cookies can be constructed to contain expiry information and may last beyond a single interactive session. Such cookies are referred to as “persistent cookies”, and are stored on the client browsers hard-drive in a location defined by the particular browser or operating system (e.g. c:\\documents and settings\\clientname\\cookies for Internet Explorer on Windows XP). By omitting expiration information from a cookie, the client browser is expected to store the cookie only in memory. These “session cookies” should be erased when the browser is closed. Example: Within the plain text of the HTTP server response – Set-Cookie: sessionID=”IE60012219”; path=”/”; domain=”www.example.com”; expires=”2003-06-01 00:00:00GMT”; version=0
Advantages:Careful use of persistent and session type cookies can be used to regulate access to the web application over time., More options are available for controlling session ID timeouts., Session information is unlikely to be recorded by intermediary devices., Cookie functionality is built in to most browsers. Thus no special coding is required to ensure session ID information is embedded within the pages served to the client browser.
Disadvantages:An increasingly common security precaution with web browsers is to disable cookie functionality. Thus web applications dependant upon the cookie function will not work for “security conscious” users., As persistent cookies exist as text files on the client system, they can be easily copied used on other systems. Depending on the hosts file access permissions, other users of the host may steal this information and impersonate the user., Cookies are limited in size, and are unsuitable for storing complex arrays of state information., Cookies will be sent with very page and file requested by the browser within the domain defined by the SET-COOKIE.

**The Session ID**

An important aspect of managing state within the web application is the “strength” of the session ID itself. As the session ID is often used to track an authenticated user through the application, organisations must be aware that this session ID must fulfil a particular set of criteria if it is not to be compromised through predictive or brute-force type attacks. The two critical characteristics of a good session ID are randomness and length.

***Session ID Randomness***

It is important that the session ID is unpredictable and the application utilises a strong method of generating random ID’s. It is vital that a cryptographically strong algorithm is used to generate a unique session ID for an authenticated user. Ideally the session ID should be a random value. Do not use linear algorithms based upon predictable variables such as date, time and client IP address.

To this end, the session ID should fulfil the following criteria:

-   It must look random – i.e. it should pass statistical tests of randomness.
-   It must be unpredictable – i.e. it must be infeasible to predict what the next random value will be, given complete knowledge of the computational algorithm or hardware generating the ID and all previous ID’s.
-   It cannot be reliably reproduced – i.e. if the ID generator is used twice with exactly the same input criteria, the result will be an unrelated random ID.

***Session ID Length***

It is important that the session ID be of a sufficient length to make it infeasible that a brute force method could be used to successfully derive a valid ID within a usable timeframe. Given current processor and bandwidth limitations, session ID’s consisting of over 50 random characters in length are recommended – but make them longer if the opportunity exists. The actual length of the session ID is dependant upon a number of factors:

-   Speed of connection – i.e. there is typically a big difference between Internet client, B2B and internal network connections. While an Internet client will typically have less than a 512 kbps connection speed, an internal user may be capable of connecting to the application server at 200 times faster. Thus an internal user could potentially obtain a valid session ID in 1/200th of the time.
-   Complexity of the ID – i.e. what values and characters are used within the session ID? Moving from numeric values (0-9) to a case-sensitive alpha-numeric (a-z, A-Z, 0-9) range means that, for the same address space, the session ID becomes much more difficult to predict. For example, the numeric range of 000000-999999 could be covered by 0000-5BH7 using a case-sensitive alpha-numeric character set.

**Session Hijacking**

As session ID’s are used to uniquely identify and track a web application user, any attacker who obtains this unique identifier is potentially able to submit the same information and impersonate someone else – this class of attack is commonly referred to as Session Hijacking. Given the inherent stateless nature of the HTTP (and HTTPS) protocol, the process of masquerading as an alternative user using a hijacked session ID is trivial. An attacker has at his disposal three methods for gaining session ID information – observation, brute force and misdirection of trust.

***Observation***

By default all HTTP traffic crosses the wire in an unencrypted, plain text, mode. Thus, any device with access to the same wire or shared network devices is capable of “sniffing” the traffic and recording session ID information (not to mention user authentication information such as user names and passwords). In addition, many perimeter devices automatically log aspects of HTTP traffic – in particular the URL information. A simple security measure to prevent “sniffing” or logging of confidential URL information is to use the encrypted form of HTTP – HTTPS.

***Brute Force***

If the session ID information is generated or presented in such a way as to be predictable, it is very easy for an attacker to repeatedly attempt to guess a valid ID. Depending upon the randomness and the length of the session ID, this process can take as little time as a few seconds. In ideal circumstances, an attacker using a domestic DSL line can potentially conduct up to as many as 1000 session ID guesses per second. Thus it is very important to have a sufficiently complex and long session ID to ensure that any likely brute forcing attack will take many hundreds of hours to predict.

A paper by David Endler on the processes involved in brute forcing session ID’s should be sought by readers requiring background information on this process.

**The explanation identifies the Internet uses limited band-width.**

*Bandwidth* in computer networking refers to the data rate supported by a network connection or interface. Network bandwidth is not the only factor that contributes to the perceived speed of a network. A lesser known element of network performance - *latency* - also plays an important role.

**What Is Network Bandwidth?**

Bandwidth is the primary measure of computer network speed. Virtually everyone knows the bandwidth rating of their modem or their Internet service that is prominently advertised on network products sold today. In networking, bandwidth represents the overall capacity of the connection. The greater the capacity, the more likely that better performance will result. Bandwidth is the amount of data that passes through a network connection over time as measured in bits per second (bps). Bandwidth can refer to both actual and theoretical throughput, and it is important to distinguish between the two. For example, a standard dial-up modem supports 56 Kbps of peak bandwidth, but due to physical limitations of telephone lines and other factors, a dial-up connection cannot support more than 53 Kbps of bandwidth (about 10% less than maximum) in practice. Likewise traditional Ethernet networks that theoretically support 100 Mbps or 1000 Mbps of maximum bandwidth, but this maximum amount cannot reasonably be achieved due to overhead in the computer hardware and operating systems.

**Broadband and Other High Bandwidth Connections**

The term *high bandwidth* is sometimes used to distinguish faster broadband Internet connections from traditional dial-up or cellular network speeds. Definitions vary, but high bandwidth connections generally support data rates of minimum 64 Kbps (and usually 300 Kbps or higher). Broadband is just one type of high bandwidth network communication method.

**Measuring Network Bandwidth**

Numerous tools exist for administrators to measure the bandwidth of network connections. On LANs (local area networks), these tools include *netperf* and *ttcp*. On the Internet, numerous bandwidth and speed test programs exist, most available for free online use. Even with these tools at your disposal, bandwidth utilization is difficult to measure precisely as it varies over time depending on the configuration of hardware and characteristics of software applications including how they are being used.

**The explanation lists the implications of slow band-width to application design**

It is not considered good user experience when people are feeling that they are waiting a long time for a page to load (perceived performance). Broadband is one of the reasons that can cause slow connectivity on the web.  Also, your dial-up users (yes it still exists!) have to wait a long, long time for large images (meaning their file size) or large amounts of coding (in your pages) to transfer to their computers and load into their browsers. Lots of code equals larger file size.  And one more thing, if you have huge amounts of code on a web page, some browsers can experience difficulty in display, especially when it is on a slower computer as it processes the information

SESSION 2. Demonstrate an understanding of different user interface methods used for Internet applications.
Learning Outcomes
1\. The demonstration identifies different user interface methods used for Internet application development. , 2. The demonstration explains each of the user interface methods identified in 1, indicating the implication of each method.

**The demonstration identifies different user interface methods used for Internet application development**. **The demonstration explains each of the user interface methods identified in 1, indicating the implication of each method.** 

ASP: Active Server Pages - Introduction

**1\. Presentation of Active Server Pages**

ASP (Active Server Pages) is a standard developed by Microsoft in 1996 for the development of interactive web applications (page with dynamic content). The content of an ASP webpage (with the .asp extension) may differ depending on certain parameters (information stored in a database, the user preferences, ...) while a classic webpage (with the .htm or .html extension) will display the same information continuously. ASP is actually a technology, or more precisely a programming environment where the interactions between the client browser, the web server, as well as the connections to databases (via ADO, ActiveX Data Objects), COM components (Component Object Model), in the form of objects. ASPs are executed on the server side (as well as the CGI, PHP, ...scripts) and not the client side (while scripts written in JavaScript or Java applets runs on the client side - in the browser).  ASP can be integrated in a web page in HTML using special tags that will instruct the Web server that the code included within these tags must be interpreted and data (usually HTML code) must be returned to the client browser.  Thus, Active Server Pages is part of a 3-tier architecture. This term means that a server that supports Active Server Pages can be used as an intermediary between the client browser and a database, using the ADO (ActiveX Data Objects) technology, which provides the elements necessary to initiate connection to a databases management system and the handling of data using the SQL language.

**Characteristics of Active Server Pages**

ASP were designed to operate on the Microsoft Web server called Microsoft IIS (Internet Information Server). This web server, developed by Microsoft in 1996, has the advantage of being free, it runs under the Microsoft Windows NT operating system .  However, this proprietary technology is now available on other web servers, like the Netscape FastTrack Server for Chili!Software and other servers including Apache (with the Apache::ASP module), making it possible to create websites using ASP technology on various platforms (Unix, Linux, PowerPC, ...).   

**The basic objects of Active Server Pages**

Active Server Pages are made up of the objects that will be "processed" by the server. The seven basic objects are:

-   **Application**: it is the object representing the web application itself, that is to say, an object containing all information shared by visitors connected to the online application.
-   **Object Context**: it can control any transactions with the Microsoft Transaction Server (MTS: Microsoft Transaction Server).
-   **Request**: This object is used to retrieve information sent to the server in the HTTP request from the client.
-   **Response**: It is used to create and send the HTTP response to the client (browser).
-   **Server**: it contains information specific to the web server.
-   **Session**: it allows you to manage user sessions, that is to say to keep information from one page to another.
-   **ASPError**: this object retrieves and sets the errors encountered during the execution of ASP scripts.

Active Server Pages (ASP) is the Microsoft solution for providing dynamic Web content. Actually, ASP looks very similar to JSP; both use custom tags to implement business logic and text (HTML) for invariant Web page parts.

**2\. Rich clients and browser-based clients**

**Explain the benefits and drawbacks of rich clients and browser-based clients as deployed in a typical Java EE application.**

**Client Considerations**

-   **Network Considerations**

The client depends on the network, and the network is imperfect. Although the client appears to be a stand-alone entity, it cannot be programmed as such because it is part of a distributed application. Three aspects of the network:

-   -   Latency is non-zero.
    -   Bandwidth is finite.
    -   The network is not always reliable.

A well-designed enterprise application must address these issues, starting with the client. The ideal client connects to the server only when it has to, transmits only as much data as it needs to, and works reasonably well when it cannot reach the server.

-   **Security Considerations**

Different networks have different security requirements, which constrain how clients connect to an enterprise. For example, when clients connect over the Internet, they usually communicate with servers through a firewall. The presence of a firewall that is not under your control limits the choices of protocols the client can use. Most firewalls are configured to allow Hypertext Transfer Protocol (HTTP) to pass across, but not Internet Inter-Orb Protocol (IIOP). This aspect of firewalls makes Web-based services, which use HTTP, particularly attractive compared to RMI- or CORBA-based services, which use IIOP. Security requirements also affect user authentication. When the client and server are in the same security domain, as might be the case on a company intranet, authenticating a user may be as simple as having the user log in only once to obtain access to the entire enterprise, a scheme known as Single Sign On. When the client and server are in different security domains, as would be the case over the Internet, a more elaborate scheme is required for single sign on, such as that proposed by the Liberty Alliance.

-   **Platform Considerations**

Every client platform's capabilities influence an application's design. For example, a browser client cannot generate graphs depicting financial projections; it would need a server to render the graphs as images, which it could download from the server. A programmable client, on the other hand, could download financial data from a server and render graphs in its own interface.

**Design Issues and Guidelines for Browser Clients**

Browsers are the thinnest of clients; they display data to their users and rely on servers for application functionality. From a deployment perspective, browser clients are attractive for a couple of reasons. First, they require minimal updating. When an application changes, server-side code has to change, but browsers are almost always unaffected. Second, they are ubiquitous. Almost every computer has a Web browser and many mobile devices have a microbrowser.

-   **Presenting the User Interface**

Browsers have a couple of strengths that make them viable enterprise application clients. First, they offer a familiar environment. Browsers are widely deployed and used, and the interactions they offer are fairly standard. This makes browsers popular, particularly with novice users. Second, browser clients can be easy to implement. The markup languages that browsers use provide high-level abstractions for how data is presented, leaving the mechanics of presentation and event-handling to the browser.

The trade-off of using a simple markup language, however, is that markup languages allow only limited interactivity. For example, HTML's tags permit presentations and interactions that make sense only for hyperlinked documents. You can enhance HTML documents slightly using technologies such as JavaScript in combination with other standards, such as Cascading Style Sheets (CSS) and the Document Object Model (DOM). However, support for these documents, also known as Dynamic HTML (DHTML) documents, is inconsistent across browsers, so creating a portable DHTML-based client is difficult. Another, more significant cost of using browser clients is potentially low responsiveness. The client depends on the server for presentation logic, so it must connect to the server whenever its interface changes. Consequently, browser clients make many connections to the server, which is a problem when latency is high. Furthermore, because the responses to a browser intermingle presentation logic with data, they can be large, consuming substantial bandwidth.

-   **Validating User Inputs**

Consider an HTML form for completing an order, which includes fields for credit card information. A browser cannot single-handedly validate this information, but it can certainly apply some simple heuristics to determine whether the information is invalid. For example, it can check that the cardholder name is not null, or that the credit card number has the right number of digits. When the browser solves these obvious problems, it can pass the information to the server. The server can deal with more esoteric tasks, such as checking that the credit card number really belongs to the given cardholder or that the cardholder has enough credit. When using an HTML browser client, you can use the JavaScript scripting language, whose syntax is close to that of the Java programming language. Be aware that JavaScript implementations vary slightly from browser to browser; to accommodate multiple types of browsers, use a subset of JavaScript that you know will work across these browsers. (For more information, see the ECMAScript Language Specification.) It may help to use JSP custom tags that autogenerate simple JavaScript that is known to be portable. Validating user inputs with a browser does not necessarily improve the responsiveness of the interface. Although the validation code allows the client to instantly report any errors it detects, the client consumes more bandwidth because it must download the code in addition to an HTML form. For a non-trivial form, the amount of validation code downloaded can be significant. To reduce download time, you can place commonly-used validation functions in a separate source file and use the script element's src attribute to reference this file. When a browser sees the src attribute, it will cache the source file, so that the next time it encounters another page using the same source file, it will not have to download it again. Also note that implementing browser validation logic will duplicate some server-side validation logic. The EJB and EIS tiers should validate data regardless of what the client does. Client-side validation is an optimization; it improves user experience and decreases load, but you should NEVER rely on the client exclusively to enforce data consistency.

-   **Communicating with the Server**

Browser clients connect to a J2EE application over the Web, and hence they use HTTP as the transport protocol. When using browser interfaces, users generally interact with an application by clicking hyperlinked text or images, and completing and submitting forms. Browser clients translate these gestures into HTTP requests for a Web server, since the server provides most, if not all, of an application's functionality. User requests to retrieve data from the server normally map to HTTP GET requests. The URLs of the requests sometimes include parameters in a query string that qualify what data should be retrieved. User requests to update data on the server normally map to HTTP POST requests. Each of these requests includes a MIME envelope of type application/x-www-form-urlencoded, containing parameters for the update. After a server handles a client request, it must send back an HTTP response; the response usually contains an HTML document. A J2EE application should use JSP pages to generate HTML document

SESSION 3. Demonstrate an awareness of the implications of copyright, ownership and royalties.
Learning Outcomes
1\. The demonstration shows an awareness of copyright issues related to Internet development. , 2. The demonstration shows an awareness of ownership issues related to Internet development. , 3. The demonstration shows an awareness of royalty issues related to Internet development.

**The demonstration shows an awareness of copyright issues related to Internet development.**

**What is Copyright?**  

Copyright is a form of protection provided by the laws of the United States (title 17, U.S. Code) to the authors of "original works of authorship" including literary, dramatic, musical, artistic, architectural and certain other intellectual works.

\*\*\*This protection is available to both published and unpublished works.

Material in the "public domain" is intellectual property that does not come under copyright laws. 

Nearly all work before the 20th C. is not copyrighted.

**What is Plagiarism?**  

Plagiarism is the the act of stealing and passing off the ideas, words, or other intellectual property produced by another as one's own. For example, using someone else's words in a research paper without citing the source, is an act of plagiarism.

**History of copyright:**

-   First law enacted 1790.
-   1976 copyright law followed international law, extending copyright for 50 years after death of the author/creator.
-   On October 27, 1998, President Clinton signed into law the "Sonny Bono Copyright Extension Act," which extends the terms of almost all existing copyrights by 20 years, to provide copyrights in the United States the same protection afforded in Europe. The basic term of copyright protection, the life of the creator plus 50 years, has been increased to life plus 70 years. The term for "work for hire" has been extended from 75 to 95 years. 

**How long does copyright last?**

-   Works created on or after Jan 1978 - life of author + 70
-   Work for hire 95 years

**The** **OWNER/manufacturer/creator**\[but not always the creator \] **of the work CAN:**

-   copy the work.
-   create derivative works based upon the work.
-   sell, rent, lease, lend copies of the work.
-   publicly perform literary, musical, dramatic, motion picture and other audiovisual works.
-   publicly perform sound recordings.

It is not necessary to have a notice of copyright (i.e.: © 1997 Jane Doe) for material to be copyright protected in the U.S.  Once something tangible is produced, text, graphics, music, video, etc., it is automatically copyrighted. Sound recordings and some other property use other copyright symbols.  Anyone can use the copyright symbol on her or his original work.

**The Internet and Copyright:**

*"The Internet has been characterized as the largest threat to copyright since its inception. The Internet is awash in information, a lot of it with varying degrees of copyright protection. Copyrighted works on the Net include new s stories, software, novels, screenplays, graphics, pictures, Usenet messages and even email. In fact, the frightening reality is that almost everything on the Net is protected by copyright law.* **What is protected on the WWW?** 

The unique underlying design of a Web page and its contents,  including:

-   links
-   original text
-   graphics
-   audio
-   video
-   html, vrml, other unique markup language sequences
-   List of Web sites compiled by an individual or organization
-   and all other unique elements that make up the original nature of the material.

**When creating a Web page, you CAN:**

-   Link to other Web sites. \[However, some individuals and organizations have specific requirements when you link to their Web material. Check a site carefully to find such restrictions. It is wise to ask permission. You need to cite source, as you are required to do in a research paper, when quoting or paraphrasing material from other sources. How much you quote is limited.\]
-   Use **free** graphics on your Web page. If the graphics are not advertised as "free" they should not be copied without permission.

**When creating a Web page, you CANNOT:**

-   Put the contents of another person's or organizations web site on your Web page
-   Copy and paste information together from various Internet sources to create "your own" document. \[You CAN quote or paraphrase limited amounts, if you give credit to the original source and the location of the source. This same principle applies to print sources, of course.\]
-   Incorporate other people's electronic material, such as e-mail, in your own document, without permission.
-   Forward someone's e-mail to another recipient without permission
-   Change the context of or edit someone else's digital correspondence in a way which changes the meaning
-   Copy and paste others' lists of resources on your own web page
-   Copy and paste logos, icons, and other graphics from other web sites to your web page (unless it is clearly advertised as "freeware." Shareware is **not** free).  Some organizations are happy to let you use their logos, with permission - it is free advertising.  But they want to know who is using it.  They might not approve of all sites who want to use their logo.

Many aspects of the issue of copyright and the Internet are still not resolved.  This information, however, should serve as a useful guide to help you avoid violation of copyright rules and the pitfalls of unknowingly plagiarizing someone else's material. When in doubt, please consult the official copyright rules and guidelines.

**The demonstration shows an awareness of ownership issues related to Internet development.**

**Who Owns The Internet?** 

Ownership of the internet is a complicated issue. In theory, the internet is owned by everyone that uses it. Yet, in reality, certain entities exert more influence over the "mechanics" and regulation of the internet than others. To understand the notion of ownership, one must understand the backbone of the internet--Domain Name Systems. As the internet continues to become a larger component of education, teachers need to be aware of the political, commercial, and public influences affecting the internet. The internet opens the door to new horizons of curriculum development, communications, research, and resources to support education. As educators, the Domain Name System has the potential to provide direction and simplification ofinternet resources. The following issues will be examined in this discussion of ownership:   

Domain Name Systems 

Control of Domain Name Systems 

Conflicts and Inequities in the Domain Name System 

Relevance to Education 

In deciding which ownership or licensing arrangements will work for your business, keep in mind the following rule: The more important content or technology is to your site, the more crucial it is that you either get ownership or a broad license to use and possibly modify those materials. This is true whether or not the Web developer has a valid reason to retain ownership. If it's essential that you own copyright ownership in a database or other technology, don't enter into an agreement that won't confer the rights you need.

**The demonstration shows an awareness of royalty issues related to Internet development.**

**Royalty-free**, or **RF**, refers to the right to use copyrighted material or intellectual property without the need to pay royalties or license fees for each use or per volume sold, or some time period of use or sales. Many computer industry standards, especially those developed and submitted by industry consortiums or individual companies, involve royalties for the actual use of these standards. These royalties are typically charged on a "per port" basis, where the manufacturer of end-user devices has to pay a small fixed fee for each device sold, and also include a substantial annual fixed fee. With millions of devices sold each year, the royalties can amount to several millions of dollars, which is a significant burden for the manufacturer. Examples of such royalties-based standards include IEEE 1394, HDMI, and H.264/MPEG-4 AVC.

**How Long to Expect Royalty Rates / Profit Sharing from Software Development**

Whether the software royalties should continue indefinitely, one should figure out what happens after developing version 1.0 of the application.  If the software developers' input stops there (and other developers end up taking the application further), perhaps the software developer should expect royalties to stop at some point too. This becomes tricky when the client insists on owning the adapted source code which you originally owned. The client should pay for the initial source code if he wishes to take ownership of the final "adapted program." For example, if the client wishes to enter a limited contract period of development, such as 3 to 5 years, what happens when the contractual period expires? Therefore, software ownership must be clearly defined at the beginning of the contract.

SESSION 4. Explain version control and security issues related to Internet Applications.
Learning Outcomes
1\. The explanation identifies version control issues related to Internet development. , 2. The explanation identifies security issues related to Internet development, and explains ways of handling each.

**The explanation identifies version control issues related to Internet development**

**Internet security** is a branch of computer security specifically related to the Internet, often involving browser security but also network security on a more general level as it applies to other applications or operating systems on a whole. Its objective is to establish rules and measures to use against attacks over the Internet.[^\[1\]^](http://en.wikipedia.org/wiki/Internet_security#cite_note-1) The Internet represents an insecure channel for exchanging information leading to a high risk of intrusion or fraud, such as phishing.[^\[2\]^](http://en.wikipedia.org/wiki/Internet_security#cite_note-2) Different methods have been used to protect the transfer of data, including encryption.

A JIT compiler runs **after** the program has started and compiles the code (usually bytecode or some kind of VM instructions) on the fly (or just-in-time, as it's called) into a form that's usually faster, typically the host CPU's native instruction set. A JIT has access to dynamic runtime information whereas a standard compiler doesn't and can make better optimizations like inlining functions that are used frequently. This is in contrast to a traditional compiler that compiles **all** the code to machine language **before** the program is first run. To paraphrase, conventional compilers build the whole program as an EXE file BEFORE the first time you run it. For newer style programs, an assembly is generated with pseudocode (p-code). Only AFTER you execute the program on the OS (e.g., by double-clicking on its icon) will the (JIT) compiler kick in and generate machine code (m-code) that the Intel-based processor or whatever will understand.

**Security token**

Some online sites offer customers the ability to use a six-digit code which randomly changes every 30-60 seconds on a security token. The key on the security token have mathematical computations built-in and manipulate numbers based on the current time built into the device. This means that every thirty seconds there's only a certain possible array of numbers which would be correct to validate access to the online account. The website that the user is logging into would be made aware of that devices' serial number and therefore would know the computation and correct time built into the device to verify that the number given is in deed one of the handful of six-digit numbers that would work in that given 30-60 second cycle. After the 30-60 seconds the device will present a new random six-digit number which can log into the website.

**Firewalls**

A firewall controls access between networks. It generally consists of gateways and filters which vary from one firewall to another. Firewalls also screen network traffic and are able to block traffic that is dangerous. Firewalls act as the intermediate server between SMTP and HTTP connections.

**Role of firewalls in Internet security and web security**

Firewalls impose restrictions on incoming and outgoing packets to and from private networks. All the traffic, whether incoming or outgoing, must pass through the firewall; only authorized traffic is allowed to pass through it. Firewalls create checkpoints between an internal private network and the public Internet, also known as *choke points*. Firewalls can create choke points based on IP source and TCP port number. They can also serve as the platform for IPsec. Using tunnel mode capability, firewall can be used to implement VPNs. Firewalls can also limit network exposure by hiding the internal network system and information from the public Internet.

**The explanation identifies security issues related to Internet development, and explains ways of handling each.**

Among the dimensions that could all too easily be compromised are:

-   Information Privacy. Threats here can range from public disclosures about an individual’s medical or credit records, to identity theft, to the acquisition (and possibly the diffusion) of classified information that could compromise national security.
-   Provision of Services. Another vulnerability is the provision of services; attacks aimed specifically at denial of service have been very effective in causing short-term disruption. Because of the dependence on Internet service providers, denial of service attacks cause enormous backlogs in communications and interfere with transactions in both business and government.
-   Critical Roles and Missions. A more serious possibility is that the implementation of missions of government agencies and departments or businesses could be affected by attacks that undermine the functionality of the systems themselves. An alternative is what might be called information tampering, something that could have serious physical consequences when virtual systems control real world processes such as manufacturing of drugs, traffic flows, safety systems, and the like.
-   Electronic Commerce. Another area that could prove to be vulnerable in a variety of ways is e-commerce. Breaches of security in financial transactions could result from (or indeed could result in) various forms of cyber-crime including fraud. Moreover, the capacity to disrupt information and communication systems on which companies depend provides enormous opportunities for extortion. A growing number of corporations are becoming dependent upon information security for both their ability to conduct business on a daily basis and also to maintain credibility with their customer base. The banking and insurance industries immediately come to mind in that regard. Additionally, incidents such as the Distributed Denial of Service attack against the Internet in February demonstrate the fragility of e-commerce security at this juncture. As the financial incentives drive more and more businesses into the realm of e-commerce, the potential for malicious activity more than keeps pace. Whether from criminals, terrorists, nations, unhappy customers or bored teenagers, e-commerce is a growing target of opportunity.
-   National Infrastructure. Advanced industrialized and post-industrialized societies depend on a series of infrastructures – communications, transportation, power grids, etc. – that are critical to the effective functioning of these societies. Damage or disruption to these infrastructures could have enormous consequences, particularly as cascading effects are taken into account. Further, as technology continues to evolve, the definition of just what comprises the "Critical National Infrastructure" will become blurred. It can be anticipated that systems that directly impact the daily functioning of technologically evolved societies will become more and more transparent to the members of those societies. The effects of these imbedded systems will be taken for granted. Should those systems become compromised, the impact will be as profound culturally as it is economically or from a national security standpoint.

-   Substantive Information. It is not only the medium that is vulnerable, but also the message itself. The integrity and validity of certain kinds of information could all too easily be compromised through the distribution of memes. A meme is broadly defined as a self-propagating or actively contagious idea. \[Lynch\]. In this context, the notion of contagion is neutral. Nevertheless, it is obvious that cyber-space is a wonderful domain for the propagation of "memetic viruses" that replicate and in effect, drive out or overwhelm the existing information.\[Matthews\]. The problem here is different from the other kinds of vulnerabilities that are related either to the availability of the channels of communication themselves or to viruses and malicious code that influence the instruction sets contained in software. Memetic viruses, in contrast, concern the content of information. Ironically, although the study of memes has developed in the west, the notion of manipulation of information and ideas to deceive and thereby influence decision-making processes is central to Chinese and Russian notions of information warfare

**Personal Information**

HTTP clients are often privy to large amounts of personal information (e.g. the user's name, location, mail address, passwords, encryption keys, etc.), and SHOULD be very careful to prevent unintentional leakage of this information via the HTTP protocol to other sources. We very strongly recommend that a convenient interface be provided for the user to control dissemination of such information, and that designers and implementors be particularly careful in this area. History shows that errors in this area often create serious security and/or privacy problems and generate highly adverse publicity for the implementor's company.

**Abuse of Server Log Information**

A server is in the position to save personal data about a user's requests which might identify their reading patterns or subjects of interest. This information is clearly confidential in nature and its handling can be constrained by law in certain countries. People using the HTTP protocol to provide data are responsible for ensuring that such material is not distributed without the permission of any individuals that are identifiable by the published results.
