"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, FileText, Compass, Loader2, Sparkles, CheckCircle2, AlertCircle, Linkedin } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AiHubPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'resume' | 'roadmap' | 'profile'>('resume');
  
  // Resume Analyzer State
  const [resumeText, setResumeText] = useState("");
  const [targetJob, setTargetJob] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeResult, setResumeResult] = useState<any>(null);

  // Roadmap Generator State
  const [currentSkills, setCurrentSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapResult, setRoadmapResult] = useState<any>(null);

  // LinkedIn Profile Builder State
  const [profileCurrentRole, setProfileCurrentRole] = useState("");
  const [profileYearsExperience, setProfileYearsExperience] = useState("");
  const [profileSkills, setProfileSkills] = useState("");
  const [profileTargetRole, setProfileTargetRole] = useState("");
  const [profileSummary, setProfileSummary] = useState("");
  const [profileLinkedinUrl, setProfileLinkedinUrl] = useState("");
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [profileResult, setProfileResult] = useState<any>(null);
  const [profileSuccessMessage, setProfileSuccessMessage] = useState("");
  const [profileErrorMessage, setProfileErrorMessage] = useState("");

  const handleAnalyzeResume = async () => {
    if (!resumeText) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetJob })
      });
      const data = await res.json();
      setResumeResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!currentSkills || !targetRole) return;
    setIsGenerating(true);
    try {
      const skillsArray = currentSkills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/ai/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentSkills: skillsArray, targetRole })
      });
      const data = await res.json();
      setRoadmapResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateProfile = async () => {
    if (!profileCurrentRole || !profileSkills || !profileTargetRole) return;
    setProfileSuccessMessage("");
    setProfileErrorMessage("");
    setIsGeneratingProfile(true);
    try {
      const skillsArray = profileSkills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/ai/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
          currentRole: profileCurrentRole,
          yearsExperience: profileYearsExperience,
          skills: skillsArray,
          targetRole: profileTargetRole,
          summary: profileSummary,
          linkedinProfileUrl: profileLinkedinUrl
        })
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        setProfileResult(data);
        setProfileSuccessMessage('Profile generated successfully and saved to your dashboard.');
      } else {
        setProfileErrorMessage(data.error || 'Unable to generate your profile at this time.');
      }
    } catch (error) {
      console.error(error);
      setProfileErrorMessage('There was an error generating your profile. Please try again.');
    } finally {
      setIsGeneratingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation Bar */}
      <nav className="relative z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard">
               <span className="font-space-grotesk font-black text-lg tracking-tight hover:text-primary transition-colors">← Dashboard</span>
            </Link>
            <Link href="/profile" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              View Profile
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 border-2 border-primary/20" } }} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-grow py-12 px-6 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
            <Sparkles className="w-4 h-4" /> Powered by Google Gemini
          </div>
          <h1 className="text-4xl md:text-5xl font-space-grotesk font-black tracking-tight">AI Career Hub</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Leverage enterprise-grade AI to optimize your resume and generate your personalized path to a billion-dollar career.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            variant={activeTab === 'resume' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('resume')}
            className={`h-12 px-8 rounded-full font-bold ${activeTab === 'resume' ? 'shadow-lg shadow-primary/20' : ''}`}
          >
            <FileText className="w-5 h-5 mr-2" /> Resume Analyzer
          </Button>
          <Button 
            variant={activeTab === 'roadmap' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('roadmap')}
            className={`h-12 px-8 rounded-full font-bold ${activeTab === 'roadmap' ? 'shadow-lg shadow-primary/20' : ''}`}
          >
            <Compass className="w-5 h-5 mr-2" /> Career Roadmap
          </Button>
          <Button 
            variant={activeTab === 'profile' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('profile')}
            className={`h-12 px-8 rounded-full font-bold ${activeTab === 'profile' ? 'shadow-lg shadow-primary/20' : ''}`}
          >
            <Linkedin className="w-5 h-5 mr-2" /> LinkedIn Profile
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {/* Resume Analyzer Tab */}
          {activeTab === 'resume' && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Input Section */}
              <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle>Resume Input</CardTitle>
                  <CardDescription>Paste your resume text and target job role for an ATS score prediction.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Target Job Description (Optional)</label>
                    <Input 
                      placeholder="e.g. Frontend Developer, React, Next.js..." 
                      value={targetJob}
                      onChange={(e) => setTargetJob(e.target.value)}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Resume Text</label>
                    <Textarea 
                      placeholder="Paste your entire resume text here..." 
                      className="min-h-[300px] bg-muted/50 border-border resize-none"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full h-12 font-bold" 
                    onClick={handleAnalyzeResume}
                    disabled={isAnalyzing || !resumeText}
                  >
                    {isAnalyzing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</> : <><BrainCircuit className="w-5 h-5 mr-2" /> Analyze Resume</>}
                  </Button>
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card className="bg-card border-border shadow-sm flex flex-col">
                <CardHeader>
                  <CardTitle>AI Analysis Results</CardTitle>
                  <CardDescription>Your ATS score and actionable feedback.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {resumeResult ? (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-2xl border border-border">
                         <div className="text-5xl font-black text-primary font-space-grotesk">{resumeResult.atsScore}%</div>
                         <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-2">Predicted ATS Match</p>
                      </div>

                      {resumeResult.missingSkills?.length > 0 && (
                        <div>
                          <h4 className="font-bold flex items-center text-destructive mb-2"><AlertCircle className="w-4 h-4 mr-2" /> Missing Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                            {resumeResult.missingSkills.map((skill: string, i: number) => (
                              <Badge key={i} variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-0">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold flex items-center text-green-500 mb-2"><CheckCircle2 className="w-4 h-4 mr-2" /> Strengths</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {resumeResult.strengths?.map((str: string, i: number) => <li key={i}>{str}</li>)}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">Recommendations</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {resumeResult.recommendations?.map((rec: string, i: number) => <li key={i}>{rec}</li>)}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 py-20">
                      <FileText className="w-16 h-16 mb-4" />
                      <p>Run analysis to see results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Roadmap Generator Tab */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle>LinkedIn Profile Builder</CardTitle>
                  <CardDescription>Generate a polished professional headline, summary, and experience highlights for your LinkedIn profile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Your Current Role</label>
                    <Input
                      placeholder="e.g. Software Developer"
                      value={profileCurrentRole}
                      onChange={(e) => setProfileCurrentRole(e.target.value)}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Years of Experience</label>
                    <Input
                      placeholder="e.g. 2 years"
                      value={profileYearsExperience}
                      onChange={(e) => setProfileYearsExperience(e.target.value)}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Key Skills</label>
                    <Input
                      placeholder="e.g. React, TypeScript, Node.js"
                      value={profileSkills}
                      onChange={(e) => setProfileSkills(e.target.value)}
                      className="bg-muted/50 border-border"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Separate skills with commas.</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Target Role</label>
                    <Input
                      placeholder="e.g. Frontend Engineer"
                      value={profileTargetRole}
                      onChange={(e) => setProfileTargetRole(e.target.value)}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Professional Summary or Current Focus</label>
                    <Textarea
                      placeholder="Briefly describe your recent achievements or what you're targeting next."
                      value={profileSummary}
                      onChange={(e) => setProfileSummary(e.target.value)}
                      className="min-h-[140px] bg-muted/50 border-border resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">LinkedIn Profile URL (Optional)</label>
                    <Input
                      placeholder="https://linkedin.com/in/yourname"
                      value={profileLinkedinUrl}
                      onChange={(e) => setProfileLinkedinUrl(e.target.value)}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  {profileSuccessMessage && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {profileSuccessMessage}
                    </div>
                  )}
                  {profileErrorMessage && (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {profileErrorMessage}
                    </div>
                  )}
                  <Button
                    className="w-full h-12 font-bold"
                    onClick={handleGenerateProfile}
                    disabled={isGeneratingProfile || !profileCurrentRole || !profileSkills || !profileTargetRole}
                  >
                    {isGeneratingProfile ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</> : <><Linkedin className="w-5 h-5 mr-2" /> Build Profile</>}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm flex flex-col">
                <CardHeader>
                  <CardTitle>Generated LinkedIn Profile</CardTitle>
                  <CardDescription>Your new professional summary, headline, and skills section.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {profileResult ? (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Headline</p>
                        <p className="text-lg font-semibold text-foreground">{profileResult.headline}</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">LinkedIn Headline</p>
                        <p className="text-lg font-semibold text-foreground">{profileResult.linkedinHeadline}</p>
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">LinkedIn Summary</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{profileResult.linkedinSummary}</p>
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">Professional Summary</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{profileResult.professionalSummary}</p>
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">Experience Highlights</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                          {profileResult.experienceHighlights?.map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {profileResult.skills?.map((skill: string, idx: number) => (
                            <Badge key={idx} className="bg-background text-sm border-border">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">Career Goal</p>
                        <p className="text-sm text-muted-foreground">{profileResult.careerGoal}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 py-20">
                      <Linkedin className="w-16 h-16 mb-4" />
                      <p>Build your LinkedIn profile to see the results here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'roadmap' && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle>Roadmap Setup</CardTitle>
                  <CardDescription>Tell the AI where you are and where you want to go.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Current Skills</label>
                    <Input 
                      placeholder="e.g. HTML, CSS, basic JavaScript..." 
                      value={currentSkills}
                      onChange={(e) => setCurrentSkills(e.target.value)}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Target Job Role</label>
                    <Input 
                      placeholder="e.g. Machine Learning Engineer" 
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <Button 
                    className="w-full h-12 font-bold" 
                    onClick={handleGenerateRoadmap}
                    disabled={isGenerating || !currentSkills || !targetRole}
                  >
                    {isGenerating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</> : <><Compass className="w-5 h-5 mr-2" /> Generate Roadmap</>}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm flex flex-col">
                <CardHeader>
                  <CardTitle>Your Personalized Path</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  {roadmapResult ? (
                    <div className="space-y-6">
                      <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-sm font-bold">
                        Estimated Time: {roadmapResult.estimatedMonthsToTarget} months
                      </div>
                      
                      <div className="space-y-4 relative border-l-2 border-primary/20 ml-3 pl-6">
                        {roadmapResult.phases?.map((phase: any, idx: number) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                            <h4 className="font-bold text-lg">{phase.phaseName} <span className="text-sm font-normal text-muted-foreground ml-2">({phase.duration})</span></h4>
                            <p className="text-sm font-semibold mt-2 text-foreground">Skills to Learn:</p>
                            <div className="flex flex-wrap gap-1 mt-1 mb-2">
                              {phase.skillsToAcquire?.map((skill: string, i: number) => (
                                <Badge key={i} variant="outline" className="bg-background text-xs">{skill}</Badge>
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground"><span className="font-semibold text-primary">Project:</span> {phase.projectIdea}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 py-20">
                      <Compass className="w-16 h-16 mb-4" />
                      <p>Generate roadmap to see path</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
