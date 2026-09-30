"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, Building2, Home, Mail } from "lucide-react";
import { forgotPassword } from "@/services/auth";

// =====================================================
// INNER COMPONENT — uses useSearchParams (needs Suspense)
// =====================================================

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "buyer";
  const isSeller = role === "seller";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Countdown timer for resend cooldown
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (event) => {
    event?.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (cooldown > 0) {
      toast.error(`Please wait ${cooldown} seconds before resending.`);
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(email.trim());

      // Always show generic success — never reveal account existence
      setSuccess(true);
      setCooldown(30);

    } catch (error) {
      console.error("Forgot Password Error:", error);
      // Never expose "Forbidden" or raw Strapi errors to the user
      toast.error("Something went wrong. We couldn't send the reset link right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // THEME — Buyer (green) vs Seller (teal/gold)
  // =====================================================
  const theme = {
    bg: isSeller ? "bg-[#073B4C]" : "bg-[#14231C]",
    accentBg: isSeller ? "bg-[#D9A441]" : "bg-[#176B4D]",
    accentText: isSeller ? "text-[#D9A441]" : "text-[#176B4D]",
    cardBg: isSeller ? "bg-[#F7F3EA]" : "bg-[#F1F8F4]",
    glowPrimary: isSeller ? "bg-[#D9A441]/20" : "bg-[#176B4D]/30",
    glowSecondary: isSeller ? "bg-[#1F7A8C]/30" : "bg-[#103D2E]/40",
    primaryButton: isSeller
      ? "bg-[#0F6678] hover:bg-[#0B5868] shadow-[#0F6678]/20"
      : "bg-[#176B4D] hover:bg-[#103D2E] shadow-[#176B4D]/20",
    iconColor: isSeller ? "text-[#073B4C]" : "text-[#F1F8F4]",
    titleColor: isSeller ? "text-[#16313A]" : "text-[#14231C]",
    subtitleColor: isSeller ? "text-[#66767B]" : "text-[#68716B]",
    inputBorder: isSeller ? "border-[#C8D4D7]" : "border-[#D8E9DF]",
    inputFocus: isSeller
      ? "focus:border-[#1F7A8C] focus:ring-[#1F7A8C]/10"
      : "focus:border-[#176B4D] focus:ring-[#176B4D]/10",
    loginLink: isSeller ? "/login" : "/user/login",
    portalName: isSeller ? "Owner Portal" : "Buyer Portal",
  };

  return (
    <main
      className={`relative min-h-screen overflow-hidden ${theme.bg} flex items-center justify-center`}
    >
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -left-24 -top-24 h-72 w-72 rounded-full ${theme.glowPrimary} blur-3xl animate-pulse`}
        />
        <div
          className={`absolute -bottom-32 -right-20 h-96 w-96 rounded-full ${theme.glowSecondary} blur-3xl animate-pulse`}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-10">
        <section className="relative">
          {/* Card outer glow */}
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl" />

          <div
            className={`relative overflow-hidden rounded-[2rem] border border-white/20 ${theme.cardBg}/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10`}
          >
            {/* Top accent bar */}
            <div
              className={`absolute left-0 right-0 top-0 h-1 ${
                isSeller
                  ? "bg-gradient-to-r from-[#1F7A8C] via-[#D9A441] to-[#1F7A8C]"
                  : "bg-gradient-to-r from-[#103D2E] via-[#34A87D] to-[#103D2E]"
              }`}
            />

            {/* Brand icon */}
            <div className="mb-8 flex justify-center">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.accentBg} shadow-lg shadow-black/20`}
              >
                {isSeller ? (
                  <Building2 size={28} className={theme.iconColor} />
                ) : (
                  <Home size={28} className={theme.iconColor} />
                )}
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6 text-center">
              <div
                className={`mb-3 inline-flex items-center rounded-full ${theme.accentBg}/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${theme.accentText}`}
              >
                {theme.portalName}
              </div>
              <h2 className={`text-3xl font-bold ${theme.titleColor}`}>
                Forgot Password?
              </h2>
            </div>

            {/* ============================================
                STEP 1 — Email form
            ============================================ */}
            {!success ? (
              <>
                <p
                  className={`mb-8 text-center text-sm leading-6 ${theme.subtitleColor}`}
                >
                  Enter your email and we'll send you a secure link to reset
                  your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="forgot-email"
                      className={`mb-2 block text-sm font-semibold ${theme.titleColor}`}
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#737A75]"
                      />
                      <input
                        id="forgot-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        autoComplete="email"
                        required
                        className={`w-full rounded-2xl border ${theme.inputBorder} bg-white px-12 py-3.5 ${theme.titleColor} outline-none transition duration-200 placeholder:text-[#929791] hover:border-opacity-70 focus:ring-4 ${theme.inputFocus}`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="send-reset-link-btn"
                    disabled={loading || cooldown > 0}
                    className={`group flex w-full items-center justify-center gap-3 rounded-2xl ${theme.primaryButton} px-5 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <span>
                      {loading
                        ? "Sending..."
                        : cooldown > 0
                        ? `Resend available in ${cooldown}s`
                        : "Send Reset Link"}
                    </span>
                    <ArrowRight
                      size={19}
                      className="transition duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </form>
              </>
            ) : (
              /* ============================================
                  STEP 2 — Success state
              ============================================ */
              <div className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Mail size={32} />
                </div>

                <h3 className={`mb-3 text-xl font-bold ${theme.titleColor}`}>
                  Check your email
                </h3>

                <p
                  className={`mb-8 text-sm leading-6 ${theme.subtitleColor}`}
                >
                  If an account exists for{" "}
                  <strong className={theme.titleColor}>{email}</strong>, we've
                  sent you a password reset link.
                </p>

                <button
                  onClick={handleSubmit}
                  id="resend-reset-link-btn"
                  disabled={loading || cooldown > 0}
                  className={`w-full rounded-2xl py-3 text-sm font-semibold ${theme.accentText} transition hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline`}
                >
                  {cooldown > 0
                    ? `Resend available in ${cooldown}s`
                    : "Didn't receive it? Resend"}
                </button>
              </div>
            )}

            {/* Back to Login */}
            <div className="mt-8 text-center">
              <Link
                href={theme.loginLink}
                className={`inline-flex items-center gap-2 text-sm font-semibold ${theme.subtitleColor} transition duration-200 hover:opacity-80`}
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// =====================================================
// PAGE EXPORT — wraps inner component in Suspense
// (required by Next.js for useSearchParams)
// =====================================================

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#14231C] flex items-center justify-center">
          <div className="text-white text-sm">Loading...</div>
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
