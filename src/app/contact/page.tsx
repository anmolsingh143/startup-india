"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Send, 
  CheckCircle, 
  MapPin, 
  ChevronDown,
  Clock,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/layout/Footer";

const FAQS = [
  {
    q: "How soon will I get a response?",
    a: "Our support team typically responds within 2-4 business hours for internship queries and within 24 hours for general support."
  },
  {
    q: "Can I change my internship domain after enrolling?",
    a: "Yes, domain changes are permitted within the first 7 days of the program. Please contact internships support for assistance."
  },
  {
    q: "Are the certificates verifiable online?",
    a: "Absolutely. All certificates issued by Startup India Technologies are verifiable through our online portal using a unique QR code/ID."
  },
  {
    q: "Do you offer placement assistance?",
    a: "Yes, we have over 500+ hiring partners and provide dedicated placement support, resume reviews, and mock interviews to all successful interns."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8"
          >
            <MessageCircle className="w-4 h-4" />
            <span>24/7 Premium Support Hub</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-space-grotesk font-black tracking-tighter mb-6"
          >
            How Can We <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Accelerate</span> Your Journey?
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
          >
            Have questions about internships, courses, or certifications? Our expert support team is here to help you every step of the way.
          </motion.p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-3xl font-space-grotesk font-bold mb-8">Get in Touch Directly</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Support Email</h3>
                  <p className="text-sm text-muted-foreground font-medium break-all">support.startupindiatech@gmail.com</p>
                </div>
                <div className="p-6 rounded-3xl bg-card border border-border hover:border-secondary/50 transition-colors shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Internship Support</h3>
                  <p className="text-sm text-muted-foreground font-medium break-all">internships.startupindiatech@gmail.com</p>
                </div>
                <div className="p-6 rounded-3xl bg-card border border-border hover:border-green-500/50 transition-colors shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mb-6">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Call / WhatsApp</h3>
                  <p className="text-sm text-muted-foreground font-medium">+91 86601 01906</p>
                </div>
                <div className="p-6 rounded-3xl bg-card border border-border hover:border-blue-500/50 transition-colors shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Working Hours</h3>
                  <p className="text-sm text-muted-foreground font-medium">Mon - Sat: 10 AM - 7 PM</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-muted/50 border border-border relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <MapPin className="w-32 h-32" />
              </div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Corporate Headquarters
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed max-w-md">
                Fourth Floor, Tech Hub, 675, 9th Main Rd, HSR Layout, Bengaluru, Karnataka 560102
              </p>
              <Button variant="link" className="p-0 h-auto mt-6 text-primary font-bold">
                View on Google Maps →
              </Button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative"
          >
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                      <Input 
                        placeholder="John Doe" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="h-14 rounded-2xl border-border bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="h-14 rounded-2xl border-border bg-background"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                      <Input 
                        placeholder="+91 00000 00000" 
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="h-14 rounded-2xl border-border bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Subject</label>
                      <Input 
                        placeholder="Internship Inquiry" 
                        required 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="h-14 rounded-2xl border-border bg-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Message</label>
                    <textarea 
                      placeholder="How can we help you?" 
                      required 
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full rounded-2xl border border-border bg-background p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold shadow-xl shadow-primary/25"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="w-5 h-5 ml-2" />
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-8">
                    <CheckCircle className="w-16 h-16" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 font-space-grotesk">Message Sent Successfully!</h2>
                  <p className="text-muted-foreground text-lg max-w-sm font-medium">
                    Thank you for reaching out. Our support executive will get back to you shortly.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-8 h-12 px-8 rounded-xl font-bold"
                    onClick={() => setIsSuccess(false)}
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="text-primary border-primary mb-3 bg-primary/10 px-4 py-1 text-sm font-bold tracking-widest uppercase">FAQ Hub</Badge>
            <h2 className="text-3xl md:text-5xl font-space-grotesk font-bold mb-4">Common Support Queries</h2>
          </div>
          
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <details key={idx} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-bold text-foreground list-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 text-primary" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground font-medium leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
