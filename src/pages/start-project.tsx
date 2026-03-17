"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BUSINESS_CATEGORIES = [
  "Technology",
  "E-commerce",
  "Healthcare",
  "Finance",
  "Marketing",
  "Education",
  "Real Estate",
  "Other",
];

const FORM_ENDPOINT =
  import.meta.env.VITE_FORM_ENDPOINT || "https://formspree.io/f/xxxxxxxx";

export function StartProjectPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim() || "";
    const email = (formData.get("email") as string)?.trim() || "";
    const phone = (formData.get("phone") as string)?.trim() || "";
    const category = (formData.get("category") as string) || "";

    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "Name is required";
    if (!category) newErrors.category = "Please select a category";
    if (!email && !phone) {
      newErrors.email = "Email or phone is required";
      newErrors.phone = "Email or phone is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleBlur = (field: string) => () => setTouched((p) => ({ ...p, [field]: true }));

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center px-6 font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto rounded-full border border-white/20 flex items-center justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-2 h-2 rounded-full bg-white"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">
            Thank you
          </h1>
          <p className="mt-3 text-sm text-white/50 uppercase tracking-widest">
            We'll get back to you Under 2 hours.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 text-[11px] font-bold text-white/70 hover:text-white uppercase tracking-[0.2em] transition-colors duration-300"
          >
            <ArrowLeft className="size-3.5" />
            Back to home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 md:p-8 md:px-14 lg:px-20">
        <Link
          to="/"
          className="font-mono text-[10px] sm:text-[11px] font-bold text-white/60 hover:text-white uppercase tracking-[0.2em] transition-colors duration-300 flex items-center gap-2"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
  
  {/* Logo */}
  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 shrink-0">
    <img
      src="/AF.png"
      alt="AF Logo"
      className="max-h-full w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
    />
  </div>

  {/* Divider */}
  <div className="w-px h-7 sm:h-8 bg-white/15 shrink-0" />

  {/* Text */}
  <div className="flex flex-col justify-center gap-[4px] leading-none">
    
    <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white tracking-[0.25em] uppercase">
      AGENTFORGE
    </span>

    <span className="font-mono text-[8px] sm:text-[9px] text-white/30 tracking-[0.18em] uppercase flex items-center gap-1.5">
      
      {/* Animated Dot */}
      <span className="relative inline-flex w-[5px] h-[5px] shrink-0">
        <span className="absolute inset-0 bg-white/50 rounded-full animate-ping opacity-40" />
        <span className="relative bg-white/60 rounded-full w-[5px] h-[5px]" />
      </span>

      Agentic Studio
    </span>

  </div>
</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white/50 tracking-[0.2em] uppercase">
            GET IN TOUCH
          </span>
          <h1 className="mt-3 text-[clamp(2rem,5vw,2.75rem)] font-black leading-tight tracking-tighter text-white uppercase">
            Start a Project
          </h1>
          <p className="mt-3 font-mono text-xs sm:text-sm text-white/40 uppercase tracking-[0.15em]">
            Share your details and we'll reach out.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >
            <div>
              <label
                htmlFor="name"
                className="block font-mono text-[10px] text-white/50 uppercase tracking-widest mb-2"
              >
                Name <span className="text-white/30">*</span>
              </label>
              <motion.input
                id="name"
                name="name"
                type="text"
                required
                onBlur={handleBlur("name")}
                placeholder="Your name"
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`w-full bg-white/5 border px-4 py-3 rounded-lg font-mono text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 transition-all duration-300 ${
                  errors.name
                    ? "border-red-500/50 focus:ring-red-500/30"
                    : "border-white/10 focus:ring-white/20 focus:border-white/30"
                }`}
              />
              {touched.name && errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 font-mono text-[10px] text-red-400/80"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block font-mono text-[10px] text-white/50 uppercase tracking-widest mb-2"
              >
                Business category <span className="text-white/30">*</span>
              </label>
              <motion.select
                id="category"
                name="category"
                required
                onBlur={handleBlur("category")}
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`w-full bg-white/5 border px-4 py-3 rounded-lg font-mono text-sm text-white focus:outline-none focus:ring-1 transition-all duration-300 appearance-none cursor-pointer [&>option]:bg-[#0a0a0a] ${
                  errors.category
                    ? "border-red-500/50 focus:ring-red-500/30"
                    : "border-white/10 focus:ring-white/20 focus:border-white/30"
                }`}
              >
                <option value="">Select category</option>
                {BUSINESS_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </motion.select>
              {touched.category && errors.category && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 font-mono text-[10px] text-red-400/80"
                >
                  {errors.category}
                </motion.p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-mono text-[10px] text-white/50 uppercase tracking-widest mb-2"
              >
                Email <span className="text-white/30">(email or phone required)</span>
              </label>
              <motion.input
                id="email"
                name="email"
                type="email"
                onBlur={handleBlur("email")}
                placeholder="you@company.com"
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`w-full bg-white/5 border px-4 py-3 rounded-lg font-mono text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 transition-all duration-300 ${
                  errors.email
                    ? "border-red-500/50 focus:ring-red-500/30"
                    : "border-white/10 focus:ring-white/20 focus:border-white/30"
                }`}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block font-mono text-[10px] text-white/50 uppercase tracking-widest mb-2"
              >
                Phone
              </label>
              <motion.input
                id="phone"
                name="phone"
                type="tel"
                onBlur={handleBlur("phone")}
                placeholder="+1 (555) 000-0000"
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`w-full bg-white/5 border px-4 py-3 rounded-lg font-mono text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 transition-all duration-300 ${
                  errors.phone
                    ? "border-red-500/50 focus:ring-red-500/30"
                    : "border-white/10 focus:ring-white/20 focus:border-white/30"
                }`}
              />
            </div>

            <div className="pt-4">
              <motion.button
                type="submit"
                disabled={status === "submitting"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-lg border border-white/15 bg-white/5 font-mono text-[11px] font-bold text-white uppercase tracking-[0.2em] hover:bg-white hover:text-black disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-500"
              >
                {status === "submitting" ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                    Sending...
                  </>
                ) : (
                  "Get in touch"
                )}
              </motion.button>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 font-mono text-[10px] text-red-400/80 text-center"
                >
                  Something went wrong. Please try again.
                </motion.p>
              )}
            </div>
          </form>
        </motion.div>
      </main>

      <div className="fixed inset-0 pointer-events-none bento-mask opacity-5 z-0" />
    </div>
  );
}
