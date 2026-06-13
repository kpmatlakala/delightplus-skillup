import { Link } from "react-router-dom";
import { ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import { PROGRAM_CATEGORIES, CATEGORY_SLUGS } from "@/data/dsaProgramCatalog";

export default function Footer() {
    return (
        <footer className="dsa-gradient-bg text-white py-16 relative overflow-hidden">
            {/* Glow effect */}
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
                            <li>
                                <Link to="/" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center gap-1.5">
                                    <ChevronRight className="h-3 w-3" /> Home
                                </Link>
                            </li>
                            <li>
                                <a href="#programs" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center gap-1.5">
                                    <ChevronRight className="h-3 w-3" /> Explore Courses
                                </a>
                            </li>
                            <li>
                                <a href="#accreditations" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center gap-1.5">
                                    <ChevronRight className="h-3 w-3" /> Accreditation
                                </a>
                            </li>
                            <li>
                                <Link to="/auth/login" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center gap-1.5">
                                    <ChevronRight className="h-3 w-3" /> Student Portal
                                </Link>
                            </li>
                            <li>
                                <Link to="/auth/signup" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center gap-1.5">
                                    <ChevronRight className="h-3 w-3" /> Apply Now
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Course Categories */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 relative pb-2">
                            Course Categories
                            <span className="absolute bottom-0 left-0 w-11 h-0.5 bg-accent rounded" />
                        </h4>
                        <ul className="space-y-2.5 text-sm text-white/80">
                            {PROGRAM_CATEGORIES.map((cat) => (
                                <li key={cat}>
                                    <Link
                                        to={`/category/${CATEGORY_SLUGS[cat]}`}
                                        className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center gap-1.5"
                                    >
                                        <ChevronRight className="h-3 w-3" /> {cat}
                                    </Link>
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
                            <div className="flex items-start gap-2.5">
                                <Phone className="h-4 w-4 mt-0.5 shrink-0" /> +27 83 2000 205
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Mail className="h-4 w-4 mt-0.5 shrink-0" /> info@thedatascienceacademy.co.za
                            </div>
                            <div className="flex items-start gap-2.5">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0" /> 28 Jorissen St, Polokwane Central, Polokwane, 0700
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/25 mt-14 pt-5 text-center text-xs text-white/80">
                    © {new Date().getFullYear()} The Data Science Academy. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}