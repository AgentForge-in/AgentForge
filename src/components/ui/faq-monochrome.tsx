"use client";

import React, { useEffect, useMemo, useState } from "react";

const INTRO_STYLE_ID = "faq1-animations";

const faqs = [
  {
    question: "How do you decide which problems to solve first?",
    answer:
      "We map opportunities across impact, feasibility, and effort, then prototype the riskiest assumption within 72 hours to make sure we are shipping momentum, not guesswork.",
    meta: "Discovery",
  },
  {
    question: "What does collaboration look like once we start?",
    answer:
      "A dedicated trio of design, engineering, and strategy meets daily in a shared async dashboard. Decisions are recorded in-line, so the team, stakeholders, and audit trail stay perfectly aligned.",
    meta: "Collaboration",
  },
  {
    question: "Can you adapt to an existing design system or stack?",
    answer:
      "Yes. We map tokens, components, and build steps into our pipeline on day one. If a gap appears, we patch the system with regression tests so velocity never compromises fidelity.",
    meta: "Systems",
  },
  {
    question: "How is quality validated before release?",
    answer:
      "Accessibility sweeps, automated visual diffs, and performance budgets run on every merge. We ship only after the experience hits the expected thresholds on real devices.",
    meta: "Quality",
  },
];

function useFAQStyles() {
  useEffect(() => {
  if (typeof document === "undefined") return;
  if (document.getElementById(INTRO_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = INTRO_STYLE_ID;
  style.innerHTML = `
    @keyframes faq1-fade-up {
      0% { transform: translate3d(0, 20px, 0); opacity: 0; filter: blur(6px); }
      60% { filter: blur(0); }
      100% { transform: translate3d(0, 0, 0); opacity: 1; filter: blur(0); }
    }
    @keyframes faq1-beam-spin {
      0% { transform: rotate(0deg) scale(1); }
      100% { transform: rotate(360deg) scale(1); }
    }
    @keyframes faq1-pulse {
      0% { transform: scale(0.7); opacity: 0.55; }
      60% { opacity: 0.1; }
      100% { transform: scale(1.25); opacity: 0; }
    }
    @keyframes faq1-meter {
      0%, 20% { transform: scaleX(0); transform-origin: left; }
      45%, 60% { transform: scaleX(1); transform-origin: left; }
      80%, 100% { transform: scaleX(0); transform-origin: right; }
    }
    @keyframes faq1-tick {
      0%, 30% { transform: translateX(-6px); opacity: 0.4; }
      50% { transform: translateX(2px); opacity: 1; }
      100% { transform: translateX(20px); opacity: 0; }
    }
    .faq1-intro {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.85rem 1.4rem;
      border-radius: 9999px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(12, 12, 12, 0.42);
      color: rgba(248, 250, 252, 0.92);
      text-transform: uppercase;
      letter-spacing: 0.35em;
      font-size: 0.65rem;
      width: 100%;
      max-width: 24rem;
      margin: 0 auto;
      mix-blend-mode: screen;
      opacity: 0;
      transform: translate3d(0, 12px, 0);
      filter: blur(8px);
      transition: opacity 720ms ease, transform 720ms ease, filter 720ms ease;
      isolation: isolate;
    }
    .faq1-intro--active {
      opacity: 1;
      transform: translate3d(0, 0, 0);
      filter: blur(0);
    }
    .faq1-intro__beam, .faq1-intro__pulse {
      position: absolute;
      inset: -110%;
      pointer-events: none;
      border-radius: 50%;
    }
    .faq1-intro__beam {
      background: conic-gradient(from 160deg, rgba(226, 232, 240, 0.25), transparent 32%, rgba(148, 163, 184, 0.22) 58%, transparent 78%, rgba(148, 163, 184, 0.18));
      animation: faq1-beam-spin 18s linear infinite;
      opacity: 0.55;
    }
    .faq1-intro__pulse {
      border: 1px solid currentColor;
      opacity: 0.25;
      animation: faq1-pulse 3.4s ease-out infinite;
    }
    .faq1-intro__label { position: relative; z-index: 1; font-weight: 600; letter-spacing: 0.4em; }
    .faq1-intro__meter {
      position: relative; z-index: 1; flex: 1 1 auto; height: 1px;
      background: linear-gradient(90deg, transparent, currentColor 35%, transparent 85%);
      transform: scaleX(0); transform-origin: left;
      animation: faq1-meter 5.8s ease-in-out infinite;
      opacity: 0.7;
    }
    .faq1-intro__tick {
      position: relative; z-index: 1;
      width: 0.55rem; height: 0.55rem; border-radius: 9999px;
      background: currentColor;
      box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
      animation: faq1-tick 3.2s ease-in-out infinite;
    }
    .faq1-fade {
      opacity: 0; transform: translate3d(0, 24px, 0); filter: blur(12px);
      transition: opacity 700ms ease, transform 700ms ease, filter 700ms ease;
    }
    .faq1-fade--ready {
      animation: faq1-fade-up 860ms cubic-bezier(0.22, 0.68, 0, 1) forwards;
    }
  `;
  document.head.appendChild(style);
  return () => { if (style.parentNode) style.remove(); };
  }, []);
}

export function FAQMonochrome({ className }: { className?: string }) {
  useFAQStyles();
  const [introReady, setIntroReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasEntered, setHasEntered] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIntroReady(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => setIntroReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleQuestion = (index: number) =>
    setActiveIndex((prev) => (prev === index ? -1 : index));

  const setCardGlow = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--faq-x", `${e.clientX - rect.left}px`);
    target.style.setProperty("--faq-y", `${e.clientY - rect.top}px`);
  };

  const clearCardGlow = (e: React.MouseEvent<HTMLLIElement>) => {
    e.currentTarget.style.removeProperty("--faq-x");
    e.currentTarget.style.removeProperty("--faq-y");
  };

  return (
    <div className={`relative w-full overflow-hidden bg-[#020202] transition-colors duration-700 ${className ?? ""}`}>
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 100% at 10% 0%, rgba(226, 232, 240, 0.08), transparent 65%), #020202",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          background: "linear-gradient(130deg, rgba(255,255,255,0.04) 0%, transparent 65%)",
          mixBlendMode: "screen",
        }}
      />

      <section
        className={`relative z-10 mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16 sm:py-20 md:py-24 lg:max-w-5xl lg:px-12 ${
          hasEntered ? "faq1-fade--ready" : "faq1-fade"
        }`}
      >
        <div className={`faq1-intro ${introReady ? "faq1-intro--active" : ""}`}>
          <span className="faq1-intro__beam" aria-hidden="true" />
          <span className="faq1-intro__pulse" aria-hidden="true" />
          <span className="faq1-intro__label font-mono">FAQ</span>
          <span className="faq1-intro__meter" aria-hidden="true" />
          <span className="faq1-intro__tick" aria-hidden="true" />
        </div>

        <header className="flex flex-col gap-6">
          <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white/50 tracking-[0.2em] uppercase">
            QUESTIONS
          </span>
          <h2 className="text-[clamp(2rem,5vw,3.25rem)] font-black leading-tight tracking-tighter text-white uppercase">
            Focus on the signal, not the noise.
          </h2>
          <p className="max-w-xl font-mono text-sm text-white/40 uppercase tracking-[0.15em] leading-relaxed">
            Everything you need to know about partnering with our team—condensed into calm clarity.
          </p>
        </header>

        <ul className="space-y-3 sm:space-y-4">
          {faqs.map((item, index) => {
            const open = activeIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-trigger-${index}`;

            return (
              <li
                key={item.question}
                className="faq-item group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:border-white/15 focus-within:-translate-y-0.5 shadow-[0_36px_140px_-60px_rgba(10,10,10,0.95)]"
                onMouseMove={setCardGlow}
                onMouseLeave={clearCardGlow}
              >
                <div
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                    open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  style={{
                    background: `radial-gradient(240px circle at var(--faq-x, 50%) var(--faq-y, 50%), rgba(255, 255, 255, 0.08), transparent 70%)`,
                  }}
                />

                <button
                  type="button"
                  id={buttonId}
                  aria-controls={panelId}
                  aria-expanded={open}
                  onClick={() => toggleQuestion(index)}
                  className="relative flex w-full items-start gap-4 sm:gap-6 px-6 sm:px-8 py-5 sm:py-7 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/25"
                >
                  <span className="relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-all duration-500 group-hover:scale-105">
                    <span
                      className={`pointer-events-none absolute inset-0 rounded-full border border-white/20 opacity-30 ${
                        open ? "animate-ping" : ""
                      }`}
                    />
                    <svg
                      className={`relative h-4 w-4 sm:h-5 sm:w-5 text-white transition-transform duration-500 ${
                        open ? "rotate-45" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                  </span>

                  <div className="flex flex-1 flex-col gap-3 sm:gap-4 min-w-0">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <h3 className="text-base sm:text-lg font-bold leading-tight text-white">
                        {item.question}
                      </h3>
                      {item.meta && (
                        <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[9px] text-white/50 uppercase tracking-[0.25em]">
                          {item.meta}
                        </span>
                      )}
                    </div>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`overflow-hidden text-sm leading-relaxed transition-[max-height] duration-500 ease-out ${
                        open ? "max-h-64" : "max-h-0"
                      } text-white/60`}
                    >
                      <p className="pr-2">{item.answer}</p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
