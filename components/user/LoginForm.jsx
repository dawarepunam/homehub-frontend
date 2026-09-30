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
    <main className="relative min-h-screen overflow-hidden bg-[#14231C]">
      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Green glow */}

        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#176B4D]/30 blur-3xl animate-pulse" />

        {/* Teal glow */}

        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#103D2E]/40 blur-3xl animate-pulse" />

        {/* Decorative diagonal shape */}

        <div className="absolute -right-20 top-20 h-72 w-72 rotate-12 rounded-[5rem] border border-[#176B4D]/20 bg-[#176B4D]/10" />

        {/* Small floating dots */}

        <div className="absolute left-[8%] top-[18%] h-2 w-2 rounded-full bg-[#176B4D] animate-bounce" />

        <div className="absolute left-[12%] top-[24%] h-1.5 w-1.5 rounded-full bg-[#34A87D] animate-pulse" />

        <div className="absolute bottom-[20%] right-[12%] h-2 w-2 rounded-full bg-[#176B4D] animate-bounce" />
      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_480px] lg:items-center">
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <section className="hidden lg:block">
            {/* Brand */}

            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#176B4D] shadow-lg shadow-black/20">
                <Home size={26} className="text-[#F1F8F4]" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  HomeHub
                </h1>

                <p className="text-sm text-[#A0B8AD]">
                  Property Discovery Platform
                </p>
              </div>
            </div>

            {/* Main heading */}

            <div className="max-w-xl">
              <p className="mb-4 inline-flex rounded-full border border-[#176B4D]/30 bg-[#176B4D]/10 px-4 py-2 text-sm font-medium text-[#34A87D] backdrop-blur-sm">
                Buyer Portal
              </p>

              <h2 className="text-5xl font-bold leading-tight text-white">
                Find Your
                <span className="block text-[#34A87D]">Dream Home</span>
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-[#A0B8AD]">
                Search for properties, save your favourites, and connect directly with owners to find the perfect place.
              </p>
            </div>

            {/* Feature cards */}

            <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
              <FeatureCard title="Search" description="Properties" />

              <FeatureCard title="Track" description="Favourites" />

              <FeatureCard title="Contact" description="Owners" />
            </div>
          </section>

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <section className="relative">
            {/* Card glow */}

            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-[#176B4D]/40 via-[#103D2E]/20 to-[#176B4D]/20 blur-xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-[#F1F8F4]/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              {/* Top accent */}

              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#103D2E] via-[#34A87D] to-[#103D2E]" />

              {/* Mobile Brand */}

              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#176B4D]">
                    <Home size={23} className="text-[#F1F8F4]" />
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold text-[#14231C]">
                      HomeHub
                    </h1>

                    <p className="text-xs text-[#61737A]">Buyer Portal</p>
                  </div>
                </div>
              </div>

              {/* Heading */}

              <div className="mb-8">
                <div className="mb-3 inline-flex items-center rounded-full bg-[#176B4D]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#176B4D]">
                  Buyer Access
                </div>

                <h2 className="text-3xl font-bold text-[#14231C]">
                  Buyer Login
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#68716B]">
                  Login to search properties and manage your favourites.
                </p>
              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="buyer-email"
                    className="mb-2 block text-sm font-semibold text-[#18352A]"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#737A75]"
                    />

                    <input
                      id="buyer-email"
                      type="email"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                      className="w-full rounded-2xl border border-[#D8E9DF] bg-white px-12 py-3.5 text-[#14231C] outline-none transition duration-200 placeholder:text-[#929791] hover:border-[#176B4D]/40 focus:border-[#176B4D] focus:ring-4 focus:ring-[#176B4D]/10"
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div>
                  <label
                    htmlFor="buyer-password"
                    className="mb-2 block text-sm font-semibold text-[#18352A]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#737A75]"
                    />

                    <input
                      id="buyer-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-2xl border border-[#D8E9DF] bg-white px-12 py-3.5 pr-12 text-[#14231C] outline-none transition duration-200 placeholder:text-[#929791] hover:border-[#176B4D]/40 focus:border-[#176B4D] focus:ring-4 focus:ring-[#176B4D]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#737A75] transition hover:bg-[#E4F1EA] hover:text-[#176B4D]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* REMEMBER / FORGOT */}

                <div className="flex items-center justify-between text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-[#68716B]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#C8DFD4] accent-[#176B4D]"
                    />
                    Remember me
                  </label>

                  <Link
                    href="/forgot-password?role=buyer"
                    className="font-semibold text-[#176B4D] transition hover:text-[#103D2E]"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#176B4D] px-5 py-4 font-semibold text-white shadow-lg shadow-[#176B4D]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#103D2E] hover:shadow-xl hover:shadow-[#176B4D]/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{loading ? "Signing In..." : "Go to Dashboard"}</span>

                  <ArrowRight
                    size={19}
                    className="transition duration-300 group-hover:translate-x-1"
                  />
                </button>
              </form>

              {/* REGISTER */}

              <div className="mt-7 text-center text-sm text-[#68716B]">
                Don't have a buyer account?
                <Link
                  href="/user/register"
                  className="ml-1 font-semibold text-[#176B4D] transition hover:text-[#103D2E] hover:underline"
                >
                  Create an account
                </Link>
              </div>

              {/* DIVIDER */}

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#D8E9DF]" />

                <span className="text-xs font-medium uppercase tracking-widest text-[#929791]">
                  or
                </span>

                <div className="h-px flex-1 bg-[#D8E9DF]" />
              </div>

              {/* SELLER LOGIN */}

              <Link
                href="/login"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-[#C8DFD4] bg-white px-5 py-3.5 font-semibold text-[#18352A] transition duration-300 hover:-translate-y-0.5 hover:border-[#176B4D] hover:bg-[#F1F8F4]"
              >
                Login as Seller
                <ArrowRight
                  size={17}
                  className="transition duration-300 group-hover:translate-x-1"
                />
              </Link>

              {/* Small footer */}

              <p className="mt-6 text-center text-xs leading-5 text-[#929791]">
                Secure buyer access for searching properties and contacting owners.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

// =====================================================
// FEATURE CARD
// =====================================================

function FeatureCard({ title, description }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#34A87D]/30 hover:bg-white/10">
      <div className="mb-3 h-1.5 w-10 rounded-full bg-[#34A87D] transition-all duration-300 group-hover:w-14" />

      <h3 className="font-semibold text-white">{title}</h3>

      <p className="mt-1 text-sm text-[#A0B8AD]">{description}</p>
    </div>
  );
}
