"use client";

import { useRef, useEffect } from "react";
import {
  Zap,
  Cpu,
  Fingerprint,
  Pencil,
  Settings2,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FeatureCard } from "@/components/ui/grid-feature-cards";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "FAAST",
    icon: Zap,
    description: "Lightning-fast execution to help developers ship and innovate at speed.",
  },
  {
    title: "POWERFUL",
    icon: Cpu,
    description: "Robust infrastructure that supports developers and businesses at scale.",
  },
  {
    title: "SECURITY",
    icon: Fingerprint,
    description: "Enterprise-grade security built for developers and businesses.",
  },
  {
    title: "CUSTOMIZATION",
    icon: Pencil,
    description: "Tailor every detail to help developers and businesses innovate.",
  },
  {
    title: "CONTROL",
    icon: Settings2,
    description: "Full control to help developers and businesses achieve their goals.",
  },
  {
    title: "BUILT FOR AI",
    icon: Sparkles,
    description: "Designed from the ground up for AI-powered workflows and automation.",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 35%",
          scrub: 1,
        },
        opacity: 0,
        y: 50,
      });

      gsap.from(gridRef.current, {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          end: "top 45%",
          scrub: 1,
        },
        opacity: 0,
        y: 40,
      });

      if (parallaxRef.current) {
        gsap.to(parallaxRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          yPercent: -15,
          ease: "none",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#020202] py-20 sm:py-24 md:py-32"
    >
      <div
        ref={parallaxRef}
        className="mx-auto w-full max-w-5xl space-y-12 sm:space-y-16 px-6 sm:px-8 md:px-14 lg:px-20"
      >
        <div
          ref={headingRef}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white/50 tracking-[0.2em] uppercase">
            WHY US
          </span>
          <h2 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight tracking-tighter text-white uppercase">
            Power. Speed. Control.
          </h2>
          <p className="mt-4 font-mono text-sm sm:text-base text-white/40 uppercase tracking-[0.2em] max-w-xl mx-auto text-balance">
            Everything you need to build fast, secure, scalable apps.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 divide-x divide-y divide-dashed divide-white/10 border border-dashed border-white/10 sm:grid-cols-2 md:grid-cols-3 rounded-lg overflow-hidden"
        >
            {features.map((feature, i) => (
              <FeatureCard
                key={i}
                feature={feature}
                className="glass-panel border-0"
              />
            ))}
          </div>
      </div>
    </section>
  );
}
