import HomeSearch from "./HomeSearch";
import styles from "./HomeHero.module.css";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

export default function HomeHero({ hero, search }) {
  const backgroundUrl = hero?.BackgroundImage?.url
    ? `${STRAPI_URL.replace("/api", "")}${hero.BackgroundImage.url}`
    : "";

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
          <span>you’ll love.</span>
        </h1>

        <p className={styles.description}>
          Discover homes, spaces &amp; properties that fit your lifestyle.
        </p>
      </div>

      <HomeSearch search={search} />
    </section>
  );
}