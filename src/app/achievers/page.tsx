"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRight, Star, ExternalLink, Trophy, Users, Briefcase, TrendingUp, Award, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const STATS = [
  { value: 50000, suffix: "+", label: "Students Trained", icon: Users },
  { value: 10000, suffix: "+", label: "Internships Completed", icon: Briefcase },
  { value: 5000,  suffix: "+", label: "Students Placed", icon: TrendingUp },
  { value: 1200,  suffix: "+", label: "MNC Placements", icon: Trophy },
  { value: 500,   suffix: "+", label: "Startup Partners", icon: Award },
  { value: 95,    suffix: "%", label: "Success Rate", icon: Star },
];

const STORIES = [
  { name: "Priya Sharma",  role: "SDE-1",           company: "Google",    package: "₹42 LPA", image: "https://i.pravatar.cc/150?img=47", quote: "From a tier-3 college to Google in 8 months. Startup India changed my life!", prev: "Fresher",       tag: "MNC Placement" },
  { name: "Arjun Mehta",   role: "Data Engineer",   company: "Microsoft", package: "₹38 LPA", image: "https://i.pravatar.cc/150?img=12", quote: "AI-powered mentorship and real projects gave me the competitive edge I needed.", prev: "₹3 LPA Job",  tag: "Career Switch" },
  { name: "Sneha Patel",   role: "Cloud Consultant",company: "Deloitte",  package: "₹28 LPA", image: "https://i.pravatar.cc/150?img=45", quote: "A Big 4 placement felt like a dream until this platform made it real.", prev: "BCA Graduate", tag: "First Job" },
  { name: "Rahul Singh",   role: "ML Engineer",     company: "Amazon",    package: "₹45 LPA", image: "https://i.pravatar.cc/150?img=15", quote: "The structured roadmap and world-class mentorship were complete game-changers.", prev: "IT Support",  tag: "MNC Placement" },
  { name: "Anjali Nair",   role: "Product Manager", company: "Infosys",   package: "₹22 LPA", image: "https://i.pravatar.cc/150?img=44", quote: "Got my first PM role through the internship projects. Truly life-changing!", prev: "Mktg Exec",   tag: "Career Switch" },
  { name: "Vikram Reddy",  role: "DevOps Engineer", company: "Wipro",     package: "₹18 LPA", image: "https://i.pravatar.cc/150?img=33", quote: "Hands-on cloud labs made me job-ready in just 90 days.", prev: "Fresher",     tag: "First Job" },
];

const MENTORS = [
  { name: "Rajesh Kumar", title: "Chief Financial Officer",  company: "Fortune 500", expertise: "Finance & Strategy",    img: "https://i.pravatar.cc/150?img=11", primary: true },
  { name: "Sunita Rao",   title: "Assistant Vice President", company: "HDFC Bank",   expertise: "Sales & Growth",        img: "https://i.pravatar.cc/150?img=43", primary: false },
  { name: "Aditya Shah",  title: "AI Research Lead",         company: "Google",      expertise: "Machine Learning & AI", img: "https://i.pravatar.cc/150?img=22", primary: true },
  { name: "Meera Pillai", title: "Placement Director",       company: "IIM Alumni",  expertise: "Career Coaching",       img: "https://i.pravatar.cc/150?img=49", primary: false },
  { name: "Sameer Joshi", title: "Startup Advisor",          company: "Y Combinator",expertise: "Entrepreneurship",      img: "https://i.pravatar.cc/150?img=18", primary: true },
  { name: "Divya Menon",  title: "Tech Lead",                company: "Microsoft",   expertise: "Full Stack & Cloud",    img: "https://i.pravatar.cc/150?img=41", primary: false },
];

const TIMELINE = [
  { step: "01", title: "Join Platform",       desc: "Enroll in your chosen Training + Internship program" },
  { step: "02", title: "Learn Skills",        desc: "AI-guided curriculum with hands-on projects and mentorship" },
  { step: "03", title: "Complete Internship", desc: "Real-world internship with live project experience" },
  { step: "04", title: "Build Portfolio",     desc: "GitHub projects, certificates, and AI-generated resume" },
  { step: "05", title: "Clear Interviews",    desc: "Mock interviews with industry mentors and ATS prep" },
  { step: "06", title: "Get Placed",          desc: "Land your dream role at an MNC or top startup" },
];

const COMPANIES = ["Google", "Microsoft", "Amazon", "Deloitte", "Infosys", "TCS", "Wipro", "Accenture"];

const ACHIEVEMENTS = [
  { icon: "🏆", label: "Top Performers",        count: "2,400+ students" },
  { icon: "📜", label: "Certificates Issued",   count: "48,000+ certs" },
  { icon: "💼", label: "Live Projects",          count: "12,000+ done" },
  { icon: "🤖", label: "AI Queries",             count: "1M+ queries" },
  { icon: "🚀", label: "Startups Launched",      count: "320+ startups" },
  { icon: "🎯", label: "Interviews Cleared",     count: "8,500+ students" },
  { icon: "⭐", label: "5-Star Reviews",         count: "35,000+ reviews" },
  { icon: "🌍", label: "States Covered",         count: "All 28 states" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 40, stiffness: 120 });
  const [display, setDisplay] = useState(0);
  useEffect(() => { if (inView) mv.set(value); }, [inView, value, mv]);
  useEffect(() => spring.on("change", (v) => setDisplay(Math.floor(v))), [spring]);
  return <span ref={ref}>{display.toLocaleString("en-IN")}{suffix}</span>;
}

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function AchieversPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground rounded-full">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-tight text-lg hidden sm:block">
            STARTUP INDIA 2026
          </span>
          <Badge className="bg-primary/10 text-primary border-primary/20 font-bold px-4 py-1">
            🏆 Achievers
          </Badge>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-3/4 h-3/4 bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -right-1/4 w-3/4 h-3/4 bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
            <Trophy className="w-4 h-4" /> ACHIEVERS HALL OF FAME
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Success Stories That{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Inspire Nations
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            From internships to MNC placements — empowering India's future workforce through AI-powered career opportunities.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-14 px-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-black text-lg shadow-lg shadow-primary/25">
              Explore Stories <ChevronRight className="ml-1 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 rounded-full font-black text-lg border-border">
              Meet Our Mentors
            </Button>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 mb-3 px-4 py-1 font-bold tracking-widest">IMPACT IN NUMBERS</Badge>
            <h2 className="text-3xl md:text-4xl font-black">Real Results from Real Students</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STATS.map((s, i) => (
              <motion.div key={s.label} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <s.icon className={`w-6 h-6 mx-auto mb-3 ${i % 2 === 0 ? "text-primary" : "text-secondary"}`} />
                <div className={`text-2xl font-black mb-1 ${i % 2 === 0 ? "text-primary" : "text-secondary"}`}>
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-muted-foreground font-semibold">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 mb-3 px-4 py-1 font-bold tracking-widest">SUCCESS STORIES</Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-3">From Dreams to Reality</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Real students. Real companies. Real transformations.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STORIES.map((story, i) => (
              <motion.div key={story.name} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.09 }}
                whileHover={{ y: -6 }} className="group">
                <Card className="h-full border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-card">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img src={story.image} alt={story.name} className="w-12 h-12 rounded-full border-2 border-primary/20 object-cover" />
                        <div>
                          <div className="font-bold text-sm">{story.name}</div>
                          <div className="text-xs text-muted-foreground">{story.role} @ {story.company}</div>
                        </div>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">{story.tag}</Badge>
                    </div>

                    <blockquote className="text-sm text-muted-foreground leading-relaxed italic flex-1 mb-4">
                      "{story.quote}"
                    </blockquote>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <div className="text-xs text-muted-foreground">Before</div>
                        <div className="text-sm font-bold">{story.prev}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Package</div>
                        <div className="text-sm font-black text-primary">{story.package}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPANY MARQUEE */}
      <section className="py-16 border-y border-border/50 bg-muted/20 overflow-hidden">
        <div className="max-w-7xl mx-auto mb-10 text-center">
          <h2 className="text-2xl font-black mb-1">Students Placed At</h2>
          <p className="text-muted-foreground text-sm">World-class companies hiring from our platform</p>
        </div>
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} className="flex gap-6 w-max">
          {[...COMPANIES, ...COMPANIES].map((c, i) => (
            <div key={i} className="flex items-center justify-center px-10 py-4 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors font-black text-lg min-w-[160px] text-center">
              {c}
            </div>
          ))}
        </motion.div>
      </section>

      {/* CAREER TIMELINE */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <Badge variant="outline" className="text-secondary border-secondary/30 bg-secondary/10 mb-3 px-4 py-1 font-bold tracking-widest">CAREER JOURNEY</Badge>
            <h2 className="text-3xl md:text-5xl font-black">The Path to Success</h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary/0 hidden md:block" />
            <div className="space-y-6">
              {TIMELINE.map((item, i) => (
                <motion.div key={item.step} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-black flex-shrink-0 mt-3 z-10">
                    {item.step}
                  </div>
                  <Card className="flex-1 border-border hover:border-primary/40 transition-all">
                    <CardContent className="p-5">
                      <h3 className="font-black text-base mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MENTORS */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <Badge variant="outline" className="text-secondary border-secondary/30 bg-secondary/10 mb-3 px-4 py-1 font-bold tracking-widest">EXPERT MENTORS</Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-3">Learn From the Best</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Industry veterans guiding your journey to success</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MENTORS.map((m, i) => (
              <motion.div key={m.name} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.09 }}
                whileHover={{ y: -5 }} className="group">
                <Card className="h-full border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all bg-card overflow-hidden">
                  <div className={`h-1 w-full ${m.primary ? "bg-gradient-to-r from-primary to-primary/40" : "bg-gradient-to-r from-secondary to-secondary/40"}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img src={m.img} alt={m.name} className="w-14 h-14 rounded-xl object-cover border-2 border-border group-hover:border-primary/40 transition-colors" />
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm truncate">{m.name}</div>
                        <div className={`text-xs font-bold ${m.primary ? "text-primary" : "text-secondary"}`}>{m.title}</div>
                        <div className="text-xs text-muted-foreground">{m.company}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs text-muted-foreground border-border">{m.expertise}</Badge>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1 text-xs h-7">
                        <ExternalLink className="w-3 h-3" /> LinkedIn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="text-7xl font-black text-primary/10 leading-none mb-4">"</div>
            <p className="text-2xl md:text-3xl font-bold leading-relaxed text-foreground mb-8">
              This platform didn't just give me a job. It gave me a career, a community, and the confidence to dream bigger than I ever had.
            </p>
            <div className="flex items-center justify-center gap-3">
              <img src="https://i.pravatar.cc/150?img=20" alt="Karan" className="w-12 h-12 rounded-full border-2 border-secondary/40" />
              <div className="text-left">
                <div className="font-black text-sm">Karan Bhatia</div>
                <div className="text-xs text-secondary font-bold">ML Engineer @ Amazon · ₹45 LPA</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ACHIEVEMENT WALL */}
      <section className="py-24 px-6 bg-muted/20 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 mb-3 px-4 py-1 font-bold tracking-widest">ACHIEVEMENTS</Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-3">Every Milestone Celebrated</h2>
            <p className="text-muted-foreground">Celebrating every step on the journey to success</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div key={a.label} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.04 }}>
                <Card className="text-center border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all bg-card">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-3">{a.icon}</div>
                    <div className="font-black text-sm mb-1">{a.label}</div>
                    <div className="text-xs text-primary font-bold">{a.count}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden text-center">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Your Success Story{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Starts Today</span>
            </h2>
            <p className="text-muted-foreground text-xl mb-10">Join 50,000+ students building their dream careers through Startup India Internship 2026.</p>
            <Link href="/">
              <Button size="lg" className="h-16 px-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-black text-xl shadow-2xl shadow-primary/25">
                Enroll Now — Transform Your Career <ChevronRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
