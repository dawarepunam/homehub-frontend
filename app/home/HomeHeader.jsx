"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, Moon, House, Building2, Warehouse, ChevronDown, ArrowRight, Heart, Bell, User, Plus, Key, Map, Users, Sofa, Briefcase, Store, Sparkles, Rocket, Calendar, Hammer, Check, Compass, MapPin, Navigation, BookOpen, BarChart } from "lucide-react";
import styles from "./HomeHeader.module.css";
import RoleSelectionModal from "./RoleSelectionModal";
import { getPropertyNavCategories } from "@/services/property";
import { getStrapiMedia } from "@/utils/getStrapiMedia";

const PROPERTY_TYPE_MENUS = ["Residential", "Commercial", "Industrial"];

export default function HomeHeader({ header }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Track which mobile sections are expanded
  const [mobileSectionsOpen, setMobileSectionsOpen] = useState({});
  const [theme, setTheme] = useState("light");
  const [navCategories, setNavCategories] = useState({
    Residential: [],
    Commercial: [],
    Industrial: [],
  });

  // Ref-based timer for closing menu — avoids flicker on gap crossing
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
    }, 80); // 80ms grace period — fast enough to feel instant, long enough to bridge gap
  };

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

    useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
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

  useEffect(() => {
    getPropertyNavCategories().then(setNavCategories);
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 850) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const router = useRouter();
  const logoUrl = getStrapiMedia(header?.Logo);

  const strapiMenuItemsFiltered = (header?.MenuItems || []).filter((item) => {
    const title = item?.Title?.trim().toLowerCase();
    return title !== "buy" && title !== "rent" && title !== "commercial";
  });

  const actions = header?.HeaderActions || [];

  const handleLoginClick = (event) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    setShowRoleModal(true);
  };

  const handleRoleContinue = (role) => {
    setShowRoleModal(false);
  };

  const handleAnchorNavigation = (event, slug) => {
    if (!slug) return;
    const hashIndex = slug.indexOf("#");
    if (hashIndex === -1) { router.push(slug); return; }
    event.preventDefault();
    setActiveMenu(null);
    setMobileMenuOpen(false);
    const pagePath = slug.slice(0, hashIndex) || "/";
    const anchorId = slug.slice(hashIndex + 1);
    const scrollToAnchor = () => {
      const target = document.getElementById(anchorId);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
    const targetPath = pagePath.replace(/\/$/, "") || "/";
    if (currentPath === targetPath) {
      scrollToAnchor();
    } else {
      router.push(pagePath);
      setTimeout(scrollToAnchor, 400);
    }
  };

  const toggleMobileSection = (id) => {
    setMobileSectionsOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderAction = (action, isMobile) => {
    const actionTitle = action?.Title?.trim().toLowerCase();
    if (actionTitle === "saved" || actionTitle === "alerts") return null;
    const isLoginAction = action?.ActionType === "login";
    const isPostProperty = actionTitle === "post property";
    const btnClass = isMobile
      ? (action.IsHighlighted ? `${styles.drawerActionButton} ${styles.drawerHighlighted}` : styles.drawerActionButton)
      : (action.IsHighlighted ? `${styles.actionButton} ${styles.highlighted}` : styles.actionButton);

    if (isLoginAction) {
      return (
        <button key={action.id} type="button" onClick={handleLoginClick} className={btnClass}>
          <span className={styles.actionIcon}>{getIcon(action.Icon)}</span>
          <span>{action.Title || "Login / Sign Up"}</span>
        </button>
      );
    }
    if (isPostProperty) {
      return (
        <Link key={action.id} href="/post-property" onClick={() => isMobile && setMobileMenuOpen(false)} className={btnClass}>
          <span className={styles.actionIcon}>{getIcon(action.Icon || "plus")}</span>
          <span>{action.Title || "Post Property"}</span>
        </Link>
      );
    }
    return (
      <a key={action.id} href={action.Slug || "#"} onClick={() => isMobile && setMobileMenuOpen(false)} className={btnClass}>
        <span className={styles.actionIcon}>{getIcon(action.Icon)}</span>
        <span>{action.Title}</span>
      </a>
    );
  };

  return (
    <>
      <header className={styles.homeHeader}>
        <div className={styles.headerInner}>

          {/* BRAND */}
          <div className={styles.brandSection}>
            {logoUrl ? (
              <img src={logoUrl} alt={header?.Brand || "HomeHub"} className={styles.brandLogo} />
            ) : (
              <div className={styles.brandMark}>H</div>
            )}
            <div className={styles.brandText}>
              <div className={styles.brandName}>{header?.Brand || "HomeHub"}</div>
              <div className={styles.brandTagline}>{header?.Tagline || "Find. Connect. Home."}</div>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className={styles.mainNavigation}>
            {PROPERTY_TYPE_MENUS.map((propertyType) => {
              const categories = navCategories[propertyType] || [];
              const menuId = `prop-type-${propertyType}`;
              return (
                <div
                  key={menuId}
                  className={styles.navItemWrapper}
                  onMouseEnter={() => openMenu(menuId)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    className={`${styles.navItem} ${activeMenu === menuId ? styles.navItemActive : ""}`}
                    aria-expanded={activeMenu === menuId}
                    aria-haspopup="true"
                  >
                    <span className={styles.navIcon}>
                      {propertyType === "Residential" ? <House size={14} strokeWidth={2} /> : propertyType === "Commercial" ? <Building2 size={14} strokeWidth={2} /> : <Warehouse size={14} strokeWidth={2} />}
                    </span>
                    <span>{propertyType}</span>
                    <ChevronDown size={12} strokeWidth={2} className={`${styles.dropdownArrow} ${activeMenu === menuId ? styles.dropdownArrowOpen : ""}`} />
                  </button>

                  {/* The mega menu uses onMouseEnter/onMouseLeave to cancel/re-schedule close */}
                  {activeMenu === menuId && (
                    <div
                      className={styles.megaMenu}
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    >
                      <div className={styles.megaMenuPanel}>
                        <div className={styles.megaMenuCategory}>
                          <div className={styles.categoryHeader}>
                            {propertyType === "Residential" ? <House size={18} /> : propertyType === "Commercial" ? <Building2 size={18} /> : <Warehouse size={18} />}
                            <span>{propertyType} PROPERTIES</span>
                          </div>
                          <div className={styles.categoryGrid}>
                            {categories.length > 0 ? categories.map((cat) => (
                              <Link
                                key={cat}
                                href={`/search?type=${encodeURIComponent(propertyType)}&category=${encodeURIComponent(cat)}`}
                                className={styles.dropdownItem}
                                onClick={() => setActiveMenu(null)}
                              >
                                <div className={styles.itemIcon}>
                                  {propertyType === "Residential" ? <House size={16} /> : propertyType === "Commercial" ? <Building2 size={16} /> : <Warehouse size={16} />}
                                </div>
                                <div className={styles.itemContent}>
                                  <div className={styles.itemTitle}>{cat}</div>
                                  <div className={styles.itemDescription}>Browse {cat} {propertyType.toLowerCase()} properties</div>
                                </div>
                                <ArrowRight size={12} className={styles.itemArrow} />
                              </Link>
                            )) : (
                              <Link
                                href={`/search?type=${encodeURIComponent(propertyType)}`}
                                className={styles.dropdownItem}
                                onClick={() => setActiveMenu(null)}
                              >
                                <div className={styles.itemIcon}>
                                  {propertyType === "Residential" ? <House size={16} /> : propertyType === "Commercial" ? <Building2 size={16} /> : <Warehouse size={16} />}
                                </div>
                                <div className={styles.itemContent}>
                                  <div className={styles.itemTitle}>All {propertyType}</div>
                                  <div className={styles.itemDescription}>Browse all {propertyType.toLowerCase()} properties</div>
                                </div>
                                <ArrowRight size={12} className={styles.itemArrow} />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {strapiMenuItemsFiltered.map((item) => (
              <div
                key={item.id}
                className={styles.navItemWrapper}
                onMouseEnter={() => { if (item.HasDropdown) openMenu(item.id); }}
                onMouseLeave={() => { if (item.HasDropdown) scheduleClose(); }}
              >
                <button
                  type="button"
                  className={`${styles.navItem} ${activeMenu === item.id ? styles.navItemActive : ""}`}
                  aria-expanded={item.HasDropdown ? activeMenu === item.id : undefined}
                  aria-haspopup={item.HasDropdown ? "true" : undefined}
                >
                  <span className={styles.navIcon}>{getIcon(item.Icon)}</span>
                  <span>{item.Title?.trim()}</span>
                  {item.HasDropdown && (
                    <ChevronDown size={12} strokeWidth={2} className={`${styles.dropdownArrow} ${activeMenu === item.id ? styles.dropdownArrowOpen : ""}`} />
                  )}
                </button>

                {item.HasDropdown && activeMenu === item.id && (
                  <div
                    className={styles.megaMenu}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <div className={styles.megaMenuPanel}>
                      <div className={styles.megaMenuCategory}>
                        <div className={styles.categoryHeader}>
                          {getIcon(item.Icon)}
                          <span>{item.Title?.trim()}</span>
                        </div>
                        <div className={styles.categoryGrid}>
                          {item.DropdownItems?.map((dropdown) => {
                            const slug = dropdown.Slug?.trim() || "";
                            const isAnchorSlug = slug.includes("#");
                            const innerContent = (
                              <>
                                <div className={styles.itemIcon}>{getIcon(dropdown.Icon)}</div>
                                <div className={styles.itemContent}>
                                  <div className={styles.itemTitle}>{dropdown.Title?.trim()}</div>
                                  {dropdown.Description && <div className={styles.itemDescription}>{dropdown.Description}</div>}
                                </div>
                                <ArrowRight size={12} className={styles.itemArrow} />
                              </>
                            );
                            
                            if (isAnchorSlug) {
                              return (
                                <button
                                  key={dropdown.id}
                                  type="button"
                                  onClick={(e) => { handleAnchorNavigation(e, slug); setActiveMenu(null); }}
                                  className={styles.dropdownItem}
                                >
                                  {innerContent}
                                </button>
                              );
                            }
                            const finalSlug = slug === "/explore/locality-insights" ? "/locality-insights" : slug;
                            return (
                              <Link
                                href={finalSlug || "#"}
                                key={dropdown.id}
                                className={styles.dropdownItem}
                                onClick={() => setActiveMenu(null)}
                              >
                                {innerContent}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className={styles.headerActions}>
            {actions.map((action) => renderAction(action, false))}

          {/* THEME TOGGLE (DESKTOP) */}
          <button type="button" onClick={toggleTheme} className={styles.themeToggleBtn} aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          </div>

          {/* HAMBURGER (mobile only) */}
          <button
            type="button"
            className={styles.hamburger}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <span className={`${styles.hamburgerBar} ${mobileMenuOpen ? styles.hbTop : ""}`} />
            <span className={`${styles.hamburgerBar} ${mobileMenuOpen ? styles.hbMid : ""}`} />
            <span className={`${styles.hamburgerBar} ${mobileMenuOpen ? styles.hbBot : ""}`} />
          </button>

        </div>
      </header>

      {/* MOBILE BACKDROP */}
      {mobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
      )}

      {/* MOBILE DRAWER */}
      <div className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.mobileDrawerOpen : ""}`} aria-hidden={!mobileMenuOpen}>

        {/* Drawer brand */}
        <div className={styles.drawerHeader}>
          <div className={styles.drawerBrand}>
            {logoUrl ? (
              <img src={logoUrl} alt={header?.Brand || "HomeHub"} className={styles.drawerLogo} />
            ) : (
              <div className={styles.drawerLogoMark}>H</div>
            )}
            <span className={styles.drawerBrandName}>{header?.Brand || "HomeHub"}</span>
          </div>
          <button type="button" className={styles.drawerClose} aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}>
            ✕
          </button>
        </div>

        {/* Drawer nav — tap to expand sections */}
        <nav className={styles.drawerNav}>
          {PROPERTY_TYPE_MENUS.map((propertyType) => {
            const categories = navCategories[propertyType] || [];
            const isOpen = !!mobileSectionsOpen[propertyType];
            return (
              <div key={propertyType} className={styles.drawerSection}>
                <button
                  type="button"
                  className={styles.drawerSectionLabel}
                  onClick={() => toggleMobileSection(propertyType)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.drawerSectionIcon}>
                    {propertyType === "Residential" ? "⌂" : propertyType === "Commercial" ? "▣" : "▥"}
                  </span>
                  <span>{propertyType}</span>
                  <ChevronDown size={12} strokeWidth={2} className={`${styles.drawerChevron} ${isOpen ? styles.drawerChevronOpen : ""}`} />
                </button>
                {isOpen && (
                  <div className={styles.drawerLinks}>
                    {categories.length > 0 ? categories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/search?type=${encodeURIComponent(propertyType)}&category=${encodeURIComponent(cat)}`}
                        className={styles.drawerLink}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {cat}<span className={styles.drawerLinkArrow}><ArrowRight size={11} /></span>
                      </Link>
                    )) : (
                      <Link
                        href={`/search?type=${encodeURIComponent(propertyType)}`}
                        className={styles.drawerLink}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Browse {propertyType}<span className={styles.drawerLinkArrow}><ArrowRight size={11} /></span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {strapiMenuItemsFiltered.map((item) => {
            const isOpen = !!mobileSectionsOpen[item.id];
            return (
              <div key={item.id} className={styles.drawerSection}>
                <button
                  type="button"
                  className={styles.drawerSectionLabel}
                  onClick={() => item.HasDropdown ? toggleMobileSection(item.id) : null}
                  aria-expanded={item.HasDropdown ? isOpen : undefined}
                >
                  <span className={styles.drawerSectionIcon}>{getIcon(item.Icon)}</span>
                  <span>{item.Title?.trim()}</span>
                  {item.HasDropdown && (
                    <ChevronDown size={12} strokeWidth={2} className={`${styles.drawerChevron} ${isOpen ? styles.drawerChevronOpen : ""}`} />
                  )}
                </button>
                {item.HasDropdown && isOpen && (
                  <div className={styles.drawerLinks}>
                    {item.DropdownItems?.length > 0
                      ? item.DropdownItems.map((dropdown) => {
                          const slug = dropdown.Slug?.trim() || "#";
                          if (slug.includes("#")) {
                            return (
                              <button key={dropdown.id} type="button" className={styles.drawerLink} onClick={(e) => handleAnchorNavigation(e, slug)}>
                                {dropdown.Title?.trim()}<span className={styles.drawerLinkArrow}><ArrowRight size={11} /></span>
                              </button>
                            );
                          }
                          const finalSlug = slug === "/explore/locality-insights" ? "/locality-insights" : slug;
                          return (
                            <Link key={dropdown.id} href={finalSlug} className={styles.drawerLink} onClick={() => setMobileMenuOpen(false)}>
                              {dropdown.Title?.trim()}<span className={styles.drawerLinkArrow}><ArrowRight size={11} /></span>
                            </Link>
                          );
                        })
                      : (
                        <Link href={item.Slug || "#"} className={styles.drawerLink} onClick={() => setMobileMenuOpen(false)}>
                          {item.Title?.trim()}<span className={styles.drawerLinkArrow}><ArrowRight size={11} /></span>
                        </Link>
                      )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Drawer actions */}
        <div className={styles.drawerActions}>

        {/* THEME TOGGLE (MOBILE) */}
        <div className={styles.mobileThemeWrapper}>
          <button type="button" onClick={toggleTheme} className={styles.drawerActionButton}>
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>

          {actions.map((action) => renderAction(action, true))}
        </div>

      </div>

      {/* ROLE SELECTION MODAL */}
      {showRoleModal && (
        <RoleSelectionModal
          onClose={() => setShowRoleModal(false)}
          onContinue={handleRoleContinue}
        />
      )}
    </>
  );
}

function getIcon(icon) {
  const icons = {
    heart: <Heart size={16} />,
    bell: <Bell size={16} />,
    user: <User size={16} />,
    plus: <Plus size={16} />,
    house: <House size={16} />,
    home: <House size={16} />,
    key: <Key size={16} />,
    building: <Building2 size={16} />,
    map: <Map size={16} />,
    users: <Users size={16} />,
    sofa: <Sofa size={16} />,
    briefcase: <Briefcase size={16} />,
    store: <Store size={16} />,
    warehouse: <Warehouse size={16} />,
    sparkles: <Sparkles size={16} />,
    rocket: <Rocket size={16} />,
    calendar: <Calendar size={16} />,
    construction: <Hammer size={16} />,
    check: <Check size={16} />,
    compass: <Compass size={16} />,
    "map-pin": <MapPin size={16} />,
    navigation: <Navigation size={16} />,
    "book-open": <BookOpen size={16} />,
    chart: <BarChart size={16} />
  };
  return icons[icon] || <House size={16} />;
}
