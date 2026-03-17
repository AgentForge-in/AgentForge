"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  ArrowUpRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const WorkBackground = () => {
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
            vec2 uv = vUv; float t = uTime * 0.06;
            float c = smoothstep(0.0, 1.0,
              (sin(uv.x * 5.0 + t) * sin(uv.y * 7.0 - t * 1.3)) * 0.5 + 0.5
            );
            gl_FragColor = vec4(mix(vec3(0.002), vec3(0.038), c), 1.0);
          }
        `}
      />
    </mesh>
  );
};

const PROJECTS = [
  {
    id: "001", title: "NEXUS CRM AGENT", category: "AGENTIC AUTOMATION", year: "2024",
    tags: ["LangChain", "GPT-4o", "Salesforce API"], outcome: "3× faster lead qualification",
    description: "End-to-end agentic CRM layer that autonomously qualifies leads, drafts follow-up sequences, and updates pipeline stages — without a human in the loop.",
    status: "SHIPPED",
  },
  {
    id: "002", title: "DOCFLOW AI", category: "DOCUMENT INTELLIGENCE", year: "2024",
    tags: ["RAG", "Pinecone", "Claude 3"], outcome: "90% reduction in manual review",
    description: "Retrieval-augmented document processing system for a legal firm — extracts, classifies, and cross-references thousands of contracts in minutes.",
    status: "SHIPPED",
  },
  {
    id: "003", title: "PULSE ANALYTICS", category: "REAL-TIME INTELLIGENCE", year: "2024",
    tags: ["Streaming", "WebSockets", "Python"], outcome: "Sub-500ms insight latency",
    description: "Live business intelligence dashboard powered by a multi-agent data pipeline — ingests, interprets, and surfaces anomalies in real time.",
    status: "SHIPPED",
  },
  {
    id: "004", title: "ONBOARD AGENT", category: "WORKFLOW AUTOMATION", year: "2025",
    tags: ["n8n", "OpenAI", "Slack API"], outcome: "2-day onboarding → 4 hours",
    description: "Autonomous employee onboarding orchestrator that provisions tools, sends personalised briefings, schedules check-ins, and tracks completion — zero manual ops.",
    status: "SHIPPED",
  },
  {
    id: "005", title: "SENTINEL MONITOR", category: "AGENTIC OPS", year: "2025",
    tags: ["Prometheus", "GPT-4o", "PagerDuty"], outcome: "60% fewer false alerts",
    description: "AI-powered infrastructure watchdog that interprets anomalies, suppresses noise, and writes root-cause summaries before the on-call engineer even opens their laptop.",
    status: "SHIPPED",
  },
  {
    id: "006", title: "VOICEFORGE", category: "CONVERSATIONAL AI", year: "2025",
    tags: ["Whisper", "ElevenLabs", "FastAPI"], outcome: "4.9 / 5 user satisfaction",
    description: "Voice-first customer support agent for an e-commerce brand — handles returns, order tracking, and escalations with human-level fluency across 6 languages.",
    status: "IN PROGRESS",
  },
];

const SERVICES = [
  { id: "01", label: "Multi-Agent Systems" },
  { id: "02", label: "RAG & Knowledge Bases" },
  { id: "03", label: "Workflow Automation" },
  { id: "04", label: "AI Interfaces" },
  { id: "05", label: "Voice Agents" },
  { id: "06", label: "Data Pipelines" },
];

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const categories = ["ALL", ...Array.from(new Set(PROJECTS.map((p) => p.category)))];
  const filtered = activeFilter === "ALL" ? PROJECTS : PROJECTS.filter((p) => p.category === activeFilter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current,
        { filter: "blur(24px)", opacity: 0, y: 20 },
        { filter: "blur(0px)", opacity: 1, y: 0, duration: 2, ease: "expo.out" }
      );
      gsap.utils.toArray<HTMLElement>(".reveal-row").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 1.2, ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

  useEffect(() => {
    gsap.fromTo(".project-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.7, ease: "power3.out" }
    );
  }, [activeFilter]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#020202] flex flex-col selection:bg-white selection:text-black overflow-x-hidden"
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 60], fov: 35 }}>
          <ambientLight intensity={0.3} />
          <WorkBackground />
        </Canvas>
      </div>

      {/* ── FIXED: AF image only ── */}
      <div className="fixed top-6 left-6 sm:top-8 sm:left-8 md:left-14 lg:left-20 z-50 pointer-events-none">
        <img
          src="/AF.png"
          alt="AgentForge Logo"
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
        />
      </div>

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

      <div className="relative z-10 w-full px-6 sm:px-8 md:px-14 lg:px-20">

        {/* HERO — unchanged, AF img here is now visually overlapped by the fixed one */}
        <div ref={heroRef} className="min-h-screen flex flex-col justify-between pt-6 pb-12 sm:pt-8 sm:pb-16">
          <div className="hidden sm:flex items-center gap-3 sm:gap-4">
  <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" />
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

          <div className="mt-auto">
            <div className="flex items-center gap-4 mb-8 sm:mb-10">
              <span className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase">000 // WORK</span>
              <div className="h-px flex-1 max-w-[80px] bg-white/10" />
            </div>
            <h1 className="text-[clamp(2.8rem,9.5vw,10.5rem)] font-black leading-[0.87] tracking-tighter text-white uppercase">
              SYSTEMS <br /><span className="text-outline">BUILT TO</span><br /> THINK.
            </h1>
            <p className="mt-6 sm:mt-8 font-mono text-sm sm:text-base md:text-[17px] text-white/40 uppercase tracking-[0.25em] sm:tracking-[0.3em] max-w-xl leading-relaxed">
              A record of agentic systems, intelligent pipelines, and AI products shipped for real businesses.
            </p>
          </div>

          <div className="mt-16 sm:mt-20 flex items-center gap-6 sm:gap-10">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">TOTAL PROJECTS</span>
              <span className="font-mono text-4xl sm:text-5xl font-black text-white tracking-tighter leading-none">{PROJECTS.length.toString().padStart(2, "0")}</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">SHIPPED</span>
              <span className="font-mono text-4xl sm:text-5xl font-black text-white tracking-tighter leading-none">{PROJECTS.filter((p) => p.status === "SHIPPED").length.toString().padStart(2, "0")}</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">IN PROGRESS</span>
              <span className="font-mono text-4xl sm:text-5xl font-black text-white tracking-tighter leading-none">{PROJECTS.filter((p) => p.status === "IN PROGRESS").length.toString().padStart(2, "0")}</span>
            </div>
          </div>
        </div>

        {/* FILTER */}
        <div className="reveal-row border-t border-white/[0.06] py-6 sm:py-8 flex flex-wrap gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveFilter(cat)}
              className={`font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase px-4 py-2 border transition-all duration-300 ${
                activeFilter === cat
                  ? "border-white/40 text-white bg-white/[0.06]"
                  : "border-white/[0.08] text-white/30 hover:border-white/20 hover:text-white/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PROJECT GRID */}
        <div className="py-10 sm:py-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04]">
          {filtered.map((project) => (
            <div key={project.id} className="project-card bg-[#020202] p-6 sm:p-8 md:p-10 flex flex-col gap-6 group hover:bg-white/[0.025] transition-colors duration-500 cursor-default">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">{project.id} // {project.category}</span>
                  <span className={`font-mono text-[8px] tracking-[0.2em] uppercase px-2 py-1 w-fit border ${
                    project.status === "SHIPPED" ? "border-white/[0.12] text-white/40" : "border-white/20 text-white/60 animate-pulse"
                  }`}>{project.status}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[9px] text-white/20 tracking-widest">{project.year}</span>
                  <ArrowUpRight size={14} className="text-white/10 group-hover:text-white/50 transition-colors duration-400" />
                </div>
              </div>
              <h3 className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-tight">{project.title}</h3>
              <p className="font-mono text-[11px] sm:text-xs text-white/35 tracking-[0.1em] uppercase leading-relaxed">{project.description}</p>
              <div className="border-t border-white/[0.06] pt-5 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[8px] text-white/20 tracking-[0.25em] uppercase">OUTCOME</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-white/70 tracking-[0.1em] uppercase">{project.outcome}</span>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[8px] text-white/25 tracking-[0.15em] uppercase border border-white/[0.07] px-2 py-1">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CAPABILITIES */}
        <div className="reveal-row border-t border-white/[0.06] py-20 sm:py-28">
          <div className="flex flex-col md:flex-row gap-10 md:gap-20 lg:gap-32">
            <div className="md:w-48 lg:w-56 shrink-0">
              <span className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase">001 // CAPABILITIES</span>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/[0.04] border border-white/[0.04]">
              {SERVICES.map((s) => (
                <div key={s.id} className="bg-[#020202] px-5 py-6 flex flex-col gap-3 hover:bg-white/[0.025] transition-colors duration-300">
                  <span className="font-mono text-[9px] text-white/20 tracking-widest">{s.id}</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-white/60 tracking-[0.1em] uppercase leading-snug">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MARQUEE */}
        <div className="reveal-row border-t border-white/[0.06] py-8 overflow-hidden">
          <div className="flex gap-10 animate-marquee whitespace-nowrap">
            {["LangChain","OpenAI","Anthropic","Pinecone","n8n","FastAPI","Supabase","Whisper","ElevenLabs","Prometheus",
              "LangChain","OpenAI","Anthropic","Pinecone","n8n","FastAPI","Supabase","Whisper","ElevenLabs","Prometheus",
            ].map((tech, i) => (
              <span key={i} className="font-mono text-[10px] text-white/15 tracking-[0.3em] uppercase shrink-0">
                {tech} <span className="text-white/8 mx-2">◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal-row border-t border-white/[0.06] py-20 sm:py-28 md:py-36 flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          <div>
            <span className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase block mb-6">002 // NEXT</span>
            <h2 className="text-[clamp(2.2rem,7vw,7.5rem)] font-black leading-[0.88] tracking-tighter text-white uppercase">
              YOUR PROJECT <br /><span className="text-outline">COULD BE</span><br /> HERE.
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <Link to="/start-project" className="w-fit flex items-center gap-5 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-white transition-all duration-500 overflow-hidden shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="group-hover:stroke-black stroke-white transition-colors duration-500">
                  <path d="M7 17L17 7M17 7H8M17 7V16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white uppercase tracking-[0.2em]">Start a Project</span>
            </Link>
            <Link to="/" className="flex items-center gap-3 group ml-[68px] sm:ml-[76px]">
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] group-hover:text-white/70 transition-colors duration-300">← Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <Footer />
      </div>

      <AgentCallDialog open={callDialogOpen} onOpenChange={setCallDialogOpen} />
      <SendMessageDialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen} />
    </section>
  );
};