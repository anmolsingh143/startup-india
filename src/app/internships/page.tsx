import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import { Internship } from "@/models/CoreModels";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InternshipList } from "@/components/internships/InternshipList";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function InternshipsPage() {
  const { userId } = await auth();

  await dbConnect();

  // Fetch open internships from MongoDB
  const internships = await Internship.find({ status: 'Open' }).lean();

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
            <span className="font-space-grotesk font-black text-lg tracking-tight">INTERNSHIPS</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {userId ? <UserButton /> : <Link href="/sign-in"><Button variant="outline">Sign In</Button></Link>}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-grow py-12 px-6 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary border font-bold px-4 py-1 uppercase tracking-widest">
            MARKETPLACE
          </Badge>
          <h1 className="text-4xl md:text-6xl font-space-grotesk font-black tracking-tight">Find Your Dream Role</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Apply to top-tier internships and get hired by verified startups across India. AI-matched to your skills.
          </p>
        </div>

        {/* Internships Grid */}
        <InternshipList internships={internships} />

      </main>
    </div>
  );
}
