"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, GraduationCap, Briefcase, PlayCircle, Clock, Star, Users, BrainCircuit, Rocket, ShieldCheck, Zap, X, QrCode, Trophy } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COURSES, Course } from "@/data/courses";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";

// Categories definition
const CATEGORIES = [
  { id: "All", label: "All", count: 44 },
  { id: "Technical", label: "Technical", count: 27 },
  { id: "Non-Technical", label: "Non-Technical", count: 8 },
  { id: "Science", label: "Science", count: 9 },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin" || user?.publicMetadata?.role === "employee";

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 23,
    hours: 21,
    minutes: 7,
    seconds: 8
  });

  useEffect(() => {
    // Set a consistent target date: May 20, 2026
    const targetDate = new Date("May 20, 2026 00:00:00");

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setVisibleCount(9);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (course: Course) => {
    setIsPaymentLoading(true);
    
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsPaymentLoading(false);
      return;
    }

    const amountStr = course.price.replace(/[^0-9.-]+/g, "");
    const amount = parseInt(amountStr);

    try {
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, itemType: 'Course', itemId: course.id }),
      });

      const orderData = await response.json();
      if (!response.ok) throw new Error(orderData.details || orderData.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Startup India 2026",
        description: `Enrollment for ${course.title}`,
        order_id: orderData.id,
        handler: function (response: any) {
          window.location.href = `/courses/${course.id}?success=true`;
        },
        prefill: {
          name: "Student",
          email: "student@example.com",
        },
        theme: { color: "#00D4FF" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      console.error(error);
      alert(`Failed to initiate payment: ${error.message || "Please check your internet and try again."}`);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  // Filter logic
  const filteredCourses = COURSES.filter((course) => {
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.tools.some(tool => tool.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative selection:bg-primary/30">
      {/* Background Gradients (Saffron & Blue) */}
      <div className="absolute top-0 -left-1/4 w-3/4 h-3/4 bg-primary/10 dark:bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-3/4 h-3/4 bg-secondary/10 dark:bg-secondary/20 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="/logo.png" alt="Startup India Logo" className="h-12 w-auto object-contain bg-white/90 p-1 rounded-md shadow-sm" />
            <span className="hidden sm:inline-block font-space-grotesk font-black text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">STARTUP INDIA 2026</span>
          </div>
          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Home</a>
            <a href="#programs" className="hover:text-primary transition-colors">Courses</a>
            <Link href="/certification" className="hover:text-primary transition-colors">Certifications</Link>
            <Link href="/career-hub" className="hover:text-primary transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Career Hub
            </Link>
            <a href="#programs" className="hover:text-primary transition-colors">Internship</a>
            <a href="#" className="hover:text-primary transition-colors">Placement</a>
            <Link href="/achievers" className="hover:text-primary transition-colors flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" /> Achievers
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isLoaded && !isSignedIn && (
              <div className="flex items-center gap-3">
                <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <Button variant="outline" className="hidden md:inline-flex border-border bg-background/50 hover:bg-accent h-9 text-xs">Login</Button>
                </SignInButton>
                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <Button className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25 h-9 text-xs px-5">Register</Button>
                </SignUpButton>
                <div className="h-6 w-[1px] bg-border/60 mx-1 hidden lg:block" />
                <Link href="/employee/sign-in">
                  <Button variant="ghost" size="sm" className="hidden lg:inline-flex text-muted-foreground hover:text-primary font-bold gap-1.5 px-2 h-8 text-[10px] uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3" /> Employee Login
                  </Button>
                </Link>
              </div>
            )}
            {isLoaded && isSignedIn && (
              <div className="flex items-center gap-3">
                <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 border-2 border-primary/20" } }} />
                {isAdmin && (
                  <>
                    <div className="h-6 w-[1px] bg-border/60 mx-1" />
                    <Link href="/admin">
                      <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10 font-black gap-1.5 h-8 px-3 text-[10px] uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3" /> Admin Hub
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <Hero />

      {/* Internship & Course Marketplace */}
      <section id="programs" className="relative z-10 py-24 px-6 max-w-7xl mx-auto border-t border-border/50">
        <div className="flex flex-col items-center text-center mb-12">
          <Badge variant="outline" className="text-primary border-primary mb-3 bg-primary/10 px-4 py-1 text-sm font-bold tracking-widest">OUR PROGRAMS</Badge>
          <h2 className="text-3xl md:text-5xl font-space-grotesk font-bold text-foreground mb-4">Master the Skills that Make You Employable</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">Explore our industry-aligned internships designed by experts to make you job-ready.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col space-y-8 mb-12">
          <div className="relative max-w-2xl mx-auto w-full group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-card border border-border rounded-2xl flex items-center shadow-lg h-16">
              <Search className="w-6 h-6 text-muted-foreground ml-5" />
              <Input 
                type="text" 
                placeholder="Search by internship name or technology (e.g., Python, React, Marketing)..." 
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg px-4 h-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <Button 
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                className={`rounded-full px-6 transition-all h-12 text-base font-semibold ${activeCategory === cat.id ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-card hover:bg-accent border-border"}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label} <span className={`ml-2 text-xs py-1 px-3 rounded-full ${activeCategory === cat.id ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>{cat.count}</span>
              </Button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredCourses.slice(0, visibleCount).map((course) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={course.id}
                className="group h-full"
              >
                <Card className="bg-card border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 transform group-hover:-translate-y-2 h-full flex flex-col relative">
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-[#FF3366] hover:bg-[#FF3366] text-white font-bold animate-pulse shadow-lg border-0">{course.discount}</Badge>
                  </div>
                  
                  <div className="h-48 relative overflow-hidden flex items-center justify-center border-b border-border text-center">
                    <div className="absolute inset-0 bg-black/60 z-10 transition-colors group-hover:bg-black/40" />
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-110" 
                    />
                    <h3 className="relative z-20 text-2xl font-bold font-space-grotesk text-white px-6 line-clamp-3 leading-tight drop-shadow-lg">{course.title}</h3>
                  </div>
                  <CardContent className="p-5 flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-semibold">{course.type}</Badge>
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary border-0">{course.category}</Badge>
                    </div>

                    <div className="flex gap-4 mb-5 text-sm font-semibold text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {course.duration}</div>
                      <div className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-secondary" /> {course.level}</div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {course.tools.map((tool, i) => (
                        <span key={i} className="text-xs font-semibold bg-muted text-foreground px-2 py-1 rounded-md border border-border/50 shadow-sm">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-0 flex flex-col gap-4 mt-auto">
                    <div className="flex items-end justify-between w-full border-t border-border/50 pt-4">
                      <div className="flex flex-col">
                         <span className="text-xs font-bold text-muted-foreground line-through">{course.oldPrice}</span>
                         <span className="text-3xl font-black text-foreground leading-none">{course.price}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full mt-2">
                      <Link href={`/courses/${course.id}`} className="w-1/2">
                        <Button variant="outline" className="w-full border-border hover:bg-accent font-bold text-sm h-11">View Details</Button>
                      </Link>
                      <Button onClick={() => handlePayment(course)} className="w-1/2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm h-11 shadow-md shadow-primary/20">Enroll Now</Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredCourses.length === 0 && (
            <div className="col-span-full py-24 text-center text-muted-foreground">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h3 className="text-2xl font-semibold mb-2">No programs found</h3>
              <p className="text-lg">Try adjusting your search criteria</p>
            </div>
          )}
        </motion.div>

        {filteredCourses.length > visibleCount && (
          <div className="mt-12 flex justify-center">
            <Button 
              onClick={() => setVisibleCount(prev => prev + 9)} 
              variant="outline" 
              size="lg" 
              className="border-primary/50 text-primary hover:bg-primary/10 font-bold px-8 py-6 rounded-full"
            >
              See More Programs
            </Button>
          </div>
        )}
      </section>

      {/* Combo Offer Banner */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto border-t border-border/50">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-1 shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-white/20 blur-xl group-hover:bg-white/30 transition-all duration-500" />
          <div className="bg-card rounded-[22px] p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold animate-pulse mb-4 border-0">LIMITED TIME COMBO OFFER</Badge>
              <h2 className="text-3xl md:text-4xl font-space-grotesk font-bold text-foreground mb-4">Get 2 Internship Programs at just <span className="text-primary font-black">₹4,500</span></h2>
              <p className="text-muted-foreground text-lg mb-2">Original Price: <span className="line-through">₹6,200</span> — <span className="text-green-500 font-bold">Save ₹1,700!</span></p>
            </div>
            <div className="flex flex-col items-center gap-4 bg-background/50 p-6 rounded-2xl backdrop-blur-sm border border-border shadow-inner">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Offer Ends In:</p>
              <div className="flex items-center gap-3 text-2xl md:text-3xl font-black font-space-grotesk text-foreground">
                <div className="flex flex-col items-center">
                  <span className="bg-muted px-4 py-2 rounded-xl border border-border min-w-[60px] text-center">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground mt-1">Days</span>
                </div> 
                <span className="text-primary mb-5">:</span>
                <div className="flex flex-col items-center">
                  <span className="bg-muted px-4 py-2 rounded-xl border border-border min-w-[60px] text-center">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground mt-1">Hours</span>
                </div> 
                <span className="text-primary mb-5">:</span>
                <div className="flex flex-col items-center">
                  <span className="bg-muted px-4 py-2 rounded-xl border border-border min-w-[60px] text-center">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground mt-1">Mins</span>
                </div> 
                <span className="text-primary mb-5">:</span>
                <div className="flex flex-col items-center">
                  <span className="bg-muted px-4 py-2 rounded-xl border border-border min-w-[60px] text-center text-red-500">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground mt-1">Secs</span>
                </div>
              </div>
              <Button className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-12 shadow-lg shadow-primary/20">Grab This Deal Now</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Internships Matter & Why Us */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto border-t border-border/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <Badge variant="outline" className="text-secondary border-secondary mb-3 bg-secondary/10 px-4 py-1 text-sm font-bold tracking-widest">WHY INTERNSHIPS</Badge>
            <h2 className="text-3xl md:text-5xl font-space-grotesk font-bold text-foreground mb-6">The Importance of Internships</h2>
            <p className="text-muted-foreground text-lg mb-8">Discover how internships can transform your career and set you apart in the competitive job market.</p>
            
            <div className="bg-card border border-border p-6 rounded-2xl shadow-lg mb-6 flex items-start gap-4 hover:border-primary/50 transition-colors">
              <div className="bg-primary/10 p-4 rounded-full"><BrainCircuit className="w-8 h-8 text-primary" /></div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Career Clarity</h3>
                <p className="text-muted-foreground">Discover your true passion and career direction by experiencing different roles and industries before graduating.</p>
              </div>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-2xl shadow-lg flex items-center gap-6 hover:border-secondary/50 transition-colors">
               <h3 className="text-5xl font-black text-secondary">60%</h3>
               <p className="text-lg font-medium text-muted-foreground">of students change career plans after internships due to practical exposure.</p>
            </div>
          </div>

          <div>
             <Badge variant="outline" className="text-primary border-primary mb-3 bg-primary/10 px-4 py-1 text-sm font-bold tracking-widest">WHY STARTUP INDIA 2026?</Badge>
             <h2 className="text-3xl md:text-5xl font-space-grotesk font-bold text-foreground mb-6">Bridge the gap between education and employability.</h2>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {['10,000+ Students Trained', '200+ Hiring Partners', 'Industry-Recognized Certifications', 'Self-Paced Learning', 'Guaranteed Project Experience', 'Dedicated Mentor Support'].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-card border border-border p-4 rounded-xl shadow-sm hover:bg-accent/50 transition-colors">
                    <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="font-semibold text-foreground text-sm">{feature}</span>
                  </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="relative z-10 py-24 px-6 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <Badge variant="outline" className="text-primary border-primary mb-3 bg-primary/10 px-4 py-1 text-sm font-bold tracking-widest">CERTIFICATIONS</Badge>
            <h2 className="text-3xl md:text-5xl font-space-grotesk font-bold text-foreground mb-4">Government & Industry Recognized</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">Earn verifiable certificates recognized by the Government of India upon successful completion of your internship program.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold font-space-grotesk text-foreground mb-6">Startup India Approved</h3>
              <Link href="/certification" className="bg-white p-2 rounded-2xl shadow-2xl border border-border/20 w-full hover:scale-[1.02] transition-transform duration-500 cursor-pointer block">
                <img src="/dpiit_cert_new.png" alt="DPIIT Certificate of Recognition" className="w-full h-auto rounded-xl border border-border/10" />
              </Link>
              <p className="text-muted-foreground text-center mt-6 max-w-md font-medium">Startup India Technologies Pvt. Ltd. is officially recognized by the Government of India under the Startup India initiative.</p>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold font-space-grotesk text-foreground mb-6">Internship Certificate of Completion</h3>
              <Link href="/certification" className="bg-white p-2 rounded-2xl shadow-2xl border border-border/20 w-full hover:scale-[1.02] transition-transform duration-500 cursor-pointer block">
                <img src="/internship_cert_new.png" alt="Internship Certificate of Completion" className="w-full h-auto rounded-xl border border-border/10" />
              </Link>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                 <Badge variant="secondary" className="px-4 py-2 bg-card border border-border"><ShieldCheck className="w-4 h-4 mr-2 text-green-500"/> MSME Registered</Badge>
                 <Badge variant="secondary" className="px-4 py-2 bg-card border border-border"><Search className="w-4 h-4 mr-2 text-primary"/> Verifiable Online</Badge>
                 <Badge variant="secondary" className="px-4 py-2 bg-card border border-border"><Briefcase className="w-4 h-4 mr-2 text-blue-500"/> LinkedIn Ready</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Marquee */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto overflow-hidden border-b border-border/50">
        <h3 className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-10">Our Alumni Work At</h3>
        <div className="flex flex-wrap gap-8 md:gap-16 items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-500">
           {['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'Accenture', 'Deloitte', 'Cognizant', 'Capgemini'].map((company, i) => (
             <span key={i} className="text-2xl md:text-4xl font-space-grotesk font-black text-foreground/50 hover:text-primary transition-colors cursor-default">{company}</span>
           ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <Badge variant="outline" className="text-secondary border-secondary mb-3 bg-secondary/10 px-4 py-1 text-sm font-bold tracking-widest">HOW IT WORKS</Badge>
            <h2 className="text-3xl md:text-5xl font-space-grotesk font-bold text-foreground mb-4">Your Journey to Success</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">From learning to landing your dream job in 5 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />
            
            {[
              { num: '01', title: 'Choose Your Course', desc: 'Browse our expert-curated programs' },
              { num: '02', title: 'Learn with Mentors', desc: 'Live sessions or self-paced learning' },
              { num: '03', title: 'Build Real Projects', desc: 'Hands-on industry experience' },
              { num: '04', title: 'Get Certified', desc: 'MSME & AICTE completion certificate' },
              { num: '05', title: 'Apply for Jobs', desc: 'Access to 200+ hiring partners' },
            ].map((step, idx) => (
              <div key={idx} className="bg-card border border-border p-6 rounded-2xl shadow-lg relative z-10 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-lg mb-4 shadow-lg ring-4 ring-background">{step.num}</div>
                <h3 className="font-bold text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="relative z-10 py-24 px-6 max-w-3xl mx-auto bg-muted/30 border-y border-border/50 rounded-3xl mb-24 shadow-inner">
        <div className="flex flex-col items-center text-center mb-12">
          <Badge variant="outline" className="text-primary border-primary mb-3 bg-primary/10 px-4 py-1 text-sm font-bold tracking-widest">FAQS</Badge>
          <h2 className="text-3xl md:text-5xl font-space-grotesk font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4 px-4 md:px-0">
          {[
            "What is the duration of the internship programs?",
            "Do I need prior experience to enroll?",
            "What certificate will I receive after completion?",
            "Is the internship self-paced or scheduled?",
            "Will I get placement assistance after completing the program?"
          ].map((q, idx) => (
            <details key={idx} className="group bg-card border border-border rounded-xl shadow-sm [&_summary::-webkit-details-marker]:hidden hover:border-primary/50 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-foreground">
                {q}
                <span className="transition group-open:rotate-180 text-primary">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="px-6 pb-6 text-muted-foreground">All our programs are deeply structured to provide massive value. The duration varies from 6 to 12 weeks depending on the complexity of the domain, ensuring you get ample time for hands-on project building.</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />

      {/* Payment Modal Overlay */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-card border border-border rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/50">
                <div>
                  <h3 className="font-space-grotesk font-bold text-xl text-foreground">Secure Payment</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{selectedCourse.title}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedCourse(null)} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 flex flex-col items-center">
                <div className="w-full bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between mb-6">
                  <span className="font-semibold text-muted-foreground">Amount to Pay:</span>
                  <span className="text-2xl font-black text-primary">{selectedCourse.price}</span>
                </div>

                <div className="w-full space-y-4 mb-6">
                  <div className="p-4 border border-border rounded-xl bg-muted/30 flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg flex-shrink-0">
                      <img src="https://razorpay.com/build/browser/static/razorpay-logo.5cdb58df.svg" alt="Razorpay" className="h-4 object-contain" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">Cards, UPI, NetBanking</h4>
                      <p className="text-xs text-muted-foreground">Pay securely via Google Pay, PhonePe, Paytm & More</p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" 
                  onClick={() => handlePayment(selectedCourse)}
                  disabled={isPaymentLoading}
                >
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  {isPaymentLoading ? "Processing..." : "Pay Now"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
