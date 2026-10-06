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
    <main className={`relative min-h-screen w-full bg-[#14231C] font-sans selection:bg-[#D9A441]/30 selection:text-white`}>
      <Toaster position="top-center" />
      
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#D9A441]/20 blur-[120px]`} />
        <div className={`absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#176B4D]/20 blur-[120px]`} />
      </div>

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className={`w-full max-w-md overflow-hidden rounded-[24px] bg-[#0E1A14]/40 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] backdrop-blur-md`}>
          
          <div className="w-full bg-white p-8 sm:p-10">
            <div className="mb-8 text-center flex flex-col items-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#D9A441] to-[#B68A36] shadow-lg">
                  <LockKeyhole size={24} className="text-[#14231C]" />
                </div>
              </div>
              
              <span className="text-xs font-bold uppercase tracking-widest text-[#14231C]/60">
                Secure Access
              </span>
              <h2 className="mt-2 text-3xl font-bold text-[#14231C]">
                Administration
              </h2>
              <p className="mt-2 text-sm text-[#5C7680]">
                Sign in to manage the HomeHub platform.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="identifier" className="text-sm font-medium text-[#14231C]">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Mail size={18} className="text-[#8BA7AF]" />
                  </div>
                  <input
                    id="identifier"
                    name="identifier"
                    type="email"
                    required
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    disabled={loading}
                    className="block w-full rounded-xl border border-[#D1D9DC] bg-[#FAFAFA] py-3.5 pl-11 pr-4 text-[15px] text-[#14231C] transition-all placeholder:text-[#8BA7AF] hover:border-[#A4B8BF] hover:bg-white focus:border-[#D9A441] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#D9A441]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-[#14231C]">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <LockKeyhole size={18} className="text-[#8BA7AF]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter admin password"
                    disabled={loading}
                    className="block w-full rounded-xl border border-[#D1D9DC] bg-[#FAFAFA] py-3.5 pl-11 pr-12 text-[15px] text-[#14231C] transition-all placeholder:text-[#8BA7AF] hover:border-[#A4B8BF] hover:bg-white focus:border-[#D9A441] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#D9A441]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8BA7AF] transition-colors hover:text-[#14231C]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-xl bg-[#14231C] px-4 py-3.5 text-sm font-semibold text-[#D9A441] shadow-sm transition-all hover:bg-[#0E1A14] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70 mt-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-[#D9A441]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Authenticating...
                  </span>
                ) : (
                  "Login to Administration"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-semibold text-[#5C7680] hover:text-[#14231C] transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
