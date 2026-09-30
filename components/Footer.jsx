"use client";

import Link from "next/link";

import styles from "../app/owner/Footer.module.css";

export default function Footer({
  data,
  footerData,
  copyrightData,
}) {
  const rawFooter =
    data ?? footerData ?? copyrightData;

  const footer = Array.isArray(rawFooter)
    ? rawFooter[0]
    : rawFooter;

  if (!footer) {
    return null;
  }

  const sortLinks = (links) => {
    if (!Array.isArray(links)) {
      return [];
    }

    return [...links]
      .filter((item) => item?.IsActive !== false)
      .sort(
        (a, b) =>
          (a?.DisplayOrder ?? 999) -
          (b?.DisplayOrder ?? 999)
      );
  };

  const quickLinks = sortLinks(footer?.QuickLinks);
  const propertyLinks = sortLinks(footer?.PropertyLinks);
  const supportLinks = sortLinks(footer?.SupportLinks);
  const socialLinks = sortLinks(footer?.SocialLinks);

  const renderLinks = (links) => {
    return links.map((item, index) => (
      <li
        key={
          item?.id ||
          item?.documentId ||
          index
        }
      >
        <a href={item?.Link || "#"}>
          {item?.Title || "Link"}
        </a>
      </li>
    ));
  };

  const getSocialIcon = (platform, icon) => {
    const value = (
      icon ||
      platform ||
      ""
    )
      .toLowerCase()
      .trim();

    switch (value) {
      case "instagram":
        return "IG";
      case "facebook":
        return "f";
      case "linkedin":
        return "in";
      case "youtube":
        return "YT";
      case "twitter":
      case "x":
        return "X";
      default:
        return "->";
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brandSection}>
            <Link
              href="/"
              className={styles.brand}
            >
              {footer?.BrandName || "HomeHub"}
            </Link>

            {footer?.Description && (
              <p className={styles.description}>
                {footer.Description}
              </p>
            )}

            {socialLinks.length > 0 && (
              <div className={styles.socials}>
                {socialLinks.map(
                  (social, index) => (
                    <a
                      key={
                        social?.id ||
                        social?.documentId ||
                        index
                      }
                      href={
                        social?.Link || "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        styles.socialButton
                      }
                      aria-label={
                        social?.Platform ||
                        "Social media"
                      }
                    >
                      {getSocialIcon(
                        social?.Platform,
                        social?.Icon
                      )}
                    </a>
                  )
                )}
              </div>
            )}
          </div>

          {quickLinks.length > 0 && (
            <div className={styles.column}>
              <h3>Quick Links</h3>
              <ul>
                {renderLinks(quickLinks)}
              </ul>
            </div>
          )}

          {propertyLinks.length > 0 && (
            <div className={styles.column}>
              <h3>Properties</h3>
              <ul>
                {renderLinks(propertyLinks)}
              </ul>
            </div>
          )}

          {supportLinks.length > 0 && (
            <div className={styles.column}>
              <h3>Support</h3>
              <ul>
                {renderLinks(supportLinks)}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.bottom}>
          <p>
            {footer?.CopyrightText ||
              "(c) 2026 HomeHub. All rights reserved."}
          </p>

          <div className={styles.bottomLinks}>
            <Link href="/privacy">
              Privacy
            </Link>
            <span>&middot;</span>
            <Link href="/terms">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
