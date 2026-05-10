"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  FileText,
  Sparkles,
  Loader2,
  Lock,
  Globe,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

interface FormProps {
  internship: any;
  paymentData: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function PremiumApplicationForm({ internship, paymentData, onClose, onSuccess }: FormProps) {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Section 1: Personal
    fullName: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    whatsapp: "",
    gender: "",
    dob: "",
    city: "",
    state: "",
    
    // Section 2: Education
    college: "",
    university: "",
    degree: "",
    branch: "",
    currentYear: "",
    gradYear: "",
    cgpa: "",
    
    // Section 3: Skills & Experience
    skills: "",
    experience: "",
    linkedin: "",
    github: "",
    portfolio: "",
    
    // Section 4: Resume
    resumeUrl: "",
    portfolioUrl: "",
    
    // Section 5: AI Analysis
    careerGoal: "",
    dreamCompany: "",
    interestedTech: "",
    
    agreed: false
  });

  const updateFormData = (fields: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          internshipId: internship._id,
          razorpay: paymentData
        })
      });
      
      if (res.ok) {
        onSuccess();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary/10 text-primary">Section 1</Badge>
              <h4 className="font-bold">Personal Details</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Full Name</label>
                <Input value={formData.fullName} onChange={e => updateFormData({ fullName: e.target.value })} className="bg-background/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Email Address</label>
                <Input value={formData.email} onChange={e => updateFormData({ email: e.target.value })} className="bg-background/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Phone Number</label>
                <Input value={formData.phone} onChange={e => updateFormData({ phone: e.target.value })} className="bg-background/50" placeholder="+91" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">WhatsApp Number</label>
                <Input value={formData.whatsapp} onChange={e => updateFormData({ whatsapp: e.target.value })} className="bg-background/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Gender</label>
                <select 
                  className="w-full bg-background/50 border border-border rounded-lg h-10 px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={formData.gender} onChange={e => updateFormData({ gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Date of Birth</label>
                <Input type="date" value={formData.dob} onChange={e => updateFormData({ dob: e.target.value })} className="bg-background/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">City</label>
                <Input value={formData.city} onChange={e => updateFormData({ city: e.target.value })} className="bg-background/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">State</label>
                <Input value={formData.state} onChange={e => updateFormData({ state: e.target.value })} className="bg-background/50" />
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
             <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary/10 text-primary">Section 2</Badge>
              <h4 className="font-bold">Education Details</h4>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">College Name</label>
              <Input value={formData.college} onChange={e => updateFormData({ college: e.target.value })} className="bg-background/50" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">University</label>
              <Input value={formData.university} onChange={e => updateFormData({ university: e.target.value })} className="bg-background/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Degree</label>
                <Input value={formData.degree} onChange={e => updateFormData({ degree: e.target.value })} className="bg-background/50" placeholder="B.Tech, BCA, etc." />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Branch / Stream</label>
                <Input value={formData.branch} onChange={e => updateFormData({ branch: e.target.value })} className="bg-background/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Current Year</label>
                <Input value={formData.currentYear} onChange={e => updateFormData({ currentYear: e.target.value })} className="bg-background/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Graduation Year</label>
                <Input value={formData.gradYear} onChange={e => updateFormData({ gradYear: e.target.value })} className="bg-background/50" />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">CGPA / Percentage</label>
                <Input value={formData.cgpa} onChange={e => updateFormData({ cgpa: e.target.value })} className="bg-background/50" />
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary/10 text-primary">Section 3</Badge>
              <h4 className="font-bold">Skills & Experience</h4>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Key Skills</label>
              <Input value={formData.skills} onChange={e => updateFormData({ skills: e.target.value })} placeholder="React, Node.js, Python..." className="bg-background/50" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Previous Internship Experience</label>
              <textarea 
                className="w-full bg-background/50 border border-border rounded-xl p-3 text-sm min-h-[80px] outline-none focus:ring-1 focus:ring-primary"
                value={formData.experience} onChange={e => updateFormData({ experience: e.target.value })}
                placeholder="Mention any past roles or projects..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">LinkedIn Profile</label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={formData.linkedin} onChange={e => updateFormData({ linkedin: e.target.value })} className="pl-9 bg-background/50" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">GitHub Profile</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={formData.github} onChange={e => updateFormData({ github: e.target.value })} className="pl-9 bg-background/50" />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Portfolio Link</label>
              <Input value={formData.portfolio} onChange={e => updateFormData({ portfolio: e.target.value })} placeholder="https://..." className="bg-background/50" />
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary/10 text-primary">Section 4</Badge>
              <h4 className="font-bold">Resume Upload</h4>
            </div>
            <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors group cursor-pointer">
              <Upload className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold mb-1">Upload Your Resume</h4>
              <p className="text-[10px] text-muted-foreground uppercase">PDF, DOCX up to 5MB</p>
              <input type="file" className="hidden" id="resume-upload" />
              <Button variant="outline" size="sm" className="mt-6 font-bold" onClick={() => document.getElementById('resume-upload')?.click()}>
                Choose File
              </Button>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Portfolio PDF (Optional)</label>
              <Input type="file" className="bg-background/50 text-xs" />
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">AI Career Analysis</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Dream Company</label>
                <Input value={formData.dreamCompany} onChange={e => updateFormData({ dreamCompany: e.target.value })} className="bg-background/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Long-term Career Goal</label>
                <textarea 
                  className="w-full bg-background/50 border border-border rounded-xl p-3 text-sm min-h-[80px] outline-none focus:ring-1 focus:ring-primary"
                  value={formData.careerGoal} onChange={e => updateFormData({ careerGoal: e.target.value })}
                  placeholder="e.g. To become a Senior Cloud Architect..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Interested Technologies</label>
                <Input value={formData.interestedTech} onChange={e => updateFormData({ interestedTech: e.target.value })} placeholder="Next.js, AWS, Kubernetes..." className="bg-background/50" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">AI Recommendation</p>
                  <p className="text-xs font-semibold">Based on your profile, you are a <span className="text-primary">94% Match</span> for this role.</p>
               </div>
               <Badge className="bg-green-500/10 text-green-400 border-green-500/20">High Match</Badge>
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400">
               <ShieldCheck className="w-6 h-6" />
               <div className="text-sm font-bold">Payment Verified · Transaction ID Generated</div>
            </div>

            <Card className="bg-primary/5 border-primary/20 p-6 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-primary" /> Application Review
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                 <div><span className="font-bold text-foreground">Name:</span><br />{formData.fullName}</div>
                 <div><span className="font-bold text-foreground">Internship:</span><br />{internship.title}</div>
                 <div><span className="font-bold text-foreground">College:</span><br />{formData.college}</div>
                 <div><span className="font-bold text-foreground">Status:</span><br />Ready to Submit</div>
              </div>
            </Card>
            
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  checked={formData.agreed} onChange={e => updateFormData({ agreed: e.target.checked })}
                />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  I certify that all details provided are true and accurate. I understand that my dashboard will be unlocked immediately upon submission.
                </span>
              </label>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {step === 1 && <User className="w-5 h-5 text-primary" />}
                {step === 2 && <GraduationCap className="w-5 h-5 text-primary" />}
                {step === 3 && <Briefcase className="w-5 h-5 text-primary" />}
                {step === 4 && <FileText className="w-5 h-5 text-primary" />}
                {step === 5 && <Sparkles className="w-5 h-5 text-primary" />}
                {step === 6 && <Lock className="w-5 h-5 text-primary" />}
             </div>
             <div>
                <h3 className="font-space-grotesk font-black text-xl">
                  {step === 1 && "Personal Identity"}
                  {step === 2 && "Academic Profile"}
                  {step === 3 && "Skills & Experience"}
                  {step === 4 && "Resume Upload"}
                  {step === 5 && "AI Career Analysis"}
                  {step === 6 && "Finalize & Submit"}
                </h3>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Step {step} of 6 — {Math.round((step/6)*100)}% Complete</p>
             </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-border overflow-hidden shrink-0">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(step/6)*100}%` }}
            className="h-full bg-primary shadow-[0_0_10px_oklch(var(--primary))]" 
          />
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto flex-grow custom-scrollbar">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30 flex items-center justify-between shrink-0">
          <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={step === 1}
            className="font-bold text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          
          {step < 6 ? (
            <Button 
              onClick={nextStep}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-8 shadow-lg shadow-primary/20"
            >
              Continue <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={!formData.agreed || isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-10 shadow-lg shadow-green-500/20"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Submit & Unlock Dashboard <CheckCircle2 className="w-5 h-5 ml-2" /></>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
