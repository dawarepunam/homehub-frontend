"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminFooter() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    router.replace("/admin/login");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0D3326] text-[#F6F0E5] border-t border-[#2E6654] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <Link href="/admin" className="flex items-center gap-3 group mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 p-2 transition-all group-hover:bg-white/20">
                <span className="text-xl font-bold text-[#D7AE62]">H</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-white leading-tight">
                  HomeHub
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#D7AE62]">
                  Administration
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-300 mt-4 leading-relaxed max-w-xs">
              Manage your HomeHub platform from one place.
            </p>
          </div>

          {/* Links: Platform */}
          <div>
            <h3 className="text-[#D7AE62] text-sm font-bold uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/admin" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/properties" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Properties
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Management */}
          <div>
            <h3 className="text-[#D7AE62] text-sm font-bold uppercase tracking-wider mb-4">
              Management
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/admin/users" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Users
                </Link>
              </li>
              <li>
                <Link href="/admin/enquiries" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Enquiries
                </Link>
              </li>
              <li>
                <Link href="/admin/subscriptions" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Account */}
          <div>
            <h3 className="text-[#D7AE62] text-sm font-bold uppercase tracking-wider mb-4">
              Account
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/admin/profile" className="text-sm text-gray-300 hover:text-white transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-300 hover:text-[#D7AE62] transition-colors text-left"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[#2E6654] flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} HomeHub Administration
          </p>
        </div>
      </div>
    </footer>
  );
}
