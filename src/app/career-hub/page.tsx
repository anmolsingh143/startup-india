"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Wand2, 
  FileEdit, 
  BarChart3, 
  Upload, 
  ArrowRight, 
  FileText, 
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CareerHubPage() {
  const [activeTab, setActiveTab] = useState("checker");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [resumeText, setResumeText] = useState("");
  const [targetJD, setTargetJD] = useState("");
  const [isFixing, setIsFixing] = useState(false);
  const [fixResult, setFixResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!resumeText) return alert("Please enter your resume text");
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, targetJobDescription: targetJD }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnalysisResult(data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFix = async () => {
    if (!resumeText || !targetJD) return alert("Please enter both resume text and target JD");
    setIsFixing(true);
    try {
      const res = await fetch("/api/ai/resume/fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, targetJobDescription: targetJD }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFixResult(data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full opacity-30 pointer-events-none" />
        
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-6 pt-6 relative z-10">
          <Link href="/">
            <Button variant="outline" className="gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full px-5">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8"
          >
            <Sparkles className="w-4 h-4" /> AI CAREER HUB
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black font-space-grotesk tracking-tight mb-6"
          >
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI-Driven</span> Future.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Optimize your resume, fix your bullet points, and build an ATS-proof career profile with our advanced Gemini AI suite.
          </motion.p>
        </div>
      </section>

      {/* Main Tools Section */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-16">
              <TabsTrigger value="checker" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold">
                <BarChart3 className="w-4 h-4 mr-2" /> ATS Checker
              </TabsTrigger>
              <TabsTrigger value="fixer" className="rounded-xl px-8 data-[state=active]:bg-secondary data-[state=active]:text-white transition-all font-bold">
                <Wand2 className="w-4 h-4 mr-2" /> AI Resume Fixer
              </TabsTrigger>
              <TabsTrigger value="maker" className="rounded-xl px-8 data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all font-bold">
                <FileEdit className="w-4 h-4 mr-2" /> Resume Maker
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="checker">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                {/* Upload Card */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <ShieldCheck className="text-primary w-6 h-6" /> Scan Your Resume
                    </h3>
                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-primary/50 transition-all group cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all">
                          <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <p className="font-bold text-lg mb-2">Drop your resume here</p>
                        <p className="text-sm text-muted-foreground">PDF, DOCX or TXT (Max 5MB)</p>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground font-bold">OR PASTE TEXT</span></div>
                      </div>
                      <Textarea 
                        placeholder="Paste your resume content here..." 
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="min-h-[200px] bg-black/40 border-white/10 rounded-xl focus:border-primary transition-all"
                      />
                      <Button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing}
                        className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-lg shadow-primary/20"
                      >
                        {isAnalyzing ? "Analyzing with AI..." : "Check ATS Score"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Card */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl min-h-[500px]">
                  <CardContent className="p-8">
                    {!analysisResult ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-40">
                        <Search className="w-16 h-16 mb-4" />
                        <p className="text-lg font-bold">Waiting for Scan...</p>
                        <p className="text-sm">Upload your resume to see the AI analysis</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold">AI Scan Result</h3>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs font-bold text-muted-foreground uppercase">ATS Score</p>
                              <p className="text-3xl font-black text-primary">{analysisResult.score}/100</p>
                            </div>
                            <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
                              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin-slow" />
                              <span className="font-black text-xl">{analysisResult.score}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20">
                            <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Key Strengths</h4>
                            <ul className="space-y-2 text-sm">
                              {analysisResult.strengths?.map((s: string) => <li key={s}>• {s}</li>)}
                            </ul>
                          </div>
                          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
                            <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Critical Gaps</h4>
                            <ul className="space-y-2 text-sm">
                              {analysisResult.weaknesses?.map((w: string) => <li key={w}>• {w}</li>)}
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold mb-3 flex items-center gap-2 text-primary"><Sparkles className="w-4 h-4" /> AI Improvement Plan</h4>
                          <div className="space-y-3">
                            {analysisResult.recommendations?.map((r: string) => (
                              <div key={r} className="flex gap-3 text-sm p-4 rounded-xl bg-white/5 border border-white/10">
                                <span className="text-primary font-bold">Fix:</span>
                                <span>{r}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="fixer">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-secondary/20 to-transparent p-8 border-b border-white/10">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Wand2 className="text-secondary w-6 h-6" /> ATS Fixer & Optimizer
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2">Rewrite your resume experience to match a specific job description perfectly.</p>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Target Job Description</label>
                        <Textarea 
                          value={targetJD}
                          onChange={(e) => setTargetJD(e.target.value)}
                          placeholder="Paste the job requirements here..." 
                          className="min-h-[150px] bg-black/40 border-white/10" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Current Experience Text</label>
                        <Textarea 
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          placeholder="Paste your current bullet points..." 
                          className="min-h-[150px] bg-black/40 border-white/10" 
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleFix}
                      disabled={isFixing}
                      className="w-full h-14 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-black text-lg shadow-lg shadow-secondary/20"
                    >
                      {isFixing ? "Optimizing..." : "Optimize with AI"}
                    </Button>

                    {fixResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 space-y-6 border-t border-white/10 pt-8"
                      >
                        <h4 className="font-bold text-xl flex items-center gap-2"><Sparkles className="text-secondary w-5 h-5" /> Optimized Results</h4>
                        
                        <div className="space-y-4">
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Optimized Summary</label>
                            <p className="text-sm leading-relaxed">{fixResult.summaryRewrite}</p>
                          </div>

                          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Optimized Experience</label>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">{fixResult.optimizedExperience}</div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {fixResult.suggestedKeywords?.map((k: string) => (
                              <Badge key={k} className="bg-secondary/10 text-secondary border-secondary/20 font-bold">{k}</Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="maker">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-6">
                  <FileEdit className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold mb-4">ATS Resume Maker (Coming Soon)</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  We are building a guided experience to generate high-impact, ATS-optimized PDF resumes directly from your profile.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-6 rounded-full">
                  Get Notified
                </Button>
              </motion.div>
            </TabsContent>
        </Tabs>
      </section>

      {/* Benefits Section */}
      <section className="bg-white/[0.02] py-24 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto text-primary font-bold">01</div>
            <h4 className="text-xl font-bold">ATS Algorithms</h4>
            <p className="text-muted-foreground">Our AI mimics the latest ATS software (Workday, Taleo, Greenhouse) to score your resume.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto text-secondary font-bold">02</div>
            <h4 className="text-xl font-bold">Keyword Optimization</h4>
            <p className="text-muted-foreground">Identify exactly which industry keywords are missing from your profile to pass screening.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto text-purple-400 font-bold">03</div>
            <h4 className="text-xl font-bold">Action Verbs</h4>
            <p className="text-muted-foreground">Transform weak bullet points into strong, results-oriented achievements that impress recruiters.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">Ready to land your dream internship?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="h-16 px-10 rounded-full font-bold text-lg bg-primary hover:bg-primary/90 text-white">
            Start Free Analysis <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="h-16 px-10 rounded-full font-bold text-lg border-white/10 hover:bg-white/5">
            View Templates
          </Button>
        </div>
      </section>
    </div>
  );
}
