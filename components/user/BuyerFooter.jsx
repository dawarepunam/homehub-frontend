"use client";

import Link from "next/link";
import styles from "../../app/owner/Footer.module.css";

export default function BuyerFooter({ data }) {
  if (!data) return null;

  const sortLinks = (links) => {
    if (!Array.isArray(links)) return [];
    return [...links]
      .filter((item) => item?.IsActive !== false)
      .sort((a, b) => (a?.DisplayOrder ?? 999) - (b?.DisplayOrder ?? 999));
  };

  const exploreLinks = sortLinks(data?.QuickLinks);
  const accountLinks = sortLinks(data?.PropertyLinks);
  const supportLinks = sortLinks(data?.SupportLinks);
  const socialLinks = sortLinks(data?.SocialLinks);

  const renderLinks = (links) => {
    return links.map((item, index) => (
      <li key={item?.id || item?.documentId || index}>
        <Link href={item?.Link || "#"}>{item?.Title || "Link"}</Link>
      </li>
    ));
  };

  const getSocialIcon = (platform, icon) => {
    const value = (icon || platform || "").toLowerCase().trim();
    switch (value) {
      case "instagram": return "IG";
      case "facebook": return "f";
      case "linkedin": return "in";
      case "youtube": return "YT";
      case "twitter":
      case "x": return "X";
      default: return "->";
    }
  };

  const currentYear = new Date().getFullYear();
  const rawCopyright = data?.CopyrightText || `© {year} HomeHub. All rights reserved.`;
  const copyrightText = rawCopyright.replace("{year}", currentYear).replace("2026", currentYear.toString());

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          {/* SECTION A — BRAND */}
          <div className={styles.brandSection}>
            <Link href="/user" className={styles.brand}>
              {data?.BrandName || "HomeHub"}
            </Link>

            {data?.Description && (
              <p className={styles.description}>{data.Description}</p>
            )}

            {socialLinks.length > 0 && (
              <div className={styles.socials}>
                {socialLinks.map((social, index) => (
                  <a
                    key={social?.id || social?.documentId || index}
                    href={social?.Link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialButton}
                    aria-label={social?.Platform || "Social media"}
                  >
                    {getSocialIcon(social?.Platform, social?.Icon)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* SECTION B — EXPLORE */}
          {exploreLinks.length > 0 && (
            <div className={styles.column}>
              <h3>Explore</h3>
              <ul>{renderLinks(exploreLinks)}</ul>
            </div>
          )}

          {/* SECTION C — BUYER ACCOUNT */}
          {accountLinks.length > 0 && (
            <div className={styles.column}>
              <h3>Buyer Account</h3>
              <ul>{renderLinks(accountLinks)}</ul>
            </div>
          )}

          {/* SECTION D — SUPPORT */}
          {supportLinks.length > 0 && (
            <div className={styles.column}>
              <h3>Support</h3>
              <ul>{renderLinks(supportLinks)}</ul>
            </div>
          )}
        </div>

        <div className={styles.bottom}>
          <p>{copyrightText}</p>

          <div className={styles.bottomLinks}>
            <Link href="/user/settings">Privacy</Link>
            <span>&middot;</span>
            <Link href="/user/settings">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
