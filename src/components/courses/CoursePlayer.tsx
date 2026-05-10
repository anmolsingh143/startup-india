"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Lock, CheckCircle2, Star, Clock, BookOpen, Award, CreditCard, ChevronRight, Zap, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuizModal } from "./QuizModal";
import { CertificateModal } from "./CertificateModal";
import type { CourseDetail } from "@/data/courseDetails";

interface CoursePlayerProps {
  detail: CourseDetail;
  courseId: string;
  price: string;
  image: string;
  hasPaid: boolean;
  onPayNow: () => void;
}

export function CoursePlayer({ detail, courseId, price, image, hasPaid, onPayNow }: CoursePlayerProps) {
  const [activeModule, setActiveModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [videoEnded, setVideoEnded] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [quizScores, setQuizScores] = useState<Record<number, number>>({});
  const [totalCredits, setTotalCredits] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const current = detail.modules[activeModule];
  const allModulesCompleted = completedModules.size === detail.modules.length && Object.keys(quizScores).length === detail.modules.length;
  const avgScore = Object.values(quizScores).reduce((a, b) => a + b, 0) / Math.max(Object.keys(quizScores).length, 1);

  const handleVideoEnd = () => {
    if (hasPaid) setVideoEnded(true);
  };

  const handleQuizComplete = (score: number, total: number) => {
    setQuizScores((prev) => ({ ...prev, [activeModule]: score }));
    const earned = score * 5 + detail.creditsPerModule;
    setTotalCredits((c) => c + earned);
    setCompletedModules((prev) => new Set([...prev, activeModule]));
    setVideoEnded(false);
    setShowQuiz(false);
  };

  const selectModule = (idx: number) => {
    if (!hasPaid) return;
    setActiveModule(idx);
    setVideoEnded(false);
  };

  return (
    <div className="space-y-8">
      {/* Credits Banner */}
      {hasPaid && totalCredits > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
        >
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-bold">Your Credits</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-primary">{totalCredits}</span>
            <span className="text-muted-foreground text-sm">XP earned</span>
          </div>
        </motion.div>
      )}

      {/* Video Player */}
      <div className="rounded-3xl overflow-hidden border border-border bg-black relative aspect-video">
        {!hasPaid ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-[#071120] to-[#0F172A]">
            <img src={image} alt={detail.title} className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Unlock Your Internship Hub</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">Complete the secure payment to unlock the full Training + Internship curriculum, AI-powered quizzes, and your official certificate.</p>
              <Button onClick={onPayNow} size="lg" className="h-14 px-10 rounded-2xl font-bold shadow-[0_0_30px_rgba(0,212,255,0.3)]">
                <CreditCard className="w-5 h-5 mr-2" /> Activate Internship & Start
              </Button>
            </div>
          </div>
        ) : (
          <>
            <iframe
              ref={iframeRef}
              src={`${current.videoUrl}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
            {/* Manual "I finished watching" button since YouTube iframe API needs JS SDK */}
            <div className="absolute bottom-4 right-4">
              <Button
                onClick={handleVideoEnd}
                size="sm"
                className="rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg"
                disabled={completedModules.has(activeModule)}
              >
                {completedModules.has(activeModule) ? <><CheckCircle2 className="w-4 h-4 mr-1" /> Done</> : <><Play className="w-4 h-4 mr-1" /> I Finished Watching</>}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Video Ended → Take Quiz CTA */}
      {videoEnded && !completedModules.has(activeModule) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 text-center"
        >
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-xl font-bold mb-2">Great job finishing "{current.title}"!</h3>
          <p className="text-muted-foreground mb-5">Take a 5-question AI quiz to earn <strong className="text-primary">{detail.creditsPerModule} credits</strong> and unlock the next module.</p>
          <Button onClick={() => setShowQuiz(true)} size="lg" className="h-13 px-8 rounded-2xl font-bold">
            Take Quiz & Earn Credits 🧠
          </Button>
        </motion.div>
      )}

      {/* Module List */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="p-4 bg-muted/30 border-b border-border flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm">Course Modules</span>
          <Badge className="ml-auto bg-primary/10 text-primary border-0">{completedModules.size}/{detail.modules.length} Completed</Badge>
        </div>
        {detail.modules.map((mod, idx) => (
          <button
            key={mod.id}
            onClick={() => selectModule(idx)}
            className={`w-full flex items-center gap-4 p-4 border-b last:border-0 border-border text-left transition-all ${
              activeModule === idx && hasPaid ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/30"
            } ${!hasPaid ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              completedModules.has(idx) ? "bg-green-500/20 text-green-500" :
              activeModule === idx && hasPaid ? "bg-primary/20 text-primary" :
              "bg-muted text-muted-foreground"
            }`}>
              {completedModules.has(idx) ? <CheckCircle2 className="w-5 h-5" /> :
               hasPaid ? <Play className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{mod.title}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <Clock className="w-3 h-3" /> {mod.duration}
                {quizScores[idx] !== undefined && (
                  <Badge className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20 ml-1">
                    Quiz: {quizScores[idx]}/5
                  </Badge>
                )}
              </div>
            </div>
            {hasPaid && <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
          </button>
        ))}
      </div>

      {/* Final Certificate CTA */}
      {allModulesCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 text-center"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold mb-2">Course Complete!</h3>
          <p className="text-muted-foreground mb-2">You earned <strong className="text-primary">{totalCredits} credits</strong> total</p>
          <p className="text-sm text-muted-foreground mb-6">Average quiz score: {Math.round((avgScore / 5) * 100)}% — Generate your AI-powered certificate now!</p>
          <Button
            onClick={() => setShowCert(true)}
            size="lg"
            className="h-14 px-10 rounded-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-[0_0_30px_rgba(245,158,11,0.3)]"
          >
            <Award className="w-5 h-5 mr-2" /> Get AI Certificate 🎓
          </Button>
        </motion.div>
      )}

      {/* Modals */}
      <QuizModal
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        courseTitle={detail.title}
        courseId={courseId}
        topic={current.topic}
        onQuizComplete={handleQuizComplete}
      />
      <CertificateModal
        isOpen={showCert}
        onClose={() => setShowCert(false)}
        courseId={courseId}
        courseTitle={detail.title}
        quizScore={Math.round(avgScore)}
        totalQuestions={5}
      />
    </div>
  );
}
