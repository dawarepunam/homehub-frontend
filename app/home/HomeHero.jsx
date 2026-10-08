import HomeSearch from "./HomeSearch";
import styles from "./HomeHero.module.css";
import { getStrapiMedia } from "@/utils/getStrapiMedia";
import HeroBackground from "./HeroBackground";

export default function HomeHero({ hero, search }) {
  const backgroundUrl = getStrapiMedia(hero?.BackgroundImage) || "";

  return (
    <section className={styles.heroWrapper}>
      {/* GetSiteGo-inspired Background */}
      <HeroBackground />

      {/* Content */}
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            HOMEHUB &bull; PROPERTY DISCOVERY
          </div>

          <h1 className={styles.title}>
            {hero?.Heading ? (
              hero.Heading
            ) : (
              <>
                Find a place<br />
                <span>you&apos;ll love.</span>
              </>
            )}
          </h1>

          <p className={styles.description}>
            {hero?.Subheading ||
              "Discover homes, spaces & properties that fit your lifestyle across India's top cities."}
          </p>
        </div>

        {/* Search — in normal document flow, not absolutely positioned */}
        <div className={styles.searchContainer}>
          <HomeSearch search={search} />
        </div>
      </div>
    </section>
  );
}