import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { User, Internship } from "@/models/CoreModels";
import { Payment } from "@/models/AnalyticsModels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, CreditCard, ShieldCheck, TrendingUp, BarChart3 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) redirect("/");

  // Admin Check
  if (clerkUser.publicMetadata?.role !== "Admin") {
    redirect("/dashboard");
  }

  await dbConnect();

  // Aggregate Metrics (Mocking some if data is empty)
  const totalUsers = await User.countDocuments();
  const totalInternships = await Internship.countDocuments();
  const successfulPayments = await Payment.find({ status: 'Successful' }).lean();
  const totalRevenue = successfulPayments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <nav className="relative z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto bg-white/90 p-1 rounded-md" />
            </Link>
            <span className="font-space-grotesk font-black text-lg">ADMIN PANEL</span>
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
            <h1 className="text-3xl font-space-grotesk font-bold">System Overview</h1>
            <p className="text-muted-foreground">Monitor platform performance and revenue metrics.</p>
          </div>
          <Badge className="bg-red-500 text-white font-bold px-4 py-2 rounded-full">SYSTEM LIVE</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue}</div>
              <p className="text-xs text-muted-foreground mt-1">Real-time payment sync</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Internships</CardTitle>
              <Activity className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInternships}</div>
              <p className="text-xs text-muted-foreground mt-1">Across 12 categories</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-[#00D4FF]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Security Audit</CardTitle>
              <ShieldCheck className="h-4 w-4 text-[#00D4FF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Secure</div>
              <p className="text-xs text-muted-foreground mt-1">Clerk JWT Active</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold font-space-grotesk flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Pending Approvals
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-4">Internship</th>
                      <th className="px-6 py-4">Recruiter</th>
                      <th className="px-6 py-4">Date Submitted</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium">Machine Learning Intern</td>
                      <td className="px-6 py-4 text-muted-foreground">TechStart India</td>
                      <td className="px-6 py-4 text-muted-foreground">May 08, 2026</td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                           <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 border-red-200">Reject</Button>
                           <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                         </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-space-grotesk flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" /> User Management
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium">Aryan Sharma</td>
                      <td className="px-6 py-4 text-muted-foreground">aryan@example.com</td>
                      <td className="px-6 py-4"><Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Student</Badge></td>
                      <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-green-500"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active</div></td>
                      <td className="px-6 py-4 text-right">
                         <Button variant="ghost" size="sm">Manage</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium">Priya Verma</td>
                      <td className="px-6 py-4 text-muted-foreground">priya@startup.co</td>
                      <td className="px-6 py-4"><Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20">Recruiter</Badge></td>
                      <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-green-500"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active</div></td>
                      <td className="px-6 py-4 text-right">
                         <Button variant="ghost" size="sm">Manage</Button>
                      </td>
                    </tr>
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
