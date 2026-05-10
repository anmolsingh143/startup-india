"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Link as LinkIcon } from "lucide-react";
import { WhatsAppPopup } from "./WhatsAppPopup";
import { SocialPanel } from "./SocialPanel";

export function FloatingSupport() {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  return (
    <>
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4">
        {/* LinkedIn Floating Icon */}
        <motion.a
          href="https://linkedin.com/company/startupindiatech"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group relative w-14 h-14 rounded-full bg-[#0077B5] text-white flex items-center justify-center shadow-2xl shadow-[#0077B5]/40 border border-white/20"
        >
          <LinkIcon className="w-6 h-6" />
          {/* Tooltip */}
          <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            Connect on LinkedIn
          </span>
          {/* Pulse Effect */}
          <span className="absolute inset-0 rounded-full bg-[#0077B5] animate-ping opacity-20 pointer-events-none" />
        </motion.a>

        {/* WhatsApp Main Button */}
        <motion.button
          onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="group relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl shadow-[#25D366]/40 border border-white/20"
        >
          <MessageCircle className="w-7 h-7" />
          {/* Online Badge */}
          <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
          
          {/* Tooltip */}
          <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            Chat with Support
          </span>

          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-[#25D366] blur-md opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none" />
        </motion.button>
      </div>

      {/* Social Panel (Positioned separately to avoid overlap) */}
      <SocialPanel />

      {/* WhatsApp Popup */}
      <WhatsAppPopup 
        isOpen={isWhatsAppOpen} 
        onClose={() => setIsWhatsAppOpen(false)} 
      />
    </>
  );
}
