"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Link as LinkIcon, Mail, Globe, Share2, Plus, X } from "lucide-react";

const SOCIAL_LINKS = [
  {
    name: "WhatsApp",
    icon: <MessageCircle className="w-5 h-5" />,
    color: "bg-[#25D366]",
    href: "https://wa.me/918660101906?text=Hello%20Startup%20India%20Technologies%20Pvt.%20Ltd.,%20I%20want%20support%20regarding%20internships%20and%20courses.",
  },
  {
    name: "LinkedIn",
    icon: <LinkIcon className="w-5 h-5" />,
    color: "bg-[#0077B5]",
    href: "https://linkedin.com/company/startupindiatech",
  },
  {
    name: "Email",
    icon: <Mail className="w-5 h-5" />,
    color: "bg-[#EA4335]",
    href: "mailto:support.startupindiatech@gmail.com",
  },
  {
    name: "Instagram",
    icon: <Globe className="w-5 h-5" />,
    color: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    href: "#",
  },
];

export function SocialPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-[100] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-3"
          >
            {SOCIAL_LINKS.map((link, idx) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`group relative flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg transition-transform hover:scale-110 active:scale-95 ${link.color}`}
              >
                {link.icon}
                <span className="absolute right-14 px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                  {link.name}
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl shadow-primary/40 border border-primary-foreground/20"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Share2 className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
