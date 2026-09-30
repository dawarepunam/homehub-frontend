
"use client";

import { useState } from "react";
import {
  BadgeCheck,
  UserCheck,
  Gem,
  Search,
  ShieldCheck,
} from "lucide-react";

import styles from "./WhyChooseHomeHub.module.css";

export default function WhyChooseHomeHub({ data }) {
  const section = Array.isArray(data) ? data[0] : data;

  const benefits = Array.isArray(section?.Benefits)
    ? [...section.Benefits]
        .filter((item) => item?.IsActive !== false)
        .sort(
          (a, b) =>
            (a?.DisplayOrder ?? 999) -
            (b?.DisplayOrder ?? 999)
        )
    : [];

  const [activeIndex, setActiveIndex] = useState(null);

  if (!section || benefits.length === 0) {
    return null;
  }

  /* =========================
     ICON MAPPING
  ========================= */

  const getBenefitIcon = (iconName) => {
    const icon = iconName?.toLowerCase()?.trim();

    switch (icon) {
      case "verified":
        return <BadgeCheck size={17} strokeWidth={2.2} />;

      case "trusted":
        return <UserCheck size={17} strokeWidth={2.2} />;

      case "genuine":
        return <Gem size={17} strokeWidth={2.2} />;

      case "search":
        return <Search size={17} strokeWidth={2.2} />;

      case "secure":
        return <ShieldCheck size={17} strokeWidth={2.2} />;

      default:
        return <BadgeCheck size={17} strokeWidth={2.2} />;
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* =========================
            SECTION HEADING
        ========================= */}

        <div className={styles.header}>
          <span className={styles.eyebrow}>
            {section?.SectionLabel ||
              "WHY CHOOSE HOMEHUB"}
          </span>

          <h2>
            {section?.Title ||
              "A Smarter Way to Find Your Property"}
          </h2>

          {section?.Subtitle && (
            <p>{section.Subtitle}</p>
          )}
        </div>

        {/* =========================
            SMALL BENEFIT BUTTONS
        ========================= */}

        <div className={styles.benefits}>
          {benefits.map((benefit, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={
                  benefit?.id ||
                  benefit?.documentId ||
                  index
                }
                className={styles.item}
              >
                <button
                  type="button"
                  className={`${styles.benefitButton} ${
                    isActive ? styles.active : ""
                  }`}
                  onClick={() =>
                    setActiveIndex(
                      isActive ? null : index
                    )
                  }
                >
                  {/* =========================
                      ICON
                  ========================= */}

                  <span className={styles.icon}>
                    {getBenefitIcon(benefit?.Icon)}
                  </span>

                  {/* =========================
                      TITLE
                  ========================= */}

                  <span className={styles.title}>
                    {benefit?.ShortTitle ||
                      benefit?.Title ||
                      "Benefit"}
                  </span>

                  {/* =========================
                      PLUS / MINUS
                  ========================= */}

                  <span className={styles.arrow}>
                    {isActive ? "−" : "+"}
                  </span>
                </button>

                {/* =========================
                    CLICKED DETAIL
                ========================= */}

                {isActive &&
                  benefit?.Description && (
                    <div className={styles.description}>
                      {benefit.Description}
                    </div>
                  )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
