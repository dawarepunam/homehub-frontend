
// import Link from "next/link";
// import styles from "./AdviceTools.module.css";

// export default function AdviceTools({ data }) {
//   const section = Array.isArray(data) ? data[0] : data;

//   if (!section) {
//     return null;
//   }

//   const tools = Array.isArray(section?.Tools)
//     ? section.Tools
//     : [];

//   const activeTools = tools
//     .filter((tool) => tool?.IsActive !== false)
//     .sort(
//       (a, b) =>
//         (a?.DisplayOrder ?? 999) -
//         (b?.DisplayOrder ?? 999)
//     );

//   if (activeTools.length === 0) {
//     return null;
//   }

//   return (
//     <section className={styles.section}>
//       <div className={styles.container}>

//         {/* =========================
//             SECTION HEADER
//         ========================= */}

//         <div className={styles.header}>

//           <span className={styles.eyebrow}>
//             <span className={styles.eyebrowLine} />

//             {section?.SectionLabel || "ADVICE & TOOLS"}
//           </span>

//           <h2>
//             {section?.Title ||
//               "Smart Tools for Your Property Journey"}
//           </h2>

//           {section?.Subtitle && (
//             <p>
//               {section.Subtitle}
//             </p>
//           )}

//         </div>

//         {/* =========================
//             TOOLS
//         ========================= */}

//         <div className={styles.grid}>

//           {activeTools.map((tool, index) => {

//             const title =
//               tool?.Title || "Property Tool";

//             const description =
//               tool?.Description || "";

//             const icon =
//               tool?.Icon || "✦";

//             const buttonText =
//               tool?.ButtonText || "Explore Tool";

//             const link =
//               tool?.Link || "#";

//             return (
//               <article
//                 key={
//                   tool?.id ||
//                   tool?.documentId ||
//                   index
//                 }
//                 className={styles.card}
//               >

//                 {/* ICON */}

//                 <div className={styles.icon}>
//                   {icon}
//                 </div>

//                 {/* TITLE */}

//                 <h3>
//                   {title}
//                 </h3>

//                 {/* DESCRIPTION */}

//                 {description && (
//                   <p>
//                     {description}
//                   </p>
//                 )}

//                 {/* LINK */}

//                 <Link
//                   href={link}
//                   className={styles.link}
//                 >
//                   {buttonText}

//                   <span>
//                     →
//                   </span>
//                 </Link>

//               </article>
//             );
//           })}

//         </div>

//       </div>
//     </section>
//   );
// }

// import Link from "next/link";
// import styles from "./AdviceTools.module.css";

// export default function AdviceTools({ data }) {
//   const section = Array.isArray(data) ? data[0] : data;

//   if (!section) {
//     return null;
//   }

//   const tools = Array.isArray(section?.Tools)
//     ? section.Tools
//     : [];

//   const activeTools = tools
//     .filter((tool) => tool?.IsActive !== false)
//     .sort(
//       (a, b) =>
//         (a?.DisplayOrder ?? 999) -
//         (b?.DisplayOrder ?? 999)
//     );

//   if (activeTools.length === 0) {
//     return null;
//   }

//   return (
//     <section className={styles.section}>
//       <div className={styles.container}>

//         {/* =========================
//             SECTION HEADER
//         ========================= */}

//         <div className={styles.header}>
//           <span className={styles.eyebrow}>
//             <span className={styles.eyebrowLine} />

//             {section?.SectionLabel ||
//               "ADVICE & TOOLS"}
//           </span>

//           <h2>
//             {section?.Title ||
//               "Smart Tools for Your Property Journey"}
//           </h2>

//           {section?.Subtitle && (
//             <p>{section.Subtitle}</p>
//           )}
//         </div>

//         {/* =========================
//             TOOLS GRID
//         ========================= */}

//         <div className={styles.grid}>
//           {activeTools.map((tool, index) => {
//             const title =
//               tool?.Title || "Property Tool";

//             const description =
//               tool?.Description || "";

//             const icon =
//               tool?.Icon || "✦";

//             const buttonText =
//               tool?.ButtonText ||
//               "Explore Tool";

//             /*
//               Link comes from Strapi.

//               Example:
//               /tools/emi
//               /tools/home-affordability
//               /tools/property-cost
//             */

//             const link =
//               typeof tool?.Link === "string" &&
//               tool.Link.trim() !== ""
//                 ? tool.Link.trim()
//                 : "#";

//             return (
//               <Link
//                 key={
//                   tool?.id ||
//                   tool?.documentId ||
//                   index
//                 }
//                 href={link}
//                 className={styles.card}
//                 aria-label={`Open ${title}`}
//               >

//                 {/* =====================
//                     ICON
//                 ===================== */}

//                 <div className={styles.icon}>
//                   {icon}
//                 </div>

//                 {/* =====================
//                     TITLE
//                 ===================== */}

//                 <h3>{title}</h3>

//                 {/* =====================
//                     DESCRIPTION
//                 ===================== */}

//                 {description && (
//                   <p>{description}</p>
//                 )}

//                 {/* =====================
//                     BUTTON
//                 ===================== */}

//                 <span className={styles.link}>
//                   {buttonText}

//                   <span
//                     className={styles.arrow}
//                     aria-hidden="true"
//                   >
//                     →
//                   </span>
//                 </span>

//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

// import Link from "next/link";
// import styles from "./AdviceTools.module.css";

// export default function AdviceTools({ data }) {
//   const section = Array.isArray(data) ? data[0] : data;

//   if (!section) {
//     return null;
//   }

//   const tools = Array.isArray(section?.Tools)
//     ? section.Tools
//     : [];

//   const activeTools = tools
//     .filter((tool) => tool?.IsActive !== false)
//     .sort(
//       (a, b) =>
//         (a?.DisplayOrder ?? 999) -
//         (b?.DisplayOrder ?? 999)
//     );

//   if (activeTools.length === 0) {
//     return null;
//   }

//   return (
//     <section className={styles.section}>
//       <div className={styles.container}>

//         {/* =========================
//             SECTION HEADER
//         ========================= */}

//         <div className={styles.header}>
//           <span className={styles.eyebrow}>
//             <span className={styles.eyebrowLine} />

//             {section?.SectionLabel ||
//               "ADVICE & TOOLS"}
//           </span>

//           <h2>
//             {section?.Title ||
//               "Smart Tools for Your Property Journey"}
//           </h2>

//           {section?.Subtitle && (
//             <p>{section.Subtitle}</p>
//           )}
//         </div>

//         {/* =========================
//             TOOLS GRID
//         ========================= */}

//         <div className={styles.grid}>
//           {activeTools.map((tool, index) => {
//             const title =
//               tool?.Title || "Property Tool";

//             const description =
//               tool?.Description || "";

//             const icon =
//               tool?.Icon || "✦";

//             const buttonText =
//               tool?.ButtonText ||
//               "Explore Tool";

//             /*
//               Link comes from Strapi.

//               Example:

//               EMI Calculator
//               /tools/emi

//               Home Affordability
//               /tools/home-affordability

//               Property Cost
//               /tools/property-cost

//               Home Loan
//               /tools/home-loan
//             */

//             const link =
//               typeof tool?.Link === "string" &&
//               tool.Link.trim() !== ""
//                 ? tool.Link.trim()
//                 : "#";

//             return (
//               <Link
//                 key={
//                   tool?.id ||
//                   tool?.documentId ||
//                   index
//                 }
//                 href={link}
//                 className={styles.card}
//                 aria-label={`Open ${title}`}
//               >

//                 {/* =====================
//                     ICON
//                 ===================== */}

//                 <div className={styles.icon}>
//                   {icon}
//                 </div>

//                 {/* =====================
//                     TITLE
//                 ===================== */}

//                 <h3>{title}</h3>

//                 {/* =====================
//                     DESCRIPTION
//                 ===================== */}

//                 {description && (
//                   <p>{description}</p>
//                 )}

//                 {/* =====================
//                     BUTTON
//                 ===================== */}

//                 <span className={styles.link}>
//                   {buttonText}

//                   <span
//                     className={styles.arrow}
//                     aria-hidden="true"
//                   >
//                     →
//                   </span>
//                 </span>

//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }


// import Link from "next/link";
// import styles from "./AdviceTools.module.css";

// export default function AdviceTools({ data }) {
//   const section = Array.isArray(data) ? data[0] : data;

//   if (!section) {
//     return null;
//   }

//   const tools = Array.isArray(section?.Tools)
//     ? section.Tools
//     : [];

//   const activeTools = tools
//     .filter((tool) => tool?.IsActive !== false)
//     .sort(
//       (a, b) =>
//         (a?.DisplayOrder ?? 999) -
//         (b?.DisplayOrder ?? 999)
//     );

//   if (activeTools.length === 0) {
//     return null;
//   }

//   return (
//     <section className={styles.section}>
//       <div className={styles.container}>

//         {/* =========================
//             SECTION HEADER
//         ========================= */}

//         <div className={styles.header}>
//           <span className={styles.eyebrow}>
//             <span className={styles.eyebrowLine} />

//             {section?.SectionLabel ||
//               "ADVICE & TOOLS"}
//           </span>

//           <h2>
//             {section?.Title ||
//               "Smart Tools for Your Property Journey"}
//           </h2>

//           {section?.Subtitle && (
//             <p>{section.Subtitle}</p>
//           )}
//         </div>

//         {/* =========================
//             TOOLS GRID
//         ========================= */}

//         <div className={styles.grid}>
//           {activeTools.map((tool, index) => {
//             const title =
//               tool?.Title || "Property Tool";

//             const description =
//               tool?.Description || "";

//             const icon =
//               tool?.Icon || "✦";

//             const buttonText =
//               tool?.ButtonText ||
//               "Explore Tool";

//             /*
//               Link comes directly from Strapi.

//               Examples:

//               /tools/emi
//               /tools/home-affordability
//               /tools/property-cost
//               /tools/home-loan
//               /tools/interior-budget
//             */

//             const link =
//               typeof tool?.Link === "string" &&
//               tool.Link.trim() !== ""
//                 ? tool.Link.trim()
//                 : "#";

//             return (
//               <Link
//                 key={
//                   tool?.id ||
//                   tool?.documentId ||
//                   index
//                 }
//                 href={link}
//                 className={styles.card}
//                 aria-label={`Open ${title}`}
//               >

//                 {/* =====================
//                     ICON
//                 ===================== */}

//                 <div className={styles.icon}>
//                   {icon}
//                 </div>

//                 {/* =====================
//                     TITLE
//                 ===================== */}

//                 <h3>
//                   {title}
//                 </h3>

//                 {/* =====================
//                     DESCRIPTION
//                 ===================== */}

//                 {description && (
//                   <p>
//                     {description}
//                   </p>
//                 )}

//                 {/* =====================
//                     BUTTON
//                 ===================== */}

//                 <span className={styles.link}>
//                   {buttonText}

//                   <span
//                     className={styles.arrow}
//                     aria-hidden="true"
//                   >
//                     →
//                   </span>
//                 </span>

//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

import Link from "next/link";
import styles from "./AdviceTools.module.css";

/* =========================================================
   STRAPI ICON → SVG ICON
========================================================= */

function ToolIcon({ name }) {
  const icon = String(name || "").trim().toLowerCase();

  if (icon === "calculator") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="5" y="2.5" width="14" height="19" rx="2" />
        <rect x="8" y="5.5" width="8" height="3" rx="0.5" />
        <path d="M8 12h.01M12 12h.01M16 12h.01" />
        <path d="M8 15.5h.01M12 15.5h.01M16 15.5h.01" />
        <path d="M8 19h.01M12 19h4" />
      </svg>
    );
  }

  if (icon === "home") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.5V21h13V9.5" />
        <path d="M9.5 21v-6h5v6" />
      </svg>
    );
  }

  if (icon === "wallet") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 6.5h14a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2Z" />
        <path d="M4 6.5V5a2 2 0 0 1 2-2h11" />
        <path d="M20 11h-5a2 2 0 0 0 0 4h5" />
        <path d="M17 13h.01" />
      </svg>
    );
  }

  if (icon === "chart") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 19V5" />
        <path d="M4 19h17" />
        <path d="m7 15 4-4 3 2 5-6" />
      </svg>
    );
  }

  if (icon === "percent") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="17" cy="17" r="2.5" />
        <path d="m19 5-14 14" />
      </svg>
    );
  }

  /* Default icon if Strapi has an unknown icon name */
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v18" />
      <path d="M3 12h18" />
    </svg>
  );
}


/* =========================================================
   ADVICE & TOOLS
========================================================= */

export default function AdviceTools({ data }) {
  const section = Array.isArray(data) ? data[0] : data;

  if (!section) {
    return null;
  }

  const tools = Array.isArray(section?.Tools)
    ? section.Tools
    : [];

  const activeTools = tools
    .filter((tool) => tool?.IsActive !== false)
    .sort(
      (a, b) =>
        (a?.DisplayOrder ?? 999) -
        (b?.DisplayOrder ?? 999)
    );

  if (activeTools.length === 0) {
    return null;
  }

  return (
    <section id="smart-tools" className={styles.section}>
      <div className={styles.container}>

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className={styles.headingRow}>

          <div className={styles.headingText}>

            <span className={styles.eyebrow}>
              {section?.SectionLabel || "ADVICE & TOOLS"}
            </span>

            <h2>
              {section?.Title ||
                "Smart Tools for Your Property Journey"}
            </h2>

            {section?.Subtitle && (
              <p>{section.Subtitle}</p>
            )}

          </div>

        </div>


        {/* =================================================
            TOOLS GRID
        ================================================= */}

        <div className={styles.grid}>

          {activeTools.map((tool, index) => {

            const title =
              tool?.Title || "Property Tool";

            const description =
              tool?.Description || "";

            const icon =
              tool?.Icon || "";

            const buttonText =
              tool?.ButtonText || "Explore Tool";

            const link =
              typeof tool?.Link === "string" &&
              tool.Link.trim() !== ""
                ? tool.Link.trim()
                : "#";


            return (
              <Link
                key={
                  tool?.id ||
                  tool?.documentId ||
                  index
                }
                href={link}
                className={styles.card}
                aria-label={`Open ${title}`}
              >

                {/* =================================================
                    ICON
                ================================================= */}

                <div className={styles.icon}>
                  <ToolIcon name={icon} />
                </div>


                {/* =================================================
                    CARD CONTENT
                ================================================= */}

                <div className={styles.cardContent}>

                  {/* TITLE */}

                  <h3>{title}</h3>


                  {/* DESCRIPTION */}

                  {description && (
                    <p>{description}</p>
                  )}

                </div>


                {/* =================================================
                    BUTTON / LINK
                ================================================= */}

                <span className={styles.link}>

                  {buttonText}

                  <span
                    className={styles.arrow}
                    aria-hidden="true"
                  >
                    →
                  </span>

                </span>

              </Link>
            );
          })}

        </div>

      </div>
    </section>
  );
}