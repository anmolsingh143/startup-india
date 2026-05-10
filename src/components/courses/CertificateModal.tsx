"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Award, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CertificateData {
  certificateTitle: string;
  studentName: string;
  courseTitle: string;
  completionDate: string;
  achievement: string;
  quizScore: string;
  grade: string;
  verificationId: string;
  issuedBy: string;
}

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  quizScore: number;
  totalQuestions: number;
}

export function CertificateModal({ isOpen, onClose, courseId, courseTitle, quizScore, totalQuestions }: CertificateModalProps) {
  const [certData, setCertData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateCertificate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, courseTitle, quizScore, totalQuestions }),
      });
      const data = await res.json();
      if (data.certificate) {
        setCertData(data.certificate);
      }
    } catch {
      // Fallback certificate
      setCertData({
        certificateTitle: "Certificate of Completion",
        studentName: "Valued Student",
        courseTitle,
        completionDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
        achievement: `Successfully completed all modules and assessments with a score of ${quizScore}/${totalQuestions}`,
        quizScore: `${quizScore}/${totalQuestions}`,
        grade: quizScore >= 4 ? "Distinction" : quizScore >= 3 ? "Merit" : "Pass",
        verificationId: Math.random().toString(36).slice(2, 10).toUpperCase(),
        issuedBy: "Startup India Technologies Pvt. Ltd.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadPDF = () => {
    if (!certData) return;
    // Generate printable page
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${certData.courseTitle}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Georgia', serif; background: #ffffff; }
          .cert-page {
            width: 297mm; height: 210mm;
            margin: 0 auto;
            background: linear-gradient(135deg, #071120 0%, #0F172A 50%, #071120 100%);
            position: relative; overflow: hidden;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            padding: 40px;
          }
          .border-outer {
            position: absolute; inset: 15px;
            border: 3px solid #00D4FF; border-radius: 8px;
            box-shadow: 0 0 30px rgba(0,212,255,0.3), inset 0 0 30px rgba(0,212,255,0.05);
          }
          .border-inner {
            position: absolute; inset: 22px;
            border: 1px solid rgba(123,97,255,0.5); border-radius: 6px;
          }
          .logo-area { text-align: center; margin-bottom: 20px; }
          .logo-text { color: #00D4FF; font-size: 22px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; }
          .logo-sub { color: rgba(255,255,255,0.5); font-size: 10px; letter-spacing: 2px; margin-top: 4px; }
          .cert-title { color: rgba(255,255,255,0.5); font-size: 13px; letter-spacing: 6px; text-transform: uppercase; margin-bottom: 15px; font-style: italic; }
          .student-name { color: #ffffff; font-size: 42px; font-family: 'Georgia', serif; font-style: italic; margin-bottom: 10px; text-shadow: 0 0 20px rgba(0,212,255,0.4); }
          .achievement-text { color: rgba(255,255,255,0.7); font-size: 13px; max-width: 500px; text-align: center; line-height: 1.8; margin-bottom: 20px; }
          .course-name { color: #00D4FF; font-size: 20px; font-weight: bold; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; }
          .divider { width: 200px; height: 1px; background: linear-gradient(to right, transparent, #00D4FF, transparent); margin: 15px auto; }
          .meta { display: flex; gap: 60px; justify-content: center; margin-bottom: 25px; }
          .meta-item { text-align: center; }
          .meta-label { color: rgba(255,255,255,0.4); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; }
          .meta-value { color: #ffffff; font-size: 13px; font-weight: bold; margin-top: 3px; }
          .footer { display: flex; justify-content: space-between; align-items: flex-end; width: 100%; padding: 0 30px; }
          .sig-block { text-align: center; }
          .sig-line { width: 150px; height: 1px; background: rgba(255,255,255,0.3); margin-bottom: 6px; }
          .sig-name { color: #ffffff; font-size: 12px; font-weight: bold; }
          .sig-role { color: rgba(255,255,255,0.5); font-size: 9px; }
          .verification { text-align: center; }
          .verify-label { color: rgba(255,255,255,0.4); font-size: 8px; letter-spacing: 2px; text-transform: uppercase; }
          .verify-id { color: #00D4FF; font-size: 11px; font-family: monospace; font-weight: bold; }
          .grade-badge { display: inline-block; padding: 4px 16px; background: rgba(0,212,255,0.15); border: 1px solid #00D4FF; border-radius: 4px; color: #00D4FF; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; }
          .stars { color: #F59E0B; font-size: 20px; margin-bottom: 8px; }
          @media print { body { margin: 0; } .cert-page { page-break-inside: avoid; } }
        </style>
      </head>
      <body>
        <div class="cert-page">
          <div class="border-outer"></div>
          <div class="border-inner"></div>
          
          <div style="position:relative; text-align:center; z-index:1; width:100%;">
            <div class="logo-area">
              <div class="logo-text">🇮🇳 Startup India Technologies</div>
              <div class="logo-sub">Pvt. Ltd. | AI-Powered Career Platform</div>
            </div>
            
            <div class="cert-title">Certificate of Completion</div>
            
            <div style="color:rgba(255,255,255,0.6); font-size:12px; margin-bottom:8px;">This is to certify that</div>
            <div class="student-name">${certData.studentName}</div>
            
            <div style="color:rgba(255,255,255,0.6); font-size:12px; margin-bottom:8px;">has successfully completed</div>
            <div class="course-name">${certData.courseTitle}</div>
            
            <div class="divider"></div>
            
            <div class="stars">★★★★★</div>
            <div class="grade-badge">${certData.grade}</div>
            
            <div class="achievement-text">${certData.achievement}</div>
            
            <div class="meta">
              <div class="meta-item">
                <div class="meta-label">Quiz Score</div>
                <div class="meta-value">${certData.quizScore}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Completion Date</div>
                <div class="meta-value">${certData.completionDate}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Platform</div>
                <div class="meta-value">Startup India 2026</div>
              </div>
            </div>
            
            <div class="footer">
              <div class="sig-block">
                <div class="sig-line"></div>
                <div class="sig-name">CEO & Founder</div>
                <div class="sig-role">Startup India Technologies Pvt. Ltd.</div>
              </div>
              <div class="verification">
                <div class="verify-label">Verification ID</div>
                <div class="verify-id">${certData.verificationId}</div>
                <div style="color:rgba(255,255,255,0.3); font-size:8px; margin-top:3px;">verify.startupindia.tech/${certData.verificationId}</div>
              </div>
              <div class="sig-block">
                <div class="sig-line"></div>
                <div class="sig-name">Academic Director</div>
                <div class="sig-role">Training & Certification</div>
              </div>
            </div>
          </div>
        </div>
        <script>window.onload = () => { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-yellow-500/10 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                <Award className="w-7 h-7 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-xl font-space-grotesk font-black">AI Certificate</h2>
                <p className="text-sm text-muted-foreground">Your achievement, powered by Gemini AI</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8">
            {!certData && !generating && (
              <div className="text-center py-6">
                <div className="text-7xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
                <p className="text-muted-foreground mb-2">
                  You scored <span className="text-primary font-black">{quizScore}/{totalQuestions}</span> on your quiz
                </p>
                <Badge className="mb-8 text-sm px-4 py-2 bg-green-500/10 text-green-400 border-green-500/30">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Course Completed!
                </Badge>
                <p className="text-sm text-muted-foreground mb-8">
                  Click below to generate your AI-powered PDF certificate signed by our team.
                </p>
                <Button onClick={generateCertificate} size="lg" className="h-14 px-10 rounded-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                  <Award className="w-5 h-5 mr-2" /> Generate My Certificate 🤖
                </Button>
              </div>
            )}

            {generating && (
              <div className="text-center py-16">
                <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-medium mb-1">Gemini AI is crafting your certificate...</p>
                <p className="text-sm text-muted-foreground">Personalizing your achievement details</p>
              </div>
            )}

            {certData && (
              <div>
                {/* Certificate Preview */}
                <div className="relative bg-gradient-to-br from-[#071120] to-[#0F172A] rounded-2xl p-8 border-2 border-primary/30 mb-6 text-center overflow-hidden">
                  <div className="absolute inset-0 border-4 border-primary/10 rounded-2xl m-2" />
                  <div className="relative z-10">
                    <div className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-4">🇮🇳 Startup India Technologies Pvt. Ltd.</div>
                    <div className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-3 italic">Certificate of Completion</div>
                    <div className="text-3xl font-bold text-white mb-2 font-serif italic">{certData.studentName}</div>
                    <div className="text-xs text-muted-foreground mb-2">has successfully completed</div>
                    <div className="text-lg font-black text-primary uppercase tracking-wide mb-4">{certData.courseTitle}</div>
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-4" />
                    <div className="text-yellow-500 text-xl mb-2">★★★★★</div>
                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">{certData.grade}</Badge>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4 leading-relaxed">{certData.achievement}</p>
                    <div className="flex justify-center gap-8 text-xs">
                      <div><div className="text-muted-foreground">Score</div><div className="font-bold text-white">{certData.quizScore}</div></div>
                      <div><div className="text-muted-foreground">Date</div><div className="font-bold text-white">{certData.completionDate}</div></div>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-primary font-mono">
                      <Shield className="w-3 h-3" />
                      <span>ID: {certData.verificationId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={downloadPDF} className="flex-1 h-12 rounded-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                    <Download className="w-4 h-4 mr-2" /> Download PDF Certificate
                  </Button>
                  <Button variant="outline" onClick={onClose} className="h-12 px-6 rounded-xl font-bold">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
