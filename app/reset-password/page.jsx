"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, Building2, Home, LockKeyhole, Eye, EyeOff, CheckCircle } from "lucide-react";
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
      toast.success("Password successfully updated!");

    } catch (error) {
      console.error("Reset Password Error:", error);
      toast.error(error?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // Theme constants based on role context
  const theme = {
    bg: isSeller ? "bg-[#073B4C]" : "bg-[#14231C]",
    accentBg: isSeller ? "bg-[#D9A441]" : "bg-[#176B4D]",
    accentText: isSeller ? "text-[#D9A441]" : "text-[#176B4D]",
    accentBorder: isSeller ? "border-[#D9A441]" : "border-[#176B4D]",
    cardBg: isSeller ? "bg-[#F7F3EA]" : "bg-[#F1F8F4]",
    glowPrimary: isSeller ? "bg-[#D9A441]/20" : "bg-[#176B4D]/30",
    glowSecondary: isSeller ? "bg-[#1F7A8C]/30" : "bg-[#103D2E]/40",
    primaryButton: isSeller ? "bg-[#0F6678] hover:bg-[#0B5868]" : "bg-[#176B4D] hover:bg-[#103D2E]",
    iconColor: isSeller ? "text-[#073B4C]" : "text-[#F1F8F4]",
    titleColor: isSeller ? "text-[#16313A]" : "text-[#14231C]",
    subtitleColor: isSeller ? "text-[#66767B]" : "text-[#68716B]",
    inputBg: isSeller ? "bg-white border-[#C8D4D7]" : "bg-white border-[#D8E9DF]",
    inputFocus: isSeller ? "focus:border-[#1F7A8C] focus:ring-[#1F7A8C]/10" : "focus:border-[#176B4D] focus:ring-[#176B4D]/10",
    loginLink: isSeller ? "/login" : "/user/login",
    portalName: isSeller ? "Owner Portal" : "Buyer Portal",
  };

  return (
    <main className={`relative min-h-screen overflow-hidden ${theme.bg} flex items-center justify-center`}>
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -left-24 -top-24 h-72 w-72 rounded-full ${theme.glowPrimary} blur-3xl animate-pulse`} />
        <div className={`absolute -bottom-32 -right-20 h-96 w-96 rounded-full ${theme.glowSecondary} blur-3xl animate-pulse`} />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-10">
        <section className="relative">
          {/* Card glow */}
          <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-transparent via-${theme.accentBg.replace('bg-', '')}/20 to-transparent blur-xl`} />

          <div className={`relative overflow-hidden rounded-[2rem] border border-white/20 ${theme.cardBg}/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10`}>
            
            {/* Brand Logo */}
            <div className="mb-8 flex justify-center">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.accentBg} shadow-lg shadow-black/20`}>
                {isSeller ? <Building2 size={28} className={theme.iconColor} /> : <Home size={28} className={theme.iconColor} />}
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8 text-center">
              <div className={`mb-3 inline-flex items-center rounded-full ${theme.accentBg}/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${theme.accentText}`}>
                {theme.portalName}
              </div>

              <h2 className={`text-3xl font-bold ${theme.titleColor}`}>
                Reset Password
              </h2>
            </div>

            {!code ? (
              <div className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
                  <LockKeyhole size={32} />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${theme.titleColor}`}>Invalid Reset Link</h3>
                <p className={`mb-8 text-sm leading-6 ${theme.subtitleColor}`}>
                  Please request a new password reset link.
                </p>
                <Link
                  href="/forgot-password"
                  className={`group flex w-full items-center justify-center gap-3 rounded-2xl ${theme.primaryButton} px-5 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5`}
                >
                  Forgot Password
                </Link>
              </div>
            ) : !success ? (
              <>
                <p className={`mb-8 text-center text-sm leading-6 ${theme.subtitleColor}`}>
                  Create a new secure password for your HomeHub account.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* NEW PASSWORD */}
                  <div>
                    <label htmlFor="password" className={`mb-2 block text-sm font-semibold ${theme.titleColor}`}>
                      New Password
                    </label>
                    <div className="relative">
                      <LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#737A75]" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        required
                        className={`w-full rounded-2xl border ${theme.inputBg} px-12 py-3.5 pr-12 ${theme.titleColor} outline-none transition duration-200 placeholder:text-[#929791] focus:ring-4 ${theme.inputFocus}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#737A75] transition hover:bg-black/5 hover:${theme.accentText}`}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label htmlFor="passwordConfirmation" className={`mb-2 block text-sm font-semibold ${theme.titleColor}`}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#737A75]" />
                      <input
                        id="passwordConfirmation"
                        type={showConfirmPassword ? "text" : "password"}
                        name="passwordConfirmation"
                        value={formData.passwordConfirmation}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        required
                        className={`w-full rounded-2xl border ${theme.inputBg} px-12 py-3.5 pr-12 ${theme.titleColor} outline-none transition duration-200 placeholder:text-[#929791] focus:ring-4 ${theme.inputFocus}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#737A75] transition hover:bg-black/5 hover:${theme.accentText}`}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`group flex w-full items-center justify-center gap-3 rounded-2xl ${theme.primaryButton} px-5 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <span>{loading ? "Resetting Password..." : "Reset Password"}</span>
                    <ArrowRight size={19} className="transition duration-300 group-hover:translate-x-1" />
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle size={32} />
                </div>
                
                <h3 className={`text-xl font-bold mb-3 ${theme.titleColor}`}>Password Reset Successfully</h3>
                
                <p className={`mb-8 text-sm leading-6 ${theme.subtitleColor}`}>
                  Your password has been updated. You can now login with your new password.
                </p>

                <Link
                  href={theme.loginLink}
                  className={`group flex w-full items-center justify-center gap-3 rounded-2xl ${theme.primaryButton} px-5 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5`}
                >
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#14231C] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
