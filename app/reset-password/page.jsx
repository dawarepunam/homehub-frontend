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
                Reset Password
              </h2>
            </div>

            {!code ? (
              <div className="text-center">
                <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
                  <LockKeyhole size={32} />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${theme.titleColor}`}>Invalid Reset Link</h3>
                <p className={`mb-8 text-sm text-[#5C7680]`}>
                  Please request a new password reset link.
                </p>
                <Link
                  href="/forgot-password"
                  className={`group relative flex w-full justify-center rounded-xl ${theme.primaryButton} px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
                >
                  Forgot Password
                </Link>
              </div>
            ) : !success ? (
              <>
                <p className={`mb-8 text-center text-sm text-[#5C7680]`}>
                  Create a new secure password for your HomeHub account.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* NEW PASSWORD */}
                  <div className="space-y-1.5">
                    <label htmlFor="password" className={`text-sm font-medium ${theme.titleColor}`}>
                      New Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <LockKeyhole size={18} className="text-[#8BA7AF]" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        required
                        className={`block w-full rounded-xl border border-[#D1D9DC] bg-[#FAFAFA] py-3.5 pl-11 pr-12 text-[15px] ${theme.titleColor} transition-all placeholder:text-[#8BA7AF] hover:border-[#A4B8BF] hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:border-opacity-100 focus:border-[#0F6678] focus:ring-[#0F6678]/10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute inset-y-0 right-0 flex items-center pr-4 text-[#8BA7AF] transition-colors hover:${theme.titleColor}`}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="space-y-1.5">
                    <label htmlFor="passwordConfirmation" className={`text-sm font-medium ${theme.titleColor}`}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <LockKeyhole size={18} className="text-[#8BA7AF]" />
                      </div>
                      <input
                        id="passwordConfirmation"
                        type={showConfirmPassword ? "text" : "password"}
                        name="passwordConfirmation"
                        value={formData.passwordConfirmation}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        required
                        className={`block w-full rounded-xl border border-[#D1D9DC] bg-[#FAFAFA] py-3.5 pl-11 pr-12 text-[15px] ${theme.titleColor} transition-all placeholder:text-[#8BA7AF] hover:border-[#A4B8BF] hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:border-opacity-100 focus:border-[#0F6678] focus:ring-[#0F6678]/10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute inset-y-0 right-0 flex items-center pr-4 text-[#8BA7AF] transition-colors hover:${theme.titleColor}`}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`group relative flex w-full justify-center rounded-xl ${theme.primaryButton} px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70 mt-6`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
              <div className="text-center">
                <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1F7A8C]/20 text-[#0F6678]">
                  <CheckCircle size={32} />
                </div>
                
                <h3 className={`text-xl font-bold mb-3 ${theme.titleColor}`}>Password Reset Successfully</h3>
                
                <p className={`mb-8 text-sm text-[#5C7680]`}>
                  Your password has been updated. You can now login with your new password.
                </p>

                <Link
                  href={theme.loginLink}
                  className={`group relative flex w-full justify-center rounded-xl ${theme.primaryButton} px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md`}
                >
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#073B4C] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
