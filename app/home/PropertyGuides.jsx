
"use client";

import styles from "./PropertyGuides.module.css";

// =========================================
// ICON MAP — driven by Strapi Icon field
// =========================================
function getIcon(iconName) {
  switch (iconName?.toLowerCase()?.trim()) {
    case "buy":   return "⌂";
    case "rent":  return "⚿";
    case "sell":  return "↗";
    case "post":  return "+";
    case "home":  return "⌂";
    case "key":   return "⚿";
    default:      return "⌂";
  }
}

export default function PropertyGuides({ data }) {
  const guides = Array.isArray(data)
    ? [...data]
        .filter((item) => item?.IsActive !== false)
        .sort(
          (a, b) =>
            (a?.DisplayOrder ?? 999) -
            (b?.DisplayOrder ?? 999)
        )
    : [];

  if (guides.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* =========================
            SECTION HEADER
        ========================= */}

        <div className={styles.header}>
          <span className={styles.eyebrow}>
            PROPERTY GUIDES
          </span>

          <h2>
            Make Your Property Journey Easier
          </h2>

          <p>
            Helpful guides to make buying, renting,
            selling and posting property simpler.
          </p>
        </div>

        {/* =========================
            GUIDE CARDS
        ========================= */}

        <div className={styles.grid}>
          {guides.map((guide, index) => (
            <a
              key={
                guide?.id ||
                guide?.documentId ||
                index
              }
              href={`/property-guides/${guide?.id}`}
              className={styles.card}
            >

              {/* ICON */}

              <div className={styles.icon}>
                {getIcon(guide?.Icon)}
              </div>

              {/* CONTENT */}

              <div className={styles.content}>
                <h3>
                  {guide?.Title || "Property Guide"}
                </h3>

                {guide?.Description && (
                  <p>
                    {guide.Description}
                  </p>
                )}

                <span className={styles.readMore}>
                  Read Guide
                  <span>→</span>
                </span>
              </div>

            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
