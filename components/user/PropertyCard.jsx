// // // "use client";

// // // import Link from "next/link";
// // // import { MapPin } from "lucide-react";

// // // const STRAPI_URL =
// // //   process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
// // //   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
// // //   "http://localhost:1337";

// // // export default function PropertyCard({ property }) {
// // //   if (!property) return null;

// // //   const image = property?.CoverImage?.url
// // //     ? `${STRAPI_URL}${property.CoverImage.url}`
// // //     : "/no-property.png";

// // //   const title = property?.Title || "Untitled Property";
// // //   const city = property?.City || "";
// // //   const area = property?.Area || "";
// // //   const purpose = property?.Purpose || "Purpose";
// // //   const propertyType = property?.Property_Type || "Property";
// // //   const price = property?.PropertyCommonDetails?.Price || "Price on Request";
// // //   const documentId = property?.documentId;

// // //   return (
// // //     <article className="overflow-hidden rounded-lg border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
// // //       <div className="relative h-60 w-full overflow-hidden">
// // //         <img src={image} alt={title} className="h-full w-full object-cover" />

// // //         <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
// // //           {propertyType}
// // //         </span>

// // //         <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
// // //           {purpose}
// // //         </span>
// // //       </div>

// // //       <div className="p-5">
// // //         <h3 className="line-clamp-1 text-xl font-bold text-gray-900">
// // //           {title}
// // //         </h3>

// // //         <p className="mt-2 text-lg font-semibold text-blue-600">{price}</p>

// // //         <p className="mt-2 flex items-center gap-1 text-sm text-gray-600">
// // //           <MapPin size={15} className="shrink-0 text-blue-600" />
// // //           <span>
// // //             {area}
// // //             {area && city ? ", " : ""}
// // //             {city}
// // //           </span>
// // //         </p>

// // //         <div className="mt-4 flex flex-wrap gap-2">
// // //           <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
// // //             {purpose}
// // //           </span>

// // //           <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
// // //             {propertyType}
// // //           </span>
// // //         </div>

// // //         <div className="mt-6 grid grid-cols-2 gap-3">
// // //           <Link
// // //             href={`/user/property/${documentId}`}
// // //             className="rounded-lg bg-blue-600 px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
// // //           >
// // //             View Details
// // //           </Link>

// // //           <Link
// // //             href={`/user/contact-owner/${documentId}`}
// // //             className="rounded-lg border border-blue-600 bg-white px-3 py-3 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
// // //           >
// // //             Contact Owner
// // //           </Link>
// // //         </div>
// // //       </div>
// // //     </article>
// // //   );
// // // // }
// // "use client";

// // import { useState } from "react";
// // import Link from "next/link";
// // import { MapPin, Heart } from "lucide-react";

// // const STRAPI_URL =
// //   process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
// //   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
// //   "http://localhost:1337";

// // export default function PropertyCard({ property }) {
// //   if (!property) return null;

// //   const [liked, setLiked] = useState(false);

// //   const image = property?.CoverImage?.url
// //     ? `${STRAPI_URL}${property.CoverImage.url}`
// //     : "/no-property.png";

// //   const title = property?.Title || "Untitled Property";
// //   const city = property?.City || "";
// //   const area = property?.Area || "";
// //   const purpose = property?.Purpose || "Purpose";
// //   const propertyType = property?.Property_Type || "Property";
// //   const price = property?.PropertyCommonDetails?.Price || "Price on Request";
// //   const documentId = property?.documentId;

// //   return (
// //     <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
// //       {/* IMAGE */}
// //       <div className="relative h-60 w-full overflow-hidden">
// //         <img
// //           src={image}
// //           alt={title}
// //           className="h-full w-full object-cover transition duration-300 hover:scale-105"
// //         />

// //         {/* Property Type */}
// //         <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
// //           {propertyType}
// //         </span>

// //         {/* Purpose */}
// //         <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
// //           {purpose}
// //         </span>
// //       </div>

// //       {/* CONTENT */}
// //       <div className="p-5">
// //         <h3 className="line-clamp-1 text-xl font-bold text-gray-900">
// //           {title}
// //         </h3>

// //         <p className="mt-2 text-xl font-bold text-blue-600">{price}</p>

// //         <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
// //           <MapPin size={16} className="text-blue-600" />

// //           <span>
// //             {area}
// //             {area && city ? ", " : ""}
// //             {city}
// //           </span>
// //         </p>

// //         {/* Tags */}
// //         <div className="mt-5 flex flex-wrap gap-2">
// //           <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
// //             {purpose}
// //           </span>

// //           <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
// //             {propertyType}
// //           </span>
// //         </div>

// //         {/* Buttons */}
// //         <div className="mt-6 grid grid-cols-[1fr_1fr_55px] gap-3">
// //           <Link
// //             href={`/user/property/${documentId}`}
// //             className="rounded-lg bg-blue-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
// //           >
// //             View Details
// //           </Link>

// //           <Link
// //             href={`/user/contact-owner/${documentId}`}
// //             className="rounded-lg border border-blue-600 bg-white py-3 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
// //           >
// //             Contact Owner
// //           </Link>

// //           <button
// //             onClick={() => setLiked(!liked)}
// //             className="flex items-center justify-center rounded-lg border border-gray-300 bg-white transition hover:border-red-400 hover:bg-red-50"
// //           >
// //             <Heart
// //               size={22}
// //               className={`transition-all duration-300 ${
// //                 liked ? "fill-red-500 text-red-500" : "text-gray-500"
// //               }`}
// //             />
// //           </button>
// //         </div>
// //       </div>
// //     </article>
// //   );
// // }
// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { MapPin, Heart } from "lucide-react";
// import toast from "react-hot-toast";

// import {
//   addToWishlist,
//   removeFromWishlist,
//   isPropertyInWishlist,
// } from "@/services/wishlistService";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// export default function PropertyCard({ property }) {
//   const [liked, setLiked] = useState(false);
//   const [loading, setLoading] = useState(false);

//   if (!property) {
//     return null;
//   }

//   const documentId = property?.documentId;

//   const title = property?.Title || "Untitled Property";
//   const city = property?.City || "";
//   const area = property?.Area || "";
//   const purpose = property?.Purpose || "Purpose";
//   const propertyType = property?.Property_Type || "Property";

//   const price = property?.PropertyCommonDetails?.Price || "Price on Request";

//   // =====================================================
//   // CHECK WISHLIST WHEN CARD LOADS
//   // =====================================================

//   useEffect(() => {
//     let mounted = true;

//     async function checkWishlist() {
//       if (!documentId) {
//         return;
//       }

//       const token =
//         typeof window !== "undefined"
//           ? localStorage.getItem("token") ||
//             localStorage.getItem("jwt") ||
//             localStorage.getItem("strapi_jwt")
//           : null;

//       if (!token) {
//         return;
//       }

//       try {
//         const result = await isPropertyInWishlist(documentId);

//         if (mounted) {
//           setLiked(result);
//         }
//       } catch (error) {
//         console.error("CHECK PROPERTY WISHLIST ERROR:", error);
//       }
//     }

//     checkWishlist();

//     return () => {
//       mounted = false;
//     };
//   }, [documentId]);

//   // =====================================================
//   // WISHLIST CLICK
//   // =====================================================

//   const handleWishlist = async () => {
//     if (loading) {
//       return;
//     }

//     const token =
//       typeof window !== "undefined"
//         ? localStorage.getItem("token") ||
//           localStorage.getItem("jwt") ||
//           localStorage.getItem("strapi_jwt")
//         : null;

//     if (!token) {
//       toast.error("Please login to use wishlist.");
//       return;
//     }

//     if (!documentId) {
//       toast.error("Property ID not found.");
//       return;
//     }

//     try {
//       setLoading(true);

//       if (liked) {
//         await removeFromWishlist(documentId);

//         setLiked(false);

//         toast.success("Property removed from wishlist.");
//       } else {
//         await addToWishlist(documentId);

//         setLiked(true);

//         toast.success("Property added to wishlist ❤️");
//       }
//     } catch (error) {
//       console.error("WISHLIST BUTTON ERROR:", error);

//       toast.error(error?.message || "Wishlist update failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // IMAGE
//   // =====================================================

//   let imageUrl = "/no-property.png";

//   if (property?.CoverImage?.url) {
//     imageUrl = property.CoverImage.url;

//     if (!imageUrl.startsWith("http")) {
//       imageUrl = `${STRAPI_URL}${imageUrl}`;
//     }
//   }

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <article className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
//       {/* IMAGE */}

//       <div className="relative h-60 w-full overflow-hidden bg-gray-100">
//         <Image
//           src={imageUrl}
//           alt={title}
//           fill
//           sizes="(max-width: 768px) 100vw, 400px"
//           className="object-cover transition duration-500 hover:scale-105"
//           unoptimized
//         />

//         {/* PROPERTY TYPE */}

//         <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
//           {propertyType}
//         </span>

//         {/* PURPOSE */}

//         <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
//           {purpose}
//         </span>
//       </div>

//       {/* CONTENT */}

//       <div className="p-5">
//         {/* TITLE */}

//         <h3 className="line-clamp-1 text-xl font-bold text-gray-900">
//           {title}
//         </h3>

//         {/* PRICE */}

//         <p className="mt-2 text-xl font-bold text-blue-600">{price}</p>

//         {/* LOCATION */}

//         <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
//           <MapPin size={16} className="text-blue-600" />

//           <span>
//             {area}

//             {area && city ? ", " : ""}

//             {city}
//           </span>
//         </p>

//         {/* TAGS */}

//         <div className="mt-5 flex flex-wrap gap-2">
//           <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
//             {purpose}
//           </span>

//           <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
//             {propertyType}
//           </span>
//         </div>

//         {/* BUTTONS */}

//         <div className="mt-6 grid grid-cols-[1fr_1fr_55px] gap-3">
//           {/* VIEW DETAILS */}

//           <Link
//             href={`/user/property/${documentId}`}
//             className="rounded-lg bg-blue-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
//           >
//             View Details
//           </Link>

//           {/* CONTACT OWNER */}

//           <Link
//             href={`/user/contact-owner/${documentId}`}
//             className="rounded-lg border border-blue-600 bg-white py-3 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
//           >
//             Contact Owner
//           </Link>

//           {/* WISHLIST */}

//           <button
//             type="button"
//             onClick={handleWishlist}
//             disabled={loading}
//             className={`flex items-center justify-center rounded-lg border transition ${
//               liked
//                 ? "border-red-400 bg-red-50"
//                 : "border-gray-300 bg-white hover:border-red-400 hover:bg-red-50"
//             } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
//             aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
//           >
//             <Heart
//               size={22}
//               className={`transition-all duration-300 ${
//                 liked ? "fill-red-500 text-red-500" : "text-gray-500"
//               }`}
//             />
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }
// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { MapPin, Heart } from "lucide-react";
// import toast from "react-hot-toast";

// import {
//   addToWishlist,
//   removeFromWishlist,
//   isPropertyInWishlist,
// } from "@/services/wishlistService";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// export default function PropertyCard({ property }) {
//   const [liked, setLiked] = useState(false);
//   const [loading, setLoading] = useState(false);

//   if (!property) {
//     return null;
//   }

//   // =====================================================
//   // PROPERTY DATA
//   // =====================================================

//   const documentId = property?.documentId;

//   const title = property?.Title || "Untitled Property";
//   const city = property?.City || "";
//   const area = property?.Area || "";
//   const purpose = property?.Purpose || "Purpose";
//   const propertyType = property?.Property_Type || "Property";

//   const price = property?.PropertyCommonDetails?.Price || "Price on Request";

//   // =====================================================
//   // CHECK WISHLIST WHEN CARD LOADS
//   // =====================================================

//   useEffect(() => {
//     let mounted = true;

//     async function checkWishlist() {
//       if (!documentId) {
//         return;
//       }

//       const token =
//         typeof window !== "undefined"
//           ? localStorage.getItem("token") ||
//             localStorage.getItem("jwt") ||
//             localStorage.getItem("strapi_jwt")
//           : null;

//       if (!token) {
//         return;
//       }

//       try {
//         const result = await isPropertyInWishlist(documentId);

//         if (mounted) {
//           setLiked(result);
//         }
//       } catch (error) {
//         console.error("CHECK PROPERTY WISHLIST ERROR:", error);
//       }
//     }

//     checkWishlist();

//     return () => {
//       mounted = false;
//     };
//   }, [documentId]);

//   // =====================================================
//   // WISHLIST CLICK
//   // =====================================================

//   const handleWishlist = async () => {
//     if (loading) {
//       return;
//     }

//     const token =
//       typeof window !== "undefined"
//         ? localStorage.getItem("token") ||
//           localStorage.getItem("jwt") ||
//           localStorage.getItem("strapi_jwt")
//         : null;

//     if (!token) {
//       toast.error("Please login to use wishlist.");
//       return;
//     }

//     if (!documentId) {
//       toast.error("Property ID not found.");
//       return;
//     }

//     try {
//       setLoading(true);

//       if (liked) {
//         await removeFromWishlist(documentId);

//         setLiked(false);

//         toast.success("Property removed from wishlist.");
//       } else {
//         await addToWishlist(documentId);

//         setLiked(true);

//         toast.success("Property added to wishlist ❤️");
//       }
//     } catch (error) {
//       console.error("WISHLIST BUTTON ERROR:", error);

//       toast.error(error?.message || "Wishlist update failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // IMAGE
//   // =====================================================

//   let imageUrl = "/no-property.png";

//   if (property?.CoverImage?.url) {
//     imageUrl = property.CoverImage.url;

//     if (!imageUrl.startsWith("http")) {
//       imageUrl = `${STRAPI_URL}${imageUrl}`;
//     }
//   }

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <article className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
//       {/* IMAGE */}

//       <div className="relative h-60 w-full overflow-hidden bg-gray-100">
//         <Image
//           src={imageUrl}
//           alt={title}
//           fill
//           sizes="(max-width: 768px) 100vw, 400px"
//           className="object-cover transition duration-500 hover:scale-105"
//           unoptimized
//         />

//         {/* PROPERTY TYPE */}

//         <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
//           {propertyType}
//         </span>

//         {/* PURPOSE */}

//         <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
//           {purpose}
//         </span>
//       </div>

//       {/* CONTENT */}

//       <div className="p-5">
//         {/* TITLE */}

//         <h3 className="line-clamp-1 text-xl font-bold text-gray-900">
//           {title}
//         </h3>

//         {/* PRICE */}

//         <p className="mt-2 text-xl font-bold text-blue-600">{price}</p>

//         {/* LOCATION */}

//         <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
//           <MapPin size={16} className="text-blue-600" />

//           <span>
//             {area}
//             {area && city ? ", " : ""}
//             {city}
//           </span>
//         </p>

//         {/* TAGS */}

//         <div className="mt-5 flex flex-wrap gap-2">
//           <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
//             {purpose}
//           </span>

//           <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
//             {propertyType}
//           </span>
//         </div>

//         {/* BUTTONS */}

//         <div className="mt-6 grid grid-cols-[1fr_1fr_55px] gap-3">
//           {/* VIEW DETAILS */}

//           <Link
//             href={documentId ? `/user/property/${documentId}` : "#"}
//             onClick={(event) => {
//               if (!documentId) {
//                 event.preventDefault();
//                 toast.error("Property ID not found.");
//               }
//             }}
//             className="rounded-lg bg-blue-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
//           >
//             View Details
//           </Link>

//           {/* CONTACT OWNER */}

//           <Link
//             href={documentId ? `/user/contact-owner/${documentId}` : "#"}
//             onClick={(event) => {
//               if (!documentId) {
//                 event.preventDefault();
//                 toast.error("Property ID not found.");
//               }
//             }}
//             className="rounded-lg border border-blue-600 bg-white py-3 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
//           >
//             Contact Owner
//           </Link>

//           {/* WISHLIST */}

//           <button
//             type="button"
//             onClick={handleWishlist}
//             disabled={loading}
//             className={`flex items-center justify-center rounded-lg border transition ${
//               liked
//                 ? "border-red-400 bg-red-50"
//                 : "border-gray-300 bg-white hover:border-red-400 hover:bg-red-50"
//             } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
//             aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
//           >
//             <Heart
//               size={22}
//               className={`transition-all duration-300 ${
//                 liked ? "fill-red-500 text-red-500" : "text-gray-500"
//               }`}
//             />
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Heart, BedDouble, Bath, Maximize, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

import {
  addToWishlist,
  removeFromWishlist,
  isPropertyInWishlist,
} from "@/services/wishlistService";
import ContactOwnerModal from "./ContactOwnerModal";

/* =====================================================
   STRAPI URL
===================================================== */

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

/* =====================================================
   SAFE VALUE
===================================================== */

function getSafeValue(value, fallback = "") {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  /*
   * Strapi rich text / component object
   * React child error avoid करण्यासाठी
   */
  if (typeof value === "object") {
    if (typeof value.value === "string") {
      return value.value;
    }

    if (typeof value.name === "string") {
      return value.name;
    }

    if (typeof value.label === "string") {
      return value.label;
    }

    if (Array.isArray(value.children)) {
      return value.children
        .map((child) => {
          if (typeof child === "string") {
            return child;
          }

          if (child?.text) {
            return child.text;
          }

          return "";
        })
        .join(" ")
        .trim();
    }

    return fallback;
  }

  return fallback;
}

/* =====================================================
   PRICE FORMAT
===================================================== */

function formatPrice(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Price on Request";
  }

  /*
   * जर Price object असेल तर safe extraction
   */
  if (typeof value === "object") {
    value =
      value?.Price ??
      value?.price ??
      value?.value ??
      value?.amount ??
      "";
  }

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Price on Request";
  }

  const numericPrice = Number(value);

  if (Number.isNaN(numericPrice)) {
    return getSafeValue(value, "Price on Request");
  }

  return `₹${new Intl.NumberFormat("en-IN").format(
    numericPrice
  )}`;
}

/* =====================================================
   IMAGE URL
===================================================== */

function getImageUrl(image) {
  if (!image) {
    return "/no-property.png";
  }

  /*
   * Strapi media object
   */
  if (image?.url) {
    if (image.url.startsWith("http")) {
      return image.url;
    }

    return `${STRAPI_URL}${image.url}`;
  }

  /*
   * जर image array मध्ये आला
   */
  if (Array.isArray(image) && image.length > 0) {
    return getImageUrl(image[0]);
  }

  /*
   * Strapi nested formats
   */
  if (image?.data) {
    if (Array.isArray(image.data)) {
      return getImageUrl(image.data[0]);
    }

    return getImageUrl(image.data);
  }

  return "/no-property.png";
}

/* =====================================================
   DATE
===================================================== */

function formatDate(date) {
  if (!date) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "";
  }
}

/* =====================================================
   PROPERTY CARD
===================================================== */

export default function PropertyCard({ property }) {
  const pathname = usePathname();

  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const documentId =
    property?.documentId ||
    property?.id;

  /* ===================================================
     CHECK WISHLIST
  =================================================== */

  useEffect(() => {
    let mounted = true;

    async function checkWishlist() {
      if (!documentId) {
        return;
      }

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") ||
            localStorage.getItem("jwt") ||
            localStorage.getItem("strapi_jwt")
          : null;

      if (!token) {
        return;
      }

      try {
        const result =
          await isPropertyInWishlist(
            documentId
          );

        if (mounted) {
          setLiked(Boolean(result));
        }
      } catch (error) {
        console.error("Wishlist check error:", error);
      }
    }

    checkWishlist();

    return () => {
      mounted = false;
    };
  }, [documentId]);

  if (!property) {
    return null;
  }

  /* ===================================================
     PROPERTY DATA
  =================================================== */

  const title = getSafeValue(
    property?.Title,
    "Untitled Property"
  );

  const city = getSafeValue(
    property?.City
  );

  const area = getSafeValue(
    property?.Area
  );

  const purpose = getSafeValue(
    property?.Purpose,
    "Purpose"
  );

  const propertyType = getSafeValue(
    property?.Property_Type,
    "Property"
  );

  const category = getSafeValue(
    property?.Category
  );

  const propertyStatus = getSafeValue(
    property?.PropertyStatus ||
      property?.Status,
    "Available"
  );

  const commonDetails =
    property?.PropertyCommonDetails || {};

  const residentialDetails =
    property?.ResidentialDetails || {};

  /* ===================================================
     PRICE
  =================================================== */

  const rawPrice =
    property?.Price ??
    commonDetails?.Price ??
    property?.price;

  const price = formatPrice(rawPrice);

  /* ===================================================
     QUICK DETAILS
  =================================================== */

  const bedrooms =
    residentialDetails?.Bedrooms ??
    commonDetails?.Bedrooms ??
    property?.Bedrooms ??
    property?.BHK ??
    null;

  const bathrooms =
    residentialDetails?.Bathrooms ??
    commonDetails?.Bathrooms ??
    property?.Bathrooms ??
    null;

  const builtUpArea =
    commonDetails?.BuiltUpArea ??
    commonDetails?.Built_upArea ??
    commonDetails?.Area ??
    property?.BuiltUpArea ??
    property?.AreaSize ??
    null;

  /* ===================================================
     DATE
  =================================================== */

  const listedDate = formatDate(
    property?.createdAt ||
      property?.publishedAt
  );

  /* ===================================================
     OWNER PAGE CHECK
  =================================================== */

  const isOwnerPage =
    pathname?.startsWith("/owner");

  /* ===================================================
     VIEW ROUTE
  =================================================== */

  const viewRoute = documentId
    ? isOwnerPage
      ? `/owner/properties/${documentId}`
      : `/user/property/${documentId}`
    : "#";

  /* ===================================================
     CONTACT OWNER ROUTE
  =================================================== */

  const contactRoute = documentId
    ? `/user/contact-owner/${documentId}`
    : "#";

  /* ===================================================
     WISHLIST
  =================================================== */

  const handleWishlist = async () => {
    if (loading) {
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") ||
          localStorage.getItem("jwt") ||
          localStorage.getItem("strapi_jwt")
        : null;

    if (!token) {
      toast.error(
        "Please login to use wishlist."
      );
      return;
    }

    if (!documentId) {
      toast.error(
        "Property ID not found."
      );
      return;
    }

    try {
      setLoading(true);

      if (liked) {
        await removeFromWishlist(
          documentId
        );

        setLiked(false);

        toast.success(
          "Property removed from wishlist."
        );
      } else {
        await addToWishlist(
          documentId
        );

        setLiked(true);

        toast.success(
          "Property added to wishlist ❤️"
        );
      }
    } catch (error) {
      console.error(
        "WISHLIST BUTTON ERROR:",
        error
      );

      toast.error(
        error?.message ||
          "Wishlist update failed."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================================================
     IMAGE
  =================================================== */

  const imageUrl = getImageUrl(
    property?.CoverImage
  );

  /* ===================================================
     LOCATION
  =================================================== */

  const location = [
    area,
    city,
  ]
    .filter(Boolean)
    .join(", ");

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <div className="w-full max-w-[360px] mx-auto">
      <article className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--border-focus)]">
        
        {/* =================================================
            MEDIA / IMAGE CONTAINER
        ================================================= */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-section)]">
          <Link href={viewRoute} className="block w-full h-full relative cursor-pointer">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
          </Link>

          {/* BADGES */}
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="rounded-lg bg-[var(--accent)] text-[var(--accent-text)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm">
              {propertyStatus}
            </span>
            <span className="rounded-lg bg-[var(--bg-card)]/90 backdrop-blur-md text-[var(--text-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm border border-[var(--border-subtle)]">
              {purpose}
            </span>
          </div>

          {/* WISHLIST BUTTON */}
          <button
            type="button"
            onClick={handleWishlist}
            disabled={loading}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-card)]/90 backdrop-blur-md shadow-sm border border-[var(--border-subtle)] transition-all hover:scale-110 active:scale-95"
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={15} className={liked ? "fill-red-500 text-red-500" : "text-[var(--text-primary)]"} />
          </button>

          {/* PRICE DISPLAY ON MEDIA */}
          <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white">
            <p className="text-xl font-extrabold tracking-tight drop-shadow-sm">
              {price}
            </p>
          </div>
        </div>

        {/* =================================================
            CARD CONTENT
        ================================================= */}
        <div className="flex flex-1 flex-col p-4 justify-between">
          <div>
            {/* Category / Type */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              <span>{category || propertyType}</span>
              {listedDate && <span>{listedDate}</span>}
            </div>

            {/* Title */}
            <h3 className="mt-1 line-clamp-1 text-base font-bold text-[var(--text-primary)] transition group-hover:text-[var(--text-primary)]" title={title}>
              <Link href={viewRoute}>
                {title}
              </Link>
            </h3>

            {/* Location */}
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <MapPin size={13} className="shrink-0 text-[var(--text-muted)]" />
              <span className="truncate">{location || "Location not specified"}</span>
            </p>

            {/* Property Key Attributes */}
            <div className="mt-3.5 flex items-center gap-3 border-t border-[var(--border-subtle)] pt-3 text-xs text-[var(--text-muted)]">
              {bedrooms !== null && bedrooms !== undefined && (
                <span className="flex items-center gap-1.5 font-medium">
                  <BedDouble size={14} className="text-[var(--text-primary)]" /> {getSafeValue(bedrooms)} Beds
                </span>
              )}
              {bathrooms !== null && bathrooms !== undefined && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Bath size={14} className="text-[var(--text-primary)]" /> {getSafeValue(bathrooms)} Baths
                </span>
              )}
              {builtUpArea !== null && builtUpArea !== undefined && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Maximize size={14} className="text-[var(--text-primary)]" /> {getSafeValue(builtUpArea)} sq.ft
                </span>
              )}
            </div>
          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--border-subtle)] pt-3">
            <Link
              href={viewRoute}
              onClick={(e) => { if (!documentId) { e.preventDefault(); toast.error("Property ID not found."); } }}
              className="hh-btn hh-btn-primary hh-btn-sm w-full"
            >
              <Eye size={13} />
              <span>Details</span>
            </Link>

            <button
              type="button"
              onClick={(e) => { 
                e.preventDefault(); 
                if (!documentId) { toast.error("Property ID not found."); } 
                else { setIsContactModalOpen(true); } 
              }}
              className="hh-btn hh-btn-secondary hh-btn-sm w-full"
            >
              <span>Contact</span>
            </button>
          </div>
        </div>

      </article>

      <ContactOwnerModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        property={property} 
      />
    </div>
  );
}