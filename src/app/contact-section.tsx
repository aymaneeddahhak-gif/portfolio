"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, CheckCircle2, Copy, Mail, MessageCircle, Phone } from "lucide-react";

function ContourPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-40 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 500"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M -100 80 C 150 140, 350 20, 600 90 C 750 130, 900 60, 1000 100"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="4 2"
        className="text-neutral-300/80"
      />
      <path
        d="M -100 120 C 120 190, 380 70, 580 140 C 740 190, 880 110, 1000 150"
        stroke="currentColor"
        strokeWidth="1.2"
        className="text-neutral-300"
      />
      <path
        d="M -100 160 C 100 240, 420 120, 560 190 C 730 250, 860 160, 1000 200"
        stroke="currentColor"
        strokeWidth="1.2"
        className="text-neutral-300/90"
      />
      <path
        d="M -100 200 C 80 290, 450 170, 540 240 C 710 300, 840 210, 1000 250"
        stroke="currentColor"
        strokeWidth="1.2"
        className="text-neutral-200"
      />
      <path
        d="M -100 240 C 60 340, 480 220, 520 290 C 690 350, 820 260, 1000 300"
        stroke="currentColor"
        strokeWidth="1.2"
        className="text-neutral-200/80"
      />
      <path
        d="M -100 280 C 40 390, 510 270, 500 340 C 670 400, 800 310, 1000 350"
        stroke="currentColor"
        strokeWidth="1.2"
        className="text-neutral-300/60"
      />
    </svg>
  );
}

const CONTACT_EMAIL = "ayman7dahhak@gmail.com";
const CONTACT_PHONE = "+212617415506";
const CONTACT_PHONE_DISPLAY = "+212 617 415 506";
const GITHUB_URL = "https://github.com/aymaneeddahhak-gif";
const WHATSAPP_URL = "https://wa.me/212617415506";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [entered, setEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playedRef = useRef(false);

  // First time the contact section is seen: the mascot wipes in left to
  // right (driven by this observer — motion's whileInView never fires here
  // because the card flips to a fullscreen overlay on entry).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || playedRef.current) return;
        playedRef.current = true;
        setEntered(true);
        setVideoExpanded(true);
        videoRef.current?.play().catch(() => {});
        window.setTimeout(() => setVideoExpanded(false), 1500);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Project inquiry from ${formData.name || "portfolio visitor"}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${formData.name}`,
        `Email: ${formData.email}`,
        `Service: ${formData.service}`,
        `Timeline / Scope: ${formData.budget}`,
        "",
        formData.message,
      ].join("\n"),
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  // The form hands off to the visitor's mail app, so keep a copy-able
  // address on screen for anyone without a mail client configured.
  const flagCopied = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      flagCopied();
      return;
    } catch {
      // Clipboard API blocked (unfocused document, non-secure context, older
      // Safari) — fall through to the legacy selection + execCommand path.
    }

    const field = document.createElement("textarea");
    field.value = CONTACT_EMAIL;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    try {
      if (document.execCommand("copy")) flagCopied();
    } catch {
      // Nothing left to try — the mailto link beside this button still works.
    }
    document.body.removeChild(field);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative w-full bg-white text-[#111827] overflow-x-hidden"
    >
      <ContourPattern className="text-neutral-300/40" />

      <div className="relative z-10 px-3 sm:px-6 lg:px-12 py-10 sm:py-14 lg:py-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 items-stretch">
          {/* Form card — appears after the video settles into place */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 1.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-white border border-neutral-200/80 shadow-[0_4px_35px_rgba(0,0,0,0.03)] p-5 sm:p-7 md:p-9 lg:p-10 flex flex-col justify-between min-h-[440px] lg:min-h-[500px]"
          >
            <div className="absolute top-0 left-0 right-0 h-28 sm:h-32 overflow-hidden pointer-events-none opacity-30">
              <ContourPattern className="text-neutral-400/70 -top-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white" />
            </div>

            {isSubmitted ? (
              <div className="relative z-10 py-12 sm:py-16 text-center space-y-4 my-auto">
                <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>
                <h2
                  id="contact-heading"
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight font-jakarta"
                >
                  Inquiry Ready!
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed px-4">
                  Your mail app just opened with the project details filled in — hit send
                  and we will get back to you within 24 hours. If nothing opened, write to{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900 transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col justify-between h-full space-y-4 sm:space-y-5">
                <div className="space-y-1 pt-1">
                  <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-neutral-400 uppercase">
                    Let&apos;s Work Together
                  </p>
                  <h2
                    id="contact-heading"
                    className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 font-jakarta leading-tight"
                  >
                    Start Your Project with{" "}
                    <span className="font-syne tracking-wider text-neutral-400">AED</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                    Have a project in mind? Fill out the details below for an estimate &amp;
                    timeline.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-neutral-700">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl bg-[#f4f5f7] border border-transparent px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-300 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-neutral-700">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl bg-[#f4f5f7] border border-transparent px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-300 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-neutral-700">
                        Service / Project Type
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Full-Stack Web App, MVP"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full rounded-xl bg-[#f4f5f7] border border-transparent px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-300 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-neutral-700">
                        Timeline / Scope
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2-4 weeks, $5k-$15k"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full rounded-xl bg-[#f4f5f7] border border-transparent px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-300 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-neutral-700">
                      Project Details
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tell us briefly about your goals, features, or architecture..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl bg-[#f4f5f7] border border-transparent px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-300 focus:outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
                    <button
                      type="submit"
                      className="group flex-1 sm:flex-initial inline-flex items-center justify-between gap-3 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold pl-5 sm:pl-6 pr-2 sm:pr-2.5 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer active:scale-95"
                    >
                      <span>Send Project Inquiry</span>
                      <div className="flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/20 group-hover:bg-white group-hover:text-black transition-colors">
                        <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </div>
                    </button>

                    <button
                      type="submit"
                      aria-label="Send inquiry"
                      className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>

                {/* Mailto fallback — works even without a configured mail app */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1.5 text-[11px] sm:text-xs text-neutral-500 border-t border-neutral-200/70 pt-3 mt-1">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Mail className="h-3.5 w-3.5 text-neutral-400" />
                    Prefer email?
                  </span>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Project inquiry")}`}
                    className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900 transition-colors break-all"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    title="Copy email address"
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-[#f4f5f7] px-2 py-1 font-semibold text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition-colors cursor-pointer active:scale-95"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                {/* Social quick-links — circles that expand into labelled pills on hover */}
                <div className="flex flex-wrap items-center gap-2.5 pt-3">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    title="Email me"
                    aria-label="Email me"
                    className="group relative flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full bg-[#EA4335] transition-all duration-400 hover:w-[110px] hover:rounded-[30px] cursor-pointer"
                  >
                    <Mail className="absolute h-[18px] w-[18px] text-white transition-opacity duration-300 group-hover:opacity-0" />
                    <span className="absolute w-[110px] text-center text-[13px] font-semibold text-white opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                      Gmail
                    </span>
                  </a>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                    title="GitHub profile"
                    aria-label="GitHub profile"
                    className="group relative flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full bg-stone-900 transition-all duration-400 hover:w-[110px] hover:rounded-[30px] cursor-pointer"
                  >
                    <i className="fa-brands fa-github absolute text-[18px] text-white transition-opacity duration-300 group-hover:opacity-0" aria-hidden="true" />
                    <span className="absolute w-[110px] text-center text-[13px] font-semibold text-white opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                      GitHub
                    </span>
                  </a>
                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    title="Direct phone call"
                    aria-label="Direct phone call"
                    className="group relative flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full bg-emerald-600 transition-all duration-400 hover:w-[112px] hover:rounded-[30px] cursor-pointer"
                  >
                    <Phone className="absolute h-[17px] w-[17px] text-white transition-opacity duration-300 group-hover:opacity-0" />
                    <span className="absolute w-[112px] text-center text-[12px] font-semibold text-white opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                      Direct call
                    </span>
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    title="Chat on WhatsApp"
                    aria-label="Chat on WhatsApp"
                    className="group relative flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full bg-[#25D366] transition-all duration-400 hover:w-[112px] hover:rounded-[30px] cursor-pointer"
                  >
                    <MessageCircle className="absolute h-[18px] w-[18px] text-white transition-opacity duration-300 group-hover:opacity-0" />
                    <span className="absolute w-[112px] text-center text-[13px] font-semibold text-white opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                      WhatsApp
                    </span>
                  </a>
                </div>

                {/* Contact info rows */}
                <div className="flex flex-col gap-1.5 text-[11px] sm:text-xs text-neutral-500 border-t border-neutral-200/70 pt-3 mt-3">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-2 font-medium hover:text-neutral-900 transition-colors w-fit"
                  >
                    <Mail className="h-3.5 w-3.5 text-neutral-400" />
                    {CONTACT_EMAIL}
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 font-medium hover:text-neutral-900 transition-colors w-fit"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-neutral-400" />
                    WhatsApp&nbsp;{CONTACT_PHONE_DISPLAY}
                  </a>
                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="flex items-center gap-2 font-medium hover:text-neutral-900 transition-colors w-fit"
                  >
                    <Phone className="h-3.5 w-3.5 text-neutral-400" />
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                  <span className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-neutral-400" />
                    Marrakech, Morocco · Available worldwide · Response within 24h
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Looping mascot — wipes in left to right on first view */}
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
            animate={
              entered
                ? { clipPath: "inset(0 0% 0 0)", opacity: 1 }
                : { clipPath: "inset(0 100% 0 0)", opacity: 0 }
            }
            transition={{ duration: 0.9, ease: "easeOut" }}
            className={
              videoExpanded
                ? "absolute inset-0 z-30 select-none"
                : "relative h-[360px] sm:h-[440px] md:h-[480px] lg:h-full lg:min-h-[500px] w-full select-none"
            }
          >
            {/* ponytail: same backdrop removal as the phones hero video —
                brightness lifts the mp4's gray studio backdrop to white and
                multiply drops it into the page; mascot reads transparent */}
            <div className="relative h-full w-full">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[92%] w-[82%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.95)_30%,rgba(255,255,255,0)_70%)]"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-[5%] left-1/2 h-[8%] w-[58%] -translate-x-1/2 rounded-full bg-stone-900/10 blur-xl"
              />
              <video
                ref={videoRef}
                src="/videos/contact.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label="Animated 3D mascot of Aymane"
                className="relative h-full w-full object-cover object-center brightness-[1.4] mix-blend-multiply"
              />
            </div>

            {/* CTA — mailto with prefilled intent, works on desktop and mobile */}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("I want to build an app")}`}
              className="group absolute bottom-4 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2.5 whitespace-nowrap px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-stone-900 hover:bg-black text-white font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              <span>I want to build an app</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 group-hover:bg-white group-hover:text-stone-900 transition-colors">
                <ArrowRight className="h-3 w-3" />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
