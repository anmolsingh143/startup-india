"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  Award,
  BookOpen,
  Briefcase,
  Star,
  Share2,
  Download,
  ArrowLeft,
  Plus,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  headline?: string;
  linkedinHeadline?: string;
  linkedinSummary?: string;
  professionalSummary?: string;
  role: string;
  xpPoints: number;
  walletBalance: number;
  experienceHighlights?: string[];
  careerGoals?: string[];
  profileSkills?: string[];
  linkedinProfileUrl?: string;
  skills?: string[];
  education?: Array<{
    college: string;
    degree: string;
    graduationYear: number;
  }>;
  enrolledCourses?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const response = await fetch("/api/profile", {
          method: "GET",
        });

        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (clerkUser?.id) {
      fetchProfile();
    }
  }, [clerkUser?.id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
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
            <p className="text-sm text-muted-foreground mb-4">{error || "Unable to load profile data."}</p>
            <Link href="/dashboard">
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName = `${profileData.firstName} ${profileData.lastName}`;
  const initials = `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 border-2 border-primary/20" } }} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
          
          {/* Profile Header Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20 flex items-center justify-center text-4xl font-bold text-primary overflow-hidden">
                      {profileData.profileImage ? (
                        <img src={profileData.profileImage} alt={fullName} className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-grow">
                    <div>
                      <h1 className="text-4xl font-black tracking-tight mb-1">{fullName}</h1>
                      {profileData.headline && (
                        <p className="text-xl text-primary font-semibold mb-3">{profileData.headline}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-primary/10 text-primary border-primary/20">{profileData.role}</Badge>
                        {profileData.enrolledCourses && profileData.enrolledCourses.length > 0 && (
                          <Badge variant="outline">{profileData.enrolledCourses.length} Courses</Badge>
                        )}
                        <Badge variant="outline" className="gap-1">
                          <Star className="w-3 h-3 fill-current" /> {profileData.xpPoints || 0} XP
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Member since {new Date(profileData.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <Link href="/profile/edit">
                        <Button size="sm" className="gap-2">
                          <Edit className="w-4 h-4" /> Edit Profile
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Share2 className="w-4 h-4" /> Share
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Download className="w-4 h-4" /> Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact & Links Section */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" /> Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Email</p>
                    <p className="text-sm font-medium">{profileData.email}</p>
                  </div>
                </div>

                {profileData.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold">Phone</p>
                      <p className="text-sm font-medium">{profileData.phone}</p>
                    </div>
                  </div>
                )}

                {profileData.linkedinProfileUrl && (
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold">LinkedIn</p>
                      <Link href={profileData.linkedinProfileUrl} target="_blank" className="text-sm font-medium text-primary hover:underline">
                        Visit Profile
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-border/50 bg-gradient-to-br from-card/50 to-card/25">
              <CardHeader>
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="text-2xl font-black text-primary">{profileData.xpPoints || 0}</div>
                    <p className="text-xs text-muted-foreground uppercase font-bold mt-1">XP Points</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <div className="text-2xl font-black text-emerald-600">₹{profileData.walletBalance || 0}</div>
                    <p className="text-xs text-muted-foreground uppercase font-bold mt-1">Wallet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* About Section */}
          {(profileData.linkedinSummary || profileData.professionalSummary) && (
            <motion.div variants={itemVariants}>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profileData.linkedinSummary && (
                    <div>
                      <p className="text-xs uppercase font-bold text-muted-foreground mb-2">LinkedIn Summary</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{profileData.linkedinSummary}</p>
                    </div>
                  )}
                  {profileData.professionalSummary && (
                    <div>
                      <p className="text-xs uppercase font-bold text-muted-foreground mb-2">Professional Summary</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{profileData.professionalSummary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Experience Highlights */}
          {profileData.experienceHighlights && profileData.experienceHighlights.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" /> Experience Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {profileData.experienceHighlights.map((highlight, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Skills Section */}
          {(profileData.profileSkills?.length || 0) > 0 || (profileData.skills?.length || 0) > 0 ? (
            <motion.div variants={itemVariants}>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" /> Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData.profileSkills?.map((skill, idx) => (
                      <Badge key={`profile-${idx}`} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 cursor-pointer transition-colors">
                        {skill}
                      </Badge>
                    ))}
                    {profileData.skills?.map((skill, idx) => (
                      <Badge key={`skill-${idx}`} variant="outline" className="hover:bg-accent cursor-pointer transition-colors">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}

          {/* Education Section */}
          {profileData.education && profileData.education.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" /> Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profileData.education.map((edu, idx) => (
                      <div key={idx} className="pb-6 border-b border-border/50 last:border-0 last:pb-0">
                        <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                        <p className="text-sm text-primary">{edu.college}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Graduated {edu.graduationYear}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Career Goals */}
          {profileData.careerGoals && profileData.careerGoals.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="border-border/50 bg-gradient-to-br from-card/50 to-card/25">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" /> Career Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {profileData.careerGoals.map((goal, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <div className="w-5 h-5 rounded-full border-2 border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Courses Section */}
          {profileData.enrolledCourses && profileData.enrolledCourses.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" /> Enrolled Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {profileData.enrolledCourses.map((course, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-border/50 bg-card/50">
                        <p className="text-sm font-semibold text-foreground">{course}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Empty State */}
          {!profileData.linkedinSummary && 
           !profileData.experienceHighlights?.length && 
           !profileData.profileSkills?.length &&
           !profileData.education?.length && (
            <motion.div variants={itemVariants}>
              <Card className="border-border/50 border-dashed">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">Complete your profile to showcase your expertise</p>
                  <Link href="/profile/edit">
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" /> Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
