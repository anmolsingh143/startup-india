import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { User, Application } from "@/models/CoreModels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Briefcase, GraduationCap, Wallet, Star } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    redirect("/");
  }

  await dbConnect();


  // 1. Always use Clerk publicMetadata for role
  let user = await User.findOne({ clerkId: userId });
  const role = (clerkUser.publicMetadata?.role || "student").toLowerCase();

  if (!user) {
    user = await User.create({
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      firstName: clerkUser.firstName || "Student",
      lastName: clerkUser.lastName || "",
      role,
      profileImage: clerkUser.imageUrl,
    });
  } else if (user.role !== role) {
    // Sync role if changed in Clerk
    user.role = role;
    await user.save();
  }

  // Only allow students
  if (role !== "student") {
    redirect("/admin/dashboard");
  }

  // Fetch user's active applications
  const applications = await Application.find({ studentId: user._id }).populate('internshipId').lean();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-1/4 w-3/4 h-3/4 bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-3/4 h-3/4 bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation Bar */}
      <nav className="relative z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img src="/logo.png" alt="Startup India Logo" className="h-10 w-auto object-contain bg-white/90 p-1 rounded-md shadow-sm" />
            </Link>
            <span className="font-space-grotesk font-black text-lg tracking-tight">STUDENT DASHBOARD</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <Link href="/profile" className="hover:text-primary transition-colors">My Profile</Link>
            <Link href="/internships" className="hover:text-primary transition-colors">Internships</Link>
            <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 border-2 border-primary/20" } }} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-grow py-12 px-6 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-space-grotesk font-bold">Welcome back, {user.firstName}! 👋</h1>
            <p className="text-muted-foreground mt-2">Here's your learning and career progress overview.</p>
          </div>
          <Badge className="bg-primary text-primary-foreground font-bold px-4 py-2 text-sm uppercase tracking-wider">{user.role}</Badge>
        </div>

        {/* Profile Builder CTA */}
        <div className="grid gap-4 md:grid-cols-[1.6fr_1fr]">
          <Card className="bg-card border-border p-6 shadow-sm">
            <CardHeader>
              <CardTitle>{user.headline ? 'Your Professional Profile' : 'Build Your LinkedIn-ready Profile'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.headline ? (
                <>
                  <p className="text-lg font-semibold text-foreground">{user.headline}</p>
                  {user.linkedinSummary ? (
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{user.linkedinSummary}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Your AI-generated LinkedIn profile summary is ready.</p>
                  )}
                  <Link href="/profile" className="inline-block mt-4">
                    <Button variant="default" size="sm">View Full Profile</Button>
                  </Link>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Generate a professional profile summary, headline, and experience highlights powered by Gemini AI. Use this to make your LinkedIn profile stand out.
                </p>
              )}
            </CardContent>
          </Card>
          <Card className="bg-card border-border p-6 shadow-sm flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle>Need a polished profile?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Create a data-driven, recruiter-friendly LinkedIn summary that highlights your skills, experience, and goals.</p>
              </CardContent>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/dashboard/ai">
                <Button className="w-full">Open AI Career Hub</Button>
              </Link>
              <Link href="/profile/edit">
                <Button variant="outline" className="w-full">Edit Profile Manually</Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{user.walletBalance || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Available for courses</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">XP Points</CardTitle>
              <Star className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.xpPoints || 0} XP</div>
              <p className="text-xs text-muted-foreground mt-1">Global Rank: #4,201</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Pending review</p>
            </CardContent>
          </Card>
          <Link href="/dashboard/ai" className="block group">
            <Card className="bg-card border-border shadow-sm group-hover:shadow-lg group-hover:border-primary/50 transition-all h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">AI Career Insights</CardTitle>
                <BrainCircuit className="h-4 w-4 text-[#00D4FF]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold group-hover:text-primary transition-colors">Analyze Profile</div>
                <p className="text-xs text-muted-foreground mt-1">Get your ATS score & roadmap →</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Applications Section */}
        <div>
          <h2 className="text-xl font-bold font-space-grotesk mb-4">Your Applications</h2>
          {applications.length > 0 ? (
            <div className="grid gap-4">
              {applications.map((app: any) => (
                <Card key={app._id.toString()} className="bg-card border-border p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{app.internshipId?.title || "Unknown Internship"}</h3>
                    <p className="text-sm text-muted-foreground">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={app.status === 'Pending' ? 'secondary' : 'default'} className="font-semibold">
                    {app.status}
                  </Badge>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/30 border-dashed border-2 p-12 flex flex-col items-center justify-center text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-semibold">No active applications</h3>
              <p className="text-muted-foreground mb-6">Explore the marketplace and apply to your dream internship.</p>
              <Link href="/internships">
                <button className="bg-primary text-primary-foreground font-bold px-6 py-2 rounded-full shadow-md hover:bg-primary/90">
                  Browse Internships
                </button>
              </Link>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
