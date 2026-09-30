// "use client";

// import { useState } from "react";
// import styles from "./PropertyCategories.module.css";

// export default function PropertyCategories({ data }) {
//   const [showAll, setShowAll] = useState(false);

//   if (!data) {
//     return null;
//   }

//   // Strapi मधून आलेल्या सर्व categories
//   const categories = data.PropertyCategories || [];

//   // फक्त active categories
//   const activeCategories = categories.filter(
//     (category) => category.IsActive !== false
//   );

//   // Homepage वर initially फक्त 4 cards
//   const visibleCategories = showAll
//     ? activeCategories
//     : activeCategories.slice(0, 4);

//   const hasMoreCategories = activeCategories.length > 4;

//   return (
//     <section className={styles.section}>
//       <div className={styles.container}>

//         {/* =========================
//             SECTION HEADING
//         ========================== */}
//         <div className={styles.heading}>
//           <span className={styles.eyebrow}>
//             PROPERTY COLLECTION
//           </span>

//           <h2>
//             {data.Title || "Explore Properties by Category"}
//           </h2>

//           <p>
//             {data.Subtitle ||
//               "Find the right property for your needs."}
//           </p>
//         </div>

//         {/* =========================
//             CATEGORY CARDS
//         ========================== */}
//         {visibleCategories.length > 0 && (
//           <div className={styles.categoryGrid}>
//             {visibleCategories.map((category, index) => (
//               <div
//                 key={category.id || category.Slug || index}
//                 className={styles.cardWrapper}
//               >
//                 <div className={styles.card}>

//                   {/* =========================
//                       FRONT
//                   ========================== */}
//                   <div className={styles.cardFront}>

//                     <div className={styles.iconBox}>
//                       <span>
//                         {getIcon(category.Icon)}
//                       </span>
//                     </div>

//                     <div className={styles.frontContent}>

//                       <span className={styles.cardNumber}>
//                         {String(index + 1).padStart(2, "0")}
//                       </span>

//                       <h3>
//                         {category.Text}
//                       </h3>

//                       {category.Description && (
//                         <p>
//                           {category.Description}
//                         </p>
//                       )}

//                     </div>

//                     <div className={styles.hoverHint}>
//                       Explore
//                       <span>↗</span>
//                     </div>

//                   </div>

//                   {/* =========================
//                       BACK
//                   ========================== */}
//                   <div className={styles.cardBack}>

//                     <span className={styles.backLabel}>
//                       EXPLORE
//                     </span>

//                     <h3>
//                       {category.Text}
//                     </h3>

//                     {category.Description && (
//                       <p>
//                         {category.Description}
//                       </p>
//                     )}

//                     {/* Property Types */}
//                     {category.PropertyTypes && (
//                       <div className={styles.propertyTypes}>
//                         {category.PropertyTypes
//                           .split(",")
//                           .map((type, typeIndex) => (
//                             <span key={typeIndex}>
//                               {type.trim()}
//                             </span>
//                           ))}
//                       </div>
//                     )}

//                     {/* Explore button */}
//                     <a
//                       href={`/properties/${
//                         category.Slug || ""
//                       }`}
//                       className={styles.exploreButton}
//                     >
//                       Explore Properties
//                       <span>→</span>
//                     </a>

//                   </div>

//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* =========================
//             VIEW ALL BUTTON
//         ========================== */}
//         {hasMoreCategories && (
//           <div className={styles.viewAllWrapper}>
//             <button
//               type="button"
//               className={styles.viewAllButton}
//               onClick={() => setShowAll((previous) => !previous)}
//             >
//               <span>
//                 {showAll
//                   ? "Show Less"
//                   : "View All Properties"}
//               </span>

//               <span
//                 className={`${styles.viewAllArrow} ${
//                   showAll ? styles.arrowUp : ""
//                 }`}
//               >
//                 →
//               </span>
//             </button>
//           </div>
//         )}

//         {/* =========================
//             EMPTY STATE
//         ========================== */}
//         {activeCategories.length === 0 && (
//           <div className={styles.emptyState}>
//             No property categories available.
//           </div>
//         )}

//       </div>
//     </section>
//   );
// }


// /* =========================================
//    ICON MAPPING
// ========================================= */

// function getIcon(icon) {
//   const icons = {
//     home: "⌂",
//     building: "▥",
//     factory: "▦",
//     leaf: "♧",

//     residential: "⌂",
//     commercial: "▥",
//     industrial: "▦",
//     agricultural: "♧",
//   };

//   return (
//     icons[String(icon || "").toLowerCase()] || "⌂"
//   );
// }


// "use client";

// import { useState } from "react";
// import styles from "./PropertyCategories.module.css";

// export default function PropertyCategories({ data }) {
//   const [showAll, setShowAll] = useState(false);

//   if (!data) {
//     return null;
//   }

//   // =========================================
//   // STRAPI DATA
//   // =========================================

//   const categories = Array.isArray(data.PropertyCategories)
//     ? data.PropertyCategories
//     : [];

//   // फक्त active categories
//   const activeCategories = categories.filter(
//     (category) => category.IsActive !== false
//   );

//   // =========================================
//   // DEBUG
//   // =========================================

//   console.log("Property Categories Data:", data);
//   console.log("All Categories:", categories);
//   console.log("Active Categories:", activeCategories);
//   console.log(
//     "Total Active Categories:",
//     activeCategories.length
//   );

//   // =========================================
//   // SHOW FIRST 4
//   // =========================================

//   const visibleCategories = showAll
//     ? activeCategories
//     : activeCategories.slice(0, 4);

//   // 4 पेक्षा जास्त categories असतील
//   // तर View All button दिसेल
//   const hasMoreCategories = activeCategories.length > 3;

//   return (
//     <section className={styles.section}>
//       <div className={styles.container}>

//         {/* =========================================
//             SECTION HEADING
//         ========================================== */}

//         <div className={styles.heading}>
//           <span className={styles.eyebrow}>
//             PROPERTY COLLECTION
//           </span>

//           <h2>
//             {data.Title || "Explore Properties by Category"}
//           </h2>

//           <p>
//             {data.Subtitle ||
//               "Find the right property for your needs."}
//           </p>
//         </div>

//         {/* =========================================
//             CATEGORY CARDS
//         ========================================== */}

//         {visibleCategories.length > 0 && (
//           <div className={styles.categoryGrid}>

//             {visibleCategories.map((category, index) => {
//               const categoryName =
//                 category.Text ||
//                 category.Name ||
//                 "Property";

//               const slug = category.Slug || "";

//               return (
//                 <div
//                   key={
//                     category.id ||
//                     category.documentId ||
//                     slug ||
//                     index
//                   }
//                   className={styles.cardWrapper}
//                 >

//                   <div className={styles.card}>

//                     {/* =================================
//                         FRONT
//                     ================================= */}

//                     <div className={styles.cardFront}>

//                       {/* ICON */}

//                       <div className={styles.iconBox}>
//                         <span>
//                           {getIcon(category.Icon)}
//                         </span>
//                       </div>

//                       {/* CONTENT */}

//                       <div className={styles.frontContent}>

//                         <span className={styles.cardNumber}>
//                           {String(index + 1).padStart(2, "0")}
//                         </span>

//                         <h3>
//                           {categoryName}
//                         </h3>

//                         {category.Description && (
//                           <p>
//                             {category.Description}
//                           </p>
//                         )}

//                       </div>

//                       {/* HOVER */}

//                       <div className={styles.hoverHint}>
//                         <span>Explore</span>
//                         <span>↗</span>
//                       </div>

//                     </div>

//                     {/* =================================
//                         BACK
//                     ================================= */}

//                     <div className={styles.cardBack}>

//                       <span className={styles.backLabel}>
//                         EXPLORE
//                       </span>

//                       <h3>
//                         {categoryName}
//                       </h3>

//                       {category.Description && (
//                         <p>
//                           {category.Description}
//                         </p>
//                       )}

//                       {/* PROPERTY TYPES */}

//                       {category.PropertyTypes && (
//                         <div className={styles.propertyTypes}>

//                           {String(category.PropertyTypes)
//                             .split(",")
//                             .map((type, typeIndex) => (
//                               <span key={typeIndex}>
//                                 {type.trim()}
//                               </span>
//                             ))}

//                         </div>
//                       )}

//                       {/* EXPLORE BUTTON */}

//                       <a
//                         href={`/properties/${slug}`}
//                         className={styles.exploreButton}
//                       >
//                         <span>
//                           Explore Properties
//                         </span>

//                         <span>
//                           →
//                         </span>
//                       </a>

//                     </div>

//                   </div>

//                 </div>
//               );
//             })}

//           </div>
//         )}

//         {/* =========================================
//             VIEW ALL PROPERTIES
//         ========================================== */}

//         {hasMoreCategories && (
//           <div className={styles.viewAllWrapper}>

//             <button
//               type="button"
//               className={styles.viewAllButton}
//               onClick={() => {
//                 setShowAll((previous) => !previous);

//                 // Show All केल्यानंतर section च्या
//                 // bottom कडे smooth scroll
//                 setTimeout(() => {
//                   document
//                     .getElementById("property-categories")
//                     ?.scrollIntoView({
//                       behavior: "smooth",
//                       block: "start",
//                     });
//                 }, 100);
//               }}
//               aria-expanded={showAll}
//             >

//               <span>
//                 {showAll
//                   ? "Show Less"
//                   : "View All Properties"}
//               </span>

//               <span
//                 className={`${styles.viewAllArrow} ${
//                   showAll ? styles.arrowUp : ""
//                 }`}
//               >
//                 {showAll ? "↑" : "→"}
//               </span>

//             </button>

//           </div>
//         )}

//         {/* =========================================
//             EMPTY STATE
//         ========================================== */}

//         {activeCategories.length === 0 && (
//           <div className={styles.emptyState}>
//             No property categories available.
//           </div>
//         )}

//       </div>
//     </section>
//   );
// }


// /* =========================================
//    ICON MAPPING
// ========================================= */

// function getIcon(icon) {
//   const icons = {
//     home: "⌂",
//     building: "▥",
//     factory: "▦",
//     leaf: "♧",

//     residential: "⌂",
//     commercial: "▥",
//     industrial: "▦",
//     agricultural: "♧",

//     apartment: "⌂",
//     apartments: "⌂",
//     villa: "⌂",
//     villas: "⌂",

//     office: "▥",
//     offices: "▥",

//     shop: "▥",
//     shops: "▥",

//     warehouse: "▦",
//     warehouses: "▦",

//     land: "⌂",
//     plot: "⌂",
//     plots: "⌂",
//   };

//   return (
//     icons[String(icon || "").toLowerCase()] || "⌂"
//   );
// }

"use client";

import { useState } from "react";
import styles from "./PropertyCategories.module.css";

export default function PropertyCategories({ data }) {
  const [showAll, setShowAll] = useState(false);

  if (!data) {
    return null;
  }

  // =========================================
  // STRAPI DATA
  // =========================================

  const categories = Array.isArray(data.PropertyCategories)
    ? data.PropertyCategories
    : [];

  // =========================================
  // ONLY ACTIVE CATEGORIES
  // =========================================

  const activeCategories = categories.filter(
    (category) =>
      category.IsActive !== false &&
      String(category.Text || category.Name).toLowerCase() !== "agricultural"
  );

  // =========================================
  // SHOW FIRST 4
  // =========================================

  const visibleCategories = showAll
    ? activeCategories
    : activeCategories.slice(0, 3);

  // =========================================
  // CHECK MORE CATEGORIES
  // =========================================

  const hasMoreCategories = activeCategories.length > 3;

  return (
    <section
      id="property-categories"
      className={styles.section}
    >
      <div className={styles.container}>

        {/* =========================================
            SECTION HEADING
        ========================================== */}

        <div className={styles.heading}>

          <span className={styles.eyebrow}>
            PROPERTY COLLECTION
          </span>

          <h2>
            {data.Title ||
              "Explore Properties by Category"}
          </h2>

          <p>
            {data.Subtitle ||
              "Find the right property for your needs."}
          </p>

        </div>

        {/* =========================================
            CATEGORY CARDS
        ========================================== */}

        {visibleCategories.length > 0 && (
          <div className={styles.categoryGrid}>

            {visibleCategories.map((category, index) => {

              const categoryName =
                category.Text ||
                category.Name ||
                "Property";

              const slug = category.Slug || "";

              return (
                <div
                  key={
                    category.id ||
                    category.documentId ||
                    slug ||
                    index
                  }
                  className={styles.cardWrapper}
                >

                  <div className={styles.card}>

                    {/* =================================
                        FRONT SIDE
                    ================================= */}

                    <div className={styles.cardFront}>

                      {/* ICON */}

                      <div className={styles.iconBox}>
                        <span>
                          {getIcon(category.Icon)}
                        </span>
                      </div>

                      {/* CONTENT */}

                      <div className={styles.frontContent}>

                        <span className={styles.cardNumber}>
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <h3>
                          {categoryName}
                        </h3>

                        {category.Description && (
                          <p>
                            {category.Description}
                          </p>
                        )}

                      </div>

                      {/* HOVER */}

                      <div className={styles.hoverHint}>
                        <span>Explore</span>
                        <span>↗</span>
                      </div>

                    </div>

                    {/* =================================
                        BACK SIDE
                    ================================= */}

                    <div className={styles.cardBack}>

                      <span className={styles.backLabel}>
                        EXPLORE
                      </span>

                      <h3>
                        {categoryName}
                      </h3>

                      {category.Description && (
                        <p>
                          {category.Description}
                        </p>
                      )}

                      {/* PROPERTY TYPES */}

                      {category.PropertyTypes && (
                        <div className={styles.propertyTypes}>

                          {String(category.PropertyTypes)
                            .split(",")
                            .slice(0, 6)
                            .map((type, typeIndex) => (
                              <span key={typeIndex}>
                                {type.trim()}
                              </span>
                            ))}

                        </div>
                      )}

                      {/* EXPLORE BUTTON */}

                      <a
                        href={`/search?type=${encodeURIComponent(categoryName)}`}
                        className={styles.exploreButton}
                      >

                        <span>
                          Explore Properties
                        </span>

                        <span>
                          →
                        </span>

                      </a>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* =========================================
            VIEW ALL CATEGORIES
            RIGHT SIDE
        ========================================== */}

        {hasMoreCategories && (
          <div
            className={styles.viewAllWrapper}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              marginTop: "32px",
            }}
          >

            <button
              type="button"
              className={styles.viewAllButton}
              onClick={() => {
                setShowAll((previous) => !previous);
              }}
              aria-expanded={showAll}
            >

              <span>
                {showAll
                  ? "Show Less"
                  : "View All Categories"}
              </span>

              <span
                className={`${styles.viewAllArrow} ${
                  showAll ? styles.arrowUp : ""
                }`}
              >
                {showAll ? "↑" : "→"}
              </span>

            </button>

          </div>
        )}

        {/* =========================================
            EMPTY STATE
        ========================================== */}

        {activeCategories.length === 0 && (
          <div className={styles.emptyState}>
            No property categories available.
          </div>
        )}

      </div>
    </section>
  );
}


/* =========================================
   ICON MAPPING
========================================= */

function getIcon(icon) {

  const icons = {

    home: "⌂",
    building: "▥",
    factory: "▦",
    leaf: "♧",

    residential: "⌂",
    commercial: "▥",
    industrial: "▦",
    agricultural: "♧",

    apartment: "⌂",
    apartments: "⌂",

    villa: "⌂",
    villas: "⌂",

    office: "▥",
    offices: "▥",

    shop: "▥",
    shops: "▥",

    warehouse: "▦",
    warehouses: "▦",

    land: "⌂",
    plot: "⌂",
    plots: "⌂",
  };

  return (
    icons[String(icon || "").toLowerCase()] ||
    "⌂"
  );
}
