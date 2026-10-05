"use client";

import { useState } from "react";
import { BadgeCheck, UserCheck, Gem, Search, ShieldCheck } from "lucide-react";
import styles from "./WhyChooseHomeHub.module.css";

const ICON_MAP = {
  verified: <BadgeCheck size={28} strokeWidth={1.8} />,
  trusted:  <UserCheck  size={28} strokeWidth={1.8} />,
  genuine:  <Gem        size={28} strokeWidth={1.8} />,
  search:   <Search     size={28} strokeWidth={1.8} />,
  secure:   <ShieldCheck size={28} strokeWidth={1.8} />,
};

function getBenefitIcon(iconName) {
  return ICON_MAP[iconName?.toLowerCase()?.trim()] ?? <BadgeCheck size={28} strokeWidth={1.8} />;
}

export default function WhyChooseHomeHub({ data }) {
  const section = Array.isArray(data) ? data[0] : data;

  const benefits = Array.isArray(section?.Benefits)
    ? [...section.Benefits]
        .filter(b => b?.IsActive !== false)
        .sort((a, b) => (a?.DisplayOrder ?? 999) - (b?.DisplayOrder ?? 999))
    : [];

  if (!section && benefits.length === 0) return null;

  // Show even without data — use default trust points
  const displayBenefits = benefits.length > 0 ? benefits : [
    { id: 1, Icon: "verified", ShortTitle: "Verified Listings",   Description: "Every property is manually reviewed for authenticity." },
    { id: 2, Icon: "trusted",  ShortTitle: "Trusted Owners",       Description: "Connect directly with verified property owners." },
    { id: 3, Icon: "genuine",  ShortTitle: "Genuine Properties",   Description: "Zero fake listings — real homes, real details." },
    { id: 4, Icon: "search",   ShortTitle: "Easy Discovery",       Description: "Advanced filters to find exactly what you need." },
    { id: 5, Icon: "secure",   ShortTitle: "Secure Platform",      Description: "Your data is encrypted and always protected." },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Why HomeHub</span>
          <h2>{section?.Title || "A Smarter Way to Find Your Property"}</h2>
        </div>

        <div className={styles.grid}>
          {displayBenefits.map((benefit, index) => (
            <div
              key={benefit?.id || benefit?.documentId || index}
              className={styles.card}
            >
              <div className={styles.icon}>
                {getBenefitIcon(benefit?.Icon)}
              </div>
              <h3 className={styles.title}>
                {benefit?.ShortTitle || benefit?.Title || "Benefit"}
              </h3>
              {benefit?.Description && (
                <p className={styles.desc}>{benefit.Description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
