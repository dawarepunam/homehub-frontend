// "use client";

// import styles from "./PopularLocations.module.css";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// export default function PopularLocations({ data }) {
//   if (!data) {
//     return null;
//   }

//   const locations = data.PopularLocationItem || [];

//   return (
//     <section className={styles.section}>
//       <div className={styles.container}>
//         <div className={styles.heading}>
//           <span className={styles.eyebrow}>
//             EXPLORE LOCATIONS
//           </span>

//           <h2>{data.Title || "Popular Locations"}</h2>

//           <p>
//             {data.Subtitle ||
//               "Discover properties in India's most sought-after cities and localities."}
//           </p>
//         </div>

//         {locations.length > 0 && (
//           <div className={styles.locationGrid}>
//             {locations
//               .filter((location) => location.IsActive !== false)
//               .map((location) => {
//                 const imageUrl = location.Image?.url
//                   ? `${STRAPI_URL.replace("/api", "")}${location.Image.url}`
//                   : null;

//                 return (
//                   <a
//                     key={location.id}
//                     href={location.Slug || "#"}
//                     className={styles.locationCard}
//                   >
//                     {imageUrl ? (
//                       <div className={styles.imageWrapper}>
//                         <img
//                           src={imageUrl}
//                           alt={location.Name || "Property location"}
//                           className={styles.locationImage}
//                         />
//                       </div>
//                     ) : (
//                       <div className={styles.icon}>
//                         <span>⌖</span>
//                       </div>
//                     )}

//                     <div className={styles.cardContent}>
//                       <h3>{location.Name}</h3>

//                       {location.Description && (
//                         <p>{location.Description}</p>
//                       )}
//                     </div>

//                     <span className={styles.arrow}>→</span>
//                   </a>
//                 );
//               })}
//           </div>
//         )}

//         {locations.length === 0 && (
//           <div className={styles.emptyState}>
//             <p>No popular locations available.</p>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }


// "use client";

// import styles from "./PopularLocations.module.css";

// const STRAPI_BASE_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// export default function PopularLocations({ data }) {
//   if (!data) {
//     return null;
//   }

//   // Strapi component single किंवा repeatable
//   // दोन्ही cases handle करतो
//   const sectionData = Array.isArray(data) ? data[0] : data;

//   if (!sectionData) {
//     return null;
//   }

//   // PopularLocationItem data
//   const locations = Array.isArray(sectionData.PopularLocationItem)
//     ? sectionData.PopularLocationItem
//     : [];

//   // Active locations
//   const activeLocations = locations.filter(
//     (location) => location?.IsActive !== false
//   );

//   // Strapi image URL
//   const getImageUrl = (image) => {
//     if (!image) {
//       return null;
//     }

//     if (image.url) {
//       return image.url.startsWith("http")
//         ? image.url
//         : `${STRAPI_BASE_URL}${image.url}`;
//     }

//     if (image.data?.attributes?.url) {
//       const url = image.data.attributes.url;

//       return url.startsWith("http")
//         ? url
//         : `${STRAPI_BASE_URL}${url}`;
//     }

//     return null;
//   };

//   return (
//     <section className={styles.section}>
//       <div className={styles.container}>

//         {/* Heading */}
//         <div className={styles.heading}>
//           <span className={styles.eyebrow}>
//             EXPLORE LOCATIONS
//           </span>

//           <h2>
//             {sectionData.Title || "Popular Locations"}
//           </h2>

//           <p>
//             {sectionData.Subtitle ||
//               "Discover properties in India's most sought-after cities and localities."}
//           </p>
//         </div>

//         {/* Cards */}
//         {activeLocations.length > 0 ? (
//           <div className={styles.locationGrid}>
//             {activeLocations.map((location, index) => {
//               const imageUrl = getImageUrl(location.Image);

//               return (
//                 <a
//                   key={location.id || location.documentId || index}
//                   href={location.Slug || "#"}
//                   className={styles.locationCard}
//                 >
//                   {/* Image */}
//                   {imageUrl ? (
//                     <div className={styles.imageWrapper}>
//                       <img
//                         src={imageUrl}
//                         alt={
//                           location.Name ||
//                           "Property location"
//                         }
//                         className={styles.locationImage}
//                       />
//                     </div>
//                   ) : (
//                     <div className={styles.icon}>
//                       <span>⌖</span>
//                     </div>
//                   )}

//                   {/* Card Content */}
//                   <div className={styles.cardContent}>
//                     <h3>
//                       {location.Name || "Location"}
//                     </h3>

//                     {location.Description && (
//                       <p>
//                         {location.Description}
//                       </p>
//                     )}
//                   </div>

//                   {/* Arrow */}
//                   <span className={styles.arrow}>
//                     →
//                   </span>
//                 </a>
//               );
//             })}
//           </div>
//         ) : (
//           <div className={styles.emptyState}>
//             <p>No popular locations available.</p>
//           </div>
//         )}

//       </div>
//     </section>
//   );
// }


"use client";

import Link from "next/link";
import styles from "./PopularLocations.module.css";

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

export default function PopularLocations({ data }) {
  if (!data) {
    return null;
  }

  // Strapi component single किंवा repeatable
  // दोन्ही cases handle करतो
  const sectionData = Array.isArray(data) ? data[0] : data;

  if (!sectionData) {
    return null;
  }

  // PopularLocationItem data
  const locations = Array.isArray(sectionData.PopularLocationItem)
    ? sectionData.PopularLocationItem
    : [];

  // Active locations
  const activeLocations = locations.filter(
    (location) => location?.IsActive !== false
  );

  // Strapi image URL
  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    if (image.url) {
      return image.url.startsWith("http")
        ? image.url
        : `${STRAPI_BASE_URL}${image.url}`;
    }

    if (image.data?.attributes?.url) {
      const url = image.data.attributes.url;

      return url.startsWith("http")
        ? url
        : `${STRAPI_BASE_URL}${url}`;
    }

    return null;
  };

  return (
    <section id="popular-locations" className={styles.section}>
      <div className={styles.container}>

        {/* Heading */}
        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            EXPLORE LOCATIONS
          </span>

          <h2>
            {sectionData.Title || "Popular Locations"}
          </h2>

          <p>
            {sectionData.Subtitle ||
              "Discover properties in India's most sought-after cities and localities."}
          </p>
        </div>

        {/* Cards */}
        {activeLocations.length > 0 ? (
          <div className={styles.locationGrid}>
            {activeLocations.map((location, index) => {
              const imageUrl = getImageUrl(location.Image);

              /*
               * IMPORTANT:
               * Strapi:
               * Name = Pune
               *
               * Click:
               * /search?location=Pune
               */

              const cityName = location.Name || "";

              const locationUrl = cityName
                ? `/search?location=${encodeURIComponent(cityName)}`
                : "/search";

              return (
                <Link
                  key={location.id || location.documentId || index}
                  href={locationUrl}
                  className={styles.locationCard}
                >
                  {/* Image */}
                  {imageUrl ? (
                    <div className={styles.imageWrapper}>
                      <img
                        src={imageUrl}
                        alt={
                          location.Name ||
                          "Property location"
                        }
                        className={styles.locationImage}
                      />
                    </div>
                  ) : (
                    <div className={styles.icon}>
                      <span>⌖</span>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className={styles.cardContent}>
                    <h3>
                      {location.Name || "Location"}
                    </h3>

                    {location.Description && (
                      <p>
                        {location.Description}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <span className={styles.arrow}>
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No popular locations available.</p>
          </div>
        )}

      </div>
    </section>
  );
}