"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Clock, Users, BookOpen, Award, CheckCircle2, ChevronRight, ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COURSES } from "@/data/courses";
import { COURSE_DETAILS, getDefaultCourseDetail } from "@/data/courseDetails";
import { CoursePlayer } from "@/components/courses/CoursePlayer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

declare global { interface Window { Razorpay: new (options: object) => { open: () => void }; } }

interface CourseDetailClientProps { courseId: string; }

export function CourseDetailClient({ courseId }: CourseDetailClientProps) {
  const course = COURSES.find((c) => c.id === courseId);
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const [hasPaid, setHasPaid] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "roadmap" | "learn">(
    searchParams.get("success") === "true" ? "learn" : "overview"
  );
  const [payLoading, setPayLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyEnrollment = async () => {
      try {
        const res = await fetch(`/api/courses/verify-enrollment?courseId=${courseId}`);
        const data = await res.json();
        if (data.enrolled) setHasPaid(true);
      } catch (error) {
        console.error("Verification failed:", error);
      } finally {
        setIsVerifying(false);
      }
    };
    verifyEnrollment();
  }, [courseId]);

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><h1 className="text-2xl font-bold mb-4">Course not found</h1><Link href="/"><Button>Go Home</Button></Link></div>
    </div>
  );

  const detail = COURSE_DETAILS[courseId] ?? getDefaultCourseDetail(courseId, course.title, course.tools, course.duration, course.level);
  const priceNum = parseInt(course.price.replace(/[^0-9]/g, ""), 10);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!isSignedIn) {
      alert("Please sign in to complete payment.");
      return;
    }

    setPayLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Please check your connection.");
        return;
      }

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: priceNum, 
          receipt: `course-${courseId}`,
          itemType: 'Course',
          itemId: courseId
        }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.details || order.error || "Failed to create order");

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) throw new Error("Razorpay public key is not configured.");

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: "INR",
        name: "Startup India Technologies",
        description: course.title,
        order_id: order.id,
        handler: () => { 
          setHasPaid(true); 
          setActiveTab("learn"); 
          window.location.href = `/courses/${courseId}?success=true`;
        },
        prefill: { name: "Student", email: "student@example.com" },
        theme: { color: "#00D4FF" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      alert(`Payment Error: ${error.message || "Please check your connection and try again."}`);
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="h-5 w-px bg-border" />
          <span className="font-bold truncate">{course.title}</span>
          <div className="ml-auto flex items-center gap-3">
            <Badge variant="outline">{course.level}</Badge>
            {hasPaid && (
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Payment Verified
                </Badge>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  <Zap className="w-3 h-3 mr-1" /> Internship Active
                </Badge>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#071120] via-background to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{course.type}</Badge>
              <Badge className={course.category === "Technical" ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/10 text-secondary border-secondary/20"}>{course.category}</Badge>
              <Badge className="bg-red-500/10 text-red-400 border-red-500/20">{course.discount}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-space-grotesk font-black tracking-tight mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{detail.tagline}</p>
            <div className="flex flex-wrap gap-6 text-sm mb-8">
              <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span className="font-bold">{detail.ratings}</span><span className="text-muted-foreground">({detail.totalStudents} students)</span></div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /><span>{course.duration}</span></div>
              <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-secondary" /><span>{detail.modules.length} modules</span></div>
              <div className="flex items-center gap-2"><Award className="w-4 h-4 text-yellow-500" /><span>AI Certificate</span></div>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">{detail.instructor[0]}</div>
              <div><span className="font-semibold text-foreground">{detail.instructor}</span> · {detail.instructorRole}</div>
            </div>
          </motion.div>

          {/* Enrollment Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="rounded-3xl border border-border bg-card p-8 shadow-2xl">
            <img src={course.image} alt={course.title} className="w-full h-48 object-cover rounded-2xl mb-6" />
            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-black">{course.price}</span>
              <span className="text-xl text-muted-foreground line-through">{course.oldPrice}</span>
              <Badge className="bg-red-500 text-white border-0 ml-auto">{course.discount}</Badge>
            </div>
            {hasPaid ? (
              <Button onClick={() => setActiveTab("learn")} size="lg" className="w-full h-14 rounded-2xl font-bold bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle2 className="w-5 h-5 mr-2" /> Continue Learning
              </Button>
            ) : (
              <Button onClick={handlePayment} disabled={payLoading} size="lg" className="w-full h-14 rounded-2xl font-bold shadow-[0_0_30px_rgba(0,212,255,0.2)]">
                {payLoading ? "Processing..." : `Enroll in Training + Internship · ${course.price}`}
              </Button>
            )}
            <div className="mt-4 space-y-2">
              {["Lifetime access to all modules", "AI-generated quiz after each video", `Earn up to ${detail.creditsPerModule * detail.modules.length}+ XP credits`, "AI-powered PDF certificate", "Expert mentor support"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex border-b border-border">
          {(["overview", "roadmap", "learn"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-semibold text-sm capitalize transition-all border-b-2 -mb-px ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {tab === "learn" ? "🚀 Internship Hub" : tab === "roadmap" ? "🗺️ Roadmap" : "📋 Overview"}
            </button>
          ))}
        </div>

        <div className="py-10">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 mb-10">
                  <h3 className="flex items-center gap-2 font-bold text-blue-400 mb-2">
                    <Zap className="w-4 h-4" /> Secure Enrollment System
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This program uses an automated <strong>Payment + AI Verification</strong> system. Access is granted instantly upon successful payment, linking your unique ID to the Startup India internship database for verifiable certification.
                  </p>
                </div>
                <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
                <div className="space-y-3 mb-10">
                  {detail.whatYoullLearn.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
                <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
                <div className="space-y-2">
                  {detail.prerequisites.map((p) => (
                    <div key={p} className="flex items-center gap-2 text-sm"><ChevronRight className="w-4 h-4 text-primary" />{p}</div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-6">Tools & Technologies</h2>
                <div className="flex flex-wrap gap-2 mb-8">
                  {course.tools.filter(t => !t.includes("+")).map((t) => (
                    <Badge key={t} variant="outline" className="px-4 py-2 text-sm">{t}</Badge>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-card border border-border text-center">
                    <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="font-black text-lg">{detail.totalStudents}</div>
                    <div className="text-xs text-muted-foreground">Students</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-card border border-border text-center">
                    <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2 fill-yellow-500" />
                    <div className="font-black text-lg">{detail.ratings}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-card border border-border text-center">
                    <Zap className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <div className="font-black text-lg">{detail.creditsPerModule * detail.modules.length}+</div>
                    <div className="text-xs text-muted-foreground">Credits</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Roadmap Tab */}
          {activeTab === "roadmap" && (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-2">Your Learning Roadmap</h2>
              <p className="text-muted-foreground mb-10">A structured path to mastery — week by week.</p>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-transparent" />
                <div className="space-y-8">
                  {detail.roadmap.map((phase, idx) => (
                    <motion.div key={phase.week} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }}
                      className="flex gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl flex-shrink-0 z-10">{phase.icon}</div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-xs">{phase.week}</Badge>
                          <h3 className="font-bold text-lg">{phase.title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {phase.skills.map((s) => <Badge key={s} className="text-xs bg-muted text-foreground border-0">{s}</Badge>)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-xl bg-muted/30 border border-border">
                          <span className="text-primary">🎯</span>
                          <span>Project: <strong>{phase.project}</strong></span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Learn Tab */}
          {activeTab === "learn" && (
            <CoursePlayer
              detail={detail}
              courseId={courseId}
              price={course.price}
              image={course.image}
              hasPaid={hasPaid}
              onPayNow={handlePayment}
            />
          )}
        </div>
      </div>
    </div>
  );
}
