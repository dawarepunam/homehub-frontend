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
  Home
} from "lucide-react";

import { loginUser } from "@/services/auth";

export default function LoginForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // BUYER LOGIN
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.identifier.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser({
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      // -----------------------------------------------
      // CHECK RESPONSE
      // -----------------------------------------------

      if (!result?.jwt || !result?.user) {
        throw new Error("Buyer login response is invalid.");
      }

      // -----------------------------------------------
      // SAVE LOGIN DATA
      // -----------------------------------------------

      localStorage.setItem("token", result.jwt);

      localStorage.setItem("user", JSON.stringify(result.user));

      localStorage.setItem("userRole", "User");

      localStorage.setItem("activeMode", "buyer");

      console.log("BUYER LOGIN USER:", result.user);

      // -----------------------------------------------
      // SUCCESS POPUP
      // -----------------------------------------------

      toast.success(`🎉 Welcome back, ${result.user.username || "Buyer"}!`, {
        duration: 2000,
      });

      // Clear form
      setFormData({
        identifier: "",
        password: "",
      });

      // -----------------------------------------------
      // REDIRECT
      // -----------------------------------------------

      setTimeout(() => {
        const pendingRedirect = localStorage.getItem("pendingActionRedirect");
        const pendingId = localStorage.getItem("pendingSavePropertyId");
        
        if (pendingRedirect) {
          localStorage.removeItem("pendingActionRedirect");
          router.replace(pendingRedirect);
        } else if (pendingId) {
          router.replace("/");
        } else {
          router.replace("/user");
        }
      }, 1500);
    } catch (error) {
      console.error("BUYER LOGIN ERROR:", error);

      toast.error(error?.message || "Buyer login failed.");
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
                  <Home size={20} className="text-[#073B4C]" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">HomeHub</span>
              </div>
              
              <div className="mt-16 sm:mt-24">
                <span className="inline-block rounded-full border border-[#D9A441]/30 bg-[#D9A441]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#D9A441]">
                  Buyer Portal
                </span>
                <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-4xl xl:text-5xl">
                  Find Your <br />
                  <span className="bg-gradient-to-r from-[#D9A441] to-[#F2D096] bg-clip-text text-transparent">Dream Home.</span>
                </h1>
                <p className="mt-6 max-w-md text-base text-[#A0B8AD] sm:text-lg">
                  Search for premium properties, track your favourites, and connect directly with verified owners seamlessly.
                </p>
              </div>
            </div>

            <div className="mt-12 hidden flex-col gap-5 sm:flex lg:mt-24">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F7A8C]/20 text-[#D9A441]">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Discover Properties</span>
                  <span className="text-xs text-[#8BA7AF]">Advanced search and filters</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F7A8C]/20 text-[#D9A441]">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Save Favourites</span>
                  <span className="text-xs text-[#8BA7AF]">Curate your perfect wishlist</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Authentication Form */}
          <div className="w-full bg-white p-8 sm:p-12 lg:w-7/12">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-[#073B4C]/60">
                  Buyer Access
                </span>
                <h2 className="mt-2 text-3xl font-bold text-[#073B4C]">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-[#5C7680]">
                  Please enter your details to sign in to your buyer account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label htmlFor="buyer-email" className="text-sm font-medium text-[#073B4C]">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Mail size={18} className="text-[#8BA7AF]" />
                    </div>
                    <input
                      id="buyer-email"
                      type="email"
                      name="identifier"
                      value={formData.identifier}
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
                  <label htmlFor="buyer-password" className="text-sm font-medium text-[#073B4C]">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <LockKeyhole size={18} className="text-[#8BA7AF]" />
                    </div>
                    <input
                      id="buyer-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="current-password"
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

                {/* Additional Options */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#D1D9DC] text-[#0F6678] focus:ring-[#0F6678]/30"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-[#5C7680] cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link href="/forgot-password?role=buyer" className="font-semibold text-[#D9A441] hover:text-[#B68A36] transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full justify-center rounded-xl bg-[#0F6678] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0A485D] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6678] disabled:cursor-not-allowed disabled:opacity-70 mt-4"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign in to Account
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </button>
              </form>

              {/* Registration Link */}
              <div className="mt-8 text-center text-sm text-[#5C7680]">
                Don't have a buyer account?{" "}
                <Link href="/user/register" className="font-semibold text-[#D9A441] hover:text-[#B68A36] hover:underline transition-all">
                  Create an account
                </Link>
              </div>

              {/* Divider */}
              <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-[#E5E9EA]" />
                </div>
                <div className="relative flex justify-center text-xs font-medium leading-6">
                  <span className="bg-white px-4 text-[#8BA7AF] uppercase tracking-wider">Alternate Login</span>
                </div>
              </div>

              {/* Secondary Action */}
              <div className="mt-8">
                <Link
                  href="/login"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[#D1D9DC] bg-white px-4 py-3 text-sm font-semibold text-[#073B4C] shadow-sm transition-all hover:bg-[#F8FAFB] hover:border-[#A4B8BF]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E5E9EA] group-hover:bg-[#D1D9DC] transition-colors">
                    <Building2 size={12} strokeWidth={2.5} />
                  </span>
                  Login as Seller
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
