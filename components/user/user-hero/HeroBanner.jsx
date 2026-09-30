// import Image from "next/image";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// export default function HeroBanner({ data }) {
//   if (!data) return null;

//   const desktopImage = data.BackgroundImage?.url
//     ? `${STRAPI_URL}${data.BackgroundImage.url}`
//     : null;

//   const mobileImage = data.MobileBackground?.url
//     ? `${STRAPI_URL}${data.MobileBackground.url}`
//     : desktopImage;

//   return (
//     <section className="relative h-[650px] w-full overflow-hidden">
//       {/* Desktop Background */}
//       {desktopImage && (
//         <Image
//           src={desktopImage}
//           alt={data.heading || "Hero Banner"}
//           fill
//           priority
//           className="hidden object-cover md:block"
//           unoptimized
//         />
//       )}

//       {/* Mobile Background */}
//       {mobileImage && (
//         <Image
//           src={mobileImage}
//           alt={data.heading || "Hero Banner"}
//           fill
//           priority
//           className="object-cover md:hidden"
//           unoptimized
//         />
//       )}

//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/50" />

//       {/* Content */}
//       <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
//         <div className="max-w-3xl text-white">
//           {data.badgeText && (
//             <span className="mb-5 inline-block rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold">
//               {data.badgeText}
//             </span>
//           )}

//           <h1 className="mb-6 text-5xl font-bold leading-tight lg:text-6xl">
//             {data.heading}
//           </h1>

//           <p className="max-w-2xl text-lg text-gray-200 lg:text-xl">
//             {data.subHeading}
//           </p>
//         </div>
//       </div>
//     </section>
// //   );
// // }
// import Image from "next/image";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// export default function HeroBanner({ data }) {
//   if (!data) return null;

//   console.log("HERO DATA", data);
//   console.log("IMAGE URL", data?.backgroundImage);
//   const desktopImage = data.backgroundImage?.url
//     ? `${STRAPI_URL}${data.backgroundImage.url}`
//     : null;

//   const mobileImage = data.mobileBackground?.url
//     ? `${STRAPI_URL}${data.mobileBackground.url}`
//     : desktopImage;

//   return (
//     <section className="relative h-[650px] w-full overflow-hidden">
//       {/* Background Image */}
//       {desktopImage && (
//         <Image
//           src={desktopImage}
//           alt={data.heading || "Hero Banner"}
//           fill
//           priority
//           unoptimized
//           className="object-cover"
//         />
//       )}

//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-black/45" />

//       {/* Hero Content */}
//       <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-8">
//         <div className="max-w-2xl">
//           {data.badgeText && (
//             <span className="mb-6 inline-block rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white">
//               {data.badgeText}
//             </span>
//           )}

//           <h1 className="mb-5 text-5xl font-bold leading-tight text-white lg:text-6xl">
//             {data.heading}
//           </h1>

//           <p className="text-lg text-gray-200 lg:text-xl">{data.subHeading}</p>
//         </div>
//       </div>
//     </section>
//   );
// // }
// import Image from "next/image";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// export default function HeroBanner({ data }) {
//   if (!data) return null;

//   console.log("HERO DATA", data);
//   console.log("IMAGE URL", data?.backgroundImage);

//   const desktopImage = data.backgroundImage?.url
//     ? `${STRAPI_URL}${data.backgroundImage.url}`
//     : null;

//   return (
//     <section className="relative h-[520px] w-full overflow-hidden">
//       {/* Background Image */}
//       {desktopImage && (
//         <Image
//           src={desktopImage}
//           alt={data.heading || "Hero Banner"}
//           fill
//           priority
//           unoptimized
//           className="object-cover"
//         />
//       )}

//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-black/40" />

//       {/* Hero Content */}
//       <div className="relative z-10 mx-auto flex h-full max-w-7xl items-start px-8 pt-24">
//         <div className="max-w-2xl">
//           {data.badgeText && (
//             <span className="mb-5 inline-flex rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg">
//               {data.badgeText}
//             </span>
//           )}

//           <h1 className="mb-4 text-5xl font-extrabold leading-[1.1] text-white lg:text-6xl">
//             {data.heading}
//           </h1>

//           <p className="max-w-xl text-lg leading-8 text-gray-200 lg:text-xl">
//             {data.subHeading}
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// // }
// import Image from "next/image";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// export default function HeroBanner({ data }) {
//   if (!data) return null;

//   console.log("HERO DATA", data);

//   const desktopImage = data?.backgroundImage?.url
//     ? `${STRAPI_URL}${data.backgroundImage.url}`
//     : null;

//   return (
//     <section className="relative h-[560px] w-full overflow-hidden">
//       {/* Background Image */}
//       {desktopImage && (
//         <Image
//           src={desktopImage}
//           alt={data.heading || "Hero Banner"}
//           fill
//           priority
//           unoptimized
//           className="object-cover"
//         />
//       )}

//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/45" />

//       {/* Content */}
//       <div className="relative z-10 mx-auto flex h-full max-w-7xl items-start px-6 pt-16 lg:px-8 lg:pt-20">
//         <div className="max-w-2xl">
//           {data.badgeText && (
//             <span className="mb-5 inline-flex items-center rounded-full bg-blue-700/80 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">
//               {data.badgeText}
//             </span>
//           )}

//           <h1 className="mb-5 text-5xl font-extrabold leading-tight text-white lg:text-7xl">
//             {data.heading}
//           </h1>

//           <p className="max-w-xl text-lg leading-8 text-gray-200 lg:text-xl">
//             {data.subHeading}
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// // }
// import Image from "next/image";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// export default function HeroBanner({ data }) {
//   if (!data) return null;

//   console.log("===== HERO DATA =====");
//   console.log(data);

//   console.log("===== BACKGROUND IMAGE =====");
//   console.log(data?.backgroundImage);

//   const desktopImage = data?.backgroundImage?.url
//     ? `${STRAPI_URL}${data.backgroundImage.url}`
//     : null;

//   console.log("===== IMAGE URL =====");
//   console.log(desktopImage);

//   return (
//     <section className="relative h-140 w-full overflow-hidden">
//       {/* Background Image */}
//       {desktopImage ? (
//         <Image
//           src={desktopImage}
//           alt={data.heading || "Hero Banner"}
//           fill
//           priority
//           unoptimized
//           className="object-cover"
//         />
//       ) : (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
//           <p className="text-red-600 font-bold">Background Image Not Found</p>
//         </div>
//       )}

//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/45" />

//       {/* Content */}
//       <div className="relative z-10 mx-auto flex h-full max-w-7xl items-start px-6 pt-16 lg:px-8 lg:pt-20">
//         <div className="max-w-2xl">
//           {data?.badgeText && (
//             <span className="mb-5 inline-flex rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white">
//               {data.badgeText}
//             </span>
//           )}

//           <h1 className="mb-5 text-5xl font-extrabold text-white lg:text-7xl">
//             {data?.heading}
//           </h1>

//           <p className="text-lg text-gray-200 lg:text-xl">{data?.subHeading}</p>
//         </div>
//       </div>
//     </section>
//   );
// }
// import Image from "next/image";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// export default function HeroBanner({ data }) {
//   if (!data) return null;

//   console.log("===== HERO DATA =====");
//   console.log(JSON.stringify(data, null, 2));

//   const image =
//     data?.backgroundImage ||
//     data?.BackgroundImage ||
//     data?.background_image ||
//     null;

//   const desktopImage = image?.url
//     ? `${STRAPI_URL}${image.url}`
//     : "http://localhost:1337/uploads/garden_75fe1a72ce.jpg";

//   console.log("IMAGE", image);
//   console.log("DESKTOP IMAGE", desktopImage);

//   return (
//     <section className="relative h-140 w-full overflow-hidden">
//       <Image
//         src={desktopImage}
//         alt="Hero"
//         fill
//         priority
//         unoptimized
//         className="object-cover"
//       />

//       <div className="absolute inset-0 bg-black/45" />

//       <div className="relative z-10 mx-auto flex h-full max-w-7xl items-start px-6 pt-16 lg:px-8 lg:pt-20">
//         <div className="max-w-2xl">
//           <h1 className="text-6xl font-bold text-white">{data.heading}</h1>

//           <p className="mt-4 text-xl text-white">{data.subHeading}</p>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

export default function HeroBanner({ data }) {
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

  if (!data) {
    // No Strapi data — render a premium gradient hero
    return (
      <section
        className="relative h-[560px] w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f4c81 0%, #1a6fa8 40%, #0e8a7a 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-start px-6 pt-20 lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white">
              India&#39;s Trusted Property Platform
            </span>
            <h1 className="text-5xl font-bold text-white lg:text-6xl">
              {greeting || "Find Your Dream Home"}
            </h1>
            <p className="mt-4 text-xl text-white/90">
              Find a place that feels like home.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const image = data?.backgroundImage || null;
  const hasImage = Boolean(image?.url);

  const desktopImage = hasImage
    ? image.url.startsWith("http")
      ? image.url
      : `${STRAPI_URL}${image.url}`
    : null;

  const displayHeading = user && greeting ? greeting : (data.heading || "Find Your Dream Home");
  const displaySubHeading = user
    ? "Find a place that feels like home."
    : (data.subHeading || "Discover thousands of properties across India.");

  return (
    <section
      className="relative h-[480px] w-full overflow-hidden"
      style={
        !hasImage
          ? {
              background:
                "linear-gradient(135deg, #0D3326 0%, #154D3A 40%, #0D3326 100%)",
            }
          : undefined
      }
    >
      {hasImage && (
        <Image
          src={desktopImage}
          alt={data.heading || "Hero"}
          fill
          priority
          unoptimized
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-start px-6 pt-20 lg:px-8">
        <div className="max-w-2xl">
          {data.badgeText && (
            <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              {data.badgeText}
            </span>
          )}
          {!data.badgeText && (
            <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              India&#39;s Trusted Property Platform
            </span>
          )}

          <h1 className="text-5xl font-extrabold text-white lg:text-7xl leading-tight">
            Find a place <br/>
            <span style={{ color: "#D7AE62" }}>you'll love.</span>
          </h1>

          <p className="mt-6 text-xl font-medium text-white/90">
            {data?.subHeading || "Buy, rent or discover verified properties that match your needs."}
          </p>
        </div>
      </div>
    </section>
  );
}