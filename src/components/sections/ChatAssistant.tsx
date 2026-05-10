"use client";

import { motion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";

export function ChatAssistant() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className="absolute bottom-[10%] left-[8%] z-20 hidden md:flex items-end gap-3 pointer-events-none"
    >
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[1px] shadow-2xl">
        <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-primary" />
        </div>
      </div>
      
      <div className="bg-background/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl rounded-bl-none shadow-2xl max-w-[200px]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-tighter text-primary">AI Career Agent</span>
          <Sparkles className="w-3 h-3 text-yellow-500" />
        </div>
        <p className="text-xs font-medium text-foreground/80 leading-relaxed">
          Launch your AI career. I can help you find the perfect internship.
        </p>
        <div className="mt-2 flex gap-1">
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} className="w-1 h-1 rounded-full bg-primary" />
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1 h-1 rounded-full bg-primary" />
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1 h-1 rounded-full bg-primary" />
        </div>
      </div>
    </motion.div>
  );
}
