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
  Home,
  Search,
  Heart
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

      toast.success(`Welcome back, ${result.user.username || "Buyer"}!`, {
        duration: 2000,
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
        }
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
      toast.error(error?.message || "Buyer login failed.", {
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
  // UI
  // =====================================================

  return (
    <main className="relative min-h-screen w-full bg-[var(--bg-page)] font-sans text-[var(--text-primary)] flex items-center justify-center selection:bg-[var(--text-primary)] selection:text-[var(--bg-page)] py-12">
      <div className="w-full max-w-[1040px] overflow-hidden rounded-[24px] bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] flex flex-col lg:flex-row mx-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8">
        
        {/* LEFT SIDE: Branding and Value Prop */}
        <div className="relative flex w-full flex-col justify-between p-10 sm:p-14 lg:w-5/12 bg-[var(--bg-card-hover)] border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)]">
          <div>
            <Link href="/" className="flex items-center gap-3 w-fit group outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] rounded-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--text-primary)] text-[var(--bg-page)] transition-transform duration-300 group-hover:scale-105">
                <Home size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">HomeHub</span>
            </Link>
            
            <div className="mt-20">
              <span className="inline-block rounded-full border border-[var(--border-subtle)] bg-[var(--bg-page)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] shadow-sm">
                Buyer Portal
              </span>
              <h1 className="mt-8 text-4xl font-extrabold leading-tight text-[var(--text-primary)] sm:text-5xl lg:text-4xl xl:text-5xl tracking-tight">
                Find Your <br />
                <span className="text-[var(--text-muted)]">Dream Home.</span>
              </h1>
              <p className="mt-6 max-w-sm text-[15px] text-[var(--text-muted)] leading-relaxed">
                Search for premium properties, track your favourites, and connect directly with verified owners seamlessly.
              </p>
            </div>
          </div>

          <div className="mt-16 hidden flex-col gap-6 sm:flex lg:mt-24">
            <div className="flex items-start gap-4">
              <div className="flex mt-1 h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-sm">
                <Search size={14} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[var(--text-primary)]">Discover Properties</span>
                <span className="text-[13px] text-[var(--text-muted)] mt-1">Advanced search and premium listings filtering</span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex mt-1 h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-sm">
                <Heart size={14} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[var(--text-primary)]">Save Favourites</span>
                <span className="text-[13px] text-[var(--text-muted)] mt-1">Curate your perfect wishlist of potential homes</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Authentication Form */}
        <div className="w-full p-10 sm:p-14 lg:w-7/12 bg-[var(--bg-card)] flex flex-col justify-center">
          <div className="mx-auto w-full max-w-[400px]">
            <div className="mb-10">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Buyer Access
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Welcome back
              </h2>
              <p className="mt-2 text-[15px] text-[var(--text-muted)]">
                Please enter your details to sign in to your buyer account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="buyer-email" className="text-[13px] font-bold text-[var(--text-primary)]">
                  Email address
                </label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Mail size={18} className="text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--text-primary)]" />
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
                    className="block w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] py-3.5 pl-11 pr-4 text-[15px] text-[var(--text-primary)] transition-all duration-200 placeholder:text-[var(--text-muted)] hover:border-[var(--border-hover)] focus:border-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)] shadow-sm"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="buyer-password" className="text-[13px] font-bold text-[var(--text-primary)]">
                  Password
                </label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <LockKeyhole size={18} className="text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--text-primary)]" />
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
                    className="block w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] py-3.5 pl-11 pr-12 text-[15px] text-[var(--text-primary)] transition-all duration-200 placeholder:text-[var(--text-muted)] hover:border-[var(--border-hover)] focus:border-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)] shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] outline-none focus-visible:text-[var(--text-primary)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Additional Options */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-[var(--text-primary)] focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-card)] cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-[13px] font-medium text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-primary)] transition-colors">
                    Remember me
                  </label>
                </div>
                <div className="text-[13px]">
                  <Link href="/forgot-password?role=buyer" className="font-bold text-[var(--text-primary)] hover:underline transition-all">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-xl bg-[var(--text-primary)] px-4 py-4 text-[15px] font-bold text-[var(--bg-page)] shadow-sm transition-all duration-300 hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-70 mt-4"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-[var(--bg-page)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in to Account
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                )}
              </button>
            </form>

            {/* Registration Link */}
            <div className="mt-8 text-center text-[13px] text-[var(--text-muted)]">
              Don't have a buyer account?{" "}
              <Link href="/user/register" className="font-bold text-[var(--text-primary)] hover:underline transition-all">
                Create an account
              </Link>
            </div>

            {/* Divider */}
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-[var(--border-subtle)]" />
              </div>
              <div className="relative flex justify-center text-[11px] font-bold leading-6">
                <span className="bg-[var(--bg-card)] px-4 text-[var(--text-muted)] uppercase tracking-widest">Alternate Login</span>
              </div>
            </div>

            {/* Secondary Action */}
            <div className="mt-8">
              <Link
                href="/login"
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 py-3.5 text-[14px] font-bold text-[var(--text-primary)] shadow-sm transition-all duration-300 hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--border-subtle)] group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-page)] transition-colors duration-300 text-[var(--text-primary)]">
                  <Building2 size={12} strokeWidth={2.5} />
                </span>
                Login as Seller
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
