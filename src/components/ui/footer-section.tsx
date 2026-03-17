'use client';

import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import type { ComponentProps, ReactNode } from 'react';
import { Instagram, Linkedin, Facebook, X } from 'lucide-react';

/* ─────────────────────────────────────────────
   Data — update links as pages are built
───────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home',          href: '/' },
  { label: 'Work',          href: '/work' },
  { label: 'About',         href: '/about' },
  { label: 'Contact',       href: '/contact' },
  { label: 'Start Project', href: '/start-project' },
];

const COMPANY_LINKS = [
  { label: 'FAQs',           href: '/#faq' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms',          href: '/terms' },
];

// ✅ ONLY CHANGE: Added real links (replace with yours)
const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/agent_forgeai?utm_source=qr&igsh=MXgyM3gyb2E5cW9wcg%3D%3D', Icon: Instagram },
  { label: 'LinkedIn',  href: 'https://x.com/ai_agentforge', Icon: Linkedin },
  { label: 'X',         href: 'https://x.com/ai_agentforge', Icon: X }, // 
  { label: 'Facebook',  href: 'https://www.facebook.com/profile.php?id=61579445401285', Icon: Facebook },
];

/* ─────────────────────────────────────────────
   Animated wrapper — same blur-in used site-wide
───────────────────────────────────────────── */
type AnimProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

function Reveal({ className, delay = 0.1, children }: AnimProps) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <motion.div
      initial={{ filter: 'blur(6px)', y: 12, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Footer
───────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className="w-full bg-[#020202] border-t border-white/[0.06]">

      {/* ── TOP SECTION ── */}
      <div className="w-full px-6 sm:px-8 md:px-14 lg:px-20 pt-14 sm:pt-18 md:pt-20 pb-12 sm:pb-16">
        <div className="flex flex-col md:flex-row gap-14 md:gap-20 lg:gap-32">

          {/* Left — logo + tagline */}
          <Reveal delay={0.05} className="md:w-64 lg:w-72 shrink-0 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <img
                  src="/AF.png"
                  alt="AgentForge Logo"
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
                />
              </div>
              <div className="w-px h-6 bg-white/15 shrink-0" />
              <div className="flex flex-col gap-[3px]">
                <span className="font-mono text-[10px] font-bold text-white tracking-[0.25em] uppercase leading-none">
                  AGENTFORGE
                </span>
                <span className="font-mono text-[8px] text-white/30 tracking-[0.18em] uppercase leading-none flex items-center gap-1.5">
                  <span className="relative inline-flex w-[5px] h-[5px] shrink-0">
                    <span className="absolute inset-0 bg-white/50 rounded-full animate-ping opacity-40" />
                    <span className="relative bg-white/60 rounded-full w-[5px] h-[5px]" />
                  </span>
                  Agentic Studio
                </span>
              </div>
            </div>

            <p className="font-mono text-[10px] sm:text-[11px] text-white/25 tracking-[0.18em] uppercase leading-relaxed max-w-[220px]">
              Your Business,<br />Amplified by Intelligence.
            </p>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-[8px] text-white/15 tracking-[0.25em] uppercase">
                MUMBAI, INDIA
              </span>
              <span className="font-mono text-[8px] text-white/15 tracking-[0.25em] uppercase flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-white/30 inline-block" />
                OPEN FOR PROJECTS
              </span>
            </div>
          </Reveal>

          {/* Right — links grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-12">

            {/* Navigate */}
            <Reveal delay={0.12} className="flex flex-col gap-5">
              <span className="font-mono text-[8px] text-white/20 tracking-[0.3em] uppercase">
                NAVIGATE
              </span>
              <ul className="flex flex-col gap-3">
                {NAV_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="font-mono text-[10px] text-white/35 tracking-[0.15em] uppercase hover:text-white/80 transition-colors duration-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Company */}
            <Reveal delay={0.18} className="flex flex-col gap-5">
              <span className="font-mono text-[8px] text-white/20 tracking-[0.3em] uppercase">
                COMPANY
              </span>
              <ul className="flex flex-col gap-3">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="font-mono text-[10px] text-white/35 tracking-[0.15em] uppercase hover:text-white/80 transition-colors duration-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Contact */}
            <Reveal delay={0.24} className="flex flex-col gap-5">
              <span className="font-mono text-[8px] text-white/20 tracking-[0.3em] uppercase">
                REACH US
              </span>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="mailto:agentforge.studio@gmail.com"
                    className="font-mono text-[10px] text-white/35 tracking-[0.1em] uppercase hover:text-white/80 transition-colors duration-300 break-all"
                  >
                    agentforge.studio@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:rahulvish194002@gmail.com"
                    className="font-mono text-[10px] text-white/35 tracking-[0.1em] uppercase hover:text-white/80 transition-colors duration-300 break-all"
                  >
                    rahulvish194002@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:virajwalavalkar90982@gmail.com"
                    className="font-mono text-[10px] text-white/35 tracking-[0.1em] uppercase hover:text-white/80 transition-colors duration-300 break-all"
                  >
                    virajwalavalkar90982@gmail.com
                  </a>
                </li>
              </ul>

              {/* Social icons */}
              <div className="flex items-center gap-3 mt-1">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank" // ✅ added
                    rel="noopener noreferrer" // ✅ added
                    aria-label={label}
                    className="w-7 h-7 border border-white/[0.08] flex items-center justify-center hover:border-white/30 hover:bg-white/[0.05] transition-all duration-300"
                  >
                    <Icon size={11} className="text-white/30 group-hover:text-white/60" />
                  </a>
                ))}
              </div>
            </Reveal>

          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <Reveal delay={0.3}>
        <div className="border-t border-white/[0.06] px-6 sm:px-8 md:px-14 lg:px-20 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="font-mono text-[8px] text-white/15 tracking-[0.25em] uppercase">
            © {new Date().getFullYear()} AGENTFORGE STUDIO — ALL RIGHTS RESERVED
          </span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[8px] text-white/10 tracking-[0.2em] uppercase">
              BUILT WITH INTELLIGENCE
            </span>
            <span className="text-white/10 text-[8px]">◆</span>
            <span className="font-mono text-[8px] text-white/10 tracking-[0.2em] uppercase">
              MUMBAI, INDIA
            </span>
          </div>
        </div>
      </Reveal>

    </footer>
  );
}