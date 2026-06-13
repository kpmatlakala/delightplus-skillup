import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Phone, Mail, MapPin, Facebook, Twitter, Youtube, Instagram,
    BookOpen, ChevronDown, Award, Info, Star, User, ArrowRight,
    Brain, Code, Shield, Cloud, Cpu, Rocket, GraduationCap, Users,
} from "lucide-react";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Top Bar */}
            <div className="hidden md:flex dsa-gradient-bg text-white text-xs px-6 py-2 justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> +27 83 2000 205</span>
                    <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> info@thedatascienceacademy.co.za</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> 28 Jorissen St, Polokwane, 0700</span>
                </div>
                <a href="/contact" className="text-white hover:text-accent transition-colors">Contact Us</a>
                <div className="flex items-center gap-3">
                    <a href="https://facebook.com/thedatascienceacademy" target="_blank" rel="noopener noreferrer" className="hover:text-accent"><Facebook className="h-3.5 w-3.5" /></a>
                    <a href="https://twitter.com/thedatascienceacademy" target="_blank" rel="noopener noreferrer" className="hover:text-accent"><Twitter className="h-3.5 w-3.5" /></a>
                    <a href="https://youtube.com/thedatascienceacademy" target="_blank" rel="noopener noreferrer" className="hover:text-accent"><Youtube className="h-3.5 w-3.5" /></a>
                    <a href="https://instagram.com/thedatascienceacademy" target="_blank" rel="noopener noreferrer" className="hover:text-accent"><Instagram className="h-3.5 w-3.5" /></a>
                </div>
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/logos/dsa-logo.png" alt="DSA" className="h-12 w-auto object-contain" />
                        </Link>

                        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                            {/* Explore Courses dropdown */}
                            <div className="relative group">
                                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                                    <BookOpen className="h-4 w-4" /> Explore Courses <ChevronDown className="h-3 w-3 ml-0.5" />
                                </button>
                                <div className="absolute left-0 top-full pt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
                                    <div className="w-screen max-w-2xl bg-card border border-border rounded-lg shadow-xl p-6 grid grid-cols-2 gap-4">
                                        <a href="/ai-data-science" className="flex gap-3 p-3 rounded-lg hover:bg-accent"><Brain className="h-5 w-5 text-primary" /> AI & Data Science</a>
                                        <a href="/software-development" className="flex gap-3 p-3 rounded-lg hover:bg-accent"><Code className="h-5 w-5 text-primary" /> Software Development</a>
                                        <a href="/cyber-security" className="flex gap-3 p-3 rounded-lg hover:bg-accent"><Shield className="h-5 w-5 text-primary" /> Cyber Security</a>
                                        <a href="/cloud-computing" className="flex gap-3 p-3 rounded-lg hover:bg-accent"><Cloud className="h-5 w-5 text-primary" /> Cloud Computing</a>
                                        <a href="/emerging-technologies" className="flex gap-3 p-3 rounded-lg hover:bg-accent"><Cpu className="h-5 w-5 text-primary" /> Emerging Technologies</a>
                                        <a href="/drone-hardware-tech" className="flex gap-3 p-3 rounded-lg hover:bg-accent"><Rocket className="h-5 w-5 text-primary" /> Drone & Hardware Tech</a>
                                    </div>
                                </div>
                            </div>

                            <a href="/accreditation" className="flex items-center gap-1 text-muted-foreground hover:text-foreground"><Award className="h-4 w-4" /> Accreditation</a>

                            <div className="relative group">
                                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground"><Info className="h-4 w-4" /> About Us <ChevronDown className="h-3 w-3 ml-0.5" /></button>
                                <div className="absolute left-0 top-full pt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
                                    <div className="w-48 bg-card border border-border rounded-lg shadow-lg py-2">
                                        <a href="/who-we-are" className="flex gap-3 px-4 py-2 hover:bg-accent text-sm"><Users className="h-4 w-4" /> Who We Are</a>
                                        <a href="/faq" className="flex gap-3 px-4 py-2 hover:bg-accent text-sm"><GraduationCap className="h-4 w-4" /> FAQ</a>
                                        <a href="/blog" className="flex gap-3 px-4 py-2 hover:bg-accent text-sm"><BookOpen className="h-4 w-4" /> Blog</a>
                                        <a href="/events" className="flex gap-3 px-4 py-2 hover:bg-accent text-sm"><Star className="h-4 w-4" /> Events</a>
                                    </div>
                                </div>
                            </div>

                            <a href="/testimonials" className="flex items-center gap-1 text-muted-foreground hover:text-foreground"><Star className="h-4 w-4" /> Testimonials</a>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" asChild><Link to="/auth/login" className="flex items-center gap-1"><User className="h-4 w-4" /> Student Portal</Link></Button>
                            <Button size="sm" asChild className="bg-accent text-accent-foreground"><Link to="/auth/signup" className="flex items-center gap-1">Apply Now <ArrowRight className="h-4 w-4" /></Link></Button>
                            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                <span className="sr-only">Menu</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-border">
                            <div className="flex flex-col gap-3">
                                <details className="group"><summary className="flex items-center gap-2 p-2 font-medium"><BookOpen className="h-4 w-4" /> Explore Courses</summary><div className="pl-6 mt-1 flex flex-col gap-2">...</div></details>
                                <a href="/accreditation" className="flex items-center gap-2 p-2"><Award className="h-4 w-4" /> Accreditation</a>
                                <details className="group"><summary className="flex items-center gap-2 p-2 font-medium"><Info className="h-4 w-4" /> About Us</summary><div className="pl-6 mt-1 flex flex-col gap-2">...</div></details>
                                <a href="/testimonials" className="flex items-center gap-2 p-2"><Star className="h-4 w-4" /> Testimonials</a>
                                <hr />
                                <Link to="/auth/login" className="flex items-center gap-2 p-2"><User className="h-4 w-4" /> Student Portal</Link>
                                <Link to="/auth/signup" className="flex items-center gap-2 p-2 bg-accent/10 rounded">Apply Now →</Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}