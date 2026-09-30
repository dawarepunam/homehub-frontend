// "use client";

// import Link from "next/link";

// export default function RegisterForm() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

//         {/* Logo / Title */}
//         <div className="mb-8 text-center">
//           <h1 className="text-4xl font-bold text-blue-600">
//             HomeHub
//           </h1>

//           <h2 className="mt-4 text-3xl font-bold text-gray-900">
//             Create Account
//           </h2>

//           <p className="mt-2 text-gray-500">
//             Register to continue
//           </p>
//         </div>

//         <form className="space-y-5">

//           {/* Full Name */}
//           <div>
//             <label className="mb-2 block font-medium">
//               Full Name
//             </label>

//             <input
//               type="text"
//               placeholder="Enter your full name"
//               className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="mb-2 block font-medium">
//               Email
//             </label>

//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="mb-2 block font-medium">
//               Password
//             </label>

//             <input
//               type="password"
//               placeholder="Enter password"
//               className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
//             />
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="mb-2 block font-medium">
//               Confirm Password
//             </label>

//             <input
//               type="password"
//               placeholder="Confirm password"
//               className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
//             />
//           </div>

//           {/* Register Button */}
//           <button
//             type="submit"
//             className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
//           >
//             Register
//           </button>

//         </form>

//         {/* Login Link */}
//         <div className="mt-6 text-center text-gray-600">
//           Already have an account?{" "}
//           <Link
//             href="/user/login"
//             className="font-semibold text-blue-600 hover:underline"
//           >
//             Login
//           </Link>
//         </div>

//       </div>
//     </div>
//   );
// }




"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import { registerUser } from "@/services/auth";

export default function RegisterForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

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

      toast.success("🎉 Registration Successful!", {
        duration: 2000,
      });

      setTimeout(() => {
        router.push("/user/login");
      }, 2000);

    } catch (error) {
      toast.error(error.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        {/* Header */}
        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-blue-600">
            HomeHub
          </h1>

          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Create Account
          </h2>

          <p className="mt-2 text-gray-500">
            Register to continue
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Full Name */}
          <div>

            <label className="mb-2 block font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            />

          </div>

          {/* Email */}
          <div>

            <label className="mb-2 block font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            />

          </div>

          {/* Password */}
          <div>

            <label className="mb-2 block font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            />

          </div>

          {/* Confirm Password */}
          <div>

            <label className="mb-2 block font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            />

          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <div className="mt-6 text-center text-gray-600">

          Already have an account?{" "}

          <Link
            href="/user/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}