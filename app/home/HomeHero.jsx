import HomeSearch from "./HomeSearch";
import styles from "./HomeHero.module.css";
import { getStrapiMedia } from "@/utils/getStrapiMedia";

export default function HomeHero({ hero, search }) {
  // Use the canonical getStrapiMedia utility — handles both Strapi 5 flat
  // and Strapi 4 nested formats, and always produces the correct production URL.
  const backgroundUrl = getStrapiMedia(hero?.BackgroundImage) || "";

  return (
    <section
      className={styles.hero}
      style={
        backgroundUrl
          ? {
              backgroundImage: `linear-gradient(
                90deg,
                rgba(5, 28, 22, 0.92) 0%,
                rgba(5, 28, 22, 0.62) 38%,
                rgba(5, 28, 22, 0.12) 75%,
                rgba(5, 28, 22, 0.2) 100%
              ), url("${backgroundUrl}")`,
            }
          : undefined
      }
    >
      <div className={styles.heroContent}>
        <div className={styles.badge}>
          <span>⌂</span>
          HOMEHUB • PROPERTY DISCOVERY
        </div>

        <h1 className={styles.title}>
          Find a place
          <br />
          <span>you&apos;ll love.</span>
        </h1>

        <p className={styles.description}>
          Discover homes, spaces &amp; properties that fit your lifestyle.
        </p>
      </div>

      <HomeSearch search={search} />
    </section>
  );
}