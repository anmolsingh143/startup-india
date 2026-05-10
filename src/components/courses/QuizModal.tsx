"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  courseId: string;
  topic: string;
  onQuizComplete: (score: number, total: number) => void;
}

export function QuizModal({ isOpen, onClose, courseTitle, courseId, topic, onQuizComplete }: QuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const loadQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, courseTitle, topic }),
      });
      const data = await res.json();
      setQuestions(data.questions);
      setStarted(true);
      setCurrentQ(0);
      setScore(0);
      setCompleted(false);
    } catch {
      // fallback questions
      setQuestions([
        { id: 1, question: `What is the primary goal of ${topic}?`, options: ["A. Speed only", "B. Understanding and application", "C. Memorization", "D. Theory only"], correctAnswer: "B. Understanding and application", explanation: "The primary goal is to understand and apply concepts practically." },
        { id: 2, question: "Which approach is best for learning new skills?", options: ["A. Theory only", "B. Practice only", "C. Theory combined with hands-on practice", "D. Watching videos passively"], correctAnswer: "C. Theory combined with hands-on practice", explanation: "Combining theory with practical application yields the best results." },
        { id: 3, question: "What makes a professional stand out in this field?", options: ["A. Certificates alone", "B. Real project experience", "C. Years of experience only", "D. Academic grades only"], correctAnswer: "B. Real project experience", explanation: "Practical project experience is the most valued differentiator." },
        { id: 4, question: "How should you approach complex problems in this domain?", options: ["A. Skip them", "B. Break them into smaller parts", "C. Use trial and error only", "D. Look for shortcuts always"], correctAnswer: "B. Break them into smaller parts", explanation: "Breaking complex problems into smaller, manageable parts is the most effective approach." },
        { id: 5, question: "What is the best way to stay updated in this field?", options: ["A. Read textbooks only", "B. Follow industry blogs and practice regularly", "C. Attend one conference", "D. Complete one course and stop"], correctAnswer: "B. Follow industry blogs and practice regularly", explanation: "Continuous learning through industry resources and regular practice keeps skills current." },
      ]);
      setStarted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option: string) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
    setShowFeedback(true);
    if (option === questions[currentQ].correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setCompleted(true);
      onQuizComplete(score + (selectedAnswer === questions[currentQ].correctAnswer ? 1 : 0), questions.length);
    }
  };

  const getOptionStyle = (option: string) => {
    if (!showFeedback) return "border-border hover:border-primary/60 hover:bg-primary/5";
    if (option === questions[currentQ].correctAnswer) return "border-green-500 bg-green-500/10 text-green-400";
    if (option === selectedAnswer) return "border-red-500 bg-red-500/10 text-red-400";
    return "border-border opacity-50";
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
            <div>
              <h2 className="text-xl font-space-grotesk font-black">🧠 AI-Generated Quiz</h2>
              <p className="text-sm text-muted-foreground">Earn credits by completing this quiz</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Not Started State */}
            {!started && !loading && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-2">Ready for the Quiz?</h3>
                <p className="text-muted-foreground mb-6">
                  5 AI-generated questions on <span className="text-primary font-semibold">"{topic}"</span>
                </p>
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="text-center"><div className="text-2xl font-black text-primary">5</div><div className="text-xs text-muted-foreground">Questions</div></div>
                  <div className="text-center"><div className="text-2xl font-black text-secondary">+25</div><div className="text-xs text-muted-foreground">Credits</div></div>
                  <div className="text-center"><div className="text-2xl font-black text-green-500">80%</div><div className="text-xs text-muted-foreground">Pass Mark</div></div>
                </div>
                <Button onClick={loadQuiz} size="lg" className="h-14 px-10 rounded-2xl font-bold">
                  Start Quiz 🚀
                </Button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Gemini AI is generating your quiz...</p>
              </div>
            )}

            {/* Quiz Questions */}
            {started && !loading && !completed && questions.length > 0 && (
              <div>
                {/* Progress */}
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">Question {currentQ + 1} / {questions.length}</Badge>
                  <Badge className="bg-primary/10 text-primary border-0">Score: {score}/{currentQ}</Badge>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full mb-6 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <h3 className="text-lg font-bold mb-5 leading-tight">{questions[currentQ].question}</h3>

                <div className="space-y-3 mb-6">
                  {questions[currentQ].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm ${getOptionStyle(option)}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border mb-4 text-sm ${selectedAnswer === questions[currentQ].correctAnswer ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}
                  >
                    <strong>{selectedAnswer === questions[currentQ].correctAnswer ? "✅ Correct!" : "❌ Incorrect"}</strong>
                    <p className="mt-1 text-muted-foreground">{questions[currentQ].explanation}</p>
                  </motion.div>
                )}

                {showFeedback && (
                  <Button onClick={handleNext} className="w-full h-12 rounded-xl font-bold">
                    {currentQ < questions.length - 1 ? "Next Question" : "Finish Quiz"} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            )}

            {/* Completed State */}
            {completed && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">{score >= 4 ? "🏆" : score >= 3 ? "🎖️" : "📚"}</div>
                <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                <p className="text-muted-foreground mb-4">
                  You scored <span className="text-primary font-black text-xl">{score}/{questions.length}</span>
                </p>
                <Badge className={`text-sm px-4 py-2 mb-6 ${score >= 4 ? "bg-green-500/10 text-green-400 border-green-500/30" : score >= 3 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" : "bg-red-500/10 text-red-400 border-red-500/30"}`}>
                  {score >= 4 ? "Distinction 🌟" : score >= 3 ? "Merit 👍" : "Keep Practicing 💪"}
                </Badge>
                <div className="flex items-center justify-center gap-2 text-green-500 font-bold text-lg mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>+{score * 5} Credits Earned!</span>
                </div>
                <Button onClick={onClose} size="lg" className="h-12 px-8 rounded-xl font-bold">
                  Continue Learning
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
