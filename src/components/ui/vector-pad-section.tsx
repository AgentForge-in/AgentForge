"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VectorPad from "@/components/ui/vector-pad";
import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";

gsap.registerPlugin(ScrollTrigger);

export function VectorPadSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
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

      gsap.from(leftRef.current, {
        scrollTrigger: {
          trigger: leftRef.current,
          start: "top 88%",
          end: "top 55%",
          scrub: 1,
        },
        opacity: 0,
        x: -40,
      });

      gsap.from(rightRef.current, {
        scrollTrigger: {
          trigger: rightRef.current,
          start: "top 88%",
          end: "top 55%",
          scrub: 1,
        },
        opacity: 0,
        x: 40,
      });

      if (parallaxRef.current) {
        gsap.to(parallaxRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          yPercent: -12,
          ease: "none",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#020202] py-20 sm:py-24 md:py-32 min-h-screen flex flex-col"
    >
      <div
        ref={parallaxRef}
        className="mx-auto w-full max-w-6xl flex flex-col items-center gap-12 sm:gap-16 px-4 sm:px-6 md:px-10 lg:px-14"
      >
        <div
          ref={headingRef}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white/50 tracking-[0.2em] uppercase">
            DISCOVER PROSPECTS
          </span>
          <h2 className="mt-4 text-[clamp(1.75rem,4.5vw,3.25rem)] font-black leading-tight tracking-tighter text-white uppercase">
            Pinpoint Your Ideal Customers
          </h2>
          <p className="mt-4 font-mono text-sm sm:text-base text-white/40 uppercase tracking-[0.2em] max-w-xl mx-auto text-balance leading-relaxed">
            Identify and reach high-intent prospects at scale—powered by intelligent automation.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 lg:gap-12 items-start md:items-center justify-items-center">
          <div ref={leftRef} className="w-full flex justify-center md:justify-end order-1">
            <DatabaseWithRestApi className="w-full max-w-[min(100%,420px)]" />
          </div>
          <div ref={rightRef} className="w-full flex justify-center md:justify-start order-2">
            <VectorPad className="w-full max-w-[320px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
