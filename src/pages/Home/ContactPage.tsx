import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Youtube,
    Instagram,
    Send,
} from "lucide-react";
import Header from "@/components/Home/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // TODO: Replace with actual API endpoint
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast({
                title: "Message sent!",
                description: "We'll get back to you within 24 hours.",
            });
            setFormData({ firstName: "", lastName: "", email: "", message: "" });
        } catch {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            {/* ── Hero Section ── */}
            <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: "url('https://thedatascienceacademy.co.za/wp-content/uploads/2025/12/ChatGPT-Image-Dec-11-2025-11_28_56-AM.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[hsl(226,100%,14%,0.9)] via-[hsl(224,82%,22%,0.75)] to-[hsl(224,100%,64%,0.35)]" />
                <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-20">
                    <div className="max-w-2xl text-white">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Get In Touch With Us</h1>
                        <p className="text-lg md:text-xl text-white/90">
                            Our team is ready to assist with your learning journey, answer course-related questions,
                            and guide you throughout admissions, training, and student support.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Contact Details + Form ── */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Left: Contact Details */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6">Contact Us</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-5 bg-card rounded-2xl shadow-sm border-l-4 border-accent">
                                    <Phone className="h-6 w-6 text-accent shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-lg">Phone Numbers</h3>
                                        <p className="text-muted-foreground">+27 83 2000 205</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 bg-card rounded-2xl shadow-sm border-l-4 border-accent">
                                    <Mail className="h-6 w-6 text-accent shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-lg">Email Address</h3>
                                        <p className="text-muted-foreground">info@thedatascienceacademy.co.za</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 bg-card rounded-2xl shadow-sm border-l-4 border-accent">
                                    <MapPin className="h-6 w-6 text-accent shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-lg">Physical Address</h3>
                                        <p className="text-muted-foreground">
                                            28 Jorissen St, Polokwane Central,<br /> Polokwane, 0700
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Contact Form */}
                        <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 border-b-4 border-accent">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                                    {isSubmitting ? "Sending..." : "Send Message"} <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Map Section ── */}
            <section className="py-16 bg-background">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                        Find Our Campus
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Visit our Polokwane campus – centrally located and easily accessible.
                    </p>
                    <div className="rounded-xl overflow-hidden border-4 border-transparent bg-gradient-to-r from-primary to-accent p-1 shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.123456789!2d29.4521!3d-23.8965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ec6b9b0e5d5e5e5%3A0x1234567890abcdef!2s28%20Jorissen%20St%2C%20Polokwane%20Central%2C%20Polokwane%2C%200700!5e0!3m2!1sen!2sza!4v1700000000000"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            title="TDSA Campus Location"
                            className="rounded-lg"
                        />
                    </div>
                </div>
            </section>

            {/* ── Footer (same as LandingPage) ── */}
            <Footer />
        </div>
    );
}