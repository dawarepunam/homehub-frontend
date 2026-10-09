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
      toast.error("Something went wrong. We couldn't send the reset link right now. Please try again.", {
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // THEME — Buyer vs Seller
  // =====================================================
  const theme = {
    loginLink: isSeller ? "/login" : "/user/login",
    portalName: isSeller ? "Owner Portal" : "Buyer Portal",
  };

  return (
    <main className="relative min-h-screen w-full bg-[var(--bg-page)] font-sans text-[var(--text-primary)] selection:bg-[var(--text-primary)] selection:text-[var(--bg-page)] py-12 flex items-center justify-center">
      <div className="w-full max-w-[480px] overflow-hidden rounded-[24px] bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] mx-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8">
        <div className="w-full p-10 sm:p-12 flex flex-col justify-center">
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--text-primary)] text-[var(--bg-page)] shadow-sm">
                {isSeller ? (
                  <Building2 size={20} strokeWidth={2.5} />
                ) : (
                  <Home size={20} strokeWidth={2.5} />
                )}
              </div>
              <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">HomeHub</span>
            </div>
            
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              {theme.portalName}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Forgot Password?
            </h2>
          </div>

          {!success ? (
            <>
              <p className="mb-10 text-center text-[15px] text-[var(--text-muted)] leading-relaxed">
                Enter your email and we'll send you a secure link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="forgot-email" className="text-[13px] font-bold text-[var(--text-primary)]">
                    Email address
                  </label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Mail size={18} className="text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--text-primary)]" />
                    </div>
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] py-3.5 pl-11 pr-4 text-[15px] text-[var(--text-primary)] transition-all duration-200 placeholder:text-[var(--text-muted)] hover:border-[var(--border-hover)] focus:border-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)] shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="send-reset-link-btn"
                  disabled={loading || cooldown > 0}
                  className="group relative flex w-full justify-center rounded-xl bg-[var(--text-primary)] px-4 py-4 text-[15px] font-bold text-[var(--bg-page)] shadow-sm transition-all duration-300 hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-70 mt-4"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-[var(--bg-page)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
            <div className="text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-sm">
                <Mail size={24} strokeWidth={2.5} />
              </div>

              <h3 className="mb-3 text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Check your email
              </h3>

              <p className="mb-8 text-[15px] text-[var(--text-muted)] leading-relaxed">
                If an account exists for <strong className="text-[var(--text-primary)]">{email}</strong>, we've sent you a password reset link.
              </p>

              <button
                onClick={handleSubmit}
                id="resend-reset-link-btn"
                disabled={loading || cooldown > 0}
                className="w-full rounded-xl py-3 text-[14px] font-bold text-[var(--text-primary)] hover:underline transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cooldown > 0 ? `Resend available in ${cooldown}s` : "Didn't receive it? Resend"}
              </button>
            </div>
          )}

          <div className="mt-8 text-center pt-8 border-t border-[var(--border-subtle)]">
            <Link
              href={theme.loginLink}
              className="inline-flex items-center gap-2 text-[14px] font-bold text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              Back to Login
            </Link>
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
        <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
          <div className="text-[var(--text-primary)] text-sm font-medium">Loading...</div>
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
