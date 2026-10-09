"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, Building2, Home, LockKeyhole, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { resetPassword } from "@/services/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Try to determine role from the URL if possible, or fallback
  const code = searchParams.get("code");
  const role = searchParams.get("role") || "buyer";
  const isSeller = role === "seller";

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirmation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!code) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter a new password.");
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      
      await resetPassword(code, formData.password, formData.passwordConfirmation);

      setSuccess(true);
      toast.success("Password successfully updated!", {
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
        }
      });

    } catch (error) {
      console.error("Reset Password Error:", error);
      toast.error(error?.message || "Failed to reset password.", {
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

  // Theme constants based on role context
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
              Reset Password
            </h2>
          </div>

          {!code ? (
            <div className="text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-sm">
                <LockKeyhole size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-extrabold mb-3 text-[var(--text-primary)] tracking-tight">Invalid Reset Link</h3>
              <p className="mb-10 text-[15px] text-[var(--text-muted)] leading-relaxed">
                Please request a new password reset link.
              </p>
              <Link
                href="/forgot-password"
                className="group relative flex w-full justify-center rounded-xl bg-[var(--text-primary)] px-4 py-4 text-[15px] font-bold text-[var(--bg-page)] shadow-sm transition-all duration-300 hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)]"
              >
                Forgot Password
              </Link>
            </div>
          ) : !success ? (
            <>
              <p className="mb-10 text-center text-[15px] text-[var(--text-muted)] leading-relaxed">
                Create a new secure password for your HomeHub account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* NEW PASSWORD */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-[13px] font-bold text-[var(--text-primary)]">
                    New Password
                  </label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <LockKeyhole size={18} className="text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--text-primary)]" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      required
                      className="block w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] py-3.5 pl-11 pr-12 text-[15px] text-[var(--text-primary)] transition-all duration-200 placeholder:text-[var(--text-muted)] hover:border-[var(--border-hover)] focus:border-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)] shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] outline-none focus-visible:text-[var(--text-primary)]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="space-y-2">
                  <label htmlFor="passwordConfirmation" className="text-[13px] font-bold text-[var(--text-primary)]">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <LockKeyhole size={18} className="text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--text-primary)]" />
                    </div>
                    <input
                      id="passwordConfirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      name="passwordConfirmation"
                      value={formData.passwordConfirmation}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      required
                      className="block w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] py-3.5 pl-11 pr-12 text-[15px] text-[var(--text-primary)] transition-all duration-200 placeholder:text-[var(--text-muted)] hover:border-[var(--border-hover)] focus:border-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)] shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] outline-none focus-visible:text-[var(--text-primary)]"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full justify-center rounded-xl bg-[var(--text-primary)] px-4 py-4 text-[15px] font-bold text-[var(--bg-page)] shadow-sm transition-all duration-300 hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-70 mt-4"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-[var(--bg-page)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Resetting Password...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Reset Password
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-sm">
                <CheckCircle2 size={24} strokeWidth={2.5} />
              </div>
              
              <h3 className="text-2xl font-extrabold mb-3 text-[var(--text-primary)] tracking-tight">Password Reset Successfully</h3>
              
              <p className="mb-10 text-[15px] text-[var(--text-muted)] leading-relaxed">
                Your password has been updated. You can now login with your new password.
              </p>

              <Link
                href={theme.loginLink}
                className="group relative flex w-full justify-center rounded-xl bg-[var(--text-primary)] px-4 py-4 text-[15px] font-bold text-[var(--bg-page)] shadow-sm transition-all duration-300 hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)]"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="text-[var(--text-primary)] text-sm font-medium">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
