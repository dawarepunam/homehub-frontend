"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
  Home,
  Search,
  Heart
} from "lucide-react";

import { registerUser } from "@/services/auth";

export default function RegisterForm() {
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Registration Successful!", {
        duration: 2000,
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
        }
      });

      setTimeout(() => {
        router.push("/user/login");
      }, 2000);

    } catch (error) {
      toast.error(error.message || "Registration Failed", {
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
                Create your buyer account to search properties, track favourites, and connect directly with verified owners.
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
                Create Account
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Join HomeHub
              </h2>
              <p className="mt-2 text-[15px] text-[var(--text-muted)]">
                Please enter your details to create your buyer account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="buyer-name" className="text-[13px] font-bold text-[var(--text-primary)]">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <UserRound size={18} className="text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--text-primary)]" />
                  </div>
                  <input
                    id="buyer-name"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="block w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] py-3.5 pl-11 pr-4 text-[15px] text-[var(--text-primary)] transition-all duration-200 placeholder:text-[var(--text-muted)] hover:border-[var(--border-hover)] focus:border-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)] shadow-sm"
                  />
                </div>
              </div>

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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
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
                    placeholder="Create password"
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="buyer-confirm-password" className="text-[13px] font-bold text-[var(--text-primary)]">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <LockKeyhole size={18} className="text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--text-primary)]" />
                  </div>
                  <input
                    id="buyer-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="block w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] py-3.5 pl-11 pr-12 text-[15px] text-[var(--text-primary)] transition-all duration-200 placeholder:text-[var(--text-muted)] hover:border-[var(--border-hover)] focus:border-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)] shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((previous) => !previous)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] outline-none focus-visible:text-[var(--text-primary)]"
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
                className="group relative flex w-full justify-center rounded-xl bg-[var(--text-primary)] px-4 py-4 text-[15px] font-bold text-[var(--bg-page)] shadow-sm transition-all duration-300 hover:opacity-90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-70 mt-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-[var(--bg-page)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Register
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center text-[13px] text-[var(--text-muted)]">
              Already have an account?{" "}
              <Link href="/user/login" className="font-bold text-[var(--text-primary)] hover:underline transition-all">
                Login
              </Link>
            </div>

            {/* Divider */}
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-[var(--border-subtle)]" />
              </div>
              <div className="relative flex justify-center text-[11px] font-bold leading-6">
                <span className="bg-[var(--bg-card)] px-4 text-[var(--text-muted)] uppercase tracking-widest">Alternate Registration</span>
              </div>
            </div>

            {/* Secondary Action */}
            <div className="mt-8">
              <Link
                href="/register"
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 py-3.5 text-[14px] font-bold text-[var(--text-primary)] shadow-sm transition-all duration-300 hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--border-subtle)] group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-page)] transition-colors duration-300 text-[var(--text-primary)]">
                  <Building2 size={12} strokeWidth={2.5} />
                </span>
                Register as Seller
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}