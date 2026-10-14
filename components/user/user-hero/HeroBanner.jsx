"use client";

import { useEffect, useState } from "react";
import BuyerHeroBackground from "./BuyerHeroBackground";
import { getStrapiMedia } from "@/utils/getStrapiMedia";
import styles from "./HeroBanner.module.css";

export default function HeroBanner({ data, children }) {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);

          const hour = new Date().getHours();
          let timeGreeting = "Good Evening";
          if (hour < 12) timeGreeting = "Good Morning";
          else if (hour < 17) timeGreeting = "Good Afternoon";

          const name = parsedUser.username || parsedUser.name || "Buyer";
          setGreeting(`${timeGreeting}, ${name}`);
        }
      } catch (error) {
        console.error("HeroBanner: user parse error", error);
      }
    }
  }, []);

  const customImageUrl =
    data?.backgroundImage?.url
      ? getStrapiMedia(data.backgroundImage)
      : data?.BackgroundImage?.url
      ? getStrapiMedia(data.BackgroundImage)
      : null;

  const displayHeading =
    user && greeting ? greeting : data?.heading || data?.Heading || "Find a place you'll love.";
  const displaySubHeading = user
    ? "Discover homes, spaces & properties tailored to your lifestyle."
    : data?.subHeading ||
      data?.subheading ||
      data?.Subheading ||
      "Discover homes, spaces & properties that fit your lifestyle across India's top cities.";

  const badgeText = data?.badgeText || data?.BadgeText || "HOMEHUB • REAL ESTATE DISCOVERY";

  return (
    <section className={styles.heroWrapper} aria-label="Buyer Hero Section">
      {/* Static Luxury Hero Backdrop with Visible Globe and Floating Particles */}
      <BuyerHeroBackground customImageUrl={customImageUrl} />

      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          {/* Eyebrow badge */}
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>{badgeText}</span>
          </div>

          {/* Clean Main Headline */}
          <h1 className={styles.title}>
            {user && greeting ? (
              displayHeading
            ) : (
              <>
                Find a place<br />
                <span>you&apos;ll love.</span>
              </>
            )}
          </h1>

          {/* Refined Description */}
          <p className={styles.description}>{displaySubHeading}</p>
        </div>

        {/* Search Panel slot */}
        {children && <div className={styles.searchContainer}>{children}</div>}
      </div>
    </section>
  );
}