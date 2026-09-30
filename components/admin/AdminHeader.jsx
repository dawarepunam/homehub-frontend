"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch admin details from local storage
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.username || user.name) {
          setAdminName(user.username || user.name);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from local storage", error);
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    router.replace("/admin/login");
  };

  const navLinks = [
    { name: "Dashboard", href: "/admin" },
    { 
      name: "Users", 
      href: "/admin/users", 
      hasDropdown: true,
      dropdownItems: [
        { name: "All Users", href: "/admin/users" },
        { name: "Buyers", href: "/admin/users/buyers" },
        { name: "Sellers", href: "/admin/users/sellers" },
      ]
    },
    { 
      name: "Properties", 
      href: "/admin/properties", 
      hasDropdown: true,
      dropdownItems: [
        { name: "All Properties", href: "/admin/properties" },
        { name: "Pending", href: "/admin/properties/pending" },
        { name: "Active", href: "/admin/properties/active" },
      ]
    },
    { name: "Enquiries", href: "/admin/enquiries" },
    { name: "Site Visits", href: "#" },
    { name: "Subscriptions", href: "/admin/subscriptions" },
    { name: "More", href: "#", hasDropdown: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2E6654] bg-gradient-to-r from-[#0A372C] to-[#0D3326]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 p-2 backdrop-blur-md transition-all group-hover:bg-white/20">
                <span className="text-2xl font-bold text-[#D7AE62]">H</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white leading-tight">
                  HomeHub
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D7AE62]">
                  Administration
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:ml-10 md:flex md:space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.hasDropdown ? (
                  <>
                    <button
                      className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                        pathname.startsWith(link.href) && link.href !== "#"
                          ? "bg-white/10 text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link.name}
                      <ChevronDown className="h-4 w-4 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                    {link.dropdownItems && (
                      <div className="absolute left-0 mt-2 w-48 origin-top-left rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden border border-gray-100">
                        <div className="py-1">
                          {link.dropdownItems.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0D3326] font-medium"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      pathname === link.href
                        ? "bg-white/10 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D7AE62] opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#D7AE62]"></span>
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D7AE62] text-xs font-bold text-[#0D3326]">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block">{adminName}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{adminName}</p>
                    <p className="text-xs text-gray-500 truncate">Administrator</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/admin/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="mr-3 h-4 w-4 text-gray-400" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-red-500" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
