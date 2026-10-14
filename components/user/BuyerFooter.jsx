"use client";

import Link from "next/link";
import styles from "./BuyerFooter.module.css";

export default function BuyerFooter({ data }) {
  const brandName = data?.BrandName || "HomeHub";
  const description =
    data?.Description ||
    "India's trusted property platform. Connecting buyers, renters, and verified real estate opportunities nationwide.";

  const sortLinks = (links) => {
    if (!Array.isArray(links)) return [];
    return [...links]
      .filter((item) => item?.IsActive !== false)
      .sort((a, b) => (a?.DisplayOrder ?? 999) - (b?.DisplayOrder ?? 999));
  };

  const rawExplore = sortLinks(data?.QuickLinks);
  const rawAccount = sortLinks(data?.PropertyLinks);
  const rawSupport = sortLinks(data?.SupportLinks);
  const socialLinks = sortLinks(data?.SocialLinks);

  // Fallback defaults if Strapi data has empty categories
  const exploreLinks =
    rawExplore.length > 0
      ? rawExplore
      : [
          { Title: "Residential Properties", Link: "/user/properties?type=Residential" },
          { Title: "Commercial Real Estate", Link: "/user/properties?type=Commercial" },
          { Title: "New Launches", Link: "/user/search?tag=new" },
          { Title: "Explore Cities", Link: "/user/search" },
        ];

  const accountLinks =
    rawAccount.length > 0
      ? rawAccount
      : [
          { Title: "Buyer Dashboard", Link: "/user" },
          { Title: "Saved Properties", Link: "/user/wishlist" },
          { Title: "My Enquiries", Link: "/user/enquiries" },
          { Title: "Profile & Settings", Link: "/user/profile" },
        ];

  const supportLinks =
    rawSupport.length > 0
      ? rawSupport
      : [
          { Title: "EMI Calculator", Link: "/user/tools/emi-calculator" },
          { Title: "Affordability Check", Link: "/user/tools/eligibility" },
          { Title: "Property Valuation", Link: "/user/tools/valuation" },
          { Title: "Contact Support", Link: "/user/settings" },
        ];

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
      default: return "→";
    }
  };

  const currentYear = new Date().getFullYear();
  const rawCopyright = data?.CopyrightText || `© {year} HomeHub. All rights reserved.`;
  const copyrightText = rawCopyright.replace("{year}", currentYear).replace("2026", currentYear.toString());

  return (
    <footer className={styles.footer} aria-label="Buyer Footer">
      {/* ── Flowing Fine Curved Wireframe Topography Mesh Inspired by GetSiteGo ── */}
      <div className={styles.meshContainer} aria-hidden="true">
        <svg
          className={styles.meshSvg}
          viewBox="0 0 1000 650"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="footerMeshGrad" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="var(--text-primary)" stopOpacity="0.0" />
              <stop offset="40%" stopColor="var(--text-primary)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--text-primary)" stopOpacity="0.32" />
            </linearGradient>
          </defs>

          {/* Natural flowing contour curves sweeping across right & bottom */}
          <path d="M 120 650 C 350 560, 600 620, 1000 420" className={styles.meshLine} />
          <path d="M 180 650 C 400 520, 650 580, 1000 370" className={styles.meshLine} />
          <path d="M 240 650 C 450 480, 700 540, 1000 320" className={styles.meshLine} />
          <path d="M 300 650 C 500 440, 750 500, 1000 270" className={styles.meshLine} />
          <path d="M 370 650 C 550 400, 800 460, 1000 220" className={styles.meshLine} />
          <path d="M 440 650 C 600 360, 850 420, 1000 170" className={styles.meshLineAccent} />
          <path d="M 520 650 C 660 320, 900 380, 1000 120" className={styles.meshLine} />
          <path d="M 600 650 C 720 280, 940 330, 1000 70" className={styles.meshLine} />
          <path d="M 700 650 C 790 240, 970 280, 1000 20" className={styles.meshLine} />

          {/* Sweeping cross-mesh longitudinal lines */}
          <path d="M 380 650 C 520 500, 720 320, 980 90" className={styles.meshCrossLine} />
          <path d="M 500 650 C 640 480, 810 270, 990 40" className={styles.meshCrossLine} />
          <path d="M 620 650 C 740 460, 880 230, 1000 0" className={styles.meshCrossLine} />
          <path d="M 280 650 C 440 490, 640 330, 880 140" className={styles.meshCrossLine} />
        </svg>
      </div>

      <div className={styles.container}>
        <div className={styles.top}>
          {/* SECTION A — BRAND & MISSION */}
          <div className={styles.brandSection}>
            <Link href="/user" className={styles.brand}>
              <div className={styles.brandMark}>H</div>
              <span className={styles.brandNameText}>{brandName}</span>
            </Link>

            <p className={styles.description}>{description}</p>

            <div className={styles.socials}>
              {socialLinks.length > 0 ? (
                socialLinks.map((social, index) => (
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
                ))
              ) : (
                <>
                  <a href="#" className={styles.socialButton} aria-label="X">X</a>
                  <a href="#" className={styles.socialButton} aria-label="LinkedIn">in</a>
                  <a href="#" className={styles.socialButton} aria-label="Instagram">IG</a>
                </>
              )}
            </div>
          </div>

          {/* SECTION B — EXPLORE */}
          <div className={styles.column}>
            <h3>Explore</h3>
            <ul>{renderLinks(exploreLinks)}</ul>
          </div>

          {/* SECTION C — BUYER ACCOUNT */}
          <div className={styles.column}>
            <h3>Buyer Account</h3>
            <ul>{renderLinks(accountLinks)}</ul>
          </div>

          {/* SECTION D — TOOLS & SUPPORT */}
          <div className={styles.column}>
            <h3>Tools & Support</h3>
            <ul>{renderLinks(supportLinks)}</ul>
          </div>
        </div>

        {/* SECTION E — LEGAL & COPYRIGHT */}
        <div className={styles.bottom}>
          <p>{copyrightText}</p>

          <div className={styles.bottomLinks}>
            <Link href="/user/settings">Privacy Policy</Link>
            <span>&middot;</span>
            <Link href="/user/settings">Terms of Service</Link>
            <span>&middot;</span>
            <Link href="/user/settings">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
