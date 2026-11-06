"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { motion } from "motion/react";
import { CheckCircle2, ChevronDown, Mail, Phone } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

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

const CONTACT_EMAIL = "aedsolutionsdev@gmail.com";
const CONTACT_PHONE = "+212617415506";
const CONTACT_PHONE_DISPLAY = "+212 617 415 506";
const GITHUB_URL = "https://github.com/aymaneeddahhak-gif";
const SERVICES = ["Web Service", "Mobile Service", "Other Service"];
const DEFAULT_INQUIRY_SUBJECT = "Project Collaboration Inquiry — AED Solutions";
const DEFAULT_WHATSAPP_BODY =
  "Hi AED Solutions! I checked out your portfolio and have a project in mind. Are you available for a quick discussion?";
const DEFAULT_GMAIL_BODY = `Hi AED Solutions,

I came across your portfolio and I'm interested in collaborating on a new project.

Quick details:
• Project Type: [Mobile App / Web App / AI Solution]
• Target Timeline: [e.g. 1 month / ASAP]
• Brief Goal: [What problem we want to solve]

Let me know your current availability for a short discussion.

Best regards,`;

const WHATSAPP_URL = `https://wa.me/212617415506?text=${encodeURIComponent(
  DEFAULT_WHATSAPP_BODY,
)}`;

const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  CONTACT_EMAIL,
)}&su=${encodeURIComponent(DEFAULT_INQUIRY_SUBJECT)}&body=${encodeURIComponent(
  DEFAULT_GMAIL_BODY,
)}`;

const MAILTO_COMPOSE_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  DEFAULT_INQUIRY_SUBJECT,
)}&body=${encodeURIComponent(DEFAULT_GMAIL_BODY)}`;

function TurnstileWidget({
  onVerify,
  onExpire,
  resetRef,
}: {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  resetRef?: React.MutableRefObject<(() => void) | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [hasDomainError, setHasDomainError] = useState(false);
  const onVerifyRef = useRef(onVerify);
  onVerifyRef.current = onVerify;
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.startsWith("192.168."));

    const envKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;
    // Use the real site key so Cloudflare does not display the "À des fins de test uniquement" testing banner
    const siteKey =
      envKey && envKey !== "1x00000000000000000000AA"
        ? envKey
        : "0x4AAAAAAFZUKl9F9SjyS8H9";

    const renderTurnstile = () => {
      const turnstile = (
        window as unknown as {
          turnstile?: {
            render: (el: HTMLElement, opt: Record<string, unknown>) => string;
            reset: (id: string) => void;
            remove: (id: string) => void;
          };
        }
      ).turnstile;

      if (turnstile && containerRef.current) {
        if (widgetIdRef.current) {
          try {
            turnstile.remove(widgetIdRef.current);
          } catch {}
        }
        try {
          widgetIdRef.current = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            action: "contact",
            theme: "light",
            size: "normal",
            callback: (token: string) => {
              setHasDomainError(false);
              onVerifyRef.current(token);
            },
            "expired-callback": () => {
              onExpireRef.current?.();
            },
            "error-callback": (err: unknown) => {
              console.warn("[Cloudflare Turnstile] Widget error:", err);
              if (isLocalhost) {
                setHasDomainError(true);
                onVerifyRef.current("dev-dummy-turnstile-token");
              } else {
                onExpireRef.current?.();
              }
            },
          });
        } catch (err) {
          console.error("[Cloudflare Turnstile] Render error:", err);
          if (isLocalhost) {
            setHasDomainError(true);
            onVerifyRef.current("dev-dummy-turnstile-token");
          }
        }
      }
    };

    if (resetRef) {
      resetRef.current = () => {
        if (typeof window !== "undefined" && widgetIdRef.current) {
          const turnstile = (
            window as unknown as {
              turnstile?: { reset: (id: string) => void };
            }
          ).turnstile;
          try {
            turnstile?.reset(widgetIdRef.current);
          } catch {}
        }
      };
    }

    if (
      typeof window !== "undefined" &&
      (window as unknown as { turnstile?: unknown }).turnstile
    ) {
      renderTurnstile();
    } else {
      let script = document.querySelector(
        'script[src*="turnstile"]',
      ) as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", renderTurnstile, { once: true });
      const interval = setInterval(() => {
        if (
          typeof window !== "undefined" &&
          (window as unknown as { turnstile?: unknown }).turnstile
        ) {
          clearInterval(interval);
          renderTurnstile();
        }
      }, 150);
      return () => {
        clearInterval(interval);
        script.removeEventListener("load", renderTurnstile);
      };
    }

    return () => {
      if (resetRef) {
        resetRef.current = null;
      }
      if (widgetIdRef.current) {
        try {
          const turnstile = (
            window as unknown as {
              turnstile?: { remove: (id: string) => void };
            }
          ).turnstile;
          if (turnstile) turnstile.remove(widgetIdRef.current);
        } catch {}
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hasDomainError) {
    return (
      <div className="w-full min-h-[46px] flex items-center justify-start py-1">
        <div className="inline-flex items-center gap-2 rounded-xl bg-neutral-50 border border-neutral-200/90 px-3 py-2 text-xs text-neutral-600 font-medium shadow-2xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Security check passed (Local Development Mode)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[65px] flex items-center justify-start bg-transparent">
      <div ref={containerRef} className="w-full" />
    </div>
  );
}

export default function ContactSection() {
  const { t, lang } = useTranslation();
  const contactVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = contactVideoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [captchaError, setCaptchaError] = useState(false);
  const turnstileResetRef = useRef<(() => void) | null>(null);
  // Prefilled hand-off links, built at submit time so the visitor can still
  // reach the inbox from their own Gmail if the API call fails.
  const [fallbackLinks, setFallbackLinks] = useState<{
    gmail: string;
    mailto: string;
  } | null>(null);
  const [serviceOpen, setServiceOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleResetForm = () => {
    setIsSubmitted(false);
    setSendFailed(false);
    setFormData({
      name: "",
      email: "",
      service: "",
      budget: "",
      message: "",
    });
    setTurnstileToken("");
    setTimeout(() => {
      turnstileResetRef.current?.();
    }, 100);
  };

  // Primary path: Web3Forms delivers the inquiry straight to the inbox that
  // owns NEXT_PUBLIC_WEB3FORMS_KEY. Web3Forms replies with HTTP 200 even for
  // some rejections, so the body's `success` flag — not just res.ok — decides
  // whether we may tell the visitor the message was delivered.
  // Fallback: hand-off links (Gmail compose + mailto) prefilled with the
  // message, shown as buttons so nothing depends on a blocked popup.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);
    setIsSending(true);
    setSendFailed(false);
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    const subject = `New ${formData.service || "project"} inquiry from ${formData.name || "portfolio visitor"}`;
    const plainBody = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Service: ${formData.service}`,
      `Timeline / Scope: ${formData.budget}`,
      "",
      formData.message,
    ].join("\n");

    try {
      if (!accessKey) throw new Error("missing access key");
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          // Cloudflare Turnstile verification response
          "cf-turnstile-response": turnstileToken,
          // Honeypot: hidden from humans; bots that autofill every field get
          // silently rejected by Web3Forms.
          botcheck: false,
          subject,
          from_name: "Portfolio Contact Form",
          // Web3Forms uses this field as the Reply-To address, so hitting
          // "Reply" in Gmail answers the visitor directly.
          replyto: formData.email,
          name: formData.name,
          email: formData.email,
          project: formData.service,
          timeline: formData.budget,
          message: formData.message,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message ?? `web3forms ${res.status}`);
      }
      setIsSubmitted(true);
    } catch {
      turnstileResetRef.current?.();
      setTurnstileToken("");
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(plainBody);
      setFallbackLinks({
        gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
          CONTACT_EMAIL,
        )}&su=${encodedSubject}&body=${encodedBody}`,
        mailto: `mailto:${CONTACT_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`,
      });
      setSendFailed(true);
      setIsSubmitted(true);
    } finally {
      setIsSending(false);
    }
  };


  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative w-full bg-transparent text-[#111827] overflow-x-hidden lg:flex lg:min-h-[100svh] lg:items-center"
    >
      <ContourPattern className="text-neutral-300/40" />

      <div className="relative z-10 px-3 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 items-stretch">
          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-[#f7f8f7] to-[#e7e7e7] border border-neutral-200/80 shadow-[0_4px_35px_rgba(0,0,0,0.03)] p-4 sm:p-6 lg:p-6 flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-28 sm:h-32 overflow-hidden pointer-events-none opacity-30">
              <ContourPattern className="text-neutral-400/70 -top-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f7f8f7]/60 to-[#f7f8f7]" />
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
                  {sendFailed ? "One more tap" : "Message sent!"}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed px-4">
                  {sendFailed ? (
                    <>
                      The automatic delivery didn&apos;t go through. Your details are ready
                      to send — open Gmail and press send, or write to{" "}
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900 transition-colors"
                      >
                        {CONTACT_EMAIL}
                      </a>
                      .
                    </>
                  ) : (
                    <>
                      Thanks for reaching out! Your inquiry landed in my inbox and I&apos;ll
                      get back to you within 24 hours.
                    </>
                  )}
                </p>
                {sendFailed && fallbackLinks && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <a
                      href={fallbackLinks.gmail}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Open in Gmail
                    </a>
                    <a
                      href={fallbackLinks.mailto}
                      className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-800 transition-colors hover:border-neutral-900"
                    >
                      Use my mail app
                    </a>
                  </div>
                )}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="text-xs font-medium text-neutral-500 hover:text-neutral-900 underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    {sendFailed ? "← Try again with form" : "← Send another message"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col justify-between h-full space-y-3 sm:space-y-4">
                <div className="space-y-1 pt-1">
                  {/* Brand mark sits inline on the heading's line, so the logo
                      finishes the sentence instead of stacking under it. */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h2
                      id="contact-heading"
                      className="text-xl sm:text-2xl lg:text-[1.75rem] font-extrabold tracking-tight text-neutral-950 font-jakarta leading-tight"
                    >
                      {t.contact.title}
                    </h2>
                    <img
                      src="/images/logosultion.png"
                      alt="Logosolution"
                      className="h-8 sm:h-9 lg:h-11 w-auto max-w-full self-center"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                    {t.contact.subtitle}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5">
                  {/* Honeypot — invisible to humans, catnip to bots */}
                  <input
                    type="checkbox"
                    name="botcheck"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="hidden"
                    style={{ display: "none" }}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-semibold text-neutral-700">
                        {t.contact.nameLabel}
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={t.contact.namePlaceholder}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="contact-field w-full px-3 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-semibold text-neutral-700">
                        {t.contact.emailLabel}
                      </label>
                      <input
                        required
                        type="email"
                        placeholder={t.contact.emailPlaceholder}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="contact-field w-full px-3 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                    <div className="space-y-1">
                      <span
                        id="service-label"
                        className="block text-[10px] font-semibold text-neutral-700"
                      >
                        {t.contact.serviceLabel}
                      </span>
                      <div
                        className="contact-select relative"
                        data-open={serviceOpen ? "true" : undefined}
                      >
                        <button
                          type="button"
                          aria-labelledby="service-label"
                          aria-haspopup="true"
                          aria-expanded={serviceOpen}
                          onClick={() => setServiceOpen((open) => !open)}
                          className="contact-field flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-xs sm:text-sm focus:outline-none"
                        >
                          <span className={formData.service ? "" : "text-neutral-400"}>
                            {formData.service || "Project type"}
                          </span>
                          <ChevronDown className="contact-select-chevron h-4 w-4 shrink-0 text-neutral-400" />
                        </button>

                        <div
                          role="radiogroup"
                          aria-labelledby="service-label"
                          className="contact-select-panel"
                        >
                          {SERVICES.map((service) => (
                            <label key={service} className="contact-radio">
                              <input
                                required
                                type="radio"
                                name="service"
                                value={service}
                                checked={formData.service === service}
                                onChange={(e) => {
                                  setFormData({ ...formData, service: e.target.value });
                                  setServiceOpen(false);
                                }}
                              />
                              <span className="contact-radio-circle" />
                              <span className="contact-radio-text">{service}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-semibold text-neutral-700">
                        Timeline / Scope
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. MVP in 3-4 weeks, flexible budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="contact-field w-full px-3 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-neutral-700">
                      {t.contact.messageLabel}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={t.contact.messagePlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="contact-field w-full px-3 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Cloudflare Turnstile Captcha */}
                  <div className="space-y-1 pt-0.5">
                    <span className="block text-[10px] font-semibold text-neutral-700">
                      {t.contact.securityVerification}
                    </span>
                    <TurnstileWidget
                      resetRef={turnstileResetRef}
                      onVerify={(token) => {
                        setTurnstileToken(token);
                        setCaptchaError(false);
                      }}
                      onExpire={() => setTurnstileToken("")}
                    />
                    {captchaError && (
                      <p className="text-[11px] font-bold text-red-500">
                        {lang === "fr"
                          ? "Veuillez compléter la vérification de sécurité Cloudflare avant d'envoyer."
                          : "Please complete the Cloudflare security verification before sending."}
                      </p>
                    )}
                  </div>

                  <div className="pt-1 flex items-center gap-2.5 sm:gap-3">
                    <button
                      type="submit"
                      disabled={isSending}
                      aria-live="polite"
                      className="uiverse-send-btn"
                    >
                      <div className="uiverse-send-outline" aria-hidden="true"></div>
                      <div className="uiverse-send-state uiverse-send-state--default">
                        <div className="uiverse-send-icon">
                          <svg
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <g style={{ filter: "url(#uiverse-send-shadow)" }}>
                              <path
                                d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63ZM7.63988 7.03001C4.85988 7.96001 3.86988 9.06001 3.86988 9.78001C3.86988 10.5 4.85988 11.6 7.63988 12.52L10.1599 13.36C10.3799 13.43 10.5599 13.61 10.6299 13.83L11.4699 16.35C12.3899 19.13 13.4999 20.12 14.2199 20.12C14.9399 20.12 16.0399 19.13 16.9699 16.35L19.7999 7.86001C20.3099 6.32001 20.2199 5.06001 19.5699 4.41001C18.9199 3.76001 17.6599 3.68001 16.1299 4.19001L7.63988 7.03001Z"
                                fill="currentColor"
                              ></path>
                              <path
                                d="M10.11 14.4C9.92005 14.4 9.73005 14.33 9.58005 14.18C9.29005 13.89 9.29005 13.41 9.58005 13.12L13.16 9.53C13.45 9.24 13.93 9.24 14.22 9.53C14.51 9.82 14.51 10.3 14.22 10.59L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z"
                                fill="currentColor"
                              ></path>
                            </g>
                            <defs>
                              <filter id="uiverse-send-shadow">
                                <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodOpacity="0.5"></feDropShadow>
                              </filter>
                            </defs>
                          </svg>
                        </div>
                        <p>
                          {(isSending ? (lang === "fr" ? "Envoi..." : "Sending") : (lang === "fr" ? "Envoyer" : "SendMessage")).split("").map((ch, i) => (
                            <span key={i} style={{ "--i": i } as CSSProperties}>
                              {ch}
                            </span>
                          ))}
                        </p>
                      </div>
                      <div className="uiverse-send-state uiverse-send-state--sent">
                        <div className="uiverse-send-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            height="1em"
                            width="1em"
                            strokeWidth="0.5px"
                            stroke="black"
                            aria-hidden="true"
                          >
                            <g style={{ filter: "url(#uiverse-send-shadow)" }}>
                              <path
                                fill="currentColor"
                                d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
                              ></path>
                              <path
                                fill="currentColor"
                                d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
                              ></path>
                            </g>
                          </svg>
                        </div>
                        <p>
                          {"Sent".split("").map((ch, i) => (
                            <span key={i} style={{ "--i": i + 5 } as CSSProperties}>
                              {ch}
                            </span>
                          ))}
                        </p>
                      </div>
                    </button>
                  </div>
                </form>

                {/* Social quick-links — circles that expand into labelled pills on hover */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                    Direct contact
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={GMAIL_COMPOSE_URL}
                    target="_blank"
                    rel="noreferrer"
                    title="Email me on Gmail (pre-filled message)"
                    aria-label="Email me"
                    className="group relative flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full bg-white border border-neutral-200 transition-all duration-400 hover:w-[190px] hover:rounded-[30px] cursor-pointer"
                  >
                    <svg
                      className="absolute h-[20px] w-[20px] transition-opacity duration-300 group-hover:opacity-0"
                      viewBox="0 0 512 512"
                      fillRule="evenodd"
                      aria-hidden="true"
                    >
                      <path fill="#4285F4" d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z" />
                      <path fill="#34A853" d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z" />
                      <path fill="#FBBC05" d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z" />
                      <path fill="#EA4335" d="M116.364 251V99.727L256 204.455 395.636 99.727V251L256 355.727z" />
                      <path fill="#C5221F" d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z" />
                    </svg>
                    <span className="absolute w-[190px] text-center text-[11px] font-bold text-neutral-900 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                      {CONTACT_EMAIL}
                    </span>
                  </a>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                    title="GitHub profile"
                    aria-label="GitHub profile"
                    className="group relative flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full bg-stone-900 transition-all duration-400 hover:w-[190px] hover:rounded-[30px] cursor-pointer"
                  >
                    <i className="fa-brands fa-github absolute text-[18px] text-white transition-opacity duration-300 group-hover:opacity-0" aria-hidden="true" />
                    <span className="absolute w-[190px] text-center text-[11px] font-bold text-white opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                      github.com/aymaneeddahhak-gif
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
                    <svg
                      className="absolute h-[18px] w-[18px] fill-white transition-opacity duration-300 group-hover:opacity-0"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                    </svg>
                    <span className="absolute w-[112px] text-center text-[13px] font-semibold text-white opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                      WhatsApp
                    </span>
                  </a>
                  </div>
                </div>

                {/* Contact info rows */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-neutral-500 border-t border-neutral-200/70 pt-2.5 mt-2">
                  <a
                    href={MAILTO_COMPOSE_URL}
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
                    <svg className="h-3.5 w-3.5 fill-neutral-400" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                    </svg>
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

          {/* Mascot Video — steady continuous loop like hero section, no moving angle, no fullscreen overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative flex items-center justify-center h-[320px] sm:h-[400px] md:h-[450px] lg:h-full lg:min-h-[500px] w-full select-none"
          >
            <div className="relative h-full w-full flex items-center justify-center">
              <div
                aria-hidden="true"
                className="absolute bottom-[4%] left-1/2 h-[8%] w-[58%] -translate-x-1/2 rounded-full bg-stone-900/15 blur-xl"
              />
              <video
                ref={contactVideoRef}
                src="/videos/conatct.mp4"
                loop
                muted
                playsInline
                preload="none"
                controls={false}
                controlsList="nodownload noplaybackrate nofullscreen"
                disablePictureInPicture
                disableRemotePlayback
                aria-label="Animated 3D mascot of Aymane"
                className="video-mask--contact absolute inset-0 h-full w-full object-contain object-center"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
