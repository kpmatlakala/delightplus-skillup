import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Award,
  GraduationCap,
  ArrowRight,
  Laptop,
  Shield,
  Globe,
  ChevronRight,
  Brain,
  Code,
  Cloud,
  Cpu,
  Smartphone,
  Rocket,
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Animation variants ──────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
} as const;

/* ── Hero slides data ────────────────────────────── */
const heroSlides = [
  {
    title: "Master Data Science & Artificial Intelligence",
    subtitle: "Learn AI, Machine Learning, Cloud, Robotics & Automation with real-world projects.",
    cta: "Start Learning",
    ctaLink: "/auth/signup",
    bg: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1920",
    featured: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Hands-On Learning Experience",
    subtitle: "Build real tech projects using industry datasets and guided labs.",
    cta: "Explore Courses",
    ctaLink: "#programs",
    bg: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920",
    featured: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Launch a Future-Proof Tech Career",
    subtitle: "Become skilled in AI Engineering, Cloud, Cybersecurity, IoT & Big Data.",
    cta: "Apply Now",
    ctaLink: "/auth/signup",
    bg: "https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=1920",
    featured: "https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

/* ── Course cards ──────────────────────────────── */
const courses = [
  {
    title: "Artificial Intelligence",
    description: "Master AI systems, automation, and intelligent technologies shaping the future.",
    image: "https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "https://thedatascienceacademy.co.za/ai-data-science/",
  },
  {
    title: "Cyber Security",
    description: "Develop industry-grade cyber defence, ethical hacking and security skills.",
    image: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "https://thedatascienceacademy.co.za/cyber-security/",
  },
  {
    title: "Cloud Computing",
    description: "Gain expertise in AWS, Azure and multi-cloud infrastructure engineering.",
    image: "https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "https://thedatascienceacademy.co.za/cloud-computing/",
  },
  {
    title: "Software Development",
    description: "Master Python, Java, JavaScript, HTML, C++ and modern full-stack workflows.",
    image: "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "https://thedatascienceacademy.co.za/software-development/",
  },
];

/* ── Why Choose Us cards ─────────────────────────── */
const whyCards = [
  { icon: Award, title: "Fully Accredited", text: "Recognized by MICT-SETA & QCTO for high-quality digital skills training." },
  { icon: Cpu, title: "4IR-Focused", text: "Training that prepares you for AI, Data Science, Cyber Security & more." },
  { icon: Users, title: "Expert Facilitators", text: "Learn from industry professionals with real-world tech experience." },
  { icon: Rocket, title: "Career-Centric", text: "Programs designed to boost employability and future opportunities." },
];

/* ── Course Categories ───────────────────────────── */
const categories = [
  { icon: Brain, label: "AI & Data Science", link: "https://thedatascienceacademy.co.za/ai-data-science" },
  { icon: Shield, label: "Cyber Security & Cloud", link: "https://thedatascienceacademy.co.za/cyber-cloud" },
  { icon: Code, label: "Software Development", link: "https://thedatascienceacademy.co.za/software-development" },
  { icon: Globe, label: "Emerging Technologies", link: "https://thedatascienceacademy.co.za/emerging-technologies" },
  { icon: Smartphone, label: "Mobile & Device Tech", link: "https://thedatascienceacademy.co.za/mobile-device-tech" },
  { icon: Laptop, label: "Drone & Hardware Tech", link: "https://thedatascienceacademy.co.za/drone-hardware-tech" },
];

/* ── Testimonials ────────────────────────────────── */
const testimonials = [
  {
    name: "Ayanda Mthembu",
    role: "Data Science Student — Durban",
    quote: "The Academy helped me understand Python and machine learning from scratch. The support was amazing!",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
  },
  {
    name: "Chad Petersen",
    role: "Cybersecurity Trainee — Cape Town",
    quote: "I loved the cybersecurity labs! It felt like real SOC training. I'm now applying for junior analyst roles.",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    name: "Riya Naidoo",
    role: "Cloud Computing Learner — Johannesburg",
    quote: "The AWS labs gave me real confidence. I finally understand cloud architecture and deployments.",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    name: "Michael Smith",
    role: "AI & Robotics Student — Pretoria",
    quote: "The robotics and automation modules were mind-blowing. Amazing lecturers and practical projects!",
    avatar: "https://randomuser.me/api/portraits/men/31.jpg",
  },
];

/* ── Accreditation partners ──────────────────────── */
const partners = [
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "QCTO", logo: "https://thedatascienceacademy.co.za/wp-content/uploads/2025/12/Quality-Council-for-Trades-and-Occupations-QCTO-Hero-1-_1_-3.webp" },
  { name: "MICT SETA", logo: "https://thedatascienceacademy.co.za/wp-content/uploads/2025/12/images-3.jpeg" },
];

/* ════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlideIndex((i) => (i + 1) % heroSlides.length), 5800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Top Bar ──────────────────────────────── */}
      <div className="hidden md:flex dsa-gradient-bg text-white text-xs px-6 py-2 justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> +27 83 2000 205</span>
          <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> info@thedatascienceacademy.co.za</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> 28 Jorissen St, Polokwane, 0700</span>
        </div>
      </div>

      {/* ── Navbar ───────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logos/dsa-logo.png" alt="DSA" className="h-12 w-auto object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#programs" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> Explore Courses
            </a>
            <a href="#why" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <a href="#accreditations" className="text-muted-foreground hover:text-foreground transition-colors">Accreditation</a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth/login">Student Portal</Link>
            </Button>
            <Button size="sm" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/auth/signup">
                Apply Now <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero Slider ──────────────────────────── */}
      <section className="relative h-[88vh] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[1300ms] ${i === slideIndex ? "opacity-100" : "opacity-0"}`}
          >
            {/* Background */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-[1.04] blur-[3px]"
              style={{ backgroundImage: `url('${slide.bg}')` }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(226,100%,14%,0.9)] via-[hsl(224,82%,22%,0.75)] to-[hsl(0,0%,0%,0.5)] z-10" />
            {/* Hologram grid */}
            <div
              className="absolute inset-0 z-[12] pointer-events-none mix-blend-overlay opacity-25"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "55px 55px",
              }}
            />

            {/* Featured image */}
            <div className={`absolute right-0 top-0 left-1/2 w-1/2 h-full z-[15] hidden lg:block transition-all duration-[1500ms] delay-300 ${i === slideIndex ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
              <img src={slide.featured} alt="" className="w-full h-full object-cover" />
            </div>

            {/* Text Content */}
            <div className="absolute top-1/2 left-[6%] -translate-y-1/2 z-20 max-w-[48%] text-white max-lg:max-w-[90%] max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.08] mb-5">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl opacity-90 mb-7">{slide.subtitle}</p>
              {slide.ctaLink.startsWith("#") ? (
                <a
                  href={slide.ctaLink}
                  className="inline-block px-8 py-3.5 rounded-lg font-bold text-base bg-gradient-to-r from-accent to-primary text-white shadow-lg hover:-translate-y-1 transition-transform"
                >
                  {slide.cta}
                </a>
              ) : (
                <Link
                  to={slide.ctaLink}
                  className="inline-block px-8 py-3.5 rounded-lg font-bold text-base bg-gradient-to-r from-accent to-primary text-white shadow-lg hover:-translate-y-1 transition-transform"
                >
                  {slide.cta}
                </Link>
              )}
            </div>
          </div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === slideIndex ? "bg-white scale-125" : "bg-white/45"}`}
            />
          ))}
        </div>
      </section>

      {/* ── Top Rated Courses ────────────────────── */}
      <section id="programs" className="py-20 bg-gradient-to-br from-background via-card to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold">
              <span className="dsa-gradient-text">Top Rated Courses</span>
            </h2>
            <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-primary to-accent opacity-80" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((c, i) => (
              <motion.a
                key={c.title}
                href={c.link}
                target="_blank"
                rel="noreferrer"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                custom={i}
                className="group bg-card/75 backdrop-blur-sm rounded-2xl overflow-hidden border border-border shadow-lg hover:-translate-y-2.5 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden h-48">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                </div>
                <div className="p-5 text-left">
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.description}</p>
                  <span className="inline-block px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-accent to-primary shadow-md group-hover:scale-105 transition-transform">
                    View More Info
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────── */}
      <section id="why" className="relative py-20 overflow-hidden" style={{ background: "hsl(226 100% 14%)" }}>
        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-accent opacity-50 animate-pulse"
            style={{
              top: `${15 + i * 18}%`,
              left: `${10 + i * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${7 + i}s`,
            }}
          />
        ))}

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-10"
          >
            Why Choose The Data Science Academy
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {whyCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                custom={i}
                className="bg-white/10 backdrop-blur p-7 rounded-2xl border border-white/25 hover:-translate-y-1.5 hover:bg-white/[0.18] transition-all duration-300"
              >
                <card.icon className="h-10 w-10 text-accent mb-3" />
                <h3 className="text-lg font-bold text-white mb-1.5">{card.title}</h3>
                <p className="text-sm text-white/90">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Course Categories ────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-background via-card to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">Our Course Categories</h2>
            <div className="w-28 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-primary to-accent opacity-80" />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-7">
            {categories.map((cat, i) => (
              <motion.a
                key={cat.label}
                href={cat.link}
                target="_blank"
                rel="noreferrer"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                custom={i}
                className="group bg-card/75 backdrop-blur-sm rounded-2xl p-6 text-center border border-border shadow-md hover:-translate-y-2.5 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full dsa-gradient-bg flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-[4deg] transition-transform duration-300">
                  <cat.icon className="h-7 w-7" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{cat.label}</h3>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────── */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">What Our Students Say</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Real testimonials from our learners building future-ready tech careers.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                custom={i}
                className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-7 shadow-md hover:-translate-y-3 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Glass reflection */}
                <div className="absolute top-0 -left-[40%] w-[180%] h-full bg-gradient-to-br from-white/[0.18] via-white/[0.05] to-white/[0.2] opacity-25 pointer-events-none" />

                <div className="flex items-center gap-3 mb-4">
                  <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-accent/30 shadow-md" loading="lazy" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{t.name}</h4>
                    <span className="text-xs text-muted-foreground">{t.role}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────── */}
      <section className="relative py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(226,100%,14%,0.92)] via-[hsl(224,82%,22%,0.78)] to-[hsl(224,100%,64%,0.35)]" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-white">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl sm:text-[46px] font-extrabold mb-5 leading-tight drop-shadow-lg">
              Take Your Tech Career to the Next Level
            </h2>
            <p className="text-lg sm:text-xl opacity-95 mb-10 leading-relaxed drop-shadow-md">
              Whether you're beginning your journey in Data Science or advancing into AI, Machine Learning,
              and Cloud Engineering, The Data Science Academy is here to empower your next breakthrough.
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              <Button size="lg" asChild className="text-base px-9 bg-gradient-to-r from-accent to-primary shadow-xl hover:-translate-y-1 transition-transform">
                <Link to="/auth/signup">Apply Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base px-9 border-white/60 text-white hover:bg-white/15"
              >
                <a href="#programs">Explore Courses</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Accreditations ───────────────────────── */}
      <section id="accreditations" className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold dsa-gradient-text">Accreditations & Partners</h2>
            <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-primary to-accent opacity-80" />
            <p className="mt-5 text-muted-foreground max-w-2xl mx-auto">
              Our training is aligned with global technology leaders and South African accreditation authorities,
              ensuring internationally recognised and industry-relevant qualifications.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {partners.map((p, i) => (
              <motion.div
                key={p.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                custom={i}
                className="flex items-center justify-center h-28 bg-card rounded-2xl border border-border shadow-sm hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 p-5"
              >
                <img src={p.logo} alt={p.name} className="max-h-16 w-auto object-contain opacity-85" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="dsa-gradient-bg text-white py-16 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-28 -right-28 w-64 h-64 bg-white/15 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logos/dsa-logo.png" alt="DSA" className="h-14 w-auto object-contain brightness-0 invert" />
              </div>
              <p className="text-sm text-white/85 leading-relaxed max-w-xs">
                A future-forward learning institution dedicated to equipping the next generation of African
                innovators with practical skills in data science, artificial intelligence, and emerging technologies.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4 relative pb-2">
                Quick Links
                <span className="absolute bottom-0 left-0 w-11 h-0.5 bg-accent rounded" />
              </h4>
              <ul className="space-y-2.5 text-sm text-white/80">
                <li><Link to="/home" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center gap-1.5"><ChevronRight className="h-3 w-3" /> Home</Link></li>
                <li><a href="#programs" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center gap-1.5"><ChevronRight className="h-3 w-3" /> Explore Courses</a></li>
                <li><a href="#accreditations" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center gap-1.5"><ChevronRight className="h-3 w-3" /> Accreditation</a></li>
                <li><Link to="/auth/login" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center gap-1.5"><ChevronRight className="h-3 w-3" /> Student Portal</Link></li>
                <li><Link to="/auth/signup" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center gap-1.5"><ChevronRight className="h-3 w-3" /> Apply Now</Link></li>
              </ul>
            </div>

            {/* Course Categories */}
            <div>
              <h4 className="font-bold text-lg mb-4 relative pb-2">
                Course Categories
                <span className="absolute bottom-0 left-0 w-11 h-0.5 bg-accent rounded" />
              </h4>
              <ul className="space-y-2.5 text-sm text-white/80">
                {categories.map((cat) => (
                  <li key={cat.label}>
                    <a href={cat.link} target="_blank" rel="noreferrer" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center gap-1.5">
                      <ChevronRight className="h-3 w-3" /> {cat.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4 relative pb-2">
                Contact Us
                <span className="absolute bottom-0 left-0 w-11 h-0.5 bg-accent rounded" />
              </h4>
              <div className="space-y-3 text-sm text-white/85">
                <div className="flex items-start gap-2.5"><Phone className="h-4 w-4 mt-0.5 shrink-0" /> +27 83 2000 205</div>
                <div className="flex items-start gap-2.5"><Mail className="h-4 w-4 mt-0.5 shrink-0" /> info@thedatascienceacademy.co.za</div>
                <div className="flex items-start gap-2.5"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> 28 Jorissen St, Polokwane Central, Polokwane, 0700</div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/25 mt-14 pt-5 text-center text-xs text-white/80">
            © {new Date().getFullYear()} The Data Science Academy. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
