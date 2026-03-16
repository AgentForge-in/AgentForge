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

const GridBackground = () => {
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
            vec2 uv=vUv; float t=uTime*0.08;
            float c=smoothstep(0.0,1.0,(sin(uv.x*6.0+t)+sin(uv.y*4.0-t))*0.5+0.5);
            gl_FragColor=vec4(mix(vec3(0.003),vec3(0.04),c),1.0);
          }
        `}
      />
    </mesh>
  );
};

const STATS = [
  { id: "001", label: "FOUNDED", value: "2023" },
  { id: "002", label: "PROJECTS", value: "20+" },
  { id: "003", label: "RETENTION", value: "98.2%" },
  { id: "004", label: "TEAM", value: "8 AGENTS" },
];

const PILLARS = [
  {
    id: "01",
    title: "INTELLIGENCE",
    body: "We build systems that learn, adapt, and evolve — moving beyond static automation into genuinely agentic workflows that think on behalf of your business.",
  },
  {
    id: "02",
    title: "PRECISION",
    body: "Every integration, every pipeline, every interface is engineered to exact tolerances. We don't ship noise. We ship signal.",
  },
  {
    id: "03",
    title: "VELOCITY",
    body: "From scoping to deployment in weeks, not quarters. Our agentic stack cuts delivery cycles without sacrificing craft or reliability.",
  },
  {
    id: "04",
    title: "CONTINUITY",
    body: "We don't disappear post-launch. AgentForge operates as an embedded intelligence partner — monitoring, iterating, and expanding your systems over time.",
  },
];

const TEAM = [
  { id: "001", name: "RAHUL V.", role: "Founder / AI Architect", since: "2023" },
  { id: "002", name: "VIRAJ W.", role: "Co-Founder / Systems Lead", since: "2023" },
  { id: "003", name: "—", role: "Open Role / ML Engineer", since: "NOW" },
];

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { filter: "blur(24px)", opacity: 0, y: 24 },
        { filter: "blur(0px)", opacity: 1, y: 0, duration: 2, ease: "expo.out" }
      );
      gsap.utils.toArray<HTMLElement>(".reveal-row").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 1.2, ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      gsap.utils.toArray<HTMLElement>(".pillar-card").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, x: 40 }, {
          opacity: 1, x: 0, duration: 1.1, ease: "power4.out", delay: i * 0.08,
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#020202] flex flex-col selection:bg-white selection:text-black overflow-x-hidden"
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 60], fov: 35 }}>
          <ambientLight intensity={0.3} />
          <GridBackground />
        </Canvas>
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

        {/* HERO */}
        <div ref={heroRef} className="min-h-screen flex flex-col justify-between pt-6 pb-12 sm:pt-8 sm:pb-16">
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

          <div className="mt-auto">
            <div className="flex items-center gap-4 mb-8 sm:mb-10">
              <span className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase">000 // ABOUT</span>
              <div className="h-px flex-1 max-w-[80px] bg-white/10" />
            </div>
            <h1 className="text-[clamp(2.8rem,9.5vw,10.5rem)] font-black leading-[0.87] tracking-tighter text-white uppercase">
              WE BUILD <br />
              <span className="text-outline">MINDS FOR</span>
              <br /> MACHINES.
            </h1>
            <p className="mt-6 sm:mt-8 font-mono text-sm sm:text-base md:text-[17px] text-white/40 uppercase tracking-[0.25em] sm:tracking-[0.3em] max-w-xl leading-relaxed">
              AgentForge is an agentic AI studio engineering intelligent systems for modern businesses.
            </p>
          </div>

          <div className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px border border-white/[0.06] bg-white/[0.06]">
            {STATS.map((s) => (
              <div key={s.id} className="bg-[#020202] p-5 sm:p-6 md:p-7 flex flex-col gap-3">
                <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">{s.id} // {s.label}</span>
                <span className="font-mono text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter leading-none">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MANIFESTO */}
        <div className="reveal-row py-20 sm:py-28 md:py-36 border-t border-white/[0.06]">
          <div className="flex flex-col md:flex-row gap-10 md:gap-20 lg:gap-32">
            <div className="md:w-48 lg:w-56 shrink-0">
              <span className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase">001 // MANIFESTO</span>
            </div>
            <div className="flex-1 max-w-3xl">
              <p className="text-[clamp(1.25rem,3.2vw,2.2rem)] font-black text-white leading-[1.2] tracking-tight uppercase">
                Most automation stops at the task.{" "}
                <span className="text-white/30">We build systems that understand the goal — and find the path themselves.</span>
              </p>
              <div className="mt-10 h-px w-full bg-white/[0.06]" />
              <p className="mt-8 font-mono text-sm text-white/40 tracking-[0.15em] uppercase leading-relaxed max-w-xl">
                AgentForge was founded on a single conviction: that AI should operate as a true business partner — not a feature, not a chatbot, not a shortcut. We architect multi-agent systems, autonomous pipelines, and intelligent interfaces that don't just follow instructions — they pursue outcomes.
              </p>
            </div>
          </div>
        </div>

        {/* PILLARS */}
        <div className="reveal-row py-20 sm:py-28 border-t border-white/[0.06]">
          <div className="flex flex-col md:flex-row gap-10 md:gap-20 lg:gap-32">
            <div className="md:w-48 lg:w-56 shrink-0">
              <span className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase">002 // PRINCIPLES</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.06] border border-white/[0.06]">
              {PILLARS.map((p) => (
                <div key={p.id} className="pillar-card bg-[#020202] p-6 sm:p-7 md:p-8 flex flex-col gap-5 group hover:bg-white/[0.03] transition-colors duration-500">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">{p.id}</span>
                    <ArrowUpRight size={12} className="text-white/10 group-hover:text-white/40 transition-colors duration-500" />
                  </div>
                  <h3 className="font-mono text-base sm:text-lg font-black text-white tracking-[0.15em] uppercase">{p.title}</h3>
                  <p className="font-mono text-[11px] sm:text-xs text-white/35 tracking-[0.1em] uppercase leading-relaxed mt-auto">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TEAM */}
        <div className="reveal-row py-20 sm:py-28 border-t border-white/[0.06]">
          <div className="flex flex-col md:flex-row gap-10 md:gap-20 lg:gap-32">
            <div className="md:w-48 lg:w-56 shrink-0">
              <span className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase">003 // TEAM</span>
            </div>
            <div className="flex-1 flex flex-col">
              {TEAM.map((member, i) => (
                <div key={member.id} className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 sm:py-7 hover:bg-white/[0.02] transition-colors duration-300 px-1 ${i !== 0 ? "border-t border-white/[0.06]" : ""}`}>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="font-mono text-[9px] text-white/20 tracking-widest w-8 shrink-0">{member.id}</span>
                    <div className="flex flex-col gap-1">
                      <span className={`font-mono text-sm sm:text-base font-black tracking-[0.12em] uppercase ${member.name === "—" ? "text-white/20" : "text-white"}`}>{member.name}</span>
                      <span className="font-mono text-[10px] text-white/30 tracking-[0.15em] uppercase">{member.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-12 sm:ml-0">
                    <span className="font-mono text-[9px] text-white/20 tracking-[0.2em] uppercase">SINCE {member.since}</span>
                    {member.name !== "—" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/60 transition-colors duration-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROCESS */}
        <div className="reveal-row py-20 sm:py-28 border-t border-white/[0.06]">
          <div className="flex flex-col md:flex-row gap-10 md:gap-20 lg:gap-32">
            <div className="md:w-48 lg:w-56 shrink-0">
              <span className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase">004 // PROCESS</span>
            </div>
            <div className="flex-1 flex flex-col gap-px bg-white/[0.04]">
              {[
                { n: "01", title: "DISCOVER", desc: "Deep-dive into your operations, data flows, and bottlenecks. We map the terrain before we build anything." },
                { n: "02", title: "ARCHITECT", desc: "Design the agent topology — tools, memory, routing, orchestration. Every system is purpose-built, never templated." },
                { n: "03", title: "BUILD", desc: "Rapid, iterative development with weekly checkpoints. You see working agents, not decks." },
                { n: "04", title: "DEPLOY & EMBED", desc: "Launch into production with full monitoring. We stay embedded to evolve the system as your business scales." },
              ].map((step) => (
                <div key={step.n} className="bg-[#020202] p-6 sm:p-7 md:p-8 flex flex-col sm:flex-row gap-5 sm:gap-10 group hover:bg-white/[0.025] transition-colors duration-400">
                  <span className="font-mono text-[9px] text-white/20 tracking-widest shrink-0 pt-1">{step.n}</span>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-mono text-sm sm:text-base font-black text-white tracking-[0.15em] uppercase">{step.title}</h4>
                    <p className="font-mono text-[11px] text-white/35 tracking-[0.1em] uppercase leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="reveal-row border-t border-white/[0.06] py-20 sm:py-28 md:py-36 flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          <div>
            <span className="font-mono text-[9px] text-white/25 tracking-[0.3em] uppercase block mb-6">005 // NEXT</span>
            <h2 className="text-[clamp(2.2rem,7vw,7.5rem)] font-black leading-[0.88] tracking-tighter text-white uppercase">
              READY TO <br /><span className="text-outline">FORGE</span><br /> SOMETHING?
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