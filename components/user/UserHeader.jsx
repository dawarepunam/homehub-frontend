"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  MapPin,
  ArrowLeftRight,
  Check,
  Home,
  LogOut,
  Heart,
  MessageSquare,
  Sun,
  Moon,
  ChevronDown,
  Building2,
  Compass,
} from "lucide-react";

import ProfileDropdown from "./ProfileDropdown";
import UserDropdown from "./UserDropdown";
import ExploreDropdown from "./ExploreDropdown";
import UserNotificationBell from "./UserNotificationBell";
import styles from "./UserHeader.module.css";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

export default function UserHeader({ headerData }) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(null);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [theme, setTheme] = useState("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeTimer = useRef(null);

  const openMenu = (id) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveMenu(id);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => {
      setActiveMenu(null);
    }, 100);
  };

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  // Sync theme
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Mode Switcher state
  const [activeMode, setActiveMode] = useState("buyer");
  const [modeSwitcherOpen, setModeSwitcherOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function loadUser() {
      try {
        const savedUser = window.localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("User Parse Error:", error);
      }
    }

    loadUser();

    window.addEventListener("userProfileUpdated", loadUser);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") loadUser();
    });
    return () => {
      window.removeEventListener("userProfileUpdated", loadUser);
      document.removeEventListener("visibilitychange", loadUser);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("activeMode");
    if (saved === "seller" || saved === "buyer") {
      setActiveMode(saved);
    } else {
      setActiveMode("buyer");
      localStorage.setItem("activeMode", "buyer");
    }
  }, []);

  function handleModeSwitch(mode) {
    if (mode === activeMode) {
      setModeSwitcherOpen(false);
      return;
    }
    localStorage.setItem("activeMode", mode);
    setActiveMode(mode);
    setModeSwitcherOpen(false);
    if (mode === "seller") {
      router.push("/owner");
    }
  }

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("activeMode");
    }
    setUser(null);
    router.replace("/user/login");
  }

  const logo = headerData?.Logo?.url
    ? `${STRAPI_URL}${headerData.Logo.url}`
    : null;

  const brandName = headerData?.Brand || "HomeHub";

  const menu = (headerData?.MenuItem || [])
    .filter(Boolean)
    .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0))
    .map((item) => ({
      ...item,
      DropdownItem: (item.DropdownItem || [])
        .filter(
          (dropdown) =>
            dropdown && dropdown.IsActive && dropdown.Text && dropdown.Slug
        )
        .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0)),
    }));

  return (
    <>
      <header className={styles.headerWrapper}>
        <div className={styles.pillContainer}>
          <div className={styles.pillInner}>
            {/* BRAND */}
            <Link href="/user" className={styles.brand}>
              {logo ? (
                <Image
                  src={logo}
                  alt={brandName}
                  width={34}
                  height={34}
                  className={styles.brandLogo}
                  unoptimized
                />
              ) : (
                <div className={styles.brandMark}>H</div>
              )}
              <div className={styles.brandTextGroup}>
                <span className={styles.brandName}>{brandName}</span>
                <span className={styles.brandBadge}>Buyer</span>
              </div>
            </Link>

            {/* DESKTOP CAPSULE NAVIGATION */}
            <nav className={styles.nav} aria-label="Buyer Navigation">
              {menu.map((item) => {
                const isOpen = activeMenu === item.id;
                return (
                  <div
                    key={item.id || item.Slug}
                    className={styles.navItemWrapper}
                    onMouseEnter={() => {
                      if (item.HasDropdown) openMenu(item.id);
                    }}
                    onMouseLeave={() => {
                      if (item.HasDropdown) scheduleClose();
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenu(isOpen ? null : item.id)
                      }
                      className={`${styles.navButton} ${
                        isOpen ? styles.navButtonActive : ""
                      }`}
                      aria-expanded={item.HasDropdown ? isOpen : undefined}
                      aria-haspopup={item.HasDropdown ? "true" : undefined}
                    >
                      <span>{item.Title}</span>
                      {item.HasDropdown && (
                        <ChevronDown
                          size={13}
                          strokeWidth={2.2}
                          className={`${styles.dropdownArrow} ${
                            isOpen ? styles.dropdownArrowOpen : ""
                          }`}
                        />
                      )}
                    </button>

                    {item.HasDropdown && isOpen && (
                      <div
                        className={styles.dropdownPanelWrapper}
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                      >
                        <UserDropdown menuItem={item} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* EXPLORE DROPDOWN */}
              <div
                className={styles.navItemWrapper}
                onMouseEnter={() => openMenu("explore")}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveMenu(activeMenu === "explore" ? null : "explore")
                  }
                  className={`${styles.navButton} ${
                    activeMenu === "explore" ? styles.navButtonActive : ""
                  }`}
                  aria-expanded={activeMenu === "explore"}
                  aria-haspopup="true"
                >
                  <span>Explore</span>
                  <ChevronDown
                    size={13}
                    strokeWidth={2.2}
                    className={`${styles.dropdownArrow} ${
                      activeMenu === "explore" ? styles.dropdownArrowOpen : ""
                    }`}
                  />
                </button>

                {activeMenu === "explore" && (
                  <div
                    className={styles.dropdownPanelWrapper}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <ExploreDropdown />
                  </div>
                )}
              </div>
            </nav>

            {/* RIGHT ACTIONS */}
            <div className={styles.actions}>
              {/* SAVED */}
              <Link
                href="/user/wishlist"
                className={styles.actionPillBtn}
                title="Saved Properties"
              >
                <Heart size={14} />
                <span className="hidden xl:inline">Saved</span>
              </Link>

              {/* ENQUIRIES */}
              <Link
                href="/user/enquiries"
                className={styles.actionPillBtn}
                title="My Enquiries"
              >
                <MessageSquare size={14} />
                <span className="hidden xl:inline">Enquiries</span>
              </Link>

              {/* NOTIFICATIONS */}
              <UserNotificationBell />

              {/* MODE SWITCHER */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setModeSwitcherOpen((p) => !p)}
                  aria-label="Switch mode"
                  className={styles.actionPillBtn}
                >
                  <ArrowLeftRight size={13} />
                  <span className="hidden md:inline">
                    {activeMode === "buyer" ? "Buyer" : "Seller"}
                  </span>
                  <ChevronDown
                    size={11}
                    className={`transition-transform ${
                      modeSwitcherOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {modeSwitcherOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[190px] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl z-[1200] p-1.5">
                    <button
                      type="button"
                      onClick={() => handleModeSwitch("buyer")}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition ${
                        activeMode === "buyer"
                          ? "bg-[var(--accent)] text-[var(--accent-text)]"
                          : "text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                      }`}
                    >
                      <ArrowLeftRight size={13} />
                      <span className="flex-1 text-left">Buyer Mode</span>
                      {activeMode === "buyer" && <Check size={13} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleModeSwitch("seller")}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition ${
                        activeMode === "seller"
                          ? "bg-[var(--accent)] text-[var(--accent-text)]"
                          : "text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                      }`}
                    >
                      <Home size={13} />
                      <span className="flex-1 text-left">Seller Mode</span>
                      {activeMode === "seller" && <Check size={13} />}
                    </button>

                    {user && (
                      <div className="border-t border-[var(--border-subtle)] mt-1 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-red-500 transition hover:bg-red-500/10"
                        >
                          <LogOut size={13} />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* USER PROFILE OR LOGIN */}
              {user ? (
                <div
                  className="relative"
                  onMouseEnter={() => setShowProfileMenu(true)}
                  onMouseLeave={() => setShowProfileMenu(false)}
                >
                  <button
                    type="button"
                    onClick={() => router.push("/user/profile")}
                    className="flex items-center gap-2 cursor-pointer pl-1"
                  >
                    {(() => {
                      const firstName = user.firstName || "";
                      const lastName = user.lastName || "";
                      const fullName =
                        [firstName, lastName].filter(Boolean).join(" ") ||
                        user.username ||
                        "";
                      const displayInitial =
                        fullName.trim().charAt(0).toUpperCase() || "U";
                      return (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden text-xs font-bold shrink-0 bg-[var(--text-primary)] text-[var(--bg-page)]">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt="Profile"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextSibling.style.display =
                                  "flex";
                              }}
                            />
                          ) : null}
                          <span
                            className="flex items-center justify-center w-full h-full"
                            style={{
                              display: user.profileImage ? "none" : "flex",
                            }}
                          >
                            {displayInitial}
                          </span>
                        </div>
                      );
                    })()}
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 z-[99999]">
                      <ProfileDropdown
                        items={headerData?.ProfileMenu || []}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/user/login" className={styles.loginBtn}>
                  Login
                </Link>
              )}

              {/* THEME TOGGLE */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
                className={styles.iconBtn}
              >
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              {/* MOBILE HAMBURGER */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((p) => !p)}
                aria-label="Toggle navigation menu"
                className={styles.hamburgerBtn}
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 h-full w-[85vw] max-w-[340px] bg-[var(--bg-card)] border-l border-[var(--border-subtle)] p-6 flex flex-col gap-6 shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] font-bold text-sm">
                  H
                </div>
                <span className="font-extrabold text-base text-[var(--text-primary)]">
                  {brandName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation in Mobile */}
            <nav className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Categories
              </span>
              {menu.map((item) => (
                <div key={item.id} className="flex flex-col py-1">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {item.Title}
                  </span>
                  {item.DropdownItem?.length > 0 && (
                    <div className="flex flex-col pl-3 mt-1.5 gap-1.5 border-l border-[var(--border-subtle)]">
                      {item.DropdownItem.map((dropdown) => (
                        <Link
                          key={dropdown.id}
                          href={`/user/properties?type=${encodeURIComponent(
                            item.Slug
                          )}&purpose=${encodeURIComponent(dropdown.Slug)}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] py-0.5"
                        >
                          Browse {dropdown.Text}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Quick Actions
                </span>
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    href="/user/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-[var(--text-primary)] py-1.5"
                  >
                    <Heart size={15} /> Saved Properties
                  </Link>
                  <Link
                    href="/user/enquiries"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-[var(--text-primary)] py-1.5"
                  >
                    <MessageSquare size={15} /> My Enquiries
                  </Link>
                  <Link
                    href="/user/tools/emi-calculator"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-[var(--text-primary)] py-1.5"
                  >
                    <Compass size={15} /> EMI Calculator
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
