"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown, MessageCircle, Send, Sparkles, User, X } from "lucide-react";

type Role = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
};

type LeadFieldKey =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "businessType"
  | "requirements"
  | "budget"
  | "meetingTime";

type LeadField = {
  key: LeadFieldKey;
  label: string;
  prompt: string;
};

const LEAD_FIELDS: LeadField[] = [
  { key: "name", label: "Name", prompt: "Great. What is your full name?" },
  { key: "email", label: "Email", prompt: "What is your work email address?" },
  { key: "phone", label: "Phone", prompt: "Please share your phone number (with country code)." },
  { key: "company", label: "Company", prompt: "What is your company or business name?" },
  { key: "businessType", label: "Business Type", prompt: "What type of business do you run?" },
  {
    key: "requirements",
    label: "Automation Requirements",
    prompt: "What workflows or processes do you want to automate?",
  },
  { key: "budget", label: "Budget", prompt: "What budget range are you planning for this project?" },
  {
    key: "meetingTime",
    label: "Preferred Meeting Time",
    prompt: "What is your preferred date/time for a discovery call?",
  },
];

const QUICK_QUESTIONS = [
  "What services does your agency provide?",
  "What is Agentic AI and how can it help my business?",
  "How much does a typical automation project cost?",
  "Can we start a project inquiry now?",
];

const SYSTEM_PROMPT = `You are the website assistant for an Agentic AI Automation and Software Development agency.

Agency summary:
The name of the Ai Agency is AgentForge
- Mission: help businesses automate operations with AI systems, intelligent agents, and custom software.
- Pricing: up to 3x more affordable than traditional automation agencies while maintaining enterprise quality.
- Core services: AI automation, agentic AI systems, custom software, modern websites, lead-generation systems, AI chatbots.
- Team: 4 specialists with 4+ years of experience in automation-first systems.
- Founder: Rahul Vishwakarma (Agentic AI Developer, Software Engineer).
- Co-founder: Viraj Walavalkar.
- Founder portfolio: https://rahulvishme.vercel.app
- Industries: startups, SaaS, ecommerce, marketing agencies, consulting, education, healthcare, local and enterprise businesses.
- Typical workflow: contact -> discovery call -> requirement analysis -> solution design -> development -> testing -> deployment -> support.

Behavior rules:
- Keep answers concise, clear, and practical.
- Explain in simple business-friendly language.
- If user intent is project/start/build/automate, guide toward booking a discovery call.
- If asked about capabilities, include examples (lead automation, CRM automation, AI support, AI sales agents, dashboards, SaaS, websites).
- Never invent unavailable contact channels or prices.
- If information is missing, invite user to share requirements.
- Tone: professional, calm, helpful.`;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid(),
      role: "assistant",
      content:
        "Hi, I am your AI assistant. I can explain services, pricing approach, and help you start a project inquiry.",
    },
  ]);
  const [leadMode, setLeadMode] = useState(false);
  const [leadIndex, setLeadIndex] = useState(0);
  const [leadData, setLeadData] = useState<Partial<Record<LeadFieldKey, string>>>({});

  // ── NEW: controls the quick-questions dropdown ──
  const [questionsOpen, setQuestionsOpen] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

  const starterHints = useMemo(() => QUICK_QUESTIONS, []);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const pushAssistant = (content: string) => {
    setMessages((prev) => [...prev, { id: uid(), role: "assistant", content }]);
  };

  const pushUser = (content: string) => {
    setMessages((prev) => [...prev, { id: uid(), role: "user", content }]);
  };

  const startLeadFlow = () => {
    setLeadMode(true);
    setLeadIndex(0);
    setLeadData({});
    pushAssistant(
      "Perfect. I will collect a few details so the team can suggest the right automation plan."
    );
    pushAssistant(LEAD_FIELDS[0].prompt);
  };

  const submitLeadToForm = async (data: Partial<Record<LeadFieldKey, string>>) => {
    if (!formEndpoint) return;
    try {
      await fetch(formEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          form_type: "chatbot_lead",
          _subject: "New Chatbot Lead - Agency Website",
          ...data,
        }),
      });
    } catch {
      // ignore network errors and keep chat flow smooth
    }
  };

  const handleLeadInput = async (text: string) => {
    const field = LEAD_FIELDS[leadIndex];
    const nextData = { ...leadData, [field.key]: text };
    setLeadData(nextData);

    const nextIndex = leadIndex + 1;
    if (nextIndex >= LEAD_FIELDS.length) {
      setLeadMode(false);
      setLeadIndex(0);
      await submitLeadToForm(nextData);
      const summary = LEAD_FIELDS.map((f) => `${f.label}: ${nextData[f.key] ?? "-"}`).join("\n");
      pushAssistant("Thanks. I have captured your project details:");
      pushAssistant(summary);
      pushAssistant(
        "Our team will review this and recommend a custom solution. You can also request a discovery call from the contact section."
      );
      return;
    }

    setLeadIndex(nextIndex);
    pushAssistant(LEAD_FIELDS[nextIndex].prompt);
  };

  const getOpenAIReply = async (text: string) => {
    if (!apiKey) {
      return "Please add `VITE_OPENAI_API_KEY=your_key` in `.env` and restart the dev server to enable AI replies.";
    }

    const history = messages
      .slice(-8)
      .map((m) => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`)
      .join("\n");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `${SYSTEM_PROMPT}\n\nRecent conversation:\n${history}\nUser: ${text}`,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      return "I could not connect right now. Please try again in a moment.";
    }

    const data = (await response.json()) as {
      output_text?: string;
      output?: Array<{ content?: Array<{ text?: string }> }>;
    };

    if (data.output_text && data.output_text.trim()) {
      return data.output_text.trim();
    }

    const fallbackText = data.output
      ?.flatMap((o) => o.content ?? [])
      .map((c) => c.text ?? "")
      .join(" ")
      .trim();

    return fallbackText || "I can help with services, pricing approach, and project planning. What do you need?";
  };

  const sendMessage = async (rawText?: string) => {
    const text = (rawText ?? input).trim();
    if (!text || isThinking) return;

    if (!rawText) setInput("");
    // close dropdown when user sends a quick question
    setQuestionsOpen(false);
    pushUser(text);

    if (leadMode) {
      await handleLeadInput(text);
      return;
    }

    const lower = text.toLowerCase();
    if (
      lower.includes("start project") ||
      lower.includes("project inquiry") ||
      lower.includes("work with you") ||
      lower.includes("automation requirements")
    ) {
      startLeadFlow();
      return;
    }

    setIsThinking(true);
    try {
      const reply = await getOpenAIReply(text);
      pushAssistant(reply);
    } catch {
      pushAssistant("Something went wrong while generating a response. Please try again.");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[220] sm:bottom-6 sm:right-6">
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="flex h-[72vh] w-[calc(100vw-1.25rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-[0_20px_70px_rgba(0,0,0,0.7)] backdrop-blur-xl"
            data-lenis-prevent
          >
            {/* ── Header ── */}
            <div className="border-b border-white/10 bg-gradient-to-r from-white/[0.07] to-transparent px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="relative grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black">
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.14),transparent_56%)]" />
                    <Bot className="relative h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Agency AI Assistant</p>
                    <p className="text-xs text-white/60">Fast answers. Calm support.</p>
                  </div>
                </div>
                <button
                  aria-label="Close chatbot"
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div
              ref={listRef}
              className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3 scroll-smooth"
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[86%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                      message.role === "user"
                        ? "border border-white/20 bg-white text-black"
                        : "border border-white/10 bg-white/[0.03] text-white/90"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 px-1 text-xs text-white/60">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  Thinking...
                </div>
              )}
            </div>

            {/* ── Input area ── */}
            <div className="shrink-0 border-t border-white/10 bg-black/90 px-3 pb-3 pt-2">

              {/* ── Quick Questions Dropdown ── */}
              <div className="mb-2">
                {/* Toggle button */}
                <button
                  onClick={() => setQuestionsOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2 text-[11px] text-white/70 transition hover:border-white/25 hover:text-white"
                >
                  <span>Quick Questions</span>
                  <motion.span
                    animate={{ rotate: questionsOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="ml-1 flex items-center"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </motion.span>
                </button>

                {/* Animated dropdown list */}
                <AnimatePresence initial={false}>
                  {questionsOpen && (
                    <motion.div
                      key="dropdown"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1.5 flex flex-col gap-1.5">
                        {starterHints.slice(0, 3).map((q) => (
                          <button
                            key={q}
                            onClick={() => sendMessage(q)}
                            className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2 text-left text-[11px] text-white/75 transition hover:border-white/25 hover:text-white"
                          >
                            {q}
                          </button>
                        ))}
                        <button
                          onClick={() => sendMessage("Can we start a project inquiry now?")}
                          className="w-full rounded-xl border border-white/20 bg-white px-3 py-2 text-left text-[11px] text-black transition hover:opacity-90"
                        >
                          Start Project Inquiry
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Text input ── */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendMessage();
                }}
                className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-2 py-2"
              >
                <User className="h-4 w-4 shrink-0 text-white/45" />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about AI automation, pricing, or strategy..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                />
                <button
                  type="submit"
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white text-black transition hover:opacity-90 disabled:opacity-40"
                  disabled={!input.trim() || isThinking}
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="trigger"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setOpen(true)}
            className="group relative grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-black shadow-[0_10px_40px_rgba(0,0,0,0.75)]"
            aria-label="Open chatbot"
          >
            <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_58%)]" />
            <MessageCircle className="relative h-6 w-6 text-white" />
            <span className="pointer-events-none absolute -top-1 -right-1 h-3 w-3 rounded-full border border-black bg-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}