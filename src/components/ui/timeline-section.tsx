"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calendar,
  Code,
  FileText,
  User,
  Clock,
} from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  {
    id: 1,
    title: "Planning",
    date: "Jan 2024",
    content: "Project planning and requirements gathering phase.",
    category: "Planning",
    icon: Calendar,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Design",
    date: "Feb 2024",
    content: "UI/UX design and system architecture.",
    category: "Design",
    icon: FileText,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Development",
    date: "Mar 2024",
    content: "Core features implementation and testing.",
    category: "Development",
    icon: Code,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "Testing",
    date: "Apr 2024",
    content: "User testing and bug fixes.",
    category: "Testing",
    icon: User,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 5,
    title: "Release",
    date: "May 2024",
    content: "Final deployment and release.",
    category: "Release",
    icon: Clock,
    relatedIds: [4],
    status: "pending" as const,
    energy: 10,
  },
];

export function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 40%",
          scrub: 1,
        },
        opacity: 0,
        y: 60,
      });

      gsap.from(timelineRef.current, {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 85%",
          end: "top 50%",
          scrub: 1,
        },
        opacity: 0,
        scale: 0.95,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#020202] min-h-screen"
    >
      <div
        ref={headingRef}
        className="pt-20 sm:pt-24 md:pt-28 px-6 sm:px-8 md:px-14 lg:px-20 text-center"
      >
        <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white/50 tracking-[0.2em] uppercase">
          OUR PROCESS
        </span>
        <h2 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight tracking-tighter text-white uppercase">
          The Journey
        </h2>
        <p className="mt-4 font-mono text-sm sm:text-base text-white/40 uppercase tracking-[0.2em] max-w-xl mx-auto">
          From concept to launch — every milestone, connected.
        </p>
      </div>

      <div ref={timelineRef} className="w-full">
        <RadialOrbitalTimeline timelineData={timelineData} />
      </div>
    </section>
  );
}
