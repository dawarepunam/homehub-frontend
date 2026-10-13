"use client";

import { useEffect, useState } from "react";
import HeroBackground from "@/app/home/HeroBackground";
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

  const displayHeading =
    user && greeting ? greeting : data?.heading || "Find a place you'll love.";
  const displaySubHeading = user
    ? "Find a place that feels like home."
    : data?.subHeading ||
      data?.subheading ||
      "Discover homes, spaces & properties that fit your lifestyle across India's top cities.";

  const badgeText = data?.badgeText || "India's Trusted Property Platform";

  return (
    <section className={styles.heroWrapper}>
      {/* Reusing the exact existing Home Page HeroBackground */}
      <HeroBackground />

      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            {badgeText}
          </div>

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

          <p className={styles.description}>{displaySubHeading}</p>
        </div>

        {/* Search Panel slot */}
        {children && <div className={styles.searchContainer}>{children}</div>}
      </div>
    </section>
  );
}