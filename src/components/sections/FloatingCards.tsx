"use client";

import { motion } from "framer-motion";
import { GraduationCap, BrainCircuit, Users, TrendingUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FloatingCards() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
      {/* Internship Card */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] w-64 p-6 rounded-3xl bg-background/40 backdrop-blur-xl border border-white/20 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm">AI Internship</h4>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Top Match</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Stipend</span>
            <span className="font-bold text-green-500">₹15,000 /mo</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Location</span>
            <span className="font-bold">Remote</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0 w-full justify-center">Apply with AI Resume</Badge>
        </div>
      </motion.div>

      {/* AI Analytics Widget */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[25%] right-[12%] w-60 p-6 rounded-3xl bg-card/60 backdrop-blur-2xl border border-white/10 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-secondary">
          <BrainCircuit className="w-4 h-4" />
          AI MATCH ANALYTICS
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] font-bold mb-1 uppercase opacity-60">Resume Score</div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "88%" }}
                transition={{ duration: 2, delay: 1 }}
                className="h-full bg-gradient-to-r from-secondary to-[#00D4FF]" 
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-bold mb-1 uppercase opacity-60">Hiring Probability</div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "94%" }}
                transition={{ duration: 2, delay: 1.5 }}
                className="h-full bg-gradient-to-r from-[#7B61FF] to-secondary" 
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
            <div className="text-xl font-black">94%</div>
            <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
        </div>
      </motion.div>

      {/* Live Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-[15%] right-[15%] flex flex-col gap-4"
      >
        <div className="flex items-center gap-4 bg-background/40 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-xl">
           <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
           </div>
           <div className="text-xs font-bold">50K+ Live Students</div>
        </div>
        <div className="flex items-center gap-4 bg-background/40 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-xl ml-8">
           <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
             <TrendingUp className="w-4 h-4" />
           </div>
           <div className="text-xs font-bold">500+ Hiring Partners</div>
        </div>
      </motion.div>
    </div>
  );
}
