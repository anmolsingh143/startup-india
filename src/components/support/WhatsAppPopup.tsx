"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ShieldCheck, CreditCard, GraduationCap, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhatsAppPopup({ isOpen, onClose }: WhatsAppPopupProps) {
  const QUICK_ACTIONS = [
    { label: "Internship Support", icon: <GraduationCap className="w-4 h-4" /> },
    { label: "Course Support", icon: <ShieldCheck className="w-4 h-4" /> },
    { label: "Payment Support", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Certificate Verification", icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const handleAction = (label: string) => {
    const message = encodeURIComponent(`Hello, I need help with ${label}.`);
    window.open(`https://wa.me/918660101906?text=${message}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-24 right-6 z-[110] w-[350px] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          {/* Header */}
          <div className="bg-[#075E54] p-6 text-white relative">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                  <img src="/logo.png" alt="Startup India" className="w-8 h-8 object-contain brightness-0 invert" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#075E54] rounded-full" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Support Executive</h3>
                <p className="text-xs text-white/70">Typically replies in a few minutes</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 bg-muted/30">
            <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-none shadow-sm mb-6 max-w-[85%]">
              <p className="text-sm font-medium text-foreground">
                Welcome to Startup India Technologies Pvt. Ltd. How can we help you today?
              </p>
              <span className="text-[10px] text-muted-foreground mt-2 block text-right">10:30 AM</span>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Quick Actions</p>
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleAction(action.label)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-accent/50 transition-all text-left text-sm font-semibold group"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {action.icon}
                  </div>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-card">
            <Button 
              onClick={() => handleAction("General Support")}
              className="w-full h-12 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Talk on WhatsApp
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
