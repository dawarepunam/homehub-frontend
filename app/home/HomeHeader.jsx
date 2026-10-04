"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./HomeHeader.module.css";
import RoleSelectionModal from "./RoleSelectionModal";
import { getPropertyNavCategories } from "@/services/property";
import { getStrapiMedia } from "@/utils/getStrapiMedia";

const PROPERTY_TYPE_MENUS = ["Residential", "Commercial", "Industrial"];

export default function HomeHeader({ header }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navCategories, setNavCategories] = useState({
    Residential: [],
    Commercial: [],
    Industrial: [],
  });

  useEffect(() => {
    getPropertyNavCategories().then(setNavCategories);
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
    console.log("Selected HomeHub Role:", role);
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
                <div key={menuId} className={styles.navItemWrapper}
                  onMouseEnter={() => setActiveMenu(menuId)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button type="button" className={styles.navItem} aria-expanded={activeMenu === menuId}>
                    <span className={styles.navIcon}>
                      {propertyType === "Residential" ? "⌂" : propertyType === "Commercial" ? "▣" : "▥"}
                    </span>
                    <span>{propertyType}</span>
                    <span className={styles.dropdownArrow}>⌄</span>
                  </button>
                  {activeMenu === menuId && (
                    <div className={styles.megaMenu}>
                      <div className={styles.megaMenuHeader}>
                        <div>
                          <h3>{propertyType}</h3>
                          <p>Explore {propertyType.toLowerCase()} properties</p>
                        </div>
                        <span className={styles.megaMenuArrow}>→</span>
                      </div>
                      <div className={styles.dropdownGrid}>
                        {categories.length > 0 ? categories.map((cat) => (
                          <Link key={cat} href={`/search?type=${encodeURIComponent(propertyType)}&category=${encodeURIComponent(cat)}`} className={styles.dropdownCard}>
                            <div className={styles.dropdownIcon}>
                              {propertyType === "Residential" ? "⌂" : propertyType === "Commercial" ? "▣" : "▥"}
                            </div>
                            <div>
                              <div className={styles.dropdownTitle}>{cat}</div>
                              <div className={styles.dropdownDescription}>Browse {cat} {propertyType.toLowerCase()} properties</div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                          </Link>
                        )) : (
                          <div className={styles.dropdownCard}>
                            <div className={styles.dropdownTitle}>No categories available</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {strapiMenuItemsFiltered.map((item) => (
              <div key={item.id} className={styles.navItemWrapper}
                onMouseEnter={() => { if (item.HasDropdown) setActiveMenu(item.id); }}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button type="button" className={styles.navItem} aria-expanded={activeMenu === item.id}>
                  <span className={styles.navIcon}>{getIcon(item.Icon)}</span>
                  <span>{item.Title?.trim()}</span>
                  {item.HasDropdown && <span className={styles.dropdownArrow}>⌄</span>}
                </button>
                {item.HasDropdown && activeMenu === item.id && (
                  <div className={styles.megaMenu}>
                    <div className={styles.megaMenuHeader}>
                      <div>
                        <h3>{item.Title?.trim()}</h3>
                        <p>Explore {item.Title?.trim().toLowerCase()} properties</p>
                      </div>
                      <span className={styles.megaMenuArrow}>→</span>
                    </div>
                    <div className={styles.dropdownGrid}>
                      {item.DropdownItems?.map((dropdown) => {
                        const slug = dropdown.Slug?.trim() || "";
                        const isAnchorSlug = slug.includes("#");
                        if (isAnchorSlug) {
                          return (
                            <button key={dropdown.id} type="button" onClick={(e) => handleAnchorNavigation(e, slug)} className={styles.dropdownCard}>
                              <div className={styles.dropdownIcon}>{getIcon(dropdown.Icon)}</div>
                              <div>
                                <div className={styles.dropdownTitle}>{dropdown.Title?.trim()}</div>
                                <div className={styles.dropdownDescription}>{dropdown.Description}</div>
                              </div>
                              <span className={styles.cardArrow}>→</span>
                            </button>
                          );
                        }
                        const finalSlug = slug === "/explore/locality-insights" ? "/locality-insights" : slug;
                        return (
                          <a href={finalSlug || "#"} key={dropdown.id} className={styles.dropdownCard}>
                            <div className={styles.dropdownIcon}>{getIcon(dropdown.Icon)}</div>
                            <div>
                              <div className={styles.dropdownTitle}>{dropdown.Title?.trim()}</div>
                              <div className={styles.dropdownDescription}>{dropdown.Description}</div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className={styles.headerActions}>
            {actions.map((action) => renderAction(action, false))}
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

        {/* Drawer nav */}
        <nav className={styles.drawerNav}>
          {PROPERTY_TYPE_MENUS.map((propertyType) => {
            const categories = navCategories[propertyType] || [];
            return (
              <div key={propertyType} className={styles.drawerSection}>
                <div className={styles.drawerSectionLabel}>
                  <span className={styles.drawerSectionIcon}>
                    {propertyType === "Residential" ? "⌂" : propertyType === "Commercial" ? "▣" : "▥"}
                  </span>
                  {propertyType}
                </div>
                <div className={styles.drawerLinks}>
                  {categories.length > 0 ? categories.map((cat) => (
                    <Link key={cat} href={`/search?type=${encodeURIComponent(propertyType)}&category=${encodeURIComponent(cat)}`} className={styles.drawerLink} onClick={() => setMobileMenuOpen(false)}>
                      {cat}<span className={styles.drawerLinkArrow}>→</span>
                    </Link>
                  )) : (
                    <Link href={`/search?type=${encodeURIComponent(propertyType)}`} className={styles.drawerLink} onClick={() => setMobileMenuOpen(false)}>
                      Browse {propertyType}<span className={styles.drawerLinkArrow}>→</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {strapiMenuItemsFiltered.map((item) => (
            <div key={item.id} className={styles.drawerSection}>
              <div className={styles.drawerSectionLabel}>
                <span className={styles.drawerSectionIcon}>{getIcon(item.Icon)}</span>
                {item.Title?.trim()}
              </div>
              <div className={styles.drawerLinks}>
                {item.HasDropdown && item.DropdownItems?.length > 0
                  ? item.DropdownItems.map((dropdown) => {
                      const slug = dropdown.Slug?.trim() || "#";
                      if (slug.includes("#")) {
                        return (
                          <button key={dropdown.id} type="button" className={styles.drawerLink} onClick={(e) => handleAnchorNavigation(e, slug)}>
                            {dropdown.Title?.trim()}<span className={styles.drawerLinkArrow}>→</span>
                          </button>
                        );
                      }
                      const finalSlug = slug === "/explore/locality-insights" ? "/locality-insights" : slug;
                      return (
                        <Link key={dropdown.id} href={finalSlug} className={styles.drawerLink} onClick={() => setMobileMenuOpen(false)}>
                          {dropdown.Title?.trim()}<span className={styles.drawerLinkArrow}>→</span>
                        </Link>
                      );
                    })
                  : (
                    <Link href={item.Slug || "#"} className={styles.drawerLink} onClick={() => setMobileMenuOpen(false)}>
                      {item.Title?.trim()}<span className={styles.drawerLinkArrow}>→</span>
                    </Link>
                  )}
              </div>
            </div>
          ))}
        </nav>

        {/* Drawer actions */}
        <div className={styles.drawerActions}>
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
    heart: "♡", bell: "♧", user: "◉", plus: "+",
    house: "⌂", home: "⌂", key: "⚿",
    building: "▥", map: "⌖", users: "♧", sofa: "▱",
    briefcase: "▣", store: "▤", warehouse: "▥",
    sparkles: "✦", rocket: "↗", calendar: "▣",
    construction: "⚒", check: "✓",
    compass: "◎", "map-pin": "●", navigation: "➤",
    "book-open": "▤", chart: "▥",
  };
  return icons[icon] || "•";
}
