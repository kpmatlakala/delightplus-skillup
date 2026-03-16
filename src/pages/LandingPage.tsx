import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Award,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Laptop,
  Shield,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-learning.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const programs = [
  {
    title: "IT Systems Development",
    level: "NQF Level 4",
    duration: "3 Blocks",
    credits: "131 Credits",
    saqa: "SAQA 78965",
    tag: "FETC",
    description:
      "Comprehensive qualification covering systems analysis, programming, networking, and project management for aspiring IT professionals.",
  },
  {
    title: "AI & Data Essentials",
    level: "Short Course",
    duration: "6 Weeks",
    credits: "Coming Soon",
    tag: "4IR",
    description:
      "Introduction to artificial intelligence, machine learning concepts, and data-driven decision making for the modern workplace.",
  },
  {
    title: "Digital Skills for Educators",
    level: "Short Course",
    duration: "4 Weeks",
    credits: "Coming Soon",
    tag: "CPD",
    description:
      "Empower educators with essential digital tools, online facilitation skills, and blended learning strategies.",
  },
  {
    title: "Cloud Computing Fundamentals",
    level: "Short Course",
    duration: "8 Weeks",
    credits: "Coming Soon",
    tag: "4IR",
    description:
      "Master cloud infrastructure concepts, deployment models, and service architectures for the modern tech landscape.",
  },
];

const stats = [
  { value: "20+", label: "Active Learners", icon: Users },
  { value: "18", label: "Unit Standards", icon: BookOpen },
  { value: "131", label: "Total Credits", icon: Award },
  { value: "NQF 4", label: "Qualification Level", icon: GraduationCap },
];

const testimonials = [
  {
    quote:
      "The CET Connect platform made it easy to track my progress through each module. The structured approach helped me stay focused and motivated throughout the programme.",
    name: "Tshifhiwa M.",
    role: "IT Systems Development Learner",
  },
  {
    quote:
      "As a facilitator, having all lesson plans, assessments, and learner progress in one place has transformed how I deliver training. The real-time communication tools are invaluable.",
    name: "Facilitator",
    role: "DSA Course Facilitator",
  },
  {
    quote:
      "The blended learning approach — combining in-person sessions with digital resources — ensures every learner can engage at their own pace while maintaining quality standards.",
    name: "Programme Coordinator",
    role: "CET Venda",
  },
];

const features = [
  {
    icon: Laptop,
    title: "Blended Learning",
    description:
      "Combine in-person sessions with self-paced digital resources for flexible, accessible education.",
  },
  {
    icon: Shield,
    title: "SAQA Compliant",
    description:
      "Full compliance with SAQA, MICT SETA, and ETQA requirements for accredited qualifications.",
  },
  {
    icon: BookOpen,
    title: "Rich Resources",
    description:
      "Downloadable workbooks, assessment packs, lesson plans, and facilitator guides for every module.",
  },
  {
    icon: Globe,
    title: "4IR Ready",
    description:
      "Future-focused curriculum aligned with Fourth Industrial Revolution skills and industry demands.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navbar ──────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logos/dsa-logo.png"
              alt="DSA"
              className="h-9 w-9 rounded-sm object-contain"
            />
            <span className="font-display text-lg font-bold tracking-tight">
              CET<span className="text-primary"> Connect</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#programs" className="text-muted-foreground hover:text-foreground transition-colors">
              Programmes
            </a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#impact" className="text-muted-foreground hover:text-foreground transition-colors">
              Impact
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Voices
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/auth/signup">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/90 to-primary/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.12 } },
              }}
            >
              <motion.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary-foreground border border-primary/30 mb-6">
                  <Award className="h-3.5 w-3.5" /> SAQA 78965 · NQF Level 4
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-foreground leading-[1.1] tracking-tight"
              >
                Shaping Africa's
                <br />
                <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                  Tech Generation
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="mt-6 text-lg text-secondary-foreground/80 max-w-lg leading-relaxed"
              >
                CET Connect empowers CET lecturers and learners with accredited,
                4IR-aligned qualifications. Build your AI-ready future with the
                Data Science Academy.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" asChild className="text-base px-8">
                  <Link to="/auth/signup">
                    Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-base px-8 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10"
                >
                  <a href="#programs">Explore Programmes</a>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImg}
                  alt="Learners collaborating on laptops at CET Venda"
                  className="w-full h-[420px] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path
              d="M0 40C360 80 720 0 1080 40C1260 60 1380 50 1440 40V80H0V40Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────── */}
      <section id="impact" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border"
              >
                <stat.icon className="h-8 w-8 text-primary mb-3" />
                <span className="font-display text-3xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground mt-1">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programs ──────────────────────────────────── */}
      <section id="programs" className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Our Programmes
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Accredited qualifications and future-focused short courses designed for
              CET lecturers and aspiring tech professionals.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((prog, i) => (
              <motion.div
                key={prog.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                custom={i}
                className="group relative bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 ${
                    prog.tag === "FETC"
                      ? "bg-primary/15 text-primary"
                      : prog.tag === "4IR"
                      ? "bg-info/15 text-info"
                      : "bg-success/15 text-success"
                  }`}
                >
                  {prog.tag}
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {prog.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {prog.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-5">
                  <span className="px-2 py-0.5 bg-muted/20 rounded">{prog.level}</span>
                  <span className="px-2 py-0.5 bg-muted/20 rounded">{prog.duration}</span>
                  <span className="px-2 py-0.5 bg-muted/20 rounded">{prog.credits}</span>
                </div>
                <Link
                  to={prog.credits === "Coming Soon" ? "#" : "/auth/signup"}
                  className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 gap-1 transition-all"
                >
                  {prog.credits === "Coming Soon" ? "Register Interest" : "Enrol Now"}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              The CET Connect Advantage
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Beyond technical training — we prepare you for a successful career with
              industry-aligned skills and SAQA-accredited qualifications.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 text-primary mb-4">
                  <feat.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section id="testimonials" className="py-20 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Why Learners Love CET Connect
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Hear from our learners and facilitators about their transformative journeys.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                custom={i}
                className="bg-card border border-border rounded-xl p-8 relative"
              >
                <div className="text-5xl font-serif text-primary/20 absolute top-4 left-6">
                  "
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 pt-6">
                  {t.quote}
                </p>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-secondary to-secondary/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.3),transparent_70%)]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-secondary-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-secondary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Do more for your career with CET Connect. Join a community of learners
              building the future of tech in South Africa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="text-base px-10">
                <Link to="/auth/signup">
                  Create Account <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base px-10 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10"
              >
                <Link to="/auth/login">Sign In</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/logos/dsa-logo.png"
                  alt="DSA"
                  className="h-8 w-8 rounded-sm object-contain"
                />
                <span className="font-display font-bold">
                  CET<span className="text-primary"> Connect</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                A catalyst for an inclusive, 4IR-driven, innovative knowledge economy.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Programmes</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>IT Systems Development</li>
                <li>AI & Data Essentials</li>
                <li>Digital Skills for Educators</li>
                <li>Cloud Computing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://thedatascienceacademy.co.za/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    Data Science Academy
                  </a>
                </li>
                <li>CET Venda</li>
                <li>SAQA 78965</li>
                <li>MICT SETA</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/auth/login" className="hover:text-foreground transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/auth/signup" className="hover:text-foreground transition-colors">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground gap-3">
            <p>© {new Date().getFullYear()} Data Science Academy. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
