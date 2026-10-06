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
  // THEME — Buyer vs Seller
  // =====================================================
  const theme = {
    bg: "bg-[#073B4C]",
    accentBg: "bg-[#D9A441]",
    glowPrimary: "bg-[#1F7A8C]/20",
    glowSecondary: "bg-[#D9A441]/10",
    cardBg: "bg-[#0A485D]/40",
    primaryButton: "bg-[#0F6678] hover:bg-[#0A485D] focus-visible:outline-[#0F6678]",
    iconColor: "text-[#073B4C]",
    titleColor: "text-[#073B4C]",
    loginLink: isSeller ? "/login" : "/user/login",
    portalName: isSeller ? "Owner Portal" : "Buyer Portal",
  };

  return (
    <main className={`relative min-h-screen w-full ${theme.bg} font-sans selection:bg-[#D9A441]/30 selection:text-white`}>
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full ${theme.glowPrimary} blur-[120px]`} />
        <div className={`absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full ${theme.glowSecondary} blur-[120px]`} />
      </div>

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className={`w-full max-w-md overflow-hidden rounded-[24px] ${theme.cardBg} border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] backdrop-blur-md`}>
          
          <div className="w-full bg-white p-8 sm:p-10">
            <div className="mb-8 text-center flex flex-col items-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D9A441] to-[#B68A36] shadow-lg">
                  {isSeller ? (
                    <Building2 size={20} className={theme.iconColor} />
                  ) : (
                    <Home size={20} className={theme.iconColor} />
                  )}
                </div>
                <span className={`text-xl font-bold tracking-tight ${theme.titleColor}`}>HomeHub</span>
              </div>
              
              <span className={`text-xs font-bold uppercase tracking-widest ${theme.titleColor}/60`}>
                {theme.portalName}
              </span>
              <h2 className={`mt-2 text-3xl font-bold ${theme.titleColor}`}>
                Forgot Password?
              </h2>
            </div>

            {!success ? (
              <>
                <p className="mb-8 text-center text-sm text-[#5C7680]">
                  Enter your email and we'll send you a secure link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="forgot-email" className={`text-sm font-medium ${theme.titleColor}`}>
                      Email address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Mail size={18} className="text-[#8BA7AF]" />
                      </div>
                      <input
                        id="forgot-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        autoComplete="email"
                        required
                        className={`block w-full rounded-xl border border-[#D1D9DC] bg-[#FAFAFA] py-3.5 pl-11 pr-4 text-[15px] ${theme.titleColor} transition-all placeholder:text-[#8BA7AF] hover:border-[#A4B8BF] hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:border-opacity-100 focus:border-[#0F6678] focus:ring-[#0F6678]/10`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="send-reset-link-btn"
                    disabled={loading || cooldown > 0}
                    className={`group relative flex w-full justify-center rounded-xl ${theme.primaryButton} px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70 mt-6`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Sending...
                      </span>
                    ) : cooldown > 0 ? (
                      `Resend available in ${cooldown}s`
                    ) : (
                      <span className="flex items-center gap-2">
                        Send Reset Link
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1F7A8C]/20 text-[#0F6678]">
                  <Mail size={32} />
                </div>

                <h3 className={`mb-3 text-xl font-bold ${theme.titleColor}`}>
                  Check your email
                </h3>

                <p className="mb-8 text-sm text-[#5C7680]">
                  If an account exists for <strong className={theme.titleColor}>{email}</strong>, we've sent you a password reset link.
                </p>

                <button
                  onClick={handleSubmit}
                  id="resend-reset-link-btn"
                  disabled={loading || cooldown > 0}
                  className={`w-full rounded-xl py-3 text-sm font-semibold text-[#D9A441] transition hover:text-[#B68A36] disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {cooldown > 0 ? `Resend available in ${cooldown}s` : "Didn't receive it? Resend"}
                </button>
              </div>
            )}

            <div className="mt-8 text-center">
              <Link
                href={theme.loginLink}
                className={`inline-flex items-center gap-2 text-sm font-semibold text-[#5C7680] transition-colors hover:text-[${theme.titleColor}]`}
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>

          </div>
        </div>
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
        <div className="min-h-screen bg-[#073B4C] flex items-center justify-center">
          <div className="text-white text-sm">Loading...</div>
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
