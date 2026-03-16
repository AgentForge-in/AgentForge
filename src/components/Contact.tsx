"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { MenuBar } from "@/components/ui/bottom-menu";
import { AgentCallDialog } from "@/components/ui/agent-call-dialog";
import { SendMessageDialog } from "@/components/ui/send-message-dialog";
import { Footer } from "@/components/ui/footer-section";
import {
  MessageCircle,
  Mail,
  Hash,
  Phone,
  PenSquare,
  Menu,
} from "lucide-react";

const ContactBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame(({ clock }) => {
    if (meshRef.current)
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value =
        clock.getElapsedTime();
  });
  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        transparent
        uniforms={uniforms}
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
        fragmentShader={`
          uniform float uTime; varying vec2 vUv;
          void main(){
            vec2 uv = vUv; float t = uTime * 0.04;
            float c = smoothstep(0.0, 1.0,
              (sin(uv.x * 3.0 + t) + sin(uv.y * 2.5 - t * 0.8)) * 0.5 + 0.5
            );
            gl_FragColor = vec4(mix(vec3(0.002), vec3(0.028), c), 1.0);
          }
        `}
      />
    </mesh>
  );
};

type StepKey = "name" | "company" | "email" | "budget" | "message";

interface Step {
  key: StepKey;
  index: string;
  prompt: string;
  subtext: string;
  placeholder: string;
  type: "text" | "email" | "textarea" | "select";
  options?: string[];
  validate: (v: string) => string | null;
}

const STEPS: Step[] = [
  {
    key: "name", index: "01",
    prompt: "What should we call you?",
    subtext: "Your full name or how you'd like to be addressed.",
    placeholder: "e.g. Rahul Sharma", type: "text",
    validate: (v) => v.trim().length < 2 ? "Please enter at least 2 characters." : null,
  },
  {
    key: "company", index: "02",
    prompt: "What's your company or project?",
    subtext: "Tell us who we'd be working with.",
    placeholder: "e.g. Acme Corp / Personal Project", type: "text",
    validate: (v) => v.trim().length < 2 ? "Please enter a company or project name." : null,
  },
  {
    key: "email", index: "03",
    prompt: "Where do we reach you?",
    subtext: "We'll use this to send you a confirmation and follow up.",
    placeholder: "e.g. hello@yourcompany.com", type: "email",
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Please enter a valid email address.",
  },
  {
    key: "budget", index: "04",
    prompt: "What's your approximate budget?",
    subtext: "This helps us scope the right solution for you.",
    placeholder: "", type: "select",
    options: ["Under ₹50,000", "₹50,000 – ₹1,50,000", "₹1,50,000 – ₹5,00,000", "₹5,00,000+", "Let's discuss"],
    validate: (v) => v ? null : "Please select a budget range.",
  },
  {
    key: "message", index: "05",
    prompt: "Describe what you want to build.",
    subtext: "The more detail you give, the better we can prepare.",
    placeholder: "Tell us about your project, goals, timeline, and any specifics...",
    type: "textarea",
    validate: (v) => v.trim().length < 20 ? "Please write at least 20 characters so we understand your needs." : null,
  },
];

const Cursor = () => (
  <span className="inline-block w-[2px] h-[1.1em] bg-white/70 ml-0.5 align-middle animate-[blink_1s_step-end_infinite]" />
);

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<Record<StepKey, string>>({ name: "", company: "", email: "", budget: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [typedPrompt, setTypedPrompt] = useState("");

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  useEffect(() => {
    if (!step) return;
    setTypedPrompt("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedPrompt(step.prompt.slice(0, i));
      if (i >= step.prompt.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [currentStep, step]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, [currentStep]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current,
        { filter: "blur(20px)", opacity: 0, y: 16 },
        { filter: "blur(0px)", opacity: 1, y: 0, duration: 1.8, ease: "expo.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const animateTransition = (cb: () => void) => {
    gsap.to(".step-body", {
      opacity: 0, y: -16, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        cb();
        gsap.fromTo(".step-body", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
      },
    });
  };

  const handleNext = () => {
    const err = step.validate(values[step.key]);
    if (err) {
      setError(err);
      gsap.fromTo(".error-msg", { x: -6 }, { x: 0, duration: 0.4, ease: "elastic.out(1,0.3)" });
      return;
    }
    setError(null);
    if (isLast) { handleSubmit(); return; }
    animateTransition(() => setCurrentStep((s) => s + 1));
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    setError(null);
    animateTransition(() => setCurrentStep((s) => s - 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && step.type !== "textarea") { e.preventDefault(); handleNext(); }
    if (e.key === "Enter" && step.type === "textarea" && e.metaKey) { e.preventDefault(); handleNext(); }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(import.meta.env.VITE_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        gsap.to(".step-body", {
          opacity: 0, y: -20, duration: 0.4, ease: "power2.in",
          onComplete: () => {
            setSubmitted(true);
            gsap.fromTo(".success-body", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" });
          },
        });
      } else {
        setError("Something went wrong. Please try again or email us directly.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((currentStep) / STEPS.length) * 100;

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#020202] flex flex-col selection:bg-white selection:text-black overflow-x-hidden"
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 60], fov: 35 }}>
          <ambientLight intensity={0.3} />
          <ContactBackground />
        </Canvas>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      {/* MENU */}
      <div className="fixed top-6 right-6 sm:top-8 sm:right-8 md:right-14 lg:right-20 z-50 pointer-events-auto max-md:scale-[0.9] max-md:origin-top-right">
        <MenuBar
          items={[
            { icon: (props) => <MessageCircle {...props} />, label: "Messages" },
            { icon: (props) => <Mail {...props} />, label: "Mail" },
            { icon: (props) => <Phone {...props} />, label: "Call to Agent" },
            { icon: (props) => <Hash {...props} />, label: "Explore" },
            { icon: (props) => <PenSquare {...props} />, label: "Write" },
            { icon: (props) => <Menu {...props} />, label: "Menu" },
          ]}
          onAction={(label) => {
            if (label === "Call to Agent") setCallDialogOpen(true);
            else if (label === "Messages") setMessageDialogOpen(true);
            else if (label === "Mail") {
              const r = "rahulvish194002@gmail.com,virajwalavalkar90982@gmail.com";
              const s = encodeURIComponent("About Ai Automation");
              const b = encodeURIComponent("Hello,\n\nI am reaching out to inquire about your AI automation services.\n\nBest regards");
              window.open(`mailto:${r}?subject=${s}&body=${b}`, "_self");
            }
          }}
        />
      </div>

      {/* MAIN */}
      <div ref={heroRef} className="relative z-10 w-full flex-1 flex flex-col px-6 sm:px-8 md:px-14 lg:px-20 pt-6 sm:pt-8">

        {/* Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <img src="/AF.png" alt="AgentForge Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
          </div>
          <div className="w-px h-7 sm:h-8 bg-white/15 shrink-0" />
          <div className="flex flex-col gap-[4px]">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white tracking-[0.25em] uppercase leading-none">AGENTFORGE</span>
            <span className="font-mono text-[8px] sm:text-[9px] text-white/30 tracking-[0.18em] uppercase leading-none flex items-center gap-1.5">
              <span className="relative inline-flex w-[5px] h-[5px] shrink-0">
                <span className="absolute inset-0 bg-white/50 rounded-full animate-ping opacity-40" />
                <span className="relative bg-white/60 rounded-full w-[5px] h-[5px]" />
              </span>
              Agentic Studio
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-8 sm:mb-10">
              <span className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase">000 // CONTACT</span>
              <div className="h-px flex-1 max-w-[80px] bg-white/10" />
            </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center max-w-3xl w-full mx-auto py-16 sm:py-20">
          {!submitted ? (
            <>
              <div className="flex items-center justify-between mb-12 sm:mb-16">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase">000 // CONTACT</span>
                  <div className="h-px w-12 bg-white/10" />
                </div>
                <span className="font-mono text-[9px] text-white/20 tracking-[0.2em] uppercase">{currentStep + 1} / {STEPS.length}</span>
              </div>

              <div className="w-full h-px bg-white/[0.06] mb-12 sm:mb-16 overflow-hidden">
                <div className="h-full bg-white/40 transition-all duration-700 ease-out" style={{ width: `${progress + (1 / STEPS.length) * 100}%` }} />
              </div>

              <div className="step-body flex flex-col gap-8 sm:gap-10">
                {currentStep > 0 && (
                  <div className="flex flex-col gap-2 mb-2">
                    {STEPS.slice(0, currentStep).map((s) => (
                      <div key={s.key} className="flex items-center gap-4">
                        <span className="font-mono text-[8px] text-white/15 tracking-widest w-5 shrink-0">{s.index}</span>
                        <span className="font-mono text-[10px] text-white/20 tracking-[0.1em] uppercase">{s.prompt}</span>
                        <span className="font-mono text-[10px] text-white/50 tracking-[0.1em] ml-auto truncate max-w-[160px] sm:max-w-xs">{values[s.key]}</span>
                      </div>
                    ))}
                    <div className="h-px w-full bg-white/[0.06] mt-4" />
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[9px] text-white/20 tracking-widest shrink-0">{step.index}</span>
                    <h2 className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight">
                      {typedPrompt}
                      {typedPrompt.length < step.prompt.length && <Cursor />}
                    </h2>
                  </div>
                  <p className="font-mono text-[10px] sm:text-[11px] text-white/25 tracking-[0.18em] uppercase leading-relaxed pl-9">{step.subtext}</p>
                </div>

                <div className="pl-9 flex flex-col gap-4">
                  {step.type === "select" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.options!.map((opt) => (
                        <button key={opt} onClick={() => { setValues((v) => ({ ...v, [step.key]: opt })); setError(null); }}
                          className={`font-mono text-[10px] tracking-[0.18em] uppercase px-5 py-4 border text-left transition-all duration-200 ${
                            values[step.key] === opt
                              ? "border-white/50 text-white bg-white/[0.06]"
                              : "border-white/[0.08] text-white/35 hover:border-white/25 hover:text-white/70"
                          }`}
                        >{opt}</button>
                      ))}
                    </div>
                  ) : step.type === "textarea" ? (
                    <textarea
                      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                      rows={5} value={values[step.key]} placeholder={step.placeholder}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => { setValues((v) => ({ ...v, [step.key]: e.target.value })); setError(null); }}
                      className="w-full bg-transparent border-b border-white/[0.12] focus:border-white/40 outline-none font-mono text-sm sm:text-base text-white placeholder:text-white/15 tracking-[0.05em] resize-none py-3 transition-colors duration-300 leading-relaxed"
                    />
                  ) : (
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type={step.type} value={values[step.key]} placeholder={step.placeholder}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => { setValues((v) => ({ ...v, [step.key]: e.target.value })); setError(null); }}
                      className="w-full bg-transparent border-b border-white/[0.12] focus:border-white/40 outline-none font-mono text-lg sm:text-xl md:text-2xl text-white placeholder:text-white/15 tracking-tight py-3 transition-colors duration-300"
                    />
                  )}

                  {error && <p className="error-msg font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase">↳ {error}</p>}
                  {step.type === "textarea" ? (
                    <p className="font-mono text-[8px] text-white/15 tracking-[0.2em] uppercase">CMD + ENTER TO CONTINUE</p>
                  ) : step.type !== "select" ? (
                    <p className="font-mono text-[8px] text-white/15 tracking-[0.2em] uppercase">PRESS ENTER TO CONTINUE</p>
                  ) : null}
                </div>

                <div className="pl-9 flex items-center gap-5 mt-2">
                  <button onClick={handleNext} disabled={submitting || (step.type === "select" && !values[step.key])}
                    className="group flex items-center gap-4 disabled:opacity-30 transition-opacity duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white transition-all duration-400 group-disabled:pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="group-hover:stroke-black stroke-white transition-colors duration-400">
                        <path d="M7 17L17 7M17 7H8M17 7V16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-white uppercase tracking-[0.2em]">
                      {submitting ? "Transmitting..." : isLast ? "Submit" : "Continue"}
                    </span>
                  </button>
                  {currentStep > 0 && (
                    <button onClick={handleBack} className="font-mono text-[9px] text-white/25 uppercase tracking-[0.2em] hover:text-white/60 transition-colors duration-300">
                      ← Back
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="success-body flex flex-col gap-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase">000 // CONTACT</span>
                <div className="h-px w-12 bg-white/10" />
              </div>
              <div className="h-px w-full bg-white/[0.06]" />
              <div className="flex flex-col gap-4 py-4">
                <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">TRANSMISSION RECEIVED</span>
                <h2 className="text-[clamp(2.2rem,7vw,7rem)] font-black leading-[0.88] tracking-tighter text-white uppercase">
                  WE'LL BE <br /><span className="text-outline">IN TOUCH</span><br /> SOON.
                </h2>
              </div>
              <div className="h-px w-full bg-white/[0.06]" />
              <div className="flex flex-col gap-3 py-2">
                {STEPS.map((s) => (
                  <div key={s.key} className="flex items-start gap-6">
                    <span className="font-mono text-[8px] text-white/15 tracking-widest w-5 shrink-0 pt-0.5">{s.index}</span>
                    <span className="font-mono text-[9px] text-white/20 tracking-[0.15em] uppercase w-28 shrink-0 pt-0.5">{s.prompt.split(" ").slice(0, 3).join(" ")}...</span>
                    <span className="font-mono text-[10px] sm:text-xs text-white/55 tracking-[0.05em] leading-relaxed">{values[s.key]}</span>
                  </div>
                ))}
              </div>
              <div className="h-px w-full bg-white/[0.06]" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                <Link to="/" className="group flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-white transition-all duration-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="group-hover:stroke-black stroke-white transition-colors duration-500">
                      <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-white uppercase tracking-[0.2em]">Back to Home</span>
                </Link>
                <span className="font-mono text-[9px] text-white/20 tracking-[0.18em] uppercase sm:ml-4">We typically respond within 24 hours.</span>
              </div>
            </div>
          )}
        </div>

        {/* Direct contact strip */}
        <div className="border-t border-white/[0.06] pt-5 pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a href="mailto:rahulvish194002@gmail.com" className="font-mono text-[8px] text-white/15 tracking-[0.2em] uppercase hover:text-white/40 transition-colors duration-300">
              rahulvish194002@gmail.com
            </a>
            <span className="text-white/10 text-[8px]">◆</span>
            <a href="mailto:virajwalavalkar90982@gmail.com" className="font-mono text-[8px] text-white/15 tracking-[0.2em] uppercase hover:text-white/40 transition-colors duration-300">
              virajwalavalkar90982@gmail.com
            </a>
          </div>
          <span className="font-mono text-[8px] text-white/15 tracking-[0.25em] uppercase">MUMBAI, INDIA</span>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 mt-0">
        <Footer />
      </div>

      <AgentCallDialog open={callDialogOpen} onOpenChange={setCallDialogOpen} />
      <SendMessageDialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen} />
    </section>
  );
};