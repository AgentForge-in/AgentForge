"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Phone, PhoneOff, X } from "lucide-react";
import Vapi from "@vapi-ai/web";

type AgentCallDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ScheduleState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  businessType: string;
  requirements: string;
  date: string;
  time: string;
  budget: string;
};

const initialSchedule: ScheduleState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  businessType: "",
  requirements: "",
  date: "",
  time: "",
  budget: "",
};

type Mode = "choice" | "calling" | "book";
type CallStatus = "idle" | "connecting" | "active" | "ended" | "error";

function toGoogleDate(date: string, time: string, addMinutes = 30) {
  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + addMinutes * 60 * 1000);
  const format = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return `${format(start)}/${format(end)}`;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function AgentCallDialog({ open, onOpenChange }: AgentCallDialogProps) {
  const [mode, setMode] = useState<Mode>("choice");
  const [schedule, setSchedule] = useState<ScheduleState>(initialSchedule);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const vapiRef = useRef<Vapi | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const vapiPublicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY as string | undefined;
  const vapiAssistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID as string | undefined;
  const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const resetAll = () => {
    setMode("choice");
    setSchedule(initialSchedule);
    setBookingStatus("idle");
    setCallStatus("idle");
    setCallDuration(0);
    setIsSpeaking(false);
  };

  const close = () => {
    if (callStatus === "active" || callStatus === "connecting") {
      endCall();
    }
    onOpenChange(false);
    setTimeout(resetAll, 200);
  };

  const startCall = () => {
    if (!vapiPublicKey || !vapiAssistantId) {
      setCallStatus("error");
      return;
    }

    setMode("calling");
    setCallStatus("connecting");
    setCallDuration(0);

    const vapi = new Vapi(vapiPublicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setCallStatus("active");
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    });

    vapi.on("call-end", () => {
      setCallStatus("ended");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    });

    vapi.on("speech-start", () => setIsSpeaking(true));
    vapi.on("speech-end", () => setIsSpeaking(false));

    vapi.on("error", () => {
      setCallStatus("error");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    });

    vapi.start(vapiAssistantId);
  };

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      vapiRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCallStatus("ended");
    setIsSpeaking(false);
  };

  const submitToFormspree = async (payload: Record<string, string>) => {
    if (!formEndpoint) return;
    await fetch(formEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  const submitBooking = async () => {
    if (!schedule.name || !schedule.email || !schedule.date || !schedule.time) return;
    setBookingStatus("loading");
    try {
      await submitToFormspree({
        form_type: "book_call",
        _subject: "Book a Call Request",
        timezone,
        ...schedule,
      });

      const dates = toGoogleDate(schedule.date, schedule.time, 30);
      const details = encodeURIComponent(
        `Name: ${schedule.name}\nEmail: ${schedule.email}\nPhone: ${schedule.phone}\nCompany: ${schedule.company}\nBusiness Type: ${schedule.businessType}\nBudget: ${schedule.budget}\nRequirements: ${schedule.requirements}`
      );
      const text = encodeURIComponent(`Discovery Call - ${schedule.company || schedule.name}`);
      const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}`;
      window.open(gcal, "_blank", "noopener,noreferrer");

      setBookingStatus("success");
    } catch {
      setBookingStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[260] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 18, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#070707] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
                  Call to Agent
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">Connect with our team</h3>
              </div>
              <button
                onClick={close}
                className="rounded-md border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[78vh] overflow-y-auto p-5" data-lenis-prevent>
              {mode === "choice" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={startCall}
                    className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.04]"
                  >
                    <Phone className="h-5 w-5 text-white/80" />
                    <h4 className="mt-3 text-base font-semibold text-white">Talk to Agent</h4>
                    <p className="mt-1 text-sm text-white/55">
                      Start an instant voice call with our AI automation expert.
                    </p>
                  </button>
                  <button
                    onClick={() => setMode("book")}
                    className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.04]"
                  >
                    <CalendarDays className="h-5 w-5 text-white/80" />
                    <h4 className="mt-3 text-base font-semibold text-white">Book a Call</h4>
                    <p className="mt-1 text-sm text-white/55">
                      Pick a preferred date/time and add it to your Google Calendar.
                    </p>
                  </button>
                </div>
              )}

              {mode === "calling" && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative mb-6">
                    <div
                      className={`flex h-24 w-24 items-center justify-center rounded-full border-2 ${
                        callStatus === "active"
                          ? "border-white/30 bg-white/[0.06]"
                          : callStatus === "connecting"
                            ? "border-white/15 bg-white/[0.03]"
                            : callStatus === "error"
                              ? "border-red-400/30 bg-red-400/[0.06]"
                              : "border-white/10 bg-white/[0.02]"
                      }`}
                    >
                      <Phone
                        className={`h-8 w-8 ${
                          callStatus === "active"
                            ? "text-white"
                            : callStatus === "error"
                              ? "text-red-400/80"
                              : "text-white/60"
                        }`}
                      />
                    </div>

                    {callStatus === "active" && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-full border border-white/20"
                          animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full border border-white/15"
                          animate={{ scale: [1, 1.9], opacity: [0.3, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                        />
                      </>
                    )}

                    {callStatus === "connecting" && (
                      <motion.div
                        className="absolute inset-0 rounded-full border border-white/20"
                        animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                  </div>

                  <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
                    {callStatus === "connecting" && "Connecting..."}
                    {callStatus === "active" && (isSpeaking ? "Agent Speaking" : "Listening")}
                    {callStatus === "ended" && "Call Ended"}
                    {callStatus === "error" && "Connection Failed"}
                  </p>

                  {(callStatus === "active" || callStatus === "ended") && (
                    <p className="mt-2 font-mono text-lg font-semibold text-white">
                      {formatDuration(callDuration)}
                    </p>
                  )}

                  {callStatus === "active" && (
                    <div className="mt-4 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 rounded-full bg-white/60"
                          animate={isSpeaking ? { height: [4, 16, 4] } : { height: 4 }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="mt-8 flex items-center gap-3">
                    {(callStatus === "connecting" || callStatus === "active") && (
                      <button
                        onClick={endCall}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-500/90 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
                      >
                        <PhoneOff className="h-4 w-4" />
                        End Call
                      </button>
                    )}

                    {(callStatus === "ended" || callStatus === "error") && (
                      <>
                        <button
                          onClick={() => {
                            setCallStatus("idle");
                            setCallDuration(0);
                            setMode("choice");
                          }}
                          className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                          Back
                        </button>
                        {callStatus === "ended" && (
                          <button
                            onClick={() => {
                              setCallStatus("idle");
                              setCallDuration(0);
                              startCall();
                            }}
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:opacity-90"
                          >
                            <Phone className="h-4 w-4" />
                            Call Again
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {callStatus === "error" && (
                    <p className="mt-4 text-xs text-red-300/90">
                      Unable to start the call. Please check your connection and try again.
                    </p>
                  )}
                </div>
              )}

              {mode === "book" && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      placeholder="Name *"
                      value={schedule.name}
                      onChange={(e) => setSchedule((p) => ({ ...p, name: e.target.value }))}
                      className="rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/30"
                    />
                    <input
                      placeholder="Email *"
                      type="email"
                      value={schedule.email}
                      onChange={(e) => setSchedule((p) => ({ ...p, email: e.target.value }))}
                      className="rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/30"
                    />
                    <input
                      type="date"
                      value={schedule.date}
                      onChange={(e) => setSchedule((p) => ({ ...p, date: e.target.value }))}
                      className="rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
                    />
                    <input
                      type="time"
                      value={schedule.time}
                      onChange={(e) => setSchedule((p) => ({ ...p, time: e.target.value }))}
                      className="rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
                    />
                    <input
                      placeholder="Phone"
                      value={schedule.phone}
                      onChange={(e) => setSchedule((p) => ({ ...p, phone: e.target.value }))}
                      className="rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/30"
                    />
                    <input
                      placeholder="Company"
                      value={schedule.company}
                      onChange={(e) => setSchedule((p) => ({ ...p, company: e.target.value }))}
                      className="rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/30"
                    />
                  </div>
                  <input
                    placeholder="Business Type"
                    value={schedule.businessType}
                    onChange={(e) => setSchedule((p) => ({ ...p, businessType: e.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/30"
                  />
                  <input
                    placeholder="Budget Range"
                    value={schedule.budget}
                    onChange={(e) => setSchedule((p) => ({ ...p, budget: e.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/30"
                  />
                  <textarea
                    placeholder="Automation requirements"
                    value={schedule.requirements}
                    onChange={(e) => setSchedule((p) => ({ ...p, requirements: e.target.value }))}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/30"
                  />
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => setMode("choice")}
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => void submitBooking()}
                      disabled={bookingStatus === "loading"}
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
                    >
                      <CalendarDays className="h-4 w-4" />
                      {bookingStatus === "loading" ? "Scheduling..." : "Book Call"}
                    </button>
                  </div>
                  {bookingStatus === "success" && (
                    <p className="text-xs text-emerald-300/90">
                      Booking submitted. Google Calendar opened in a new tab for final confirmation.
                    </p>
                  )}
                  {bookingStatus === "error" && (
                    <p className="text-xs text-red-300/90">
                      Could not submit booking. Please verify form endpoint and try again.
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
