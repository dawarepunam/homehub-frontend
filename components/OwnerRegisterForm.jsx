"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { registerOwner } from "@/services/ownerAuth";

export default function OwnerRegisterForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // OWNER REGISTER
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = formData.username.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!username) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    if (!password) {
      toast.error("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // -------------------------------------------------
      // CREATE OWNER ACCOUNT IN STRAPI
      // -------------------------------------------------

      const result = await registerOwner({
        username,
        email,
        password,
      });

      console.log("OWNER REGISTER RESULT:", result);

      // -------------------------------------------------
      // SUCCESS POPUP
      // -------------------------------------------------

      toast.success("🎉 Owner registration successful!", {
        duration: 2000,
      });

      // Clear form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // -------------------------------------------------
      // REDIRECT TO OWNER LOGIN
      // -------------------------------------------------

      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (error) {
      console.error("OWNER REGISTRATION ERROR:", error);

      toast.error(error?.message || "Owner registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="relative min-h-screen w-full bg-[#073B4C] font-sans selection:bg-[#D9A441]/30 selection:text-white">
      {/* Background gradients for premium feel without being childish */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#1F7A8C]/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#D9A441]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl overflow-hidden rounded-[24px] bg-[#0A485D]/40 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] backdrop-blur-md flex flex-col lg:flex-row">
          
          {/* LEFT SIDE: Branding and Value Prop */}
          <div className="relative flex w-full flex-col justify-between p-8 sm:p-12 lg:w-5/12">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D9A441] to-[#B68A36] shadow-lg">
                  <Building2 size={20} className="text-[#073B4C]" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">HomeHub</span>
              </div>
              
              <div className="mt-16 sm:mt-24">
                <span className="inline-block rounded-full border border-[#D9A441]/30 bg-[#D9A441]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#D9A441]">
                  Seller Portal
                </span>
                <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-4xl xl:text-5xl">
                  Build Your <br />
                  <span className="bg-gradient-to-r from-[#D9A441] to-[#F2D096] bg-clip-text text-transparent">Property Business.</span>
                </h1>
                <p className="mt-6 max-w-md text-base text-[#B1C9CF] sm:text-lg">
                  Create your owner account and manage properties, enquiries, and your real-estate business from one professional workspace.
                </p>
              </div>
            </div>

            <div className="mt-12 hidden flex-col gap-5 sm:flex lg:mt-24">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F7A8C]/20 text-[#D9A441]">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">List Properties</span>
                  <span className="text-xs text-[#8BA7AF]">Reach thousands of buyers</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F7A8C]/20 text-[#D9A441]">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Grow Business</span>
                  <span className="text-xs text-[#8BA7AF]">Advanced insights and tools</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Authentication Form */}
          <div className="w-full bg-white p-8 sm:p-12 lg:w-7/12">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-[#073B4C]/60">
                  Create Account
                </span>
                <h2 className="mt-2 text-3xl font-bold text-[#073B4C]">
                  Become a Seller
                </h2>
                <p className="mt-2 text-sm text-[#5C7680]">
                  Create your account to list and manage properties on HomeHub.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="owner-name" className="text-sm font-medium text-[#073B4C]">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <UserRound size={18} className="text-[#8BA7AF]" />
                    </div>
                    <input
                      id="owner-name"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                      className="block w-full rounded-xl border border-[#D1D9DC] bg-[#FAFAFA] py-3.5 pl-11 pr-4 text-[15px] text-[#073B4C] transition-all placeholder:text-[#8BA7AF] hover:border-[#A4B8BF] hover:bg-white focus:border-[#0F6678] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0F6678]/10"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label htmlFor="owner-email" className="text-sm font-medium text-[#073B4C]">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Mail size={18} className="text-[#8BA7AF]" />
                    </div>
                    <input
                      id="owner-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-xl border border-[#D1D9DC] bg-[#FAFAFA] py-3.5 pl-11 pr-4 text-[15px] text-[#073B4C] transition-all placeholder:text-[#8BA7AF] hover:border-[#A4B8BF] hover:bg-white focus:border-[#0F6678] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0F6678]/10"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label htmlFor="owner-password" className="text-sm font-medium text-[#073B4C]">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <LockKeyhole size={18} className="text-[#8BA7AF]" />
                    </div>
                    <input
                      id="owner-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      autoComplete="new-password"
                      required
                      className="block w-full rounded-xl border border-[#D1D9DC] bg-[#FAFAFA] py-3.5 pl-11 pr-12 text-[15px] text-[#073B4C] transition-all placeholder:text-[#8BA7AF] hover:border-[#A4B8BF] hover:bg-white focus:border-[#0F6678] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0F6678]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8BA7AF] transition-colors hover:text-[#073B4C]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label htmlFor="owner-confirm-password" className="text-sm font-medium text-[#073B4C]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <LockKeyhole size={18} className="text-[#8BA7AF]" />
                    </div>
                    <input
                      id="owner-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      required
                      className="block w-full rounded-xl border border-[#D1D9DC] bg-[#FAFAFA] py-3.5 pl-11 pr-12 text-[15px] text-[#073B4C] transition-all placeholder:text-[#8BA7AF] hover:border-[#A4B8BF] hover:bg-white focus:border-[#0F6678] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0F6678]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((previous) => !previous)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8BA7AF] transition-colors hover:text-[#073B4C]"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full justify-center rounded-xl bg-[#0F6678] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0A485D] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6678] disabled:cursor-not-allowed disabled:opacity-70 mt-6"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Seller Account
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center text-sm text-[#5C7680]">
                Already have a seller account?{" "}
                <Link href="/login" className="font-semibold text-[#D9A441] hover:text-[#B68A36] hover:underline transition-all">
                  Seller Login
                </Link>
              </div>

              {/* Divider */}
              <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-[#E5E9EA]" />
                </div>
                <div className="relative flex justify-center text-xs font-medium leading-6">
                  <span className="bg-white px-4 text-[#8BA7AF] uppercase tracking-wider">Alternate Registration</span>
                </div>
              </div>

              {/* Secondary Action */}
              <div className="mt-8">
                <Link
                  href="/user/register"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[#D1D9DC] bg-white px-4 py-3 text-sm font-semibold text-[#073B4C] shadow-sm transition-all hover:bg-[#F8FAFB] hover:border-[#A4B8BF]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E5E9EA] group-hover:bg-[#D1D9DC] transition-colors">
                    <UserRound size={12} strokeWidth={2.5} />
                  </span>
                  Register as Buyer
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
