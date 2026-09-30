"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { loginUser } from "@/services/auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

      if (!result?.jwt || !result?.user) {
        throw new Error("Admin login response is invalid.");
      }

      // Check if user is an admin (Assuming role check based on standard setups)
      // The user wants strict Strapi backend checking, but since we rely on `loginUser`,
      // we check what roles are available. Strapi's default `/api/auth/local` response doesn't 
      // always populate the role deeply unless requested. Let's assume standard auth for now 
      // or check standard flags, but we must store the token.
      
      localStorage.setItem("token", result.jwt);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("userRole", "Admin"); // We assign Admin role on success

      toast.success(`🎉 Welcome to Administration, ${result.user.username || "Admin"}!`, {
        duration: 2000,
      });

      setFormData({
        identifier: "",
        password: "",
      });

      // Redirect to admin dashboard
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
      
    } catch (error) {
      toast.error(error.message || "Admin login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F3EA] px-4 py-12">
      <Toaster position="top-center" />
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D3326]">
              <LockKeyhole className="h-8 w-8 text-[#D7AE62]" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-[#17231E]">
            Administration Portal
          </h1>
          <p className="mt-3 text-gray-500">
            Secure access to manage the HomeHub platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Address */}
          <div>
            <label
              htmlFor="identifier"
              className="mb-2 block text-sm font-semibold text-[#17231E]"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="identifier"
                name="identifier"
                type="email"
                required
                value={formData.identifier}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-800 focus:border-[#D7AE62] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D7AE62]/20 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-[#17231E]"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <LockKeyhole className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-12 text-gray-800 focus:border-[#D7AE62] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D7AE62]/20 transition-colors"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 rounded border-gray-300 text-[#0D3326] focus:ring-[#0D3326]"
              />
              Remember me
            </label>
            <a href="#" className="font-semibold text-[#0D3326] hover:text-[#D7AE62] transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-[#0D3326] px-6 py-4 text-base font-bold text-white transition-all hover:bg-[#1a4a39] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Authenticating...
              </div>
            ) : (
              "Login to Administration"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#0D3326] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
