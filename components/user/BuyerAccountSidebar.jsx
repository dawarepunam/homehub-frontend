"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  UserRound,
  PenLine,
  House,
  Activity,
  Search,
  MessageSquare,
  Bell,
  Settings,
  ShieldCheck,
  LogOut,
  MapPin,
  ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";

import { getUserProfile } from "@/services/userProfile";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

function getMediaUrl(media) {
  if (!media) return null;
  const raw = Array.isArray(media) ? media[0] : media;
  const item = raw?.data || raw;
  const attrs = item?.attributes || item;
  const url = attrs?.formats?.large?.url || attrs?.formats?.medium?.url || attrs?.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

export default function BuyerAccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      let storedUser = null;
      if (typeof window !== "undefined") {
        try {
          storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
          storedUser = {};
        }
      }
      setUser(storedUser);
      
      const profileData = await getUserProfile();
      if (profileData) {
        setProfile(profileData);
      }
    } catch (err) {
      console.error("Failed to load profile for sidebar", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("jwt");
      localStorage.removeItem("strapi_jwt");
      localStorage.removeItem("user");
    }
    toast.success("Logged out successfully");
    router.push("/user/login");
  };

  const profileDetails = profile?.ProfileDetails || {};
  const username = user?.username || "";
  const firstName = profileDetails?.FirstName || "";
  const lastName = profileDetails?.LastName || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || username || "HomeHub Member";
  const initials = getInitials(fullName);
  
  const city = profileDetails?.City || "";
  const state = profileDetails?.State || "";
  const locationStr = [city, state].filter(Boolean).join(", ");
  const profileImageUrl = getMediaUrl(profileDetails?.ProfileImage);

  const sections = [
    {
      title: "PROFILE",
      items: [
        { name: "My Profile", href: "/user/profile", icon: UserRound },
        { name: "Edit Profile", href: "/user/profile/edit", icon: PenLine },
      ]
    },
    {
      title: "PROPERTY",
      items: [
        { name: "Property Requirement", href: "/user/profile/requirements", icon: House },
        { name: "My Activity", href: "/user/profile/activity", icon: Activity },
        { name: "Saved Searches", href: "/user/profile/saved-searches", icon: Search },
        { name: "Saved Messages", href: "/user/profile/saved-messages", icon: MessageSquare },
        { name: "Property Alerts", href: "/user/profile/property-alerts", icon: Bell },
      ]
    },
    {
      title: "SETTINGS",
      items: [
        { name: "Notifications", href: "/user/profile/notifications", icon: Settings },
        { name: "Account & Security", href: "/user/profile/security", icon: ShieldCheck },
      ]
    }
  ];

  // Helper to find the active section name for mobile dropdown
  let activeItemName = "My Profile";
  sections.forEach(section => {
    section.items.forEach(item => {
      if (pathname === item.href) activeItemName = item.name;
    });
  });

  return (
    <>
      {/* MOBILE DROPDOWN NAVIGATION */}
      <div className="lg:hidden mb-6">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">MY ACCOUNT</h2>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)]"
          >
            <span>{activeItemName}</span>
            <ChevronDown size={16} className={`text-[var(--text-secondary)] transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
          </button>
          
          {mobileMenuOpen && (
            <div className="mt-2 space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-2 shadow-lg">
              {sections.map((section, idx) => (
                <div key={idx} className="pb-2">
                  <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    {section.title}
                  </p>
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                          isActive 
                            ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]" 
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <Icon size={16} className={isActive ? "text-[var(--btn-primary-text)]" : "text-[var(--text-secondary)]"} />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              ))}
              <div className="border-t border-[var(--border-subtle)] pt-2">
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  ACCOUNT
                </p>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-red-500 transition-all hover:bg-red-500/10"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-28 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm overflow-hidden pb-4">
          
          <div className="px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
             <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">MY ACCOUNT</h2>
             
             {loading ? (
               <div className="animate-pulse flex items-center gap-4">
                 <div className="h-16 w-16 rounded-full bg-[var(--border-subtle)]" />
                 <div className="space-y-2">
                   <div className="h-4 w-24 bg-[var(--border-subtle)] rounded" />
                   <div className="h-3 w-16 bg-[var(--border-subtle)] rounded" />
                 </div>
               </div>
             ) : (
               <div className="flex items-center gap-4">
                 <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[var(--border-subtle)] bg-[var(--bg-page)]">
                   {profileImageUrl ? (
                     <img src={profileImageUrl} alt={fullName} className="h-full w-full object-cover" />
                   ) : (
                     <div className="flex h-full w-full items-center justify-center text-xl font-bold text-[var(--text-primary)]">
                       {initials}
                     </div>
                   )}
                 </div>
                 <div className="min-w-0">
                   <h3 className="truncate text-base font-bold text-[var(--text-primary)]" title={fullName}>
                     {fullName}
                   </h3>
                   <span className="mt-1 inline-block rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)]">
                     Buyer
                   </span>
                   {locationStr && (
                     <p className="mt-1.5 flex items-center gap-1.5 truncate text-xs font-medium text-[var(--text-secondary)]">
                       <MapPin size={11} className="shrink-0 text-[var(--text-secondary)]" />
                       <span className="truncate">{locationStr}</span>
                     </p>
                   )}
                 </div>
               </div>
             )}
          </div>

          <div className="px-4 py-4 space-y-6">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h4 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  {section.title}
                </h4>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                          isActive 
                            ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-sm" 
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <Icon size={16} className={isActive ? "text-[var(--btn-primary-text)]" : "text-[var(--text-secondary)]"} />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div>
              <h4 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                ACCOUNT
              </h4>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition-all hover:bg-red-500/10 hover:text-red-600"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}
