"use client";

import Link from "next/link";
import { getStrapiMedia } from "@/utils/getStrapiMedia";
import styles from "./Footer.module.css";

function sortLinks(links) {
  if (!Array.isArray(links)) return [];
  return [...links]
    .filter(l => l?.IsActive !== false)
    .sort((a, b) => (a?.DisplayOrder ?? 999) - (b?.DisplayOrder ?? 999));
}

function getSocialLabel(platform, icon) {
  const v = (icon || platform || "").toLowerCase().trim();
  return { instagram: "IG", facebook: "f", linkedin: "in", youtube: "YT", twitter: "X", x: "X" }[v] || "→";
}

export default function Footer({ data, footerData, copyrightData }) {
  const rawFooter = data ?? footerData ?? copyrightData;
  const footer = Array.isArray(rawFooter) ? rawFooter[0] : rawFooter;

  // Always render footer — use defaults if no Strapi data
  const brandName = footer?.BrandName || "HomeHub";
  const description = footer?.Description || "India's trusted real estate platform. Find, rent, sell and manage properties with ease.";
  const copyrightText = footer?.CopyrightText || `© ${new Date().getFullYear()} HomeHub. All rights reserved.`;
  const logoUrl = getStrapiMedia(footer?.Logo);

  const quickLinks    = sortLinks(footer?.QuickLinks);
  const propertyLinks = sortLinks(footer?.PropertyLinks);
  const supportLinks  = sortLinks(footer?.SupportLinks);
  const socialLinks   = sortLinks(footer?.SocialLinks);

  // Fallback link sets
  const defaultQuickLinks = [
    { id: 1, Title: "Home", Link: "/home" },
    { id: 2, Title: "Properties", Link: "/search" },
    { id: 3, Title: "About Us", Link: "#" },
    { id: 4, Title: "Contact", Link: "#" },
  ];
  const defaultPropertyLinks = [
    { id: 1, Title: "Buy Property", Link: "/search?purpose=Buy" },
    { id: 2, Title: "Rent Property", Link: "/search?purpose=Rent" },
    { id: 3, Title: "Commercial", Link: "/search?purpose=Commercial" },
    { id: 4, Title: "Post Property", Link: "/post-property" },
  ];
  const defaultSupportLinks = [
    { id: 1, Title: "Help Center", Link: "#" },
    { id: 2, Title: "Privacy Policy", Link: "/privacy" },
    { id: 3, Title: "Terms of Use", Link: "/terms" },
  ];

  const renderLinks = (links, fallback) =>
    (links.length > 0 ? links : fallback).map((item, i) => (
      <li key={item?.id || i} className={styles.linkItem}>
        <a href={item?.Link || "#"}>{item?.Title || "Link"}</a>
      </li>
    ));

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>

          {/* BRAND */}
          <div className={styles.brandSection}>
            <div className={styles.brandRow}>
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={brandName} className={styles.logoImg} />
              ) : (
                <div className={styles.logoMark}>H</div>
              )}
              <span className={styles.brandName}>{brandName}</span>
            </div>
            <p className={styles.brandDesc}>{description}</p>
            {socialLinks.length > 0 && (
              <div className={styles.socials}>
                {socialLinks.map((s, i) => (
                  <a
                    key={s?.id || i}
                    href={s?.Link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialBtn}
                    aria-label={s?.Platform || "Social"}
                  >
                    {getSocialLabel(s?.Platform, s?.Icon)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className={styles.columnTitle}>Quick Links</h3>
            <ul className={styles.linkList}>{renderLinks(quickLinks, defaultQuickLinks)}</ul>
          </div>

          {/* PROPERTIES */}
          <div>
            <h3 className={styles.columnTitle}>Properties</h3>
            <ul className={styles.linkList}>{renderLinks(propertyLinks, defaultPropertyLinks)}</ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className={styles.columnTitle}>Support</h3>
            <ul className={styles.linkList}>{renderLinks(supportLinks, defaultSupportLinks)}</ul>
          </div>

        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>{copyrightText}</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
