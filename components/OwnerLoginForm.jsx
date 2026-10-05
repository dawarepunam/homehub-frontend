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
} from "lucide-react";

import { loginOwner } from "@/services/ownerAuth";

export default function OwnerLoginForm() {
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
  // OWNER LOGIN
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

      const result = await loginOwner({
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      // -----------------------------------------------
      // CHECK RESPONSE
      // -----------------------------------------------

      if (!result?.jwt || !result?.user) {
        throw new Error("Owner login response is invalid.");
      }

      // -----------------------------------------------
      // SAVE LOGIN DATA
      // -----------------------------------------------

      localStorage.setItem("token", result.jwt);

      localStorage.setItem("user", JSON.stringify(result.user));

      localStorage.setItem("userRole", "Owner");

      localStorage.setItem("activeMode", "seller");

      console.log("OWNER LOGIN USER:", result.user);

      // -----------------------------------------------
      // SUCCESS POPUP
      // -----------------------------------------------

      toast.success(`🎉 Welcome back, ${result.user.username || "Owner"}!`, {
        duration: 2000,
      });

      // Clear form
      setFormData({
        identifier: "",
        password: "",
      });

      // -----------------------------------------------
      // REDIRECT
      // app/page.jsx = "/"
      // -----------------------------------------------

      setTimeout(() => {
        const pendingRedirect = localStorage.getItem("pendingActionRedirect");
        if (pendingRedirect) {
          localStorage.removeItem("pendingActionRedirect");
          router.replace(pendingRedirect);
        } else {
          router.replace("/owner/properties");
        }
      }, 1500);
    } catch (error) {
      console.error("OWNER LOGIN ERROR:", error);

      toast.error(error?.message || "Owner login failed.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#073B4C]">
      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Mustard glow */}

        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D9A441]/20 blur-3xl animate-pulse" />

        {/* Teal glow */}

        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#1F7A8C]/30 blur-3xl animate-pulse" />

        {/* Decorative diagonal shape */}

        <div className="absolute -right-20 top-20 h-72 w-72 rotate-12 rounded-[5rem] border border-[#D9A441]/20 bg-[#D9A441]/10" />

        {/* Small floating dots */}

        <div className="absolute left-[8%] top-[18%] h-2 w-2 rounded-full bg-[#D9A441] animate-bounce" />

        <div className="absolute left-[12%] top-[24%] h-1.5 w-1.5 rounded-full bg-[#F2D096] animate-pulse" />

        <div className="absolute bottom-[20%] right-[12%] h-2 w-2 rounded-full bg-[#D9A441] animate-bounce" />
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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9A441] shadow-lg shadow-black/20">
                <Building2 size={26} className="text-[#073B4C]" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  HomeHub
                </h1>

                <p className="text-sm text-[#D7E5E9]">
                  Property Management Platform
                </p>
              </div>
            </div>

            {/* Main heading */}

            <div className="max-w-xl">
              <p className="mb-4 inline-flex rounded-full border border-[#D9A441]/30 bg-[#D9A441]/10 px-4 py-2 text-sm font-medium text-[#F2D096] backdrop-blur-sm">
                Owner Portal
              </p>

              <h2 className="text-5xl font-bold leading-tight text-white">
                Building Better
                <span className="block text-[#D9A441]">Tomorrow</span>
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-[#D7E5E9]">
                Manage your properties, track enquiries, and grow your
                real-estate business from one professional workspace.
              </p>
            </div>

            {/* Feature cards */}

            <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
              <FeatureCard title="Manage" description="Properties" />

              <FeatureCard title="Monitor" description="Enquiries" />

              <FeatureCard title="Grow" description="Business" />
            </div>
          </section>

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <section className="relative">
            {/* Card glow */}

            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-[#D9A441]/40 via-[#1F7A8C]/20 to-[#D9A441]/20 blur-xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-[#F7F3EA]/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              {/* Top accent */}

              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#1F7A8C] via-[#D9A441] to-[#1F7A8C]" />

              {/* Mobile Brand */}

              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9A441]">
                    <Building2 size={23} className="text-[#073B4C]" />
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold text-[#073B4C]">
                      HomeHub
                    </h1>

                    <p className="text-xs text-[#61737A]">Owner Portal</p>
                  </div>
                </div>
              </div>

              {/* Heading */}

              <div className="mb-8">
                <div className="mb-3 inline-flex items-center rounded-full bg-[#1F7A8C]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1F7A8C]">
                  Seller Access
                </div>

                <h2 className="text-3xl font-bold text-[#16313A]">
                  Seller Login
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#66767B]">
                  Login to manage your properties and enquiries.
                </p>
              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="owner-email"
                    className="mb-2 block text-sm font-semibold text-[#28434B]"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7D8D92]"
                    />

                    <input
                      id="owner-email"
                      type="email"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                      className="w-full rounded-2xl border border-[#C8D4D7] bg-white px-12 py-3.5 text-[#16313A] outline-none transition duration-200 placeholder:text-[#99A5A8] hover:border-[#9DAFB4] focus:border-[#1F7A8C] focus:ring-4 focus:ring-[#1F7A8C]/10"
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div>
                  <label
                    htmlFor="owner-password"
                    className="mb-2 block text-sm font-semibold text-[#28434B]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7D8D92]"
                    />

                    <input
                      id="owner-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-2xl border border-[#C8D4D7] bg-white px-12 py-3.5 pr-12 text-[#16313A] outline-none transition duration-200 placeholder:text-[#99A5A8] hover:border-[#9DAFB4] focus:border-[#1F7A8C] focus:ring-4 focus:ring-[#1F7A8C]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#7D8D92] transition hover:bg-[#EEF3F4] hover:text-[#1F7A8C]"
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
                  <label className="flex cursor-pointer items-center gap-2 text-[#61737A]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#B8C6CA] accent-[#1F7A8C]"
                    />
                    Remember me
                  </label>

                  <Link
                    href="/forgot-password?role=seller"
                    className="font-semibold text-[#D08F18] transition hover:text-[#B6750A]"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0F6678] px-5 py-4 font-semibold text-white shadow-lg shadow-[#0F6678]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#0B5868] hover:shadow-xl hover:shadow-[#0F6678]/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{loading ? "Signing In..." : "Go to Dashboard"}</span>

                  <ArrowRight
                    size={19}
                    className="transition duration-300 group-hover:translate-x-1"
                  />
                </button>
              </form>

              {/* REGISTER */}

              <div className="mt-7 text-center text-sm text-[#61737A]">
                Don't have a seller account?
                <Link
                  href="/register"
                  className="ml-1 font-semibold text-[#D08F18] transition hover:text-[#B6750A] hover:underline"
                >
                  Become a seller
                </Link>
              </div>

              {/* DIVIDER */}

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#D7E0E2]" />

                <span className="text-xs font-medium uppercase tracking-widest text-[#8A979B]">
                  or
                </span>

                <div className="h-px flex-1 bg-[#D7E0E2]" />
              </div>

              {/* USER LOGIN */}

              <Link
                href="/user/login"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-[#C7D3D6] bg-white px-5 py-3.5 font-semibold text-[#28505A] transition duration-300 hover:-translate-y-0.5 hover:border-[#1F7A8C] hover:bg-[#F5FAFB]"
              >
                Login as Buyer
                <ArrowRight
                  size={17}
                  className="transition duration-300 group-hover:translate-x-1"
                />
              </Link>

              {/* Small footer */}

              <p className="mt-6 text-center text-xs leading-5 text-[#8A979B]">
                Secure owner access for managing properties and enquiries.
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
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#D9A441]/30 hover:bg-white/10">
      <div className="mb-3 h-1.5 w-10 rounded-full bg-[#D9A441] transition-all duration-300 group-hover:w-14" />

      <h3 className="font-semibold text-white">{title}</h3>

      <p className="mt-1 text-sm text-[#C5D8DC]">{description}</p>
    </div>
  );
}
