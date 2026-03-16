"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Send, X } from "lucide-react";

type SendMessageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DEFAULT_MESSAGE =
  "Hello, I wanted to enquire about the automation of business services.";

export function SendMessageDialog({ open, onOpenChange }: SendMessageDialogProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

  const reset = () => {
    setEmail("");
    setMessage(DEFAULT_MESSAGE);
    setStatus("idle");
  };

  const close = () => {
    onOpenChange(false);
    setTimeout(reset, 200);
  };

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setStatus("loading");

    try {
      if (formEndpoint) {
        await fetch(formEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            form_type: "send_message",
            _subject: "New Message - Agency Website",
            email: email.trim(),
            message: message.trim(),
          }),
        });
      }
      setStatus("success");
    } catch {
      setStatus("error");
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
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#070707] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] text-white/45 uppercase">
                  Send Message
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">Get in Touch</h3>
              </div>
              <button
                onClick={close}
                className="rounded-md border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5" data-lenis-prevent>
              {status === "success" ? (
                <div className="flex flex-col items-center py-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/[0.06]">
                    <Mail className="h-6 w-6 text-emerald-400/80" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-white">Message Sent</p>
                  <p className="mt-1 text-xs text-white/55">
                    Thank you! Our team will get back to you shortly.
                  </p>
                  <button
                    onClick={close}
                    className="mt-6 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] tracking-[0.15em] text-white/45 uppercase">
                      Your Email *
                    </label>
                    <input
                      placeholder="name@company.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[10px] tracking-[0.15em] text-white/45 uppercase">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/30"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={close}
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => void handleSubmit()}
                      disabled={!email.trim() || status === "loading"}
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                      {status === "loading" ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                  {status === "error" && (
                    <p className="text-xs text-red-300/90">
                      Could not send the message. Please try again.
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
