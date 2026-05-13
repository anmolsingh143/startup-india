"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { 
  Save, 
  X,
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileData {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  headline?: string;
  linkedinHeadline?: string;
  linkedinSummary?: string;
  professionalSummary?: string;
  linkedinProfileUrl?: string;
  experienceHighlights?: string[];
  careerGoals?: string[];
  profileSkills?: string[];
  skills?: string[];
  education?: Array<{
    college: string;
    degree: string;
    graduationYear: number;
  }>;
}

export default function EditProfilePage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [newEducation, setNewEducation] = useState({ college: "", degree: "", graduationYear: new Date().getFullYear() });

  useEffect(() => {
    if (!isLoaded) return;
    if (!clerkUser) {
      redirect("/sign-in");
    }
  }, [isLoaded, clerkUser]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (clerkUser?.id) {
      fetchProfile();
    }
  }, [clerkUser?.id]);

  const handleSave = async () => {
    if (!profileData) return;
    
    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Failed to save profile");
      
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setProfileData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addSkill = () => {
    if (!newSkill.trim() || !profileData) return;
    const updatedSkills = [...(profileData.profileSkills || []), newSkill.trim()];
    updateField("profileSkills", updatedSkills);
    setNewSkill("");
  };

  const removeSkill = (index: number) => {
    if (!profileData) return;
    const updatedSkills = profileData.profileSkills?.filter((_, i) => i !== index) || [];
    updateField("profileSkills", updatedSkills);
  };

  const addHighlight = () => {
    if (!newHighlight.trim() || !profileData) return;
    const updatedHighlights = [...(profileData.experienceHighlights || []), newHighlight.trim()];
    updateField("experienceHighlights", updatedHighlights);
    setNewHighlight("");
  };

  const removeHighlight = (index: number) => {
    if (!profileData) return;
    const updatedHighlights = profileData.experienceHighlights?.filter((_, i) => i !== index) || [];
    updateField("experienceHighlights", updatedHighlights);
  };

  const addGoal = () => {
    if (!newGoal.trim() || !profileData) return;
    const updatedGoals = [...(profileData.careerGoals || []), newGoal.trim()];
    updateField("careerGoals", updatedGoals);
    setNewGoal("");
  };

  const removeGoal = (index: number) => {
    if (!profileData) return;
    const updatedGoals = profileData.careerGoals?.filter((_, i) => i !== index) || [];
    updateField("careerGoals", updatedGoals);
  };

  const addEducation = () => {
    if (!newEducation.college.trim() || !newEducation.degree.trim() || !profileData) return;
    const updatedEducation = [...(profileData.education || []), newEducation];
    updateField("education", updatedEducation);
    setNewEducation({ college: "", degree: "", graduationYear: new Date().getFullYear() });
  };

  const removeEducation = (index: number) => {
    if (!profileData) return;
    const updatedEducation = profileData.education?.filter((_, i) => i !== index) || [];
    updateField("education", updatedEducation);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{errorMessage || "Unable to load profile data."}</p>
            <Link href="/profile">
              <Button className="w-full">Back to Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">Back to Profile</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 border-2 border-primary/20" } }} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">Update your profile information, skills, and experience</p>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {successMessage}
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {/* Personal Info */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">First Name</label>
                  <Input
                    value={profileData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Last Name</label>
                  <Input
                    value={profileData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Email</label>
                <Input
                  value={profileData.email}
                  disabled
                  className="bg-muted/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Phone</label>
                <Input
                  value={profileData.phone || ""}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="bg-background/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Professional Headline</label>
                <Input
                  value={profileData.headline || ""}
                  onChange={(e) => updateField("headline", e.target.value)}
                  placeholder="e.g., Full Stack Developer | AI Enthusiast"
                  className="bg-background/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">LinkedIn Profile URL</label>
                <Input
                  value={profileData.linkedinProfileUrl || ""}
                  onChange={(e) => updateField("linkedinProfileUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/yourname"
                  className="bg-background/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>About & Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">LinkedIn Summary</label>
                <Textarea
                  value={profileData.linkedinSummary || ""}
                  onChange={(e) => updateField("linkedinSummary", e.target.value)}
                  placeholder="Your professional summary for LinkedIn"
                  className="min-h-[120px] bg-background/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Professional Summary</label>
                <Textarea
                  value={profileData.professionalSummary || ""}
                  onChange={(e) => updateField("professionalSummary", e.target.value)}
                  placeholder="Your professional background and expertise"
                  className="min-h-[120px] bg-background/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="bg-background/50"
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill} size="sm" className="gap-1">
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </div>

              {profileData.profileSkills && profileData.profileSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profileData.profileSkills.map((skill, idx) => (
                    <Badge key={idx} className="gap-2 py-1 px-3">
                      {skill}
                      <button
                        onClick={() => removeSkill(idx)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Experience Highlights */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Experience Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add an experience highlight"
                  className="min-h-[100px] bg-background/50"
                />
                <Button onClick={addHighlight} size="sm" className="gap-1">
                  <Plus className="w-4 h-4" /> Add Highlight
                </Button>
              </div>

              {profileData.experienceHighlights && profileData.experienceHighlights.length > 0 && (
                <ul className="space-y-3">
                  {profileData.experienceHighlights.map((highlight, idx) => (
                    <li key={idx} className="flex gap-3 items-start p-3 rounded-lg bg-background/50 border border-border/50">
                      <span className="text-sm text-muted-foreground flex-grow">{highlight}</span>
                      <button
                        onClick={() => removeHighlight(idx)}
                        className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Career Goals */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Career Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Add a career goal"
                  className="min-h-[100px] bg-background/50"
                />
                <Button onClick={addGoal} size="sm" className="gap-1">
                  <Plus className="w-4 h-4" /> Add Goal
                </Button>
              </div>

              {profileData.careerGoals && profileData.careerGoals.length > 0 && (
                <ul className="space-y-3">
                  {profileData.careerGoals.map((goal, idx) => (
                    <li key={idx} className="flex gap-3 items-start p-3 rounded-lg bg-background/50 border border-border/50">
                      <span className="text-sm text-muted-foreground flex-grow">{goal}</span>
                      <button
                        onClick={() => removeGoal(idx)}
                        className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 p-4 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">College/University</label>
                  <Input
                    value={newEducation.college}
                    onChange={(e) => setNewEducation({ ...newEducation, college: e.target.value })}
                    placeholder="e.g., IIT Delhi"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Degree</label>
                  <Input
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                    placeholder="e.g., B.Tech in Computer Science"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Graduation Year</label>
                  <Input
                    type="number"
                    value={newEducation.graduationYear}
                    onChange={(e) => setNewEducation({ ...newEducation, graduationYear: parseInt(e.target.value) })}
                    className="bg-background"
                  />
                </div>
                <Button onClick={addEducation} size="sm" className="gap-1 w-full">
                  <Plus className="w-4 h-4" /> Add Education
                </Button>
              </div>

              {profileData.education && profileData.education.length > 0 && (
                <div className="space-y-3">
                  {profileData.education.map((edu, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-background/50 border border-border/50 flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm">{edu.degree}</h4>
                        <p className="text-xs text-muted-foreground">{edu.college}</p>
                        <p className="text-xs text-muted-foreground">Graduated {edu.graduationYear}</p>
                      </div>
                      <button
                        onClick={() => removeEducation(idx)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3 justify-end pt-6 border-t border-border/50">
            <Link href="/profile">
              <Button variant="outline" className="gap-2">
                <X className="w-4 h-4" /> Cancel
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 bg-primary text-white hover:bg-primary/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
