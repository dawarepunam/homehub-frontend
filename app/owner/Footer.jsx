"use client";

import Link from "next/link";

import styles from "./Footer.module.css";

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

  // ── Fallback footer when no Strapi data is provided ──────────────────────
  if (!footer) {
    return (
      <footer style={{
        backgroundColor: "#064d3b",
        color: "#e8e2d6",
        padding: "40px 24px 20px",
        marginTop: "auto",
        fontFamily: "inherit",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "space-between", marginBottom: "32px" }}>
            {/* Brand */}
            <div style={{ minWidth: "200px" }}>
              <a href="/owner" style={{ fontSize: "22px", fontWeight: 800, color: "#c99838", textDecoration: "none", letterSpacing: "-0.5px" }}>
                HomeHub
              </a>
              <p style={{ marginTop: "10px", fontSize: "13px", color: "#a0b5ae", lineHeight: "1.6", maxWidth: "260px" }}>
                Your trusted real-estate owner portal for managing properties, enquiries and site visits.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#c99838", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                Owner Portal
              </h3>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { label: "Dashboard", href: "/owner/dashboard" },
                  { label: "My Properties", href: "/owner/properties" },
                  { label: "Enquiries", href: "/owner/enquiries" },
                  { label: "Site Visits", href: "/owner/site-visits" },
                  { label: "Insights", href: "/owner/insights" },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} style={{ color: "#c8d8d0", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => e.target.style.color = "#c99838"}
                      onMouseLeave={(e) => e.target.style.color = "#c8d8d0"}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Insights */}
            <div>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#c99838", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                Insights
              </h3>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { label: "Performance", href: "/owner/insights/performance" },
                  { label: "Reports", href: "/owner/insights/reports" },
                  { label: "Market Trends", href: "/owner/insights/market-trends" },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} style={{ color: "#c8d8d0", fontSize: "13px", textDecoration: "none" }}
                      onMouseEnter={(e) => e.target.style.color = "#c99838"}
                      onMouseLeave={(e) => e.target.style.color = "#c8d8d0"}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid #1a5c47", paddingTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <p style={{ fontSize: "12px", color: "#6a8f82", margin: 0 }}>
              © {new Date().getFullYear()} HomeHub. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              {[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }].map((link) => (
                <a key={link.href} href={link.href} style={{ fontSize: "12px", color: "#6a8f82", textDecoration: "none" }}
                  onMouseEnter={(e) => e.target.style.color = "#c99838"}
                  onMouseLeave={(e) => e.target.style.color = "#6a8f82"}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
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
              href="/owner"
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
