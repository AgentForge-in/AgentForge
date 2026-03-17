"use client";

import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Component } from "./components/ui/experience-hero";
import { TimelineSection } from "./components/ui/timeline-section";
import { FeaturesSection } from "./components/ui/features-section";
import { VectorPadSection } from "./components/ui/vector-pad-section";
import { FAQSection } from "./components/ui/faq-section";
import { Footer } from "./components/ui/footer-section";
import { ChatbotWidget } from "./components/ui/chatbot-widget";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ✅ Lazy loaded pages (ONLY CHANGE)
const StartProjectPage = lazy(() => import("./pages/start-project"));
const AboutPage = lazy(() => import("./components/About").then(m => ({ default: m.Component })));
const WorkPage = lazy(() => import("./components/Work").then(m => ({ default: m.Component })));
const ContactPage = lazy(() => import("./components/Contact").then(m => ({ default: m.Component })));

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="dark min-h-screen bg-[#020202] selection:bg-white selection:text-black">
      <BrowserRouter>
        <main className="relative w-full overflow-x-hidden">

          {/* ✅ Suspense wrapper added */}
          <Suspense fallback={<div className="text-white p-5">Loading...</div>}>
            <Routes>

              {/* ── Home ── */}
              <Route
                path="/"
                element={
                  <>
                    <Component />
                    <TimelineSection />
                    <FeaturesSection />
                    <VectorPadSection />
                    <FAQSection />
                    <div className="px-4 pb-6 sm:px-6 lg:px-8">
                      <Footer />
                    </div>
                    <div className="fixed inset-0 pointer-events-none bento-mask opacity-10 z-[100]" />
                  </>
                }
              />

              {/* ── About ── */}
              <Route path="/about" element={<AboutPage />} />

              {/* ── Work ── */}
              <Route path="/work" element={<WorkPage />} />

              {/* ── Contact ── */}
              <Route path="/contact" element={<ContactPage />} />

              {/* ── Start Project ── */}
              <Route path="/start-project" element={<StartProjectPage />} />

            </Routes>
          </Suspense>

          {/* ChatbotWidget floats on top of every page */}
          <ChatbotWidget />
        </main>
      </BrowserRouter>
    </div>
  );
}