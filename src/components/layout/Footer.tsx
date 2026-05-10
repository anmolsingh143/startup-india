"use client";

import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Link as LinkIcon, 
  Globe, 
  X,
  MapPin, 
  ArrowUpRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";

const COMPANY_DETAILS = {
  name: "Startup India Technologies Pvt. Ltd.",
  emails: {
    support: "support.startupindiatech@gmail.com",
    internship: "internships.startupindiatech@gmail.com"
  },
  phone: "+91 86601 01906",
  whatsapp: "+91 86601 01906",
  address: "Fourth Floor, Tech Hub, 675, 9th Main Rd, HSR Layout, Bengaluru, Karnataka 560102"
};

const FOOTER_LINKS = [
  {
    title: "Quick Navigation",
    links: [
      { name: "Home", href: "/" },
      { name: "Programs", href: "/#programs" },
      { name: "Certifications", href: "/certification" },
      { name: "Internships", href: "/internships" },
      { name: "Contact Us", href: "/contact" },
      { name: "Employee Login", href: "/employee/sign-in" }
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Success Stories", href: "#" },
      { name: "Verify Certificate", href: "/certification" },
      { name: "Career Blog", href: "#" },
      { name: "Hiring Partners", href: "#" },
      { name: "Terms of Service", href: "#" }
    ]
  }
];

const SOCIAL_LINKS = [
  { name: "LinkedIn", icon: <LinkIcon className="w-5 h-5" />, href: "#", color: "hover:text-[#0077B5]" },
  { name: "Instagram", icon: <Globe className="w-5 h-5" />, href: "#", color: "hover:text-[#E4405F]" },
  { name: "X", icon: <X className="w-5 h-5" />, href: "#", color: "hover:text-[#000000]" },
  { name: "WhatsApp", icon: <MessageCircle className="w-5 h-5" />, href: "#", color: "hover:text-[#25D366]" }
];

export function Footer() {
  return (
    <footer className="relative z-10 bg-background/80 backdrop-blur-3xl border-t border-border/40 pt-24 pb-12 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Company Section */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="relative">
                <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain bg-white/90 p-1 rounded-lg" />
                <div className="absolute -inset-1 bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              </div>
              <span className="font-space-grotesk font-black text-xl tracking-tight text-foreground">STARTUP INDIA</span>
            </Link>
            <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
              Empowering India’s future with high-impact internships and AI-driven skill development. Build your billion-dollar career today.
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 rounded-xl bg-muted/50 border border-border flex items-center justify-center transition-all ${social.color} hover:bg-background hover:scale-110 hover:shadow-lg`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h4 className="font-space-grotesk font-bold text-foreground mb-8 text-sm uppercase tracking-widest">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center group font-medium"
                    >
                      <ArrowUpRight className="w-3 h-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div>
            <h4 className="font-space-grotesk font-bold text-foreground mb-8 text-sm uppercase tracking-widest">Support Hub</h4>
            <ul className="space-y-6">
              <li className="group">
                <a href={`mailto:${COMPANY_DETAILS.emails.support}`} className="flex items-start gap-3 hover:text-primary transition-colors">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter mb-1">General Support</p>
                    <p className="text-sm font-semibold break-all">{COMPANY_DETAILS.emails.support}</p>
                  </div>
                </a>
              </li>
              <li className="group">
                <a href={`mailto:${COMPANY_DETAILS.emails.internship}`} className="flex items-start gap-3 hover:text-primary transition-colors">
                  <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter mb-1">Internship Queries</p>
                    <p className="text-sm font-semibold break-all">{COMPANY_DETAILS.emails.internship}</p>
                  </div>
                </a>
              </li>
              <li className="group">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter mb-1">Call / WhatsApp</p>
                    <p className="text-sm font-semibold">{COMPANY_DETAILS.phone}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/40 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-medium text-muted-foreground">
            © 2026 {COMPANY_DETAILS.name}. <span className="hidden sm:inline">Crafted with precision in Bengaluru.</span>
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Refunds</a>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-[10px] uppercase tracking-tighter">
              <ShieldCheck className="w-3 h-3 text-green-500" /> Secure SSL Encrypted
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
