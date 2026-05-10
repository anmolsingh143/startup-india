import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { Internship, Application, User } from "@/models/CoreModels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Plus, Search, MoreHorizontal, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function RecruiterDashboard() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) redirect("/");

  // RBAC Check
  const role = clerkUser.publicMetadata?.role;
  if (role !== "Recruiter" && role !== "Admin") {
    redirect("/dashboard");
  }

  await dbConnect();
  
  // Find recruiter user in DB
  const user = await User.findOne({ clerkId: userId });
  if (!user) redirect("/");

  // Fetch internships posted by this recruiter
  const internships = await Internship.find({ recruiterId: user._id }).lean();
  
  // Fetch applications for these internships
  const internshipIds = internships.map(i => i._id);
  const applications = await Application.find({ internshipId: { $in: internshipIds } })
    .populate('studentId')
    .populate('internshipId')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <nav className="relative z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto bg-white/90 p-1 rounded-md" />
            </Link>
            <span className="font-space-grotesk font-black text-lg">RECRUITER HUB</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-grow py-12 px-6 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-space-grotesk font-bold">Recruiter Dashboard</h1>
            <p className="text-muted-foreground">Manage your internship listings and track candidates.</p>
          </div>
          <Link href="/dashboard/recruiter/post">
            <Button className="bg-primary text-white font-bold rounded-full px-6">
              <Plus className="w-4 h-4 mr-2" /> Post New Internship
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Postings</CardTitle>
              <Briefcase className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{internships.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
              <Search className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applications.filter((a: any) => a.status === 'Shortlisted').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-space-grotesk">Recent Applications</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-primary/5 text-primary border-primary/20">
                <Sparkles className="w-4 h-4 mr-2" /> AI Filter: Top Talent
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-4">Candidate</th>
                      <th className="px-6 py-4">AI Match</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-b">
                    {applications.map((app: any) => (
                      <tr key={app._id.toString()} className="hover:bg-muted/30 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                              {(app.studentId as any)?.firstName?.[0]}
                            </div>
                            <div>
                              <p className="font-medium">{(app.studentId as any)?.firstName} {(app.studentId as any)?.lastName}</p>
                              <p className="text-xs text-muted-foreground">{(app.studentId as any)?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-muted rounded-full h-1.5 max-w-[60px]">
                              <div className="bg-primary h-1.5 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <span className="text-xs font-bold text-primary">85%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{(app.internshipId as any)?.title}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={app.status === 'Shortlisted' ? 'border-green-500 text-green-500' : ''}>
                            {app.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <Button size="sm" variant="outline" className="h-8 px-3">View Profile</Button>
                             <Button size="sm" className="h-8 px-3 bg-primary text-white">Schedule</Button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
