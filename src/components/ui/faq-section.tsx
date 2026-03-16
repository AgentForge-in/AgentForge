"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FAQMonochrome } from "@/components/ui/faq-monochrome";

gsap.registerPlugin(ScrollTrigger);

export function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          end: "top 40%",
          scrub: 1,
        },
        opacity: 0,
        y: 60,
        immediateRender: false,
      });

      gsap.from(".faq1-intro", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 45%",
          scrub: 1,
        },
        opacity: 0,
        y: 30,
        immediateRender: false,
      });

      gsap.from(".faq-item", {
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        x: -20,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        immediateRender: false,
      });

      if (parallaxRef.current) {
        gsap.to(parallaxRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          yPercent: -10,
          ease: "none",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#020202]"
    >
      <div ref={parallaxRef}>
        <div ref={contentRef}>
          <FAQMonochrome />
        </div>
      </div>
    </section>
  );
}
