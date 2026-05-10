"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Rocket, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !videoRef.current || !contentRef.current) return;

    // Scroll Animation: Video Zoom & Content Fade
    gsap.to(videoRef.current, {
      scale: 1.2,
      filter: "blur(4px)",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(contentRef.current, {
      y: -100,
      opacity: 0,
      filter: "blur(10px)",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom center",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#071120]"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.png"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          {/* Cinematic Modern Tech Office / Young Professionals Visuals */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-business-people-walking-around-the-office-and-working-4352-large.mp4" type="video/mp4" />
        </video>
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#071120]/20 to-[#071120]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071120]/40 via-transparent to-[#071120]/40" />
      </div>

      {/* Hero Content */}
      <div 
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-20 text-center flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-black mb-10 backdrop-blur-md shadow-[0_0_20px_rgba(0,212,255,0.1)]"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#00D4FF]" />
          <span className="uppercase tracking-[0.2em] text-[10px]">India’s Next-Gen Career Platform</span>
          <Sparkles className="w-4 h-4" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-space-grotesk font-black tracking-tighter leading-[1] mb-8 max-w-5xl"
        >
          Launch Your Career with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-[#7B61FF] to-[#00D4FF] bg-300% animate-gradient drop-shadow-[0_0_20px_rgba(0,212,255,0.2)]">
            India’s AI-Powered Ecosystem
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 font-medium leading-relaxed opacity-90"
        >
          Work with startups, learn AI skills, and build your future with India’s next-generation career platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full"
        >
          <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold shadow-[0_0_30px_rgba(0,212,255,0.2)] group">
            Find Internship <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-border/50 bg-background/20 backdrop-blur-xl hover:bg-accent text-lg font-bold group">
            <GraduationCap className="w-5 h-5 mr-2 text-secondary group-hover:-translate-y-1 transition-transform" /> Start Learning
          </Button>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest">Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
}
