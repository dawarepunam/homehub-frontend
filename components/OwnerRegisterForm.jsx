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
    <main className="relative min-h-screen overflow-hidden bg-[#073B4C]">
      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Mustard glow */}

        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D9A441]/20 blur-3xl animate-pulse" />

        {/* Teal glow */}

        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#1F7A8C]/30 blur-3xl animate-pulse" />

        {/* Decorative shape */}

        <div className="absolute right-[-70px] top-24 h-72 w-72 rotate-12 rounded-[5rem] border border-[#D9A441]/20 bg-[#D9A441]/10" />

        {/* Floating dots */}

        <div className="absolute left-[8%] top-[18%] h-2 w-2 rounded-full bg-[#D9A441] animate-bounce" />

        <div className="absolute left-[12%] top-[25%] h-1.5 w-1.5 rounded-full bg-[#F2D096] animate-pulse" />

        <div className="absolute bottom-[20%] right-[12%] h-2 w-2 rounded-full bg-[#D9A441] animate-bounce" />
      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_500px] lg:items-center">
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
                Build Your
                <span className="block text-[#D9A441]">Property Business</span>
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-[#D7E5E9]">
                Create your owner account and manage properties, enquiries, and
                your real-estate business from one professional workspace.
              </p>
            </div>

            {/* Feature cards */}

            <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
              <FeatureCard title="List" description="Properties" />

              <FeatureCard title="Manage" description="Enquiries" />

              <FeatureCard title="Grow" description="Business" />
            </div>
          </section>

          {/* =================================================
              REGISTER CARD
          ================================================= */}

          <section className="relative">
            {/* Card glow */}

            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-[#D9A441]/40 via-[#1F7A8C]/20 to-[#D9A441]/20 blur-xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-[#F7F3EA]/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              {/* Top accent */}

              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#1F7A8C] via-[#D9A441] to-[#1F7A8C]" />

              {/* Mobile brand */}

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
                  Create Account
                </div>

                <h2 className="text-3xl font-bold text-[#16313A]">
                  Become an Owner
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#66767B]">
                  Create your account to list and manage properties on HomeHub.
                </p>
              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* FULL NAME */}

                <div>
                  <label
                    htmlFor="owner-name"
                    className="mb-2 block text-sm font-semibold text-[#28434B]"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7D8D92]"
                    />

                    <input
                      id="owner-name"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                      className="w-full rounded-2xl border border-[#C8D4D7] bg-white px-12 py-3.5 text-[#16313A] outline-none transition duration-200 placeholder:text-[#99A5A8] hover:border-[#9DAFB4] focus:border-[#1F7A8C] focus:ring-4 focus:ring-[#1F7A8C]/10"
                    />
                  </div>
                </div>

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
                      name="email"
                      value={formData.email}
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
                      placeholder="Create password"
                      autoComplete="new-password"
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

                {/* CONFIRM PASSWORD */}

                <div>
                  <label
                    htmlFor="owner-confirm-password"
                    className="mb-2 block text-sm font-semibold text-[#28434B]"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7D8D92]"
                    />

                    <input
                      id="owner-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      required
                      className="w-full rounded-2xl border border-[#C8D4D7] bg-white px-12 py-3.5 pr-12 text-[#16313A] outline-none transition duration-200 placeholder:text-[#99A5A8] hover:border-[#9DAFB4] focus:border-[#1F7A8C] focus:ring-4 focus:ring-[#1F7A8C]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#7D8D92] transition hover:bg-[#EEF3F4] hover:text-[#1F7A8C]"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* REGISTER BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0F6678] px-5 py-4 font-semibold text-white shadow-lg shadow-[#0F6678]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#0B5868] hover:shadow-xl hover:shadow-[#0F6678]/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>
                    {loading ? "Creating Account..." : "Create Owner Account"}
                  </span>

                  <ArrowRight
                    size={19}
                    className="transition duration-300 group-hover:translate-x-1"
                  />
                </button>
              </form>

              {/* LOGIN LINK */}

              <div className="mt-7 text-center text-sm text-[#61737A]">
                Already have an owner account?
                <Link
                  href="/login"
                  className="ml-1 font-semibold text-[#D08F18] transition hover:text-[#B6750A] hover:underline"
                >
                  Owner Login
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

              {/* USER REGISTER */}

              <Link
                href="/user/register"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-[#C7D3D6] bg-white px-5 py-3.5 font-semibold text-[#28505A] transition duration-300 hover:-translate-y-0.5 hover:border-[#1F7A8C] hover:bg-[#F5FAFB]"
              >
                Register as User
                <ArrowRight
                  size={17}
                  className="transition duration-300 group-hover:translate-x-1"
                />
              </Link>

              {/* FOOTER TEXT */}

              <p className="mt-6 text-center text-xs leading-5 text-[#8A979B]">
                Create your professional Owner account and start managing your
                properties.
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
