// "use client";

// import { useState } from "react";
// import styles from "./HomeHeader.module.css";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// const STRAPI_BASE_URL = STRAPI_URL.replace(/\/api\/?$/, "");

// export default function HomeHeader({ header }) {
//   const [activeMenu, setActiveMenu] = useState(null);

//   const logoUrl = header?.Logo?.url
//     ? `${STRAPI_BASE_URL}${header.Logo.url}`
//     : null;

//   const menuItems = header?.MenuItems || [];
//   const actions = header?.HeaderActions || [];

//   return (
//     <header className={styles.homeHeader}>
//       <div className={styles.headerInner}>
//         {/* Brand */}
//         <div className={styles.brandSection}>
//           {logoUrl ? (
//             <img
//               src={logoUrl}
//               alt={header?.Brand || "HomeHub"}
//               className={styles.brandLogo}
//             />
//           ) : (
//             <div className={styles.brandMark}>H</div>
//           )}

//           <div className={styles.brandText}>
//             <div className={styles.brandName}>
//               {header?.Brand || "HomeHub"}
//             </div>

//             <div className={styles.brandTagline}>
//               {header?.Tagline || "Find. Connect. Home."}
//             </div>
//           </div>
//         </div>

//         {/* Main Navigation */}
//         <nav className={styles.mainNavigation}>
//           {menuItems.map((item) => (
//             <div
//               key={item.id}
//               className={styles.navItemWrapper}
//               onMouseEnter={() => {
//                 if (item.HasDropdown) {
//                   setActiveMenu(item.id);
//                 }
//               }}
//               onMouseLeave={() => {
//                 setActiveMenu(null);
//               }}
//             >
//               <button
//                 type="button"
//                 className={styles.navItem}
//                 aria-expanded={activeMenu === item.id}
//               >
//                 <span className={styles.navIcon}>
//                   {getIcon(item.Icon)}
//                 </span>

//                 <span>{item.Title?.trim()}</span>

//                 {item.HasDropdown && (
//                   <span className={styles.dropdownArrow}>⌄</span>
//                 )}
//               </button>

//               {/* Mega Menu */}
//               {item.HasDropdown && activeMenu === item.id && (
//                 <div className={styles.megaMenu}>
//                   <div className={styles.megaMenuHeader}>
//                     <div>
//                       <h3>{item.Title?.trim()}</h3>

//                       <p>
//                         Explore{" "}
//                         {item.Title?.trim().toLowerCase()} properties
//                       </p>
//                     </div>

//                     <span className={styles.megaMenuArrow}>→</span>
//                   </div>

//                   <div className={styles.dropdownGrid}>
//                     {item.DropdownItems?.map((dropdown) => (
//                       <a
//                         href={dropdown.Slug?.trim() || "#"}
//                         key={dropdown.id}
//                         className={styles.dropdownCard}
//                       >
//                         <div className={styles.dropdownIcon}>
//                           {getIcon(dropdown.Icon)}
//                         </div>

//                         <div>
//                           <div className={styles.dropdownTitle}>
//                             {dropdown.Title?.trim()}
//                           </div>

//                           <div className={styles.dropdownDescription}>
//                             {dropdown.Description}
//                           </div>
//                         </div>

//                         <span className={styles.cardArrow}>→</span>
//                       </a>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </nav>

//         {/* Header Actions */}
//         <div className={styles.headerActions}>
//           {actions.map((action) => (
//             <a
//               key={action.id}
//               href={action.Slug || "#"}
//               className={
//                 action.IsHighlighted
//                   ? `${styles.actionButton} ${styles.highlighted}`
//                   : styles.actionButton
//               }
//             >
//               <span className={styles.actionIcon}>
//                 {getIcon(action.Icon)}
//               </span>

//               <span>{action.Title}</span>
//             </a>
//           ))}
//         </div>
//       </div>
//     </header>
//   );
// }

// /* =========================
//    ICONS
// ========================= */

// function getIcon(icon) {
//   const icons = {
//     heart: "♡",
//     bell: "♧",
//     user: "◉",
//     plus: "+",

//     house: "⌂",
//     home: "⌂",
//     key: "⚿",

//     building: "▥",
//     map: "⌖",
//     users: "♧",
//     sofa: "▱",

//     briefcase: "▣",
//     store: "▤",
//     warehouse: "▥",

//     sparkles: "✦",
//     rocket: "↗",
//     calendar: "▣",
//     construction: "⚒",
//     check: "✓",

//     compass: "◎",
//     "map-pin": "●",
//     navigation: "➤",
//     "book-open": "▤",
//     chart: "▥",
//   };

//   return icons[icon] || "•";
// }


// "use client";

// import { useState } from "react";
// import styles from "./HomeHeader.module.css";
// import RoleSelectionModal from "./RoleSelectionModal";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL ||
//   "http://localhost:1337/api";

// const STRAPI_BASE_URL = STRAPI_URL.replace(/\/api\/?$/, "");

// export default function HomeHeader({ header }) {
//   const [activeMenu, setActiveMenu] = useState(null);

//   // =========================
//   // ROLE MODAL
//   // =========================
//   const [showRoleModal, setShowRoleModal] = useState(false);

//   const logoUrl = header?.Logo?.url
//     ? `${STRAPI_BASE_URL}${header.Logo.url}`
//     : null;

//   const menuItems = header?.MenuItems || [];
//   const actions = header?.HeaderActions || [];

//   // =========================
//   // LOGIN / SIGNUP CLICK
//   // =========================
//   const handleLoginClick = (event) => {
//     event.preventDefault();
//     setShowRoleModal(true);
//   };

//   // =========================
//   // ROLE CONTINUE
//   // =========================
//   const handleRoleContinue = (role) => {
//     console.log("Selected HomeHub Role:", role);

//     // Next step:
//     // User  → Login / Signup
//     // Owner → Login / Signup

//     setShowRoleModal(false);
//   };

//   return (
//     <>
//       <header className={styles.homeHeader}>
//         <div className={styles.headerInner}>

//           {/* =========================
//               BRAND
//           ========================= */}
//           <div className={styles.brandSection}>
//             {logoUrl ? (
//               <img
//                 src={logoUrl}
//                 alt={header?.Brand || "HomeHub"}
//                 className={styles.brandLogo}
//               />
//             ) : (
//               <div className={styles.brandMark}>H</div>
//             )}

//             <div className={styles.brandText}>
//               <div className={styles.brandName}>
//                 {header?.Brand || "HomeHub"}
//               </div>

//               <div className={styles.brandTagline}>
//                 {header?.Tagline || "Find. Connect. Home."}
//               </div>
//             </div>
//           </div>

//           {/* =========================
//               MAIN NAVIGATION
//           ========================= */}
//           <nav className={styles.mainNavigation}>
//             {menuItems.map((item) => (
//               <div
//                 key={item.id}
//                 className={styles.navItemWrapper}
//                 onMouseEnter={() => {
//                   if (item.HasDropdown) {
//                     setActiveMenu(item.id);
//                   }
//                 }}
//                 onMouseLeave={() => {
//                   setActiveMenu(null);
//                 }}
//               >
//                 <button
//                   type="button"
//                   className={styles.navItem}
//                   aria-expanded={activeMenu === item.id}
//                 >
//                   <span className={styles.navIcon}>
//                     {getIcon(item.Icon)}
//                   </span>

//                   <span>{item.Title?.trim()}</span>

//                   {item.HasDropdown && (
//                     <span className={styles.dropdownArrow}>
//                       ⌄
//                     </span>
//                   )}
//                 </button>

//                 {/* =========================
//                     MEGA MENU
//                 ========================= */}
//                 {item.HasDropdown &&
//                   activeMenu === item.id && (
//                     <div className={styles.megaMenu}>
//                       <div className={styles.megaMenuHeader}>
//                         <div>
//                           <h3>{item.Title?.trim()}</h3>

//                           <p>
//                             Explore{" "}
//                             {item.Title
//                               ?.trim()
//                               .toLowerCase()}{" "}
//                             properties
//                           </p>
//                         </div>

//                         <span
//                           className={styles.megaMenuArrow}
//                         >
//                           →
//                         </span>
//                       </div>

//                       <div className={styles.dropdownGrid}>
//                         {item.DropdownItems?.map(
//                           (dropdown) => (
//                             <a
//                               href={
//                                 dropdown.Slug?.trim() ||
//                                 "#"
//                               }
//                               key={dropdown.id}
//                               className={
//                                 styles.dropdownCard
//                               }
//                             >
//                               <div
//                                 className={
//                                   styles.dropdownIcon
//                                 }
//                               >
//                                 {getIcon(dropdown.Icon)}
//                               </div>

//                               <div>
//                                 <div
//                                   className={
//                                     styles.dropdownTitle
//                                   }
//                                 >
//                                   {dropdown.Title?.trim()}
//                                 </div>

//                                 <div
//                                   className={
//                                     styles.dropdownDescription
//                                   }
//                                 >
//                                   {dropdown.Description}
//                                 </div>
//                               </div>

//                               <span
//                                 className={
//                                   styles.cardArrow
//                                 }
//                               >
//                                 →
//                               </span>
//                             </a>
//                           )
//                         )}
//                       </div>
//                     </div>
//                   )}
//               </div>
//             ))}
//           </nav>

//           {/* =========================
//               HEADER ACTIONS
//           ========================= */}
//           <div className={styles.headerActions}>
//             {actions.map((action) => {

//               // =========================
//               // CHECK LOGIN ACTION
//               // =========================
//               const isLoginAction =
//                 action?.ActionType === "login";

//               // =========================
//               // LOGIN / SIGN UP
//               // =========================
//               if (isLoginAction) {
//                 return (
//                   <button
//                     key={action.id}
//                     type="button"
//                     onClick={handleLoginClick}
//                     className={
//                       action.IsHighlighted
//                         ? `${styles.actionButton} ${styles.highlighted}`
//                         : styles.actionButton
//                     }
//                   >
//                     <span
//                       className={styles.actionIcon}
//                     >
//                       {getIcon(action.Icon)}
//                     </span>

//                     <span>
//                       {action.Title || "Login / Sign Up"}
//                     </span>
//                   </button>
//                 );
//               }

//               // =========================
//               // OTHER HEADER ACTIONS
//               // =========================
//               return (
//                 <a
//                   key={action.id}
//                   href={action.Slug || "#"}
//                   className={
//                     action.IsHighlighted
//                       ? `${styles.actionButton} ${styles.highlighted}`
//                       : styles.actionButton
//                   }
//                 >
//                   <span
//                     className={styles.actionIcon}
//                   >
//                     {getIcon(action.Icon)}
//                   </span>

//                   <span>{action.Title}</span>
//                 </a>
//               );
//             })}
//           </div>
//         </div>
//       </header>

//       {/* =========================
//           ROLE SELECTION MODAL
//       ========================= */}
//       {showRoleModal && (
//         <RoleSelectionModal
//           onClose={() => setShowRoleModal(false)}
//           onContinue={handleRoleContinue}
//         />
//       )}
//     </>
//   );
// }

// /* =========================
//    ICONS
// ========================= */

// function getIcon(icon) {
//   const icons = {
//     heart: "♡",
//     bell: "♧",
//     user: "◉",
//     plus: "+",

//     house: "⌂",
//     home: "⌂",
//     key: "⚿",

//     building: "▥",
//     map: "⌖",
//     users: "♧",
//     sofa: "▱",

//     briefcase: "▣",
//     store: "▤",
//     warehouse: "▥",

//     sparkles: "✦",
//     rocket: "↗",
//     calendar: "▣",
//     construction: "⚒",
//     check: "✓",

//     compass: "◎",
//     "map-pin": "●",
//     navigation: "➤",
//     "book-open": "▤",
//     chart: "▥",
//   };

//   return icons[icon] || "•";
// }


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./HomeHeader.module.css";
import RoleSelectionModal from "./RoleSelectionModal";
import { getPropertyNavCategories } from "@/services/property";
import { getStrapiMedia } from "@/utils/getStrapiMedia";

// Property types driven by real Strapi property data
// (replace the old Buy / Rent / Commercial Strapi menu items)
const PROPERTY_TYPE_MENUS = ["Residential", "Commercial", "Industrial"];

export default function HomeHeader({ header }) {
  const [activeMenu, setActiveMenu] = useState(null);

  // =========================
  // ROLE MODAL
  // =========================
  const [showRoleModal, setShowRoleModal] = useState(false);

  // =========================
  // STRAPI-DRIVEN NAV CATEGORIES
  // =========================
  const [navCategories, setNavCategories] = useState({
    Residential: [],
    Commercial: [],
    Industrial: [],
  });

  useEffect(() => {
    getPropertyNavCategories().then(setNavCategories);
  }, []);

  const router = useRouter();

  // Use canonical getStrapiMedia — handles relative /uploads/... paths correctly
  const logoUrl = getStrapiMedia(header?.Logo);


  // Filter out the old Buy / Rent / Commercial Strapi menu items.
  // We replace them with PROPERTY_TYPE_MENUS driven by actual property data.
  const strapiMenuItemsFiltered = (header?.MenuItems || []).filter((item) => {
    const title = item?.Title?.trim().toLowerCase();
    return (
      title !== "buy" &&
      title !== "rent" &&
      title !== "commercial"
    );
  });

  const actions = header?.HeaderActions || [];

  // =========================
  // LOGIN / SIGNUP CLICK
  // =========================
  const handleLoginClick = (event) => {
    event.preventDefault();
    setShowRoleModal(true);
  };


  // =========================
  // ROLE CONTINUE
  // =========================
  const handleRoleContinue = (role) => {
    console.log("Selected HomeHub Role:", role);

    // Next step:
    // User  → Login / Signup
    // Owner → Login / Signup

    setShowRoleModal(false);
  };

  // =========================
  // ANCHOR NAVIGATION
  // Handles slugs like "/#popular-locations".
  // - Same page  → smooth scroll, no reload.
  // - Other page → navigate then scroll after paint.
  // All other slugs fall through to normal routing.
  // =========================
  const handleAnchorNavigation = (event, slug) => {
    if (!slug) return;

    // Only intercept hash-anchor slugs, e.g. "/#popular-locations"
    const hashIndex = slug.indexOf("#");
    if (hashIndex === -1) {
      // Not an anchor slug – navigate normally
      router.push(slug);
      return;
    }

    event.preventDefault();
    setActiveMenu(null);

    const pagePath = slug.slice(0, hashIndex) || "/";
    const anchorId = slug.slice(hashIndex + 1);

    const scrollToAnchor = () => {
      const target = document.getElementById(anchorId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // Check whether we are already on the target page
    const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
    const targetPath = pagePath.replace(/\/$/, "") || "/";

    if (currentPath === targetPath) {
      // Already on the right page — scroll immediately
      scrollToAnchor();
    } else {
      // Navigate to the target page, then scroll after it renders
      router.push(pagePath);
      // Allow one render cycle for the page + section to mount
      setTimeout(scrollToAnchor, 400);
    }
  };

  return (
    <>
      <header className={styles.homeHeader}>
        <div className={styles.headerInner}>

          {/* =========================
              BRAND
          ========================= */}
          <div className={styles.brandSection}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={header?.Brand || "HomeHub"}
                className={styles.brandLogo}
              />
            ) : (
              <div className={styles.brandMark}>H</div>
            )}

            <div className={styles.brandText}>
              <div className={styles.brandName}>
                {header?.Brand || "HomeHub"}
              </div>

              <div className={styles.brandTagline}>
                {header?.Tagline || "Find. Connect. Home."}
              </div>
            </div>
          </div>

          {/* =========================
              MAIN NAVIGATION
          ========================= */}
          <nav className={styles.mainNavigation}>

            {/* =========================
                PROPERTY TYPE MENUS
                Residential / Commercial / Industrial
                Driven by actual Strapi property data
            ========================= */}
            {PROPERTY_TYPE_MENUS.map((propertyType) => {
              const categories = navCategories[propertyType] || [];
              const menuId = `prop-type-${propertyType}`;

              return (
                <div
                  key={menuId}
                  className={styles.navItemWrapper}
                  onMouseEnter={() => setActiveMenu(menuId)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button
                    type="button"
                    className={styles.navItem}
                    aria-expanded={activeMenu === menuId}
                  >
                    <span className={styles.navIcon}>
                      {propertyType === "Residential" ? "⌂" :
                       propertyType === "Commercial" ? "▣" : "▥"}
                    </span>

                    <span>{propertyType}</span>

                    <span className={styles.dropdownArrow}>⌄</span>
                  </button>

                  {/* Dropdown */}
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
                        {categories.length > 0 ? (
                          categories.map((cat) => (
                            <Link
                              key={cat}
                              href={`/search?type=${encodeURIComponent(propertyType)}&category=${encodeURIComponent(cat)}`}
                              className={styles.dropdownCard}
                            >
                              <div className={styles.dropdownIcon}>
                                {propertyType === "Residential" ? "⌂" :
                                 propertyType === "Commercial" ? "▣" : "▥"}
                              </div>
                              <div>
                                <div className={styles.dropdownTitle}>{cat}</div>
                                <div className={styles.dropdownDescription}>
                                  Browse {cat} {propertyType.toLowerCase()} properties
                                </div>
                              </div>
                              <span className={styles.cardArrow}>→</span>
                            </Link>
                          ))
                        ) : (
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

            {/* =========================
                OTHER STRAPI MENU ITEMS
                New Projects, Explore, etc.
                (Buy / Rent / Commercial are filtered out)
            ========================= */}
            {strapiMenuItemsFiltered.map((item) => (
              <div
                key={item.id}
                className={styles.navItemWrapper}
                onMouseEnter={() => {
                  if (item.HasDropdown) {
                    setActiveMenu(item.id);
                  }
                }}
                onMouseLeave={() => {
                  setActiveMenu(null);
                }}
              >
                <button
                  type="button"
                  className={styles.navItem}
                  aria-expanded={activeMenu === item.id}
                >
                  <span className={styles.navIcon}>
                    {getIcon(item.Icon)}
                  </span>

                  <span>{item.Title?.trim()}</span>

                  {item.HasDropdown && (
                    <span className={styles.dropdownArrow}>
                      ⌄
                    </span>
                  )}
                </button>

                {/* =========================
                    MEGA MENU (Strapi-driven)
                ========================= */}
                {item.HasDropdown &&
                  activeMenu === item.id && (
                    <div className={styles.megaMenu}>
                      <div className={styles.megaMenuHeader}>
                        <div>
                          <h3>{item.Title?.trim()}</h3>

                          <p>
                            Explore{" "}
                            {item.Title
                              ?.trim()
                              .toLowerCase()}{" "}
                            properties
                          </p>
                        </div>

                        <span
                          className={styles.megaMenuArrow}
                        >
                          →
                        </span>
                      </div>

                      <div className={styles.dropdownGrid}>
                        {item.DropdownItems?.map(
                          (dropdown) => {
                            const slug = dropdown.Slug?.trim() || "";
                            const isAnchorSlug = slug.includes("#");

                            // =========================
                            // ANCHOR SLUG (e.g. /#popular-locations)
                            // Use button + handleAnchorNavigation
                            // so we can scroll without a full reload.
                            // =========================
                            if (isAnchorSlug) {
                              return (
                                <button
                                  key={dropdown.id}
                                  type="button"
                                  onClick={(e) =>
                                    handleAnchorNavigation(e, slug)
                                  }
                                  className={styles.dropdownCard}
                                >
                                  <div
                                    className={
                                      styles.dropdownIcon
                                    }
                                  >
                                    {getIcon(dropdown.Icon)}
                                  </div>

                                  <div>
                                    <div
                                      className={
                                        styles.dropdownTitle
                                      }
                                    >
                                      {dropdown.Title?.trim()}
                                    </div>

                                    <div
                                      className={
                                        styles.dropdownDescription
                                      }
                                    >
                                      {dropdown.Description}
                                    </div>
                                  </div>

                                  <span
                                    className={
                                      styles.cardArrow
                                    }
                                  >
                                    →
                                  </span>
                                </button>
                              );
                            }

                            // =========================
                            // REGULAR SLUG
                            // Plain anchor tag as before.
                            // =========================
                            const finalSlug = slug === "/explore/locality-insights" ? "/locality-insights" : slug;
                            return (
                              <a
                                href={finalSlug || "#"}
                                key={dropdown.id}
                                className={
                                  styles.dropdownCard
                                }
                              >
                                <div
                                  className={
                                    styles.dropdownIcon
                                  }
                                >
                                  {getIcon(dropdown.Icon)}
                                </div>

                                <div>
                                  <div
                                    className={
                                      styles.dropdownTitle
                                    }
                                  >
                                    {dropdown.Title?.trim()}
                                  </div>

                                  <div
                                    className={
                                      styles.dropdownDescription
                                    }
                                  >
                                    {dropdown.Description}
                                  </div>
                                </div>

                                <span
                                  className={
                                    styles.cardArrow
                                  }
                                >
                                  →
                                </span>
                              </a>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </nav>

          {/* =========================
              HEADER ACTIONS
          ========================= */}
          <div className={styles.headerActions}>

            {actions.map((action) => {

              const actionTitle = action?.Title?.trim().toLowerCase();
              if (actionTitle === "saved" || actionTitle === "alerts") {
                return null;
              }

              // =========================
              // CHECK LOGIN ACTION
              // =========================
              const isLoginAction =
                action?.ActionType === "login";

              // =========================
              // CHECK POST PROPERTY
              // =========================
              const isPostProperty =
                action?.Title
                  ?.trim()
                  .toLowerCase() === "post property";

              // =========================
              // LOGIN / SIGN UP
              // =========================
              if (isLoginAction) {
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={handleLoginClick}
                    className={
                      action.IsHighlighted
                        ? `${styles.actionButton} ${styles.highlighted}`
                        : styles.actionButton
                    }
                  >
                    <span
                      className={styles.actionIcon}
                    >
                      {getIcon(action.Icon)}
                    </span>

                    <span>
                      {action.Title ||
                        "Login / Sign Up"}
                    </span>
                  </button>
                );
              }

              // =========================
              // POST PROPERTY
              // =========================
              if (isPostProperty) {
                return (
                  <Link
                    key={action.id}
                    href="/post-property"
                    className={
                      action.IsHighlighted
                        ? `${styles.actionButton} ${styles.highlighted}`
                        : styles.actionButton
                    }
                  >
                    <span
                      className={styles.actionIcon}
                    >
                      {getIcon(action.Icon || "plus")}
                    </span>

                    <span>
                      {action.Title || "Post Property"}
                    </span>
                  </Link>
                );
              }

              // =========================
              // OTHER HEADER ACTIONS
              // =========================
              return (
                <a
                  key={action.id}
                  href={action.Slug || "#"}
                  className={
                    action.IsHighlighted
                      ? `${styles.actionButton} ${styles.highlighted}`
                      : styles.actionButton
                  }
                >
                  <span
                    className={styles.actionIcon}
                  >
                    {getIcon(action.Icon)}
                  </span>

                  <span>{action.Title}</span>
                </a>
              );
            })}
          </div>
        </div>
      </header>

      {/* =========================
          ROLE SELECTION MODAL
      ========================= */}
      {showRoleModal && (
        <RoleSelectionModal
          onClose={() => setShowRoleModal(false)}
          onContinue={handleRoleContinue}
        />
      )}
    </>
  );
}

/* =========================
   ICONS
========================= */

function getIcon(icon) {
  const icons = {
    heart: "♡",
    bell: "♧",
    user: "◉",
    plus: "+",

    house: "⌂",
    home: "⌂",
    key: "⚿",

    building: "▥",
    map: "⌖",
    users: "♧",
    sofa: "▱",

    briefcase: "▣",
    store: "▤",
    warehouse: "▥",

    sparkles: "✦",
    rocket: "↗",
    calendar: "▣",
    construction: "⚒",
    check: "✓",

    compass: "◎",
    "map-pin": "●",
    navigation: "➤",
    "book-open": "▤",
    chart: "▥",
  };

  return icons[icon] || "•";
}