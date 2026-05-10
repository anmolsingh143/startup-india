import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function CertificationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-1/4 w-3/4 h-3/4 bg-primary/10 dark:bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-3/4 h-3/4 bg-secondary/10 dark:bg-secondary/20 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center py-12 px-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-10">
          <Badge variant="outline" className="text-primary border-primary mb-3 bg-primary/10 px-4 py-1 text-sm font-bold tracking-widest">
            OFFICIAL CERTIFICATION
          </Badge>
          <h1 className="text-4xl md:text-5xl font-space-grotesk font-black text-foreground mb-4">
            Startup India Recognition
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Startup India Technologies Pvt. Ltd. is officially recognized by the Government of India under the Startup India initiative.
          </p>
        </div>

        <div className="w-full max-w-4xl bg-white p-4 md:p-6 rounded-3xl shadow-2xl border border-border/20">
          <img 
            src="/dpiit_cert_new.png" 
            alt="DPIIT Certificate of Recognition" 
            className="w-full h-auto rounded-2xl border border-border/10 shadow-inner" 
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Badge variant="secondary" className="px-6 py-3 text-sm bg-card border border-border shadow-sm">
            <ShieldCheck className="w-5 h-5 mr-2 text-green-500"/> Government of India Recognized
          </Badge>
        </div>
      </main>
    </div>
  );
}
