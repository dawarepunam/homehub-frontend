// // import Link from "next/link";

// // const STRAPI_URL =
// //   process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/api$/, "") ||
// //   "http://localhost:1337";

// // export default function PropertyCard({ property }) {
// //   const image = property?.CoverImage?.url
// //     ? `${STRAPI_URL}${property.CoverImage.url}`
// //     : "https://placehold.co/600x400?text=No+Image";

// //   const statusColor =
// //     property?.PropertyStatus === "Available"
// //       ? "bg-green-100 text-green-700"
// //       : property?.PropertyStatus === "Sold"
// //       ? "bg-red-100 text-red-700"
// //       : "bg-yellow-100 text-yellow-700";

// //   return (
// //     <Link
// //       href={`/property/${property.documentId}`}
// //       className="group block"
// //     >
// //       <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

// //         {/* Image */}
// //         <div className="relative h-60 overflow-hidden">
// //           <img
// //             src={image}
// //             alt={property?.Title || "Property"}
// //             className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
// //           />

// //           {/* Property Type */}
// //           <div className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
// //             {property?.Property_Type || "Property"}
// //           </div>

// //           {/* Purpose */}
// //           <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow">
// //             {property?.Purpose || "Sale"}
// //           </div>
// //         </div>

// //         {/* Body */}
// //         <div className="p-5">

// //           <h2 className="line-clamp-1 text-xl font-bold text-gray-900">
// //             {property?.Title}
// //           </h2>

// //           <p className="mt-2 text-sm text-gray-500">
// //             📍 {property?.Area}, {property?.City}
// //           </p>

// //           <div className="mt-4 flex flex-wrap gap-2">

// //             <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
// //               {property?.Category}
// //             </span>

// //             <span
// //               className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}
// //             >
// //               {property?.PropertyStatus}
// //             </span>

// //           </div>

// //           <div className="mt-6 flex items-center justify-between">

// //             <div>
// //               <p className="text-xs text-gray-500">
// //                 Property ID
// //               </p>

// //               <p className="font-semibold text-gray-800">
// //                 {property?.documentId?.slice(0, 8)}
// //               </p>
// //             </div>

// //             <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
// //               View Details
// //             </button>

// //           </div>

// //         </div>

// //       </div>
// //     </Link>
// //   );
// // // }
// // "use client";

// // import Image from "next/image";
// // import Link from "next/link";
// // import { useState } from "react";
// // import { Heart, MapPin } from "lucide-react";
// // import toast from "react-hot-toast";

// // import {
// //   addToWishlist,
// //   removeFromWishlist,
// //   isPropertyInWishlist,
// // } from "@/services/wishlistService";

// // const STRAPI_URL =
// //   process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

// // export default function PropertyCard({ property }) {
// //   const [liked, setLiked] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   if (!property) {
// //     return null;
// //   }

// //   const documentId = property.documentId;

// //   const title = property.Title || "Untitled Property";

// //   const city = property.City || "";

// //   const area = property.Area || "";

// //   const purpose = property.Purpose || "Sale";

// //   const propertyType = property.Property_Type || "Property";

// //   const category = property.Category || "";

// //   const status = property.PropertyStatus || "Available";

// //   // --------------------------------------------------
// //   // COVER IMAGE
// //   // --------------------------------------------------

// //   let imageUrl = "/no-property.png";

// //   if (property.CoverImage?.url) {
// //     imageUrl = property.CoverImage.url;

// //     if (!imageUrl.startsWith("http")) {
// //       imageUrl = `${STRAPI_URL}${imageUrl}`;
// //     }
// //   }

// //   // --------------------------------------------------
// //   // STATUS STYLE
// //   // --------------------------------------------------

// //   let statusClass = "bg-yellow-100 text-yellow-700";

// //   if (status === "Available") {
// //     statusClass = "bg-green-100 text-green-700";
// //   }

// //   if (status === "Sold") {
// //     statusClass = "bg-red-100 text-red-700";
// //   }

// //   // --------------------------------------------------
// //   // WISHLIST
// //   // --------------------------------------------------

// //   const handleWishlist = async () => {
// //     if (loading) {
// //       return;
// //     }

// //     const token =
// //       typeof window !== "undefined" ? localStorage.getItem("token") : null;

// //     if (!token) {
// //       toast.error("Please login to use wishlist.");
// //       return;
// //     }

// //     if (!documentId) {
// //       toast.error("Property ID not found.");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const alreadyLiked = await isPropertyInWishlist(documentId);

// //       if (alreadyLiked) {
// //         await removeFromWishlist(documentId);

// //         setLiked(false);

// //         toast.success("Removed from wishlist.");
// //       } else {
// //         await addToWishlist(documentId);

// //         setLiked(true);

// //         toast.success("Added to wishlist ❤️");
// //       }
// //     } catch (error) {
// //       console.error("Wishlist Error:", error);

// //       toast.error(error?.message || "Wishlist update failed.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <article className="overflow-hidden rounded-lg border border-[#D9D1C2] bg-[#F7F0E3] shadow-[0_8px_24px_rgba(30,61,48,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#B99852] hover:shadow-[0_18px_34px_rgba(30,61,48,0.15)]">
// //       {/* IMAGE */}

// //       <div className="relative h-60 w-full overflow-hidden bg-[#DDE6DE]">
// //         <Image
// //           src={imageUrl}
// //           alt={title}
// //           fill
// //           sizes="(max-width: 768px) 100vw, 400px"
// //           className="object-cover transition duration-500 hover:scale-105"
// //           unoptimized
// //         />

// //         {/* PROPERTY TYPE */}

// //         <span className="absolute left-4 top-4 rounded-full bg-[#174B3B] px-3 py-1 text-xs font-bold text-[#F7F0E3] shadow">
// //           {propertyType}
// //         </span>

// //         {/* PURPOSE */}

// //         <span className="absolute right-4 top-4 rounded-full bg-[#F7F0E3] px-3 py-1 text-xs font-bold text-[#174B3B] shadow">
// //           {purpose}
// //         </span>
// //       </div>

// //       {/* CONTENT */}

// //       <div className="p-5">
// //         {/* TITLE */}

// //         <h2 className="line-clamp-1 text-xl font-extrabold text-[#123F32]">
// //           {title}
// //         </h2>

// //         {/* LOCATION */}

// //         <p className="mt-3 flex items-center gap-2 text-sm text-[#718177]">
// //           <MapPin size={16} className="text-[#B99852]" />

// //           <span>
// //             {area}

// //             {area && city ? ", " : ""}

// //             {city}
// //           </span>
// //         </p>

// //         {/* TAGS */}

// //         <div className="mt-4 flex flex-wrap gap-2">
// //           {category && (
// //             <span className="rounded-full bg-[#E5E8DE] px-3 py-1 text-xs font-semibold text-[#416353]">
// //               {category}
// //             </span>
// //           )}

// //           <span
// //             className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
// //           >
// //             {status}
// //           </span>
// //         </div>

// //         {/* BUTTONS */}

// //         <div className="mt-6 grid grid-cols-[1fr_1fr_52px] gap-3">
// //           {/* VIEW DETAILS */}

// //           <Link
// //             href={`/user/property/${documentId}`}
// //             className="rounded-lg bg-[#174B3B] px-3 py-3 text-center text-sm font-bold text-[#F7F0E3] transition hover:bg-[#123F32]"
// //           >
// //             View Details
// //           </Link>

// //           {/* CONTACT OWNER */}

// //           <Link
// //             href={`/user/contact-owner/${documentId}`}
// //             className="rounded-lg border border-[#B99852] bg-transparent px-3 py-3 text-center text-sm font-bold text-[#174B3B] transition hover:bg-[#D7AE62] hover:text-[#123F32]"
// //           >
// //             Contact Owner
// //           </Link>

// //           {/* WISHLIST */}

// //           <button
// //             type="button"
// //             onClick={handleWishlist}
// //             disabled={loading}
// //             className={`flex items-center justify-center rounded-lg border transition ${
// //               liked
// //                 ? "border-red-400 bg-red-50"
// //                 : "border-[#C9D0C8] bg-transparent hover:border-red-400 hover:bg-red-50"
// //             } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
// //             aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
// //           >
// //             <Heart
// //               size={22}
// //               className={liked ? "fill-red-500 text-red-500" : "text-gray-500"}
// //             />
// //           </button>
// //         </div>
// //       </div>
// //     </article>
// //   );
// // // }
// // "use client";

// // import Image from "next/image";
// // import Link from "next/link";
// // import { useState } from "react";
// // import { Heart, MapPin } from "lucide-react";
// // import toast from "react-hot-toast";

// // import {
// //   addToWishlist,
// //   removeFromWishlist,
// //   isPropertyInWishlist,
// // } from "@/services/wishlistService";

// // const STRAPI_URL =
// //   process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
// //   "http://localhost:1337";

// // export default function PropertyCard({ property }) {
// //   const [liked, setLiked] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   if (!property) {
// //     return null;
// //   }

// //   const documentId = property.documentId;

// //   const title = property.Title || "Untitled Property";
// //   const city = property.City || "";
// //   const area = property.Area || "";
// //   const purpose = property.Purpose || "Sale";
// //   const propertyType = property.Property_Type || "Property";
// //   const category = property.Category || "";
// //   const status = property.PropertyStatus || "Available";

// //   // --------------------------------------------------
// //   // COVER IMAGE
// //   // --------------------------------------------------

// //   let imageUrl = "/no-property.png";

// //   if (property.CoverImage?.url) {
// //     imageUrl = property.CoverImage.url;

// //     if (!imageUrl.startsWith("http")) {
// //       imageUrl = `${STRAPI_URL}${imageUrl}`;
// //     }
// //   }

// //   // --------------------------------------------------
// //   // STATUS STYLE
// //   // --------------------------------------------------

// //   let statusClass = "bg-yellow-100 text-yellow-700";

// //   if (status === "Available") {
// //     statusClass = "bg-green-100 text-green-700";
// //   }

// //   if (status === "Sold") {
// //     statusClass = "bg-red-100 text-red-700";
// //   }

// //   // --------------------------------------------------
// //   // WISHLIST
// //   // --------------------------------------------------

// //   const handleWishlist = async () => {
// //     if (loading) {
// //       return;
// //     }

// //     const token =
// //       typeof window !== "undefined"
// //         ? localStorage.getItem("token")
// //         : null;

// //     if (!token) {
// //       toast.error("Please login to use wishlist.");
// //       return;
// //     }

// //     if (!documentId) {
// //       toast.error("Property ID not found.");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const alreadyLiked =
// //         await isPropertyInWishlist(documentId);

// //       if (alreadyLiked) {
// //         await removeFromWishlist(documentId);

// //         setLiked(false);

// //         toast.success("Removed from wishlist.");
// //       } else {
// //         await addToWishlist(documentId);

// //         setLiked(true);

// //         toast.success("Added to wishlist ❤️");
// //       }
// //     } catch (error) {
// //       console.error("Wishlist Error:", error);

// //       toast.error(
// //         error?.message || "Wishlist update failed."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <article className="overflow-hidden rounded-lg border border-[#D9D1C2] bg-[#F7F0E3] shadow-[0_8px_24px_rgba(30,61,48,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#B99852] hover:shadow-[0_18px_34px_rgba(30,61,48,0.15)]">

// //       {/* =====================================================
// //           IMAGE
// //       ===================================================== */}

// //       <div className="relative h-60 w-full overflow-hidden bg-[#DDE6DE]">

// //         <Image
// //           src={imageUrl}
// //           alt={title}
// //           fill
// //           sizes="(max-width: 768px) 100vw, 400px"
// //           className="object-cover transition duration-500 hover:scale-105"
// //           unoptimized
// //         />

// //         {/* PROPERTY TYPE */}

// //         <span className="absolute left-4 top-4 rounded-full bg-[#174B3B] px-3 py-1 text-xs font-bold text-[#F7F0E3] shadow">
// //           {propertyType}
// //         </span>

// //         {/* PURPOSE */}

// //         <span className="absolute right-4 top-4 rounded-full bg-[#F7F0E3] px-3 py-1 text-xs font-bold text-[#174B3B] shadow">
// //           {purpose}
// //         </span>

// //       </div>

// //       {/* =====================================================
// //           CONTENT
// //       ===================================================== */}

// //       <div className="p-5">

// //         {/* TITLE */}

// //         <h2 className="line-clamp-1 text-xl font-extrabold text-[#123F32]">
// //           {title}
// //         </h2>

// //         {/* LOCATION */}

// //         <p className="mt-3 flex items-center gap-2 text-sm text-[#718177]">
// //           <MapPin
// //             size={16}
// //             className="text-[#B99852]"
// //           />

// //           <span>
// //             {area}

// //             {area && city ? ", " : ""}

// //             {city}
// //           </span>
// //         </p>

// //         {/* TAGS */}

// //         <div className="mt-4 flex flex-wrap gap-2">

// //           {category && (
// //             <span className="rounded-full bg-[#E5E8DE] px-3 py-1 text-xs font-semibold text-[#416353]">
// //               {category}
// //             </span>
// //           )}

// //           <span
// //             className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
// //           >
// //             {status}
// //           </span>

// //         </div>

// //         {/* =====================================================
// //             BUTTONS
// //         ===================================================== */}

// //         <div className="mt-6 grid grid-cols-[1fr_1fr_52px] gap-3">

// //           {/* VIEW DETAILS */}

// //           <Link
// //             href={`/user/property/${documentId}`}
// //             className="rounded-lg bg-[#174B3B] px-3 py-3 text-center text-sm font-bold text-[#F7F0E3] transition hover:bg-[#123F32]"
// //           >
// //             View Details
// //           </Link>

// //           {/* CONTACT OWNER */}

// //           <Link
// //             href={`/user/contact-owner/${documentId}`}
// //             className="rounded-lg border border-[#B99852] bg-transparent px-3 py-3 text-center text-sm font-bold text-[#174B3B] transition hover:bg-[#D7AE62] hover:text-[#123F32]"
// //           >
// //             Contact Owner
// //           </Link>

// //           {/* WISHLIST */}

// //           <button
// //             type="button"
// //             onClick={handleWishlist}
// //             disabled={loading}
// //             className={`flex items-center justify-center rounded-lg border transition ${
// //               liked
// //                 ? "border-red-400 bg-red-50"
// //                 : "border-[#C9D0C8] bg-transparent hover:border-red-400 hover:bg-red-50"
// //             } ${
// //               loading
// //                 ? "cursor-not-allowed opacity-50"
// //                 : ""
// //             }`}
// //             aria-label={
// //               liked
// //                 ? "Remove from wishlist"
// //                 : "Add to wishlist"
// //             }
// //           >
// //             <Heart
// //               size={22}
// //               className={
// //                 liked
// //                   ? "fill-red-500 text-red-500"
// //                   : "text-gray-500"
// //               }
// //             />
// //           </button>

// //         </div>

// //       </div>

// //     </article>
// //   );
// // // }
// // "use client";

// // import Image from "next/image";
// // import Link from "next/link";
// // import { useState } from "react";

// // import {
// //   Heart,
// //   MapPin,
// //   BedDouble,
// //   Car,
// //   Maximize,
// //   Eye,
// //   Bookmark,
// //   MessageSquare,
// //   Pencil,
// //   MoreVertical,
// //   Trash2,
// //   ExternalLink,
// // } from "lucide-react";

// // import toast from "react-hot-toast";

// // import {
// //   addToWishlist,
// //   removeFromWishlist,
// //   isPropertyInWishlist,
// // } from "@/services/wishlistService";

// // const STRAPI_URL =
// //   process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
// //   process.env.NEXT_PUBLIC_STRAPI_URL ||
// //   "http://localhost:1337";

// // /* =====================================================
// //    HELPERS
// // ===================================================== */

// // function getImageUrl(property) {
// //   let imageUrl = "/no-property.png";

// //   if (property?.CoverImage?.url) {
// //     imageUrl = property.CoverImage.url;

// //     if (!imageUrl.startsWith("http")) {
// //       imageUrl = `${STRAPI_URL}${imageUrl}`;
// //     }
// //   }

// //   return imageUrl;
// // }

// // function getStatusStyle(status) {
// //   const value = status?.toString().toLowerCase();

// //   switch (value) {
// //     case "available":
// //     case "active":
// //       return "bg-[#0E7658] text-white";

// //     case "pending":
// //       return "bg-[#D88A16] text-white";

// //     case "draft":
// //       return "bg-[#7C3AED] text-white";

// //     case "sold":
// //       return "bg-[#B42318] text-white";

// //     case "rented":
// //       return "bg-[#8B3FC7] text-white";

// //     case "inactive":
// //       return "bg-[#475467] text-white";

// //     case "reserved":
// //       return "bg-[#A66A12] text-white";

// //     default:
// //       return "bg-[#667085] text-white";
// //   }
// // }

// // function getOwnerStatus(status) {
// //   const value = status?.toString().toLowerCase();

// //   if (value === "available") {
// //     return "ACTIVE";
// //   }

// //   if (value === "active") {
// //     return "ACTIVE";
// //   }

// //   if (value === "pending") {
// //     return "PENDING";
// //   }

// //   if (value === "draft") {
// //     return "DRAFT";
// //   }

// //   if (value === "sold") {
// //     return "SOLD";
// //   }

// //   if (value === "rented") {
// //     return "RENTED";
// //   }

// //   if (value === "inactive") {
// //     return "INACTIVE";
// //   }

// //   if (value === "reserved") {
// //     return "RESERVED";
// //   }

// //   return status || "ACTIVE";
// // }

// // function formatPrice(price, priceUnits) {
// //   if (
// //     price === null ||
// //     price === undefined ||
// //     price === ""
// //   ) {
// //     return "--";
// //   }

// //   const numericPrice = Number(price);

// //   if (Number.isNaN(numericPrice)) {
// //     return `${price}`;
// //   }

// //   const formatted = new Intl.NumberFormat("en-IN").format(
// //     numericPrice
// //   );

// //   if (
// //     priceUnits &&
// //     priceUnits.toString().toLowerCase() !== "inr"
// //   ) {
// //     return `₹${formatted} ${priceUnits}`;
// //   }

// //   return `₹${formatted}`;
// // }

// // /* =====================================================
// //    COMPONENT
// // ===================================================== */

// // export default function PropertyCard({
// //   property,
// //   ownerMode = false,
// // }) {
// //   const [liked, setLiked] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [showMore, setShowMore] = useState(false);

// //   if (!property) {
// //     return null;
// //   }

// //   /* ===================================================
// //      PROPERTY DATA
// //   =================================================== */

// //   const documentId =
// //     property?.documentId || property?.id;

// //   const title =
// //     property?.Title ||
// //     "Untitled Property";

// //   const city =
// //     property?.City ||
// //     "";

// //   const area =
// //     property?.Area ||
// //     "";

// //   const purpose =
// //     property?.Purpose ||
// //     "Sale";

// //   const propertyType =
// //     property?.Property_Type ||
// //     "Property";

// //   const category =
// //     property?.Category ||
// //     "";

// //   const status =
// //     property?.PropertyStatus ||
// //     "Available";

// //   const ownerStatus =
// //     getOwnerStatus(status);

// //   const imageUrl =
// //     getImageUrl(property);

// //   /* ===================================================
// //      PRICE
// //   =================================================== */

// //   const price = formatPrice(
// //     property?.Price,
// //     property?.PriceUnits
// //   );

// //   /* ===================================================
// //      PROPERTY DETAILS
// //   =================================================== */

// //   const commonDetails =
// //     property?.PropertyCommonDetails || {};

// //   const residentialDetails =
// //     property?.ResidentialDetails || {};

// //   const commercialDetails =
// //     property?.CommercialDetails || {};

// //   const beds =
// //     residentialDetails?.Bedrooms ??
// //     commonDetails?.Bedrooms ??
// //     property?.Bedrooms ??
// //     property?.BHK ??
// //     null;

// //   const parking =
// //     residentialDetails?.Parking ??
// //     commonDetails?.Parking ??
// //     property?.Parking ??
// //     null;

// //   const areaValue =
// //     commonDetails?.BuiltUpArea ??
// //     commonDetails?.Area ??
// //     property?.BuiltUpArea ??
// //     property?.AreaSize ??
// //     null;

// //   const views =
// //     property?.Views ??
// //     property?.views ??
// //     0;

// //   const saves =
// //     property?.Saves ??
// //     property?.saves ??
// //     0;

// //   const enquiries =
// //     property?.Enquiries ??
// //     property?.enquiries ??
// //     0;

// //   /* ===================================================
// //      WISHLIST
// //      Only for USER CARD
// //   =================================================== */

// //   const handleWishlist = async () => {
// //     if (loading) {
// //       return;
// //     }

// //     const token =
// //       typeof window !== "undefined"
// //         ? localStorage.getItem("token")
// //         : null;

// //     if (!token) {
// //       toast.error(
// //         "Please login to use wishlist."
// //       );
// //       return;
// //     }

// //     if (!documentId) {
// //       toast.error(
// //         "Property ID not found."
// //       );
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const alreadyLiked =
// //         await isPropertyInWishlist(
// //           documentId
// //         );

// //       if (alreadyLiked) {
// //         await removeFromWishlist(
// //           documentId
// //         );

// //         setLiked(false);

// //         toast.success(
// //           "Removed from wishlist."
// //         );
// //       } else {
// //         await addToWishlist(
// //           documentId
// //         );

// //         setLiked(true);

// //         toast.success(
// //           "Added to wishlist ❤️"
// //         );
// //       }
// //     } catch (error) {
// //       console.error(
// //         "Wishlist Error:",
// //         error
// //       );

// //       toast.error(
// //         error?.message ||
// //           "Wishlist update failed."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ===================================================
// //      OWNER CARD
// //   =================================================== */

// //   if (ownerMode) {
// //     return (
// //       <article className="group overflow-hidden rounded-2xl border border-[#3A3329] bg-[#171411] shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B99852] hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)]">

// //         {/* =============================================
// //             IMAGE
// //         ============================================= */}

// //         <div className="relative h-52 w-full overflow-hidden bg-[#24201B]">

// //           <Image
// //             src={imageUrl}
// //             alt={title}
// //             fill
// //             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
// //             className="object-cover transition duration-500 group-hover:scale-105"
// //             unoptimized
// //           />

// //           {/* IMAGE OVERLAY */}

// //           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/10" />

// //           {/* STATUS */}

// //           <span
// //             className={`absolute left-3 top-3 rounded-md px-3 py-1 text-[11px] font-extrabold tracking-wide shadow ${getStatusStyle(
// //               status
// //             )}`}
// //           >
// //             {ownerStatus}
// //           </span>

// //           {/* BOOKMARK */}

// //           <button
// //             type="button"
// //             className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/70"
// //             aria-label="Bookmark property"
// //           >
// //             <Bookmark size={17} />
// //           </button>

// //           {/* DRAFT / SOLD / RENTED CENTER LABEL */}

// //           {[
// //             "DRAFT",
// //             "SOLD",
// //             "RENTED",
// //             "RESERVED",
// //           ].includes(ownerStatus) && (
// //             <div className="absolute inset-0 flex items-center justify-center">

// //               <div className="rounded-xl bg-black/45 px-6 py-4 text-center backdrop-blur-[2px]">

// //                 {ownerStatus === "SOLD" && (
// //                   <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#E76F51] text-[#E76F51]">
// //                     ✓
// //                   </div>
// //                 )}

// //                 {ownerStatus === "RENTED" && (
// //                   <div className="mx-auto mb-2 text-3xl text-[#D76AD8]">
// //                     ⛓
// //                   </div>
// //                 )}

// //                 {ownerStatus === "RESERVED" && (
// //                   <div className="mx-auto mb-2 text-3xl text-[#D89B31]">
// //                     ⌛
// //                   </div>
// //                 )}

// //                 <p className="text-lg font-extrabold tracking-wide text-white">
// //                   {ownerStatus}
// //                 </p>

// //                 {ownerStatus === "DRAFT" && (
// //                   <p className="mt-1 text-xs text-white/70">
// //                     Continue editing
// //                   </p>
// //                 )}

// //               </div>

// //             </div>
// //           )}

// //         </div>

// //         {/* =============================================
// //             CONTENT
// //         ============================================= */}

// //         <div className="p-4">

// //           {/* TITLE */}

// //           <h2 className="line-clamp-1 text-[17px] font-bold text-white">
// //             {title}
// //           </h2>

// //           {/* LOCATION */}

// //           <p className="mt-2 flex items-center gap-1.5 text-xs text-[#B8B0A5]">

// //             <MapPin
// //               size={14}
// //               className="shrink-0 text-[#D0A54A]"
// //             />

// //             <span className="line-clamp-1">
// //               {area}
// //               {area && city ? ", " : ""}
// //               {city}
// //             </span>

// //           </p>

// //           {/* PRICE */}

// //           <p className="mt-3 text-lg font-extrabold text-[#4CCB63]">
// //             {price}

// //             {purpose?.toLowerCase() ===
// //               "rent" && (
// //               <span className="ml-1 text-xs font-medium text-[#A9A19A]">
// //                 / month
// //               </span>
// //             )}
// //           </p>

// //           {/* ===========================================
// //               FEATURES
// //           =========================================== */}

// //           <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#C7C0B7]">

// //             {beds !== null && (
// //               <span className="flex items-center gap-1">
// //                 <BedDouble size={14} />
// //                 {beds} Beds
// //               </span>
// //             )}

// //             {parking !== null && (
// //               <span className="flex items-center gap-1">
// //                 <Car size={14} />
// //                 {parking} Parking
// //               </span>
// //             )}

// //             {areaValue !== null && (
// //               <span className="flex items-center gap-1">
// //                 <Maximize size={13} />
// //                 {areaValue} sq.ft
// //               </span>
// //             )}

// //             {category && (
// //               <span className="rounded bg-[#27231E] px-2 py-0.5">
// //                 {category}
// //               </span>
// //             )}

// //           </div>

// //           {/* ===========================================
// //               STATS
// //           =========================================== */}

// //           <div className="mt-4 grid grid-cols-3 border-t border-[#39332B] pt-3">

// //             <div className="flex flex-col">

// //               <span className="flex items-center gap-1 text-xs text-[#C1B9AF]">
// //                 <Eye size={13} />
// //                 {views}
// //               </span>

// //               <span className="mt-0.5 text-[10px] text-[#817A72]">
// //                 Views
// //               </span>

// //             </div>

// //             <div className="flex flex-col">

// //               <span className="flex items-center gap-1 text-xs text-[#C1B9AF]">
// //                 <Heart size={13} />
// //                 {saves}
// //               </span>

// //               <span className="mt-0.5 text-[10px] text-[#817A72]">
// //                 Saves
// //               </span>

// //             </div>

// //             <div className="flex flex-col">

// //               <span className="flex items-center gap-1 text-xs text-[#C1B9AF]">
// //                 <MessageSquare size={13} />
// //                 {enquiries}
// //               </span>

// //               <span className="mt-0.5 text-[10px] text-[#817A72]">
// //                 Enquiries
// //               </span>

// //             </div>

// //           </div>

// //           {/* ===========================================
// //               ACTIONS
// //           =========================================== */}

// //           <div className="mt-4 flex gap-2">

// //             {/* VIEW */}

// //             <Link
// //               href={`/user/property/${documentId}`}
// //               className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#39332B] bg-[#24201B] px-3 py-2.5 text-xs font-bold text-white transition hover:border-[#B99852] hover:bg-[#302A23]"
// //             >
// //               <Eye size={14} />
// //               View
// //             </Link>

// //             {/* EDIT */}

// //             <Link
// //               href={`/owner/properties/${documentId}/edit`}
// //               className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#66512D] bg-[#2A241B] px-3 py-2.5 text-xs font-bold text-[#E1B75A] transition hover:bg-[#3A301F]"
// //             >
// //               <Pencil size={14} />
// //               Edit
// //             </Link>

// //             {/* MORE */}

// //             <div className="relative">

// //               <button
// //                 type="button"
// //                 onClick={() =>
// //                   setShowMore(
// //                     (value) => !value
// //                   )
// //                 }
// //                 className="flex h-full min-w-[44px] items-center justify-center gap-1 rounded-lg border border-[#39332B] bg-[#24201B] px-3 text-white transition hover:border-[#B99852]"
// //                 aria-label="More actions"
// //               >
// //                 <MoreVertical
// //                   size={16}
// //                 />
// //               </button>

// //               {showMore && (
// //                 <div className="absolute bottom-12 right-0 z-20 w-36 overflow-hidden rounded-xl border border-[#40382F] bg-[#211D18] p-1 shadow-2xl">

// //                   <Link
// //                     href={`/user/property/${documentId}`}
// //                     className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white hover:bg-[#302A23]"
// //                   >
// //                     <ExternalLink
// //                       size={13}
// //                     />
// //                     View Property
// //                   </Link>

// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       setShowMore(false);
// //                       toast("More actions coming soon.");
// //                     }}
// //                     className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-white hover:bg-[#302A23]"
// //                   >
// //                     <MoreVertical
// //                       size={13}
// //                     />
// //                     More Options
// //                   </button>

// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       setShowMore(false);
// //                       toast.error(
// //                         "Delete action will be connected next."
// //                       );
// //                     }}
// //                     className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-400 hover:bg-red-950/30"
// //                   >
// //                     <Trash2
// //                       size={13}
// //                     />
// //                     Delete
// //                   </button>

// //                 </div>
// //               )}

// //             </div>

// //           </div>

// //           {/* DRAFT ACTION */}

// //           {ownerStatus === "DRAFT" && (
// //             <Link
// //               href={`/owner/properties/${documentId}/edit`}
// //               className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#392449] px-3 py-2 text-xs font-bold text-[#D99AE8] transition hover:bg-[#49305C]"
// //             >
// //               Continue Editing
// //             </Link>
// //           )}

// //         </div>

// //       </article>
// //     );
// //   }

// //   /* =====================================================
// //      EXISTING USER PROPERTY CARD
// // ===================================================== */

// //   let statusClass =
// //     "bg-yellow-100 text-yellow-700";

// //   if (status === "Available") {
// //     statusClass =
// //       "bg-green-100 text-green-700";
// //   }

// //   if (status === "Sold") {
// //     statusClass =
// //       "bg-red-100 text-red-700";
// //   }

// //   return (
// //     <article className="overflow-hidden rounded-lg border border-[#D9D1C2] bg-[#F7F0E3] shadow-[0_8px_24px_rgba(30,61,48,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#B99852] hover:shadow-[0_18px_34px_rgba(30,61,48,0.15)]">

// //       {/* IMAGE */}

// //       <div className="relative h-60 w-full overflow-hidden bg-[#DDE6DE]">

// //         <Image
// //           src={imageUrl}
// //           alt={title}
// //           fill
// //           sizes="(max-width: 768px) 100vw, 400px"
// //           className="object-cover transition duration-500 hover:scale-105"
// //           unoptimized
// //         />

// //         <span className="absolute left-4 top-4 rounded-full bg-[#174B3B] px-3 py-1 text-xs font-bold text-[#F7F0E3] shadow">
// //           {propertyType}
// //         </span>

// //         <span className="absolute right-4 top-4 rounded-full bg-[#F7F0E3] px-3 py-1 text-xs font-bold text-[#174B3B] shadow">
// //           {purpose}
// //         </span>

// //       </div>

// //       {/* CONTENT */}

// //       <div className="p-5">

// //         <h2 className="line-clamp-1 text-xl font-extrabold text-[#123F32]">
// //           {title}
// //         </h2>

// //         <p className="mt-3 flex items-center gap-2 text-sm text-[#718177]">

// //           <MapPin
// //             size={16}
// //             className="text-[#B99852]"
// //           />

// //           <span>
// //             {area}
// //             {area && city ? ", " : ""}
// //             {city}
// //           </span>

// //         </p>

// //         <div className="mt-4 flex flex-wrap gap-2">

// //           {category && (
// //             <span className="rounded-full bg-[#E5E8DE] px-3 py-1 text-xs font-semibold text-[#416353]">
// //               {category}
// //             </span>
// //           )}

// //           <span
// //             className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
// //           >
// //             {status}
// //           </span>

// //         </div>

// //         <div className="mt-6 grid grid-cols-[1fr_1fr_52px] gap-3">

// //           <Link
// //             href={`/user/property/${documentId}`}
// //             className="rounded-lg bg-[#174B3B] px-3 py-3 text-center text-sm font-bold text-[#F7F0E3] transition hover:bg-[#123F32]"
// //           >
// //             View Details
// //           </Link>

// //           <Link
// //             href={`/user/contact-owner/${documentId}`}
// //             className="rounded-lg border border-[#B99852] bg-transparent px-3 py-3 text-center text-sm font-bold text-[#174B3B] transition hover:bg-[#D7AE62] hover:text-[#123F32]"
// //           >
// //             Contact Owner
// //           </Link>

// //           <button
// //             type="button"
// //             onClick={handleWishlist}
// //             disabled={loading}
// //             className={`flex items-center justify-center rounded-lg border transition ${
// //               liked
// //                 ? "border-red-400 bg-red-50"
// //                 : "border-[#C9D0C8] bg-transparent hover:border-red-400 hover:bg-red-50"
// //             } ${
// //               loading
// //                 ? "cursor-not-allowed opacity-50"
// //                 : ""
// //             }`}
// //             aria-label={
// //               liked
// //                 ? "Remove from wishlist"
// //                 : "Add to wishlist"
// //             }
// //           >
// //             <Heart
// //               size={22}
// //               className={
// //                 liked
// //                   ? "fill-red-500 text-red-500"
// //                   : "text-gray-500"
// //               }
// //             />
// //           </button>

// //         </div>

// //       </div>

// //     </article>
// //   );
// // // }
// // "use client";

// // import Image from "next/image";
// // import Link from "next/link";
// // import { useState } from "react";

// // import {
// //   Heart,
// //   MapPin,
// //   BedDouble,
// //   Car,
// //   Maximize,
// //   Eye,
// //   Bookmark,
// //   MessageSquare,
// //   Pencil,
// //   MoreVertical,
// //   Trash2,
// //   ExternalLink,
// // } from "lucide-react";

// // import toast from "react-hot-toast";

// // import {
// //   addToWishlist,
// //   removeFromWishlist,
// //   isPropertyInWishlist,
// // } from "@/services/wishlistService";

// // const STRAPI_URL =
// //   process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
// //   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
// //   "http://localhost:1337";

// // /* =====================================================
// //    HELPERS
// // ===================================================== */

// // function getImageUrl(property) {
// //   let imageUrl = "/no-property.png";

// //   if (property?.CoverImage?.url) {
// //     imageUrl = property.CoverImage.url;

// //     if (!imageUrl.startsWith("http")) {
// //       imageUrl = `${STRAPI_URL}${imageUrl}`;
// //     }
// //   }

// //   return imageUrl;
// // }

// // function getStatusStyle(status) {
// //   const value = status?.toString().toLowerCase();

// //   switch (value) {
// //     case "available":
// //     case "active":
// //       return "bg-[#0E7658] text-white";

// //     case "pending":
// //       return "bg-[#D88A16] text-white";

// //     case "draft":
// //       return "bg-[#7C3AED] text-white";

// //     case "sold":
// //       return "bg-[#B42318] text-white";

// //     case "rented":
// //       return "bg-[#8B3FC7] text-white";

// //     case "inactive":
// //       return "bg-[#475467] text-white";

// //     case "reserved":
// //       return "bg-[#A66A12] text-white";

// //     default:
// //       return "bg-[#667085] text-white";
// //   }
// // }

// // function getOwnerStatus(status) {
// //   const value = status?.toString().toLowerCase();

// //   if (value === "available") return "ACTIVE";
// //   if (value === "active") return "ACTIVE";
// //   if (value === "pending") return "PENDING";
// //   if (value === "draft") return "DRAFT";
// //   if (value === "sold") return "SOLD";
// //   if (value === "rented") return "RENTED";
// //   if (value === "inactive") return "INACTIVE";
// //   if (value === "reserved") return "RESERVED";

// //   return status || "ACTIVE";
// // }

// // function formatPrice(price, priceUnits) {
// //   if (price === null || price === undefined || price === "") {
// //     return "--";
// //   }

// //   const numericPrice = Number(price);

// //   if (Number.isNaN(numericPrice)) {
// //     return `${price}`;
// //   }

// //   const formatted = new Intl.NumberFormat("en-IN").format(
// //     numericPrice
// //   );

// //   if (
// //     priceUnits &&
// //     priceUnits.toString().toLowerCase() !== "inr"
// //   ) {
// //     return `₹${formatted} ${priceUnits}`;
// //   }

// //   return `₹${formatted}`;
// // }

// // /* =====================================================
// //    COMPONENT
// // ===================================================== */

// // export default function PropertyCard({
// //   property,
// //   ownerMode = false,
// // }) {
// //   const [liked, setLiked] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [showMore, setShowMore] = useState(false);

// //   if (!property) {
// //     return null;
// //   }

// //   /* ===================================================
// //      PROPERTY DATA
// //   =================================================== */

// //   const documentId =
// //     property?.documentId || property?.id;

// //   const title =
// //     property?.Title || "Untitled Property";

// //   const city =
// //     property?.City || "";

// //   const area =
// //     property?.Area || "";

// //   const purpose =
// //     property?.Purpose || "Sale";

// //   const propertyType =
// //     property?.Property_Type || "Property";

// //   const category =
// //     property?.Category || "";

// //   const status =
// //     property?.PropertyStatus || "Available";

// //   const ownerStatus =
// //     getOwnerStatus(status);

// //   const imageUrl =
// //     getImageUrl(property);

// //   /* ===================================================
// //      PRICE
// //   =================================================== */

// //   const price = formatPrice(
// //     property?.Price,
// //     property?.PriceUnits
// //   );

// //   /* ===================================================
// //      PROPERTY DETAILS
// //   =================================================== */

// //   const commonDetails =
// //     property?.PropertyCommonDetails || {};

// //   const residentialDetails =
// //     property?.ResidentialDetails || {};

// //   const commercialDetails =
// //     property?.CommercialDetails || {};

// //   const beds =
// //     residentialDetails?.Bedrooms ??
// //     commonDetails?.Bedrooms ??
// //     property?.Bedrooms ??
// //     property?.BHK ??
// //     null;

// //   const parking =
// //     residentialDetails?.Parking ??
// //     commonDetails?.Parking ??
// //     property?.Parking ??
// //     null;

// //   const areaValue =
// //     commonDetails?.BuiltUpArea ??
// //     commonDetails?.Area ??
// //     property?.BuiltUpArea ??
// //     property?.AreaSize ??
// //     null;

// //   const views =
// //     property?.Views ??
// //     property?.views ??
// //     0;

// //   const saves =
// //     property?.Saves ??
// //     property?.saves ??
// //     0;

// //   const enquiries =
// //     property?.Enquiries ??
// //     property?.enquiries ??
// //     0;

// //   /* ===================================================
// //      WISHLIST
// //      USER CARD ONLY
// //   =================================================== */

// //   const handleWishlist = async () => {
// //     if (loading) {
// //       return;
// //     }

// //     const token =
// //       typeof window !== "undefined"
// //         ? localStorage.getItem("token")
// //         : null;

// //     if (!token) {
// //       toast.error(
// //         "Please login to use wishlist."
// //       );
// //       return;
// //     }

// //     if (!documentId) {
// //       toast.error(
// //         "Property ID not found."
// //       );
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const alreadyLiked =
// //         await isPropertyInWishlist(
// //           documentId
// //         );

// //       if (alreadyLiked) {
// //         await removeFromWishlist(
// //           documentId
// //         );

// //         setLiked(false);

// //         toast.success(
// //           "Removed from wishlist."
// //         );
// //       } else {
// //         await addToWishlist(
// //           documentId
// //         );

// //         setLiked(true);

// //         toast.success(
// //           "Added to wishlist ❤️"
// //         );
// //       }
// //     } catch (error) {
// //       console.error(
// //         "Wishlist Error:",
// //         error
// //       );

// //       toast.error(
// //         error?.message ||
// //           "Wishlist update failed."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* =====================================================
// //      OWNER CARD
// //   ===================================================== */

// //   if (ownerMode) {
// //     return (
// //       <article className="group overflow-hidden rounded-2xl border border-[#3A3329] bg-[#171411] shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B99852] hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)]">

// //         {/* IMAGE */}

// //         <div className="relative h-52 w-full overflow-hidden bg-[#24201B]">

// //           <Image
// //             src={imageUrl}
// //             alt={title}
// //             fill
// //             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
// //             className="object-cover transition duration-500 group-hover:scale-105"
// //             unoptimized
// //           />

// //           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/10" />

// //           {/* STATUS */}

// //           <span
// //             className={`absolute left-3 top-3 rounded-md px-3 py-1 text-[11px] font-extrabold tracking-wide shadow ${getStatusStyle(
// //               status
// //             )}`}
// //           >
// //             {ownerStatus}
// //           </span>

// //           {/* BOOKMARK */}

// //           <button
// //             type="button"
// //             className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/70"
// //             aria-label="Bookmark property"
// //           >
// //             <Bookmark size={17} />
// //           </button>

// //           {/* SPECIAL STATUS */}

// //           {[
// //             "DRAFT",
// //             "SOLD",
// //             "RENTED",
// //             "RESERVED",
// //           ].includes(ownerStatus) && (
// //             <div className="absolute inset-0 flex items-center justify-center">

// //               <div className="rounded-xl bg-black/45 px-6 py-4 text-center backdrop-blur-[2px]">

// //                 {ownerStatus === "SOLD" && (
// //                   <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#E76F51] text-[#E76F51]">
// //                     ✓
// //                   </div>
// //                 )}

// //                 {ownerStatus === "RENTED" && (
// //                   <div className="mx-auto mb-2 text-3xl text-[#D76AD8]">
// //                     ⛓
// //                   </div>
// //                 )}

// //                 {ownerStatus === "RESERVED" && (
// //                   <div className="mx-auto mb-2 text-3xl text-[#D89B31]">
// //                     ⌛
// //                   </div>
// //                 )}

// //                 <p className="text-lg font-extrabold tracking-wide text-white">
// //                   {ownerStatus}
// //                 </p>

// //                 {ownerStatus === "DRAFT" && (
// //                   <p className="mt-1 text-xs text-white/70">
// //                     Continue editing
// //                   </p>
// //                 )}

// //               </div>

// //             </div>
// //           )}

// //         </div>

// //         {/* CONTENT */}

// //         <div className="p-4">

// //           {/* TITLE */}

// //           <h2 className="line-clamp-1 text-[17px] font-bold text-white">
// //             {title}
// //           </h2>

// //           {/* LOCATION */}

// //           <p className="mt-2 flex items-center gap-1.5 text-xs text-[#B8B0A5]">

// //             <MapPin
// //               size={14}
// //               className="shrink-0 text-[#D0A54A]"
// //             />

// //             <span className="line-clamp-1">
// //               {area}
// //               {area && city ? ", " : ""}
// //               {city}
// //             </span>

// //           </p>

// //           {/* PRICE */}

// //           <p className="mt-3 text-lg font-extrabold text-[#4CCB63]">
// //             {price}

// //             {purpose?.toLowerCase() === "rent" && (
// //               <span className="ml-1 text-xs font-medium text-[#A9A19A]">
// //                 / month
// //               </span>
// //             )}
// //           </p>

// //           {/* FEATURES */}

// //           <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#C7C0B7]">

// //             {beds !== null && (
// //               <span className="flex items-center gap-1">
// //                 <BedDouble size={14} />
// //                 {beds} Beds
// //               </span>
// //             )}

// //             {parking !== null && (
// //               <span className="flex items-center gap-1">
// //                 <Car size={14} />
// //                 {parking} Parking
// //               </span>
// //             )}

// //             {areaValue !== null && (
// //               <span className="flex items-center gap-1">
// //                 <Maximize size={13} />
// //                 {areaValue} sq.ft
// //               </span>
// //             )}

// //             {category && (
// //               <span className="rounded bg-[#27231E] px-2 py-0.5">
// //                 {category}
// //               </span>
// //             )}

// //           </div>

// //           {/* STATS */}

// //           <div className="mt-4 grid grid-cols-3 border-t border-[#39332B] pt-3">

// //             <div className="flex flex-col">
// //               <span className="flex items-center gap-1 text-xs text-[#C1B9AF]">
// //                 <Eye size={13} />
// //                 {views}
// //               </span>

// //               <span className="mt-0.5 text-[10px] text-[#817A72]">
// //                 Views
// //               </span>
// //             </div>

// //             <div className="flex flex-col">
// //               <span className="flex items-center gap-1 text-xs text-[#C1B9AF]">
// //                 <Heart size={13} />
// //                 {saves}
// //               </span>

// //               <span className="mt-0.5 text-[10px] text-[#817A72]">
// //                 Saves
// //               </span>
// //             </div>

// //             <div className="flex flex-col">
// //               <span className="flex items-center gap-1 text-xs text-[#C1B9AF]">
// //                 <MessageSquare size={13} />
// //                 {enquiries}
// //               </span>

// //               <span className="mt-0.5 text-[10px] text-[#817A72]">
// //                 Enquiries
// //               </span>
// //             </div>

// //           </div>

// //           {/* ACTIONS */}

// //           <div className="mt-4 flex gap-2">

// //             {/* VIEW */}

// //             <Link
// //               href={`/user/property/${documentId}`}
// //               className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#39332B] bg-[#24201B] px-3 py-2.5 text-xs font-bold text-white transition hover:border-[#B99852] hover:bg-[#302A23]"
// //             >
// //               <Eye size={14} />
// //               View
// //             </Link>

// //             {/* EDIT */}

// //             <Link
// //               href={`/owner/properties/${documentId}/edit`}
// //               className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#66512D] bg-[#2A241B] px-3 py-2.5 text-xs font-bold text-[#E1B75A] transition hover:bg-[#3A301F]"
// //             >
// //               <Pencil size={14} />
// //               Edit
// //             </Link>

// //             {/* MORE */}

// //             <div className="relative">

// //               <button
// //                 type="button"
// //                 onClick={() =>
// //                   setShowMore((value) => !value)
// //                 }
// //                 className="flex h-full min-w-[44px] items-center justify-center gap-1 rounded-lg border border-[#39332B] bg-[#24201B] px-3 text-white transition hover:border-[#B99852]"
// //                 aria-label="More actions"
// //               >
// //                 <MoreVertical size={16} />
// //               </button>

// //               {showMore && (
// //                 <div className="absolute bottom-12 right-0 z-20 w-36 overflow-hidden rounded-xl border border-[#40382F] bg-[#211D18] p-1 shadow-2xl">

// //                   <Link
// //                     href={`/user/property/${documentId}`}
// //                     className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white hover:bg-[#302A23]"
// //                   >
// //                     <ExternalLink size={13} />
// //                     View Property
// //                   </Link>

// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       setShowMore(false);
// //                       toast("More actions coming soon.");
// //                     }}
// //                     className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-white hover:bg-[#302A23]"
// //                   >
// //                     <MoreVertical size={13} />
// //                     More Options
// //                   </button>

// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       setShowMore(false);
// //                       toast.error(
// //                         "Delete action will be connected next."
// //                       );
// //                     }}
// //                     className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-400 hover:bg-red-950/30"
// //                   >
// //                     <Trash2 size={13} />
// //                     Delete
// //                   </button>

// //                 </div>
// //               )}

// //             </div>

// //           </div>

// //           {/* DRAFT ACTION */}

// //           {ownerStatus === "DRAFT" && (
// //             <Link
// //               href={`/owner/properties/${documentId}/edit`}
// //               className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#392449] px-3 py-2 text-xs font-bold text-[#D99AE8] transition hover:bg-[#49305C]"
// //             >
// //               Continue Editing
// //             </Link>
// //           )}

// //         </div>

// //       </article>
// //     );
// //   }

// //   /* =====================================================
// //      EXISTING USER PROPERTY CARD
// //      FLOW UNCHANGED
// //   ===================================================== */

// //   let statusClass =
// //     "bg-yellow-100 text-yellow-700";

// //   if (status === "Available") {
// //     statusClass =
// //       "bg-green-100 text-green-700";
// //   }

// //   if (status === "Sold") {
// //     statusClass =
// //       "bg-red-100 text-red-700";
// //   }

// //   return (
// //     <article className="overflow-hidden rounded-lg border border-[#D9D1C2] bg-[#F7F0E3] shadow-[0_8px_24px_rgba(30,61,48,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#B99852] hover:shadow-[0_18px_34px_rgba(30,61,48,0.15)]">

// //       {/* IMAGE */}

// //       <div className="relative h-60 w-full overflow-hidden bg-[#DDE6DE]">

// //         <Image
// //           src={imageUrl}
// //           alt={title}
// //           fill
// //           sizes="(max-width: 768px) 100vw, 400px"
// //           className="object-cover transition duration-500 hover:scale-105"
// //           unoptimized
// //         />

// //         <span className="absolute left-4 top-4 rounded-full bg-[#174B3B] px-3 py-1 text-xs font-bold text-[#F7F0E3] shadow">
// //           {propertyType}
// //         </span>

// //         <span className="absolute right-4 top-4 rounded-full bg-[#F7F0E3] px-3 py-1 text-xs font-bold text-[#174B3B] shadow">
// //           {purpose}
// //         </span>

// //       </div>

// //       {/* CONTENT */}

// //       <div className="p-5">

// //         <h2 className="line-clamp-1 text-xl font-extrabold text-[#123F32]">
// //           {title}
// //         </h2>

// //         <p className="mt-3 flex items-center gap-2 text-sm text-[#718177]">

// //           <MapPin
// //             size={16}
// //             className="text-[#B99852]"
// //           />

// //           <span>
// //             {area}
// //             {area && city ? ", " : ""}
// //             {city}
// //           </span>

// //         </p>

// //         <div className="mt-4 flex flex-wrap gap-2">

// //           {category && (
// //             <span className="rounded-full bg-[#E5E8DE] px-3 py-1 text-xs font-semibold text-[#416353]">
// //               {category}
// //             </span>
// //           )}

// //           <span
// //             className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
// //           >
// //             {status}
// //           </span>

// //         </div>

// //         <div className="mt-6 grid grid-cols-[1fr_1fr_52px] gap-3">

// //           <Link
// //             href={`/user/property/${documentId}`}
// //             className="rounded-lg bg-[#174B3B] px-3 py-3 text-center text-sm font-bold text-[#F7F0E3] transition hover:bg-[#123F32]"
// //           >
// //             View Details
// //           </Link>

// //           <Link
// //             href={`/user/contact-owner/${documentId}`}
// //             className="rounded-lg border border-[#B99852] bg-transparent px-3 py-3 text-center text-sm font-bold text-[#174B3B] transition hover:bg-[#D7AE62] hover:text-[#123F32]"
// //           >
// //             Contact Owner
// //           </Link>

// //           <button
// //             type="button"
// //             onClick={handleWishlist}
// //             disabled={loading}
// //             className={`flex items-center justify-center rounded-lg border transition ${
// //               liked
// //                 ? "border-red-400 bg-red-50"
// //                 : "border-[#C9D0C8] bg-transparent hover:border-red-400 hover:bg-red-50"
// //             } ${
// //               loading
// //                 ? "cursor-not-allowed opacity-50"
// //                 : ""
// //             }`}
// //             aria-label={
// //               liked
// //                 ? "Remove from wishlist"
// //                 : "Add to wishlist"
// //             }
// //           >
// //             <Heart
// //               size={22}
// //               className={
// //                 liked
// //                   ? "fill-red-500 text-red-500"
// //                   : "text-gray-500"
// //               }
// //             />
// //           </button>

// //         </div>

// //       </div>

// //     </article>
// //   );
// // // }
// // "use client";

// // import Image from "next/image";
// // import Link from "next/link";
// // import { useState } from "react";

// // import {
// //   Heart,
// //   MapPin,
// //   BedDouble,
// //   Car,
// //   Maximize,
// //   Eye,
// //   Bookmark,
// //   MessageSquare,
// //   Pencil,
// //   MoreVertical,
// //   Trash2,
// //   ExternalLink,
// // } from "lucide-react";

// // import toast from "react-hot-toast";

// // import {
// //   addToWishlist,
// //   removeFromWishlist,
// //   isPropertyInWishlist,
// // } from "@/services/wishlistService";

// // const STRAPI_URL =
// //   process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
// //   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
// //   "http://localhost:1337";

// // /* =====================================================
// //    HELPERS
// // ===================================================== */

// // function getImageUrl(property) {
// //   let imageUrl = "/no-property.png";

// //   if (property?.CoverImage?.url) {
// //     imageUrl = property.CoverImage.url;

// //     if (!imageUrl.startsWith("http")) {
// //       imageUrl = `${STRAPI_URL}${imageUrl}`;
// //     }
// //   }

// //   return imageUrl;
// // }

// // /* =====================================================
// //    STATUS STYLE
// // ===================================================== */

// // function getStatusStyle(status) {
// //   const value = status?.toString().toLowerCase();

// //   switch (value) {
// //     case "available":
// //     case "active":
// //       return "bg-[#0E7658] text-white";

// //     case "pending":
// //       return "bg-[#D88A16] text-white";

// //     case "draft":
// //       return "bg-[#7C3AED] text-white";

// //     case "sold":
// //       return "bg-[#B42318] text-white";

// //     case "rented":
// //       return "bg-[#8B3FC7] text-white";

// //     case "inactive":
// //       return "bg-[#475467] text-white";

// //     case "reserved":
// //       return "bg-[#A66A12] text-white";

// //     default:
// //       return "bg-[#667085] text-white";
// //   }
// // }

// // /* =====================================================
// //    OWNER STATUS
// // ===================================================== */

// // function getOwnerStatus(status) {
// //   const value = status?.toString().toLowerCase();

// //   if (value === "available") return "ACTIVE";
// //   if (value === "active") return "ACTIVE";
// //   if (value === "pending") return "PENDING";
// //   if (value === "draft") return "DRAFT";
// //   if (value === "sold") return "SOLD";
// //   if (value === "rented") return "RENTED";
// //   if (value === "inactive") return "INACTIVE";
// //   if (value === "reserved") return "RESERVED";

// //   return status || "ACTIVE";
// // }

// // /* =====================================================
// //    STATUS IMAGE CLASS
// // ===================================================== */

// // function getOwnerImageClass(ownerStatus) {
// //   switch (ownerStatus) {
// //     case "DRAFT":
// //     case "SOLD":
// //     case "RENTED":
// //     case "RESERVED":
// //       return "scale-[1.03] blur-[3px]";

// //     case "INACTIVE":
// //       return "scale-[1.02] blur-[1.5px] grayscale-[20%] opacity-75";

// //     default:
// //       return "";
// //   }
// // }

// // /* =====================================================
// //    STATUS OVERLAY
// // ===================================================== */

// // function getStatusOverlay(ownerStatus) {
// //   if (
// //     !["DRAFT", "SOLD", "RENTED", "RESERVED"].includes(
// //       ownerStatus,
// //     )
// //   ) {
// //     return null;
// //   }

// //   let icon = null;
// //   let iconClass = "";

// //   if (ownerStatus === "SOLD") {
// //     icon = "✓";
// //     iconClass =
// //       "border-2 border-[#E76F51] text-[#E76F51]";
// //   }

// //   if (ownerStatus === "RENTED") {
// //     icon = "⛓";
// //     iconClass = "text-[#D76AD8]";
// //   }

// //   if (ownerStatus === "RESERVED") {
// //     icon = "⌛";
// //     iconClass = "text-[#D89B31]";
// //   }

// //   return {
// //     icon,
// //     iconClass,
// //   };
// // }

// // /* =====================================================
// //    PRICE
// // ===================================================== */

// // function formatPrice(price, priceUnits) {
// //   if (
// //     price === null ||
// //     price === undefined ||
// //     price === ""
// //   ) {
// //     return "--";
// //   }

// //   const numericPrice = Number(price);

// //   if (Number.isNaN(numericPrice)) {
// //     return `${price}`;
// //   }

// //   const formatted = new Intl.NumberFormat("en-IN").format(
// //     numericPrice,
// //   );

// //   if (
// //     priceUnits &&
// //     priceUnits.toString().toLowerCase() !== "inr"
// //   ) {
// //     return `₹${formatted} ${priceUnits}`;
// //   }

// //   return `₹${formatted}`;
// // }

// // /* =====================================================
// //    DATE
// // ===================================================== */

// // function formatListedDate(date) {
// //   if (!date) {
// //     return "";
// //   }

// //   try {
// //     return new Intl.DateTimeFormat("en-IN", {
// //       day: "2-digit",
// //       month: "short",
// //       year: "numeric",
// //     }).format(new Date(date));
// //   } catch {
// //     return "";
// //   }
// // }

// // /* =====================================================
// //    COMPONENT
// // ===================================================== */

// // export default function PropertyCard({
// //   property,
// //   ownerMode = false,
// // }) {
// //   const [liked, setLiked] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [showMore, setShowMore] = useState(false);

// //   if (!property) {
// //     return null;
// //   }

// //   /* ===================================================
// //      PROPERTY DATA
// //   =================================================== */

// //   const documentId =
// //     property?.documentId || property?.id;

// //   const title =
// //     property?.Title || "Untitled Property";

// //   const city =
// //     property?.City || "";

// //   const area =
// //     property?.Area || "";

// //   const purpose =
// //     property?.Purpose || "Sale";

// //   const propertyType =
// //     property?.Property_Type || "Property";

// //   const category =
// //     property?.Category || "";

// //   const status =
// //     property?.PropertyStatus || "Available";

// //   const ownerStatus =
// //     getOwnerStatus(status);

// //   const imageUrl =
// //     getImageUrl(property);

// //   /* ===================================================
// //      PRICE
// //   =================================================== */

// //   const commonDetails =
// //     property?.PropertyCommonDetails || {};

// //   const price = formatPrice(
// //     property?.Price ?? commonDetails?.Price,
// //     property?.PriceUnits ?? commonDetails?.PriceUnits,
// //   );

// //   /* ===================================================
// //      PROPERTY DETAILS
// //   =================================================== */

// //   const residentialDetails =
// //     property?.ResidentialDetails || {};

// //   const commercialDetails =
// //     property?.CommercialDetails || {};

// //   const beds =
// //     residentialDetails?.Bedrooms ??
// //     commonDetails?.Bedrooms ??
// //     property?.Bedrooms ??
// //     property?.BHK ??
// //     null;

// //   const parking =
// //     residentialDetails?.Parking ??
// //     commercialDetails?.Parking ??
// //     commonDetails?.Parking ??
// //     property?.Parking ??
// //     null;

// //   const areaValue =
// //     commonDetails?.BuiltUpArea ??
// //     commonDetails?.Built_upArea ??
// //     commonDetails?.Area ??
// //     property?.BuiltUpArea ??
// //     property?.AreaSize ??
// //     null;

// //   const views =
// //     property?.Views ??
// //     property?.views ??
// //     0;

// //   const saves =
// //     property?.Saves ??
// //     property?.saves ??
// //     0;

// //   const enquiries =
// //     property?.Enquiries ??
// //     property?.enquiries ??
// //     0;

// //   const listedDate =
// //     formatListedDate(
// //       property?.createdAt ||
// //         property?.publishedAt,
// //     );

// //   /* ===================================================
// //      OWNER IMAGE / OVERLAY
// //   =================================================== */

// //   const ownerImageClass =
// //     getOwnerImageClass(ownerStatus);

// //   const statusOverlay =
// //     getStatusOverlay(ownerStatus);

// //   /* ===================================================
// //      WISHLIST
// //      USER CARD ONLY
// //   =================================================== */

// //   const handleWishlist = async () => {
// //     if (loading) {
// //       return;
// //     }

// //     const token =
// //       typeof window !== "undefined"
// //         ? localStorage.getItem("token")
// //         : null;

// //     if (!token) {
// //       toast.error(
// //         "Please login to use wishlist.",
// //       );
// //       return;
// //     }

// //     if (!documentId) {
// //       toast.error(
// //         "Property ID not found.",
// //       );
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const alreadyLiked =
// //         await isPropertyInWishlist(
// //           documentId,
// //         );

// //       if (alreadyLiked) {
// //         await removeFromWishlist(
// //           documentId,
// //         );

// //         setLiked(false);

// //         toast.success(
// //           "Removed from wishlist.",
// //         );
// //       } else {
// //         await addToWishlist(
// //           documentId,
// //         );

// //         setLiked(true);

// //         toast.success(
// //           "Added to wishlist ❤️",
// //         );
// //       }
// //     } catch (error) {
// //       console.error(
// //         "Wishlist Error:",
// //         error,
// //       );

// //       toast.error(
// //         error?.message ||
// //           "Wishlist update failed.",
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* =====================================================
// //      OWNER CARD
// //      FLOW UNCHANGED
// // ===================================================== */

// //   if (ownerMode) {
// //     return (
// //       <article
// //         className="
// //           group
// //           overflow-visible
// //           rounded-2xl
// //           border
// //           border-[#3A3329]
// //           bg-[#171411]
// //           shadow-[0_10px_30px_rgba(0,0,0,0.18)]
// //           transition-all
// //           duration-300
// //           hover:-translate-y-1
// //           hover:border-[#B99852]
// //           hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)]
// //         "
// //       >
// //         {/* =================================================
// //             IMAGE
// //         ================================================= */}

// //         <div className="relative h-52 w-full overflow-hidden rounded-t-2xl bg-[#24201B]">

// //           <Image
// //             src={imageUrl}
// //             alt={title}
// //             fill
// //             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
// //             className={`
// //               object-cover
// //               transition-all
// //               duration-500
// //               group-hover:scale-105
// //               ${ownerImageClass}
// //             `}
// //             unoptimized
// //           />

// //           {/* IMAGE DARK GRADIENT */}

// //           <div
// //             className="
// //               absolute
// //               inset-0
// //               bg-gradient-to-t
// //               from-black/75
// //               via-black/15
// //               to-black/10
// //             "
// //           />

// //           {/* =================================================
// //               STATUS BADGE
// //           ================================================= */}

// //           <span
// //             className={`
// //               absolute
// //               left-3
// //               top-3
// //               rounded-md
// //               px-3
// //               py-1
// //               text-[11px]
// //               font-extrabold
// //               tracking-wide
// //               shadow-lg
// //               ${getStatusStyle(status)}
// //             `}
// //           >
// //             {ownerStatus}
// //           </span>

// //           {/* =================================================
// //               BOOKMARK
// //           ================================================= */}

// //           <button
// //             type="button"
// //             className="
// //               absolute
// //               right-3
// //               top-3
// //               flex
// //               h-8
// //               w-8
// //               items-center
// //               justify-center
// //               rounded-lg
// //               bg-black/40
// //               text-white
// //               backdrop-blur-sm
// //               transition
// //               hover:bg-black/70
// //             "
// //             aria-label="Bookmark property"
// //           >
// //             <Bookmark size={17} />
// //           </button>

// //           {/* =================================================
// //               SPECIAL STATUS OVERLAY
// //           ================================================= */}

// //           {statusOverlay && (
// //             <div
// //               className="
// //                 absolute
// //                 inset-0
// //                 flex
// //                 items-center
// //                 justify-center
// //               "
// //             >
// //               <div
// //                 className="
// //                   rounded-xl
// //                   bg-black/50
// //                   px-7
// //                   py-5
// //                   text-center
// //                   shadow-2xl
// //                   backdrop-blur-[3px]
// //                 "
// //               >

// //                 {/* SOLD ICON */}

// //                 {ownerStatus === "SOLD" && (
// //                   <div
// //                     className="
// //                       mx-auto
// //                       mb-2
// //                       flex
// //                       h-11
// //                       w-11
// //                       items-center
// //                       justify-center
// //                       rounded-full
// //                       border-2
// //                       border-[#E76F51]
// //                       text-xl
// //                       font-bold
// //                       text-[#E76F51]
// //                     "
// //                   >
// //                     ✓
// //                   </div>
// //                 )}

// //                 {/* RENTED ICON */}

// //                 {ownerStatus === "RENTED" && (
// //                   <div
// //                     className="
// //                       mx-auto
// //                       mb-2
// //                       text-3xl
// //                       text-[#D76AD8]
// //                     "
// //                   >
// //                     ⛓
// //                   </div>
// //                 )}

// //                 {/* RESERVED ICON */}

// //                 {ownerStatus === "RESERVED" && (
// //                   <div
// //                     className="
// //                       mx-auto
// //                       mb-2
// //                       text-3xl
// //                       text-[#D89B31]
// //                     "
// //                   >
// //                     ⌛
// //                   </div>
// //                 )}

// //                 {/* STATUS TEXT */}

// //                 <p
// //                   className="
// //                     text-lg
// //                     font-extrabold
// //                     tracking-wide
// //                     text-white
// //                   "
// //                 >
// //                   {ownerStatus}
// //                 </p>

// //                 {/* SOLD DATE */}

// //                 {ownerStatus === "SOLD" &&
// //                   listedDate && (
// //                     <p className="mt-1 text-[11px] text-white/70">
// //                       Listed on {listedDate}
// //                     </p>
// //                   )}

// //                 {/* RENTED DATE */}

// //                 {ownerStatus === "RENTED" &&
// //                   listedDate && (
// //                     <p className="mt-1 text-[11px] text-white/70">
// //                       Listed on {listedDate}
// //                     </p>
// //                   )}

// //                 {/* RESERVED DATE */}

// //                 {ownerStatus === "RESERVED" &&
// //                   listedDate && (
// //                     <p className="mt-1 text-[11px] text-white/70">
// //                       Listed on {listedDate}
// //                     </p>
// //                   )}

// //                 {/* DRAFT MESSAGE */}

// //                 {ownerStatus === "DRAFT" && (
// //                   <p className="mt-1 text-xs text-white/70">
// //                     Continue editing
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* =================================================
// //             CONTENT
// //         ================================================= */}

// //         <div className="p-4">

// //           {/* TITLE */}

// //           <h2
// //             className="
// //               line-clamp-1
// //               text-[17px]
// //               font-bold
// //               text-white
// //             "
// //           >
// //             {title}
// //           </h2>

// //           {/* LOCATION */}

// //           <p
// //             className="
// //               mt-2
// //               flex
// //               items-center
// //               gap-1.5
// //               text-xs
// //               text-[#B8B0A5]
// //             "
// //           >
// //             <MapPin
// //               size={14}
// //               className="shrink-0 text-[#D0A54A]"
// //             />

// //             <span className="line-clamp-1">
// //               {area}
// //               {area && city ? ", " : ""}
// //               {city}
// //             </span>
// //           </p>

// //           {/* PRICE */}

// //           <p
// //             className="
// //               mt-3
// //               text-lg
// //               font-extrabold
// //               text-[#4CCB63]
// //             "
// //           >
// //             {price}

// //             {purpose?.toLowerCase() ===
// //               "rent" && (
// //               <span
// //                 className="
// //                   ml-1
// //                   text-xs
// //                   font-medium
// //                   text-[#A9A19A]
// //                 "
// //               >
// //                 / month
// //               </span>
// //             )}
// //           </p>

// //           {/* =================================================
// //               FEATURES
// //           ================================================= */}

// //           <div
// //             className="
// //               mt-3
// //               flex
// //               flex-wrap
// //               gap-x-4
// //               gap-y-2
// //               text-[11px]
// //               text-[#C7C0B7]
// //             "
// //           >
// //             {beds !== null && (
// //               <span className="flex items-center gap-1">
// //                 <BedDouble size={14} />
// //                 {beds} Beds
// //               </span>
// //             )}

// //             {parking !== null && (
// //               <span className="flex items-center gap-1">
// //                 <Car size={14} />
// //                 {parking} Parking
// //               </span>
// //             )}

// //             {areaValue !== null && (
// //               <span className="flex items-center gap-1">
// //                 <Maximize size={13} />
// //                 {areaValue} sq.ft
// //               </span>
// //             )}

// //             {category && (
// //               <span
// //                 className="
// //                   rounded
// //                   bg-[#27231E]
// //                   px-2
// //                   py-0.5
// //                 "
// //               >
// //                 {category}
// //               </span>
// //             )}
// //           </div>

// //           {/* =================================================
// //               STATS
// //           ================================================= */}

// //           <div
// //             className="
// //               mt-4
// //               grid
// //               grid-cols-3
// //               border-t
// //               border-[#39332B]
// //               pt-3
// //             "
// //           >
// //             <div className="flex flex-col">
// //               <span
// //                 className="
// //                   flex
// //                   items-center
// //                   gap-1
// //                   text-xs
// //                   text-[#C1B9AF]
// //                 "
// //               >
// //                 <Eye size={13} />
// //                 {views}
// //               </span>

// //               <span
// //                 className="
// //                   mt-0.5
// //                   text-[10px]
// //                   text-[#817A72]
// //                 "
// //               >
// //                 Views
// //               </span>
// //             </div>

// //             <div className="flex flex-col">
// //               <span
// //                 className="
// //                   flex
// //                   items-center
// //                   gap-1
// //                   text-xs
// //                   text-[#C1B9AF]
// //                 "
// //               >
// //                 <Heart size={13} />
// //                 {saves}
// //               </span>

// //               <span
// //                 className="
// //                   mt-0.5
// //                   text-[10px]
// //                   text-[#817A72]
// //                 "
// //               >
// //                 Saves
// //               </span>
// //             </div>

// //             <div className="flex flex-col">
// //               <span
// //                 className="
// //                   flex
// //                   items-center
// //                   gap-1
// //                   text-xs
// //                   text-[#C1B9AF]
// //                 "
// //               >
// //                 <MessageSquare size={13} />
// //                 {enquiries}
// //               </span>

// //               <span
// //                 className="
// //                   mt-0.5
// //                   text-[10px]
// //                   text-[#817A72]
// //                 "
// //               >
// //                 Enquiries
// //               </span>
// //             </div>
// //           </div>

// //           {/* =================================================
// //               LISTED DATE
// //           ================================================= */}

// //           {listedDate && (
// //             <p
// //               className="
// //                 mt-3
// //                 text-[10px]
// //                 text-[#817A72]
// //               "
// //             >
// //               Listed on {listedDate}
// //             </p>
// //           )}

// //           {/* =================================================
// //               ACTIONS
// //           ================================================= */}

// //           <div className="mt-4 flex gap-2">

// //             {/* VIEW */}

// //             <Link
// //               href={`/user/property/${documentId}`}
// //               className="
// //                 flex
// //                 flex-1
// //                 items-center
// //                 justify-center
// //                 gap-1.5
// //                 rounded-lg
// //                 border
// //                 border-[#39332B]
// //                 bg-[#24201B]
// //                 px-3
// //                 py-2.5
// //                 text-xs
// //                 font-bold
// //                 text-white
// //                 transition
// //                 hover:border-[#B99852]
// //                 hover:bg-[#302A23]
// //               "
// //             >
// //               <Eye size={14} />
// //               View
// //             </Link>

// //             {/* EDIT */}

// //             <Link
// //               href={`/owner/properties/${documentId}/edit`}
// //               className="
// //                 flex
// //                 flex-1
// //                 items-center
// //                 justify-center
// //                 gap-1.5
// //                 rounded-lg
// //                 border
// //                 border-[#66512D]
// //                 bg-[#2A241B]
// //                 px-3
// //                 py-2.5
// //                 text-xs
// //                 font-bold
// //                 text-[#E1B75A]
// //                 transition
// //                 hover:bg-[#3A301F]
// //               "
// //             >
// //               <Pencil size={14} />
// //               Edit
// //             </Link>

// //             {/* MORE */}

// //             <div className="relative">

// //               <button
// //                 type="button"
// //                 onClick={() =>
// //                   setShowMore(
// //                     (value) => !value,
// //                   )
// //                 }
// //                 className="
// //                   flex
// //                   h-full
// //                   min-w-[44px]
// //                   items-center
// //                   justify-center
// //                   gap-1
// //                   rounded-lg
// //                   border
// //                   border-[#39332B]
// //                   bg-[#24201B]
// //                   px-3
// //                   text-white
// //                   transition
// //                   hover:border-[#B99852]
// //                 "
// //                 aria-label="More actions"
// //               >
// //                 <MoreVertical size={16} />
// //               </button>

// //               {showMore && (
// //                 <div
// //                   className="
// //                     absolute
// //                     bottom-12
// //                     right-0
// //                     z-20
// //                     w-36
// //                     overflow-hidden
// //                     rounded-xl
// //                     border
// //                     border-[#40382F]
// //                     bg-[#211D18]
// //                     p-1
// //                     shadow-2xl
// //                   "
// //                 >

// //                   <Link
// //                     href={`/user/property/${documentId}`}
// //                     className="
// //                       flex
// //                       items-center
// //                       gap-2
// //                       rounded-lg
// //                       px-3
// //                       py-2
// //                       text-xs
// //                       text-white
// //                       hover:bg-[#302A23]
// //                     "
// //                   >
// //                     <ExternalLink size={13} />
// //                     View Property
// //                   </Link>

// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       setShowMore(false);

// //                       toast(
// //                         "More actions coming soon.",
// //                       );
// //                     }}
// //                     className="
// //                       flex
// //                       w-full
// //                       items-center
// //                       gap-2
// //                       rounded-lg
// //                       px-3
// //                       py-2
// //                       text-left
// //                       text-xs
// //                       text-white
// //                       hover:bg-[#302A23]
// //                     "
// //                   >
// //                     <MoreVertical size={13} />
// //                     More Options
// //                   </button>

// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       setShowMore(false);

// //                       toast.error(
// //                         "Delete action will be connected next.",
// //                       );
// //                     }}
// //                     className="
// //                       flex
// //                       w-full
// //                       items-center
// //                       gap-2
// //                       rounded-lg
// //                       px-3
// //                       py-2
// //                       text-left
// //                       text-xs
// //                       text-red-400
// //                       hover:bg-red-950/30
// //                     "
// //                   >
// //                     <Trash2 size={13} />
// //                     Delete
// //                   </button>

// //                 </div>
// //               )}

// //             </div>

// //           </div>

// //           {/* =================================================
// //               DRAFT ACTION
// //           ================================================= */}

// //           {ownerStatus === "DRAFT" && (
// //             <Link
// //               href={`/owner/properties/${documentId}/edit`}
// //               className="
// //                 mt-2
// //                 flex
// //                 w-full
// //                 items-center
// //                 justify-center
// //                 rounded-lg
// //                 bg-[#392449]
// //                 px-3
// //                 py-2
// //                 text-xs
// //                 font-bold
// //                 text-[#D99AE8]
// //                 transition
// //                 hover:bg-[#49305C]
// //               "
// //             >
// //               Continue Editing
// //             </Link>
// //           )}

// //         </div>
// //       </article>
// //     );
// //   }

// //   /* =====================================================
// //      EXISTING USER PROPERTY CARD
// //      FLOW UNCHANGED
// // ===================================================== */

// //   let statusClass =
// //     "bg-yellow-100 text-yellow-700";

// //   if (status === "Available") {
// //     statusClass =
// //       "bg-green-100 text-green-700";
// //   }

// //   if (status === "Sold") {
// //     statusClass =
// //       "bg-red-100 text-red-700";
// //   }

// //   return (
// //     <article
// //       className="
// //         overflow-hidden
// //         rounded-lg
// //         border
// //         border-[#D9D1C2]
// //         bg-[#F7F0E3]
// //         shadow-[0_8px_24px_rgba(30,61,48,0.08)]
// //         transition
// //         duration-300
// //         hover:-translate-y-1
// //         hover:border-[#B99852]
// //         hover:shadow-[0_18px_34px_rgba(30,61,48,0.15)]
// //       "
// //     >

// //       {/* IMAGE */}

// //       <div className="relative h-60 w-full overflow-hidden bg-[#DDE6DE]">

// //         <Image
// //           src={imageUrl}
// //           alt={title}
// //           fill
// //           sizes="(max-width: 768px) 100vw, 400px"
// //           className="
// //             object-cover
// //             transition
// //             duration-500
// //             hover:scale-105
// //           "
// //           unoptimized
// //         />

// //         <span
// //           className="
// //             absolute
// //             left-4
// //             top-4
// //             rounded-full
// //             bg-[#174B3B]
// //             px-3
// //             py-1
// //             text-xs
// //             font-bold
// //             text-[#F7F0E3]
// //             shadow
// //           "
// //         >
// //           {propertyType}
// //         </span>

// //         <span
// //           className="
// //             absolute
// //             right-4
// //             top-4
// //             rounded-full
// //             bg-[#F7F0E3]
// //             px-3
// //             py-1
// //             text-xs
// //             font-bold
// //             text-[#174B3B]
// //             shadow
// //           "
// //         >
// //           {purpose}
// //         </span>

// //       </div>

// //       {/* CONTENT */}

// //       <div className="p-5">

// //         <h2
// //           className="
// //             line-clamp-1
// //             text-xl
// //             font-extrabold
// //             text-[#123F32]
// //           "
// //         >
// //           {title}
// //         </h2>

// //         <p
// //           className="
// //             mt-3
// //             flex
// //             items-center
// //             gap-2
// //             text-sm
// //             text-[#718177]
// //           "
// //         >
// //           <MapPin
// //             size={16}
// //             className="text-[#B99852]"
// //           />

// //           <span>
// //             {area}
// //             {area && city ? ", " : ""}
// //             {city}
// //           </span>
// //         </p>

// //         <div className="mt-4 flex flex-wrap gap-2">

// //           {category && (
// //             <span
// //               className="
// //                 rounded-full
// //                 bg-[#E5E8DE]
// //                 px-3
// //                 py-1
// //                 text-xs
// //                 font-semibold
// //                 text-[#416353]
// //               "
// //             >
// //               {category}
// //             </span>
// //           )}

// //           <span
// //             className={`
// //               rounded-full
// //               px-3
// //               py-1
// //               text-xs
// //               font-semibold
// //               ${statusClass}
// //             `}
// //           >
// //             {status}
// //           </span>

// //         </div>

// //         <div
// //           className="
// //             mt-6
// //             grid
// //             grid-cols-[1fr_1fr_52px]
// //             gap-3
// //           "
// //         >

// //           <Link
// //             href={`/user/property/${documentId}`}
// //             className="
// //               rounded-lg
// //               bg-[#174B3B]
// //               px-3
// //               py-3
// //               text-center
// //               text-sm
// //               font-bold
// //               text-[#F7F0E3]
// //               transition
// //               hover:bg-[#123F32]
// //             "
// //           >
// //             View Details
// //           </Link>

// //           <Link
// //             href={`/user/contact-owner/${documentId}`}
// //             className="
// //               rounded-lg
// //               border
// //               border-[#B99852]
// //               bg-transparent
// //               px-3
// //               py-3
// //               text-center
// //               text-sm
// //               font-bold
// //               text-[#174B3B]
// //               transition
// //               hover:bg-[#D7AE62]
// //               hover:text-[#123F32]
// //             "
// //           >
// //             Contact Owner
// //           </Link>

// //           <button
// //             type="button"
// //             onClick={handleWishlist}
// //             disabled={loading}
// //             className={`
// //               flex
// //               items-center
// //               justify-center
// //               rounded-lg
// //               border
// //               transition
// //               ${
// //                 liked
// //                   ? "border-red-400 bg-red-50"
// //                   : "border-[#C9D0C8] bg-transparent hover:border-red-400 hover:bg-red-50"
// //               }
// //               ${
// //                 loading
// //                   ? "cursor-not-allowed opacity-50"
// //                   : ""
// //               }
// //             `}
// //             aria-label={
// //               liked
// //                 ? "Remove from wishlist"
// //                 : "Add to wishlist"
// //             }
// //           >
// //             <Heart
// //               size={22}
// //               className={
// //                 liked
// //                   ? "fill-red-500 text-red-500"
// //                   : "text-gray-500"
// //               }
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
// import { useState } from "react";

// import {
//   Heart,
//   MapPin,
//   BedDouble,
//   Car,
//   Maximize,
//   Eye,
//   Bookmark,
//   MessageSquare,
//   Pencil,
//   MoreVertical,
//   Trash2,
//   ExternalLink,
// } from "lucide-react";

// import toast from "react-hot-toast";

// import {
//   addToWishlist,
//   removeFromWishlist,
//   isPropertyInWishlist,
// } from "@/services/wishlistService";

// /* =====================================================
//    STRAPI URL
// ===================================================== */

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// /* =====================================================
//    IMAGE HELPER
// ===================================================== */

// function getImageUrl(property) {
//   let imageUrl = "/no-property.png";

//   if (property?.CoverImage?.url) {
//     imageUrl = property.CoverImage.url;

//     if (!imageUrl.startsWith("http")) {
//       imageUrl = `${STRAPI_URL}${imageUrl}`;
//     }
//   }

//   return imageUrl;
// }

// /* =====================================================
//    STATUS
// ===================================================== */

// function getOwnerStatus(status) {
//   const value = status?.toString().toLowerCase();

//   if (value === "available") return "ACTIVE";
//   if (value === "active") return "ACTIVE";
//   if (value === "pending") return "PENDING";
//   if (value === "draft") return "DRAFT";
//   if (value === "sold") return "SOLD";
//   if (value === "rented") return "RENTED";
//   if (value === "inactive") return "INACTIVE";
//   if (value === "reserved") return "RESERVED";

//   return status || "ACTIVE";
// }

// function getStatusStyle(status) {
//   const value = status?.toString().toLowerCase();

//   switch (value) {
//     case "available":
//     case "active":
//       return "bg-[#0E7658] text-white";

//     case "pending":
//       return "bg-[#D88A16] text-white";

//     case "draft":
//       return "bg-[#7C3AED] text-white";

//     case "sold":
//       return "bg-[#B42318] text-white";

//     case "rented":
//       return "bg-[#8B3FC7] text-white";

//     case "inactive":
//       return "bg-[#475467] text-white";

//     case "reserved":
//       return "bg-[#A66A12] text-white";

//     default:
//       return "bg-[#667085] text-white";
//   }
// }

// /* =====================================================
//    OWNER IMAGE STATE
// ===================================================== */

// function getOwnerImageClass(ownerStatus) {
//   switch (ownerStatus) {
//     case "DRAFT":
//     case "SOLD":
//     case "RENTED":
//     case "RESERVED":
//       return "scale-[1.03] blur-[2px]";

//     case "INACTIVE":
//       return "scale-[1.02] grayscale-[20%] opacity-75";

//     default:
//       return "";
//   }
// }

// /* =====================================================
//    PRICE
// ===================================================== */

// function formatPrice(price, priceUnits) {
//   if (
//     price === null ||
//     price === undefined ||
//     price === ""
//   ) {
//     return "--";
//   }

//   const numericPrice = Number(price);

//   if (Number.isNaN(numericPrice)) {
//     return `${price}`;
//   }

//   const formatted = new Intl.NumberFormat("en-IN").format(
//     numericPrice
//   );

//   if (
//     priceUnits &&
//     priceUnits.toString().toLowerCase() !== "inr"
//   ) {
//     return `₹${formatted} ${priceUnits}`;
//   }

//   return `₹${formatted}`;
// }

// /* =====================================================
//    DATE
// ===================================================== */

// function formatListedDate(date) {
//   if (!date) {
//     return "";
//   }

//   try {
//     return new Intl.DateTimeFormat("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     }).format(new Date(date));
//   } catch {
//     return "";
//   }
// }

// /* =====================================================
//    COMPONENT
// ===================================================== */

// export default function PropertyCard({
//   property,
//   ownerMode = false,
// }) {
//   const [liked, setLiked] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showMore, setShowMore] = useState(false);

//   if (!property) {
//     return null;
//   }

//   /* ===================================================
//      BASIC PROPERTY DATA
//   =================================================== */

//   const documentId =
//     property?.documentId || property?.id;

//   const title =
//     property?.Title || "Untitled Property";

//   const city =
//     property?.City || "";

//   const area =
//     property?.Area || "";

//   const purpose =
//     property?.Purpose || "Sale";

//   const propertyType =
//     property?.Property_Type || "Property";

//   const category =
//     property?.Category || "";

//   const status =
//     property?.PropertyStatus || "Available";

//   const ownerStatus =
//     getOwnerStatus(status);

//   const imageUrl =
//     getImageUrl(property);

//   /* ===================================================
//      COMMON DETAILS
//   =================================================== */

//   const commonDetails =
//     property?.PropertyCommonDetails || {};

//   /* ===================================================
//      PRICE
//   =================================================== */

//   const price = formatPrice(
//     property?.Price ??
//       commonDetails?.Price,
//     property?.PriceUnits ??
//       commonDetails?.PriceUnits
//   );

//   /* ===================================================
//      RESIDENTIAL / COMMERCIAL
//   =================================================== */

//   const residentialDetails =
//     property?.ResidentialDetails || {};

//   const commercialDetails =
//     property?.CommercialDetails || {};

//   /* ===================================================
//      BEDROOMS
//   =================================================== */

//   const beds =
//     residentialDetails?.Bedrooms ??
//     commonDetails?.Bedrooms ??
//     property?.Bedrooms ??
//     property?.BHK ??
//     null;

//   /* ===================================================
//      PARKING
//   =================================================== */

//   const parking =
//     residentialDetails?.Parking ??
//     commercialDetails?.Parking ??
//     commonDetails?.Parking ??
//     property?.Parking ??
//     null;

//   /* ===================================================
//      AREA
//   =================================================== */

//   const areaValue =
//     commonDetails?.BuiltUpArea ??
//     commonDetails?.Built_upArea ??
//     commonDetails?.Area ??
//     property?.BuiltUpArea ??
//     property?.AreaSize ??
//     null;

//   /* ===================================================
//      OWNER STATS
//   =================================================== */

//   const views =
//     property?.Views ??
//     property?.views ??
//     0;

//   const saves =
//     property?.Saves ??
//     property?.saves ??
//     0;

//   const enquiries =
//     property?.Enquiries ??
//     property?.enquiries ??
//     0;

//   const listedDate =
//     formatListedDate(
//       property?.createdAt ||
//         property?.publishedAt
//     );

//   /* ===================================================
//      OWNER IMAGE
//   =================================================== */

//   const ownerImageClass =
//     getOwnerImageClass(ownerStatus);

//   /* ===================================================
//      WISHLIST
//      USER MODE ONLY
//   =================================================== */

//   const handleWishlist = async () => {
//     if (loading) {
//       return;
//     }

//     const token =
//       typeof window !== "undefined"
//         ? localStorage.getItem("token")
//         : null;

//     if (!token) {
//       toast.error(
//         "Please login to use wishlist."
//       );
//       return;
//     }

//     if (!documentId) {
//       toast.error(
//         "Property ID not found."
//       );
//       return;
//     }

//     try {
//       setLoading(true);

//       const alreadyLiked =
//         await isPropertyInWishlist(
//           documentId
//         );

//       if (alreadyLiked) {
//         await removeFromWishlist(
//           documentId
//         );

//         setLiked(false);

//         toast.success(
//           "Removed from wishlist."
//         );
//       } else {
//         await addToWishlist(
//           documentId
//         );

//         setLiked(true);

//         toast.success(
//           "Added to wishlist ❤️"
//         );
//       }
//     } catch (error) {
//       console.error(
//         "Wishlist Error:",
//         error
//       );

//       toast.error(
//         error?.message ||
//           "Wishlist update failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =====================================================
//      OWNER CARD
//   ===================================================== */

//   if (ownerMode) {
//     return (
//       <article
//         className="
//           group
//           overflow-hidden
//           rounded-2xl
//           border
//           border-[#D9D1C2]
//           bg-[#F7F0E3]
//           shadow-[0_8px_28px_rgba(30,61,48,0.08)]
//           transition-all
//           duration-300
//           hover:-translate-y-1
//           hover:border-[#B99852]
//           hover:shadow-[0_18px_40px_rgba(30,61,48,0.14)]
//         "
//       >
//         {/* =================================================
//             IMAGE
//         ================================================= */}

//         <div className="relative h-56 w-full overflow-hidden bg-[#DDE6DE]">

//           <Image
//             src={imageUrl}
//             alt={title}
//             fill
//             sizes="
//               (max-width: 768px) 100vw,
//               (max-width: 1200px) 50vw,
//               25vw
//             "
//             className={`
//               object-cover
//               transition-all
//               duration-500
//               group-hover:scale-105
//               ${ownerImageClass}
//             `}
//             unoptimized
//           />

//           {/* IMAGE GRADIENT */}

//           <div
//             className="
//               absolute
//               inset-0
//               bg-gradient-to-t
//               from-black/65
//               via-black/10
//               to-transparent
//             "
//           />

//           {/* PURPOSE */}

//           <span
//             className="
//               absolute
//               left-4
//               top-4
//               rounded-full
//               bg-[#174B3B]
//               px-3
//               py-1.5
//               text-[11px]
//               font-extrabold
//               text-white
//               shadow-md
//             "
//           >
//             {purpose}
//           </span>

//           {/* STATUS */}

//           <span
//             className={`
//               absolute
//               right-4
//               top-4
//               rounded-full
//               px-3
//               py-1.5
//               text-[11px]
//               font-extrabold
//               tracking-wide
//               shadow-md
//               ${getStatusStyle(status)}
//             `}
//           >
//             {ownerStatus}
//           </span>

//           {/* PROPERTY TYPE */}

//           <div
//             className="
//               absolute
//               bottom-4
//               left-4
//               right-4
//             "
//           >
//             <p
//               className="
//                 text-[11px]
//                 font-bold
//                 uppercase
//                 tracking-[0.16em]
//                 text-[#E5D3A8]
//               "
//             >
//               {propertyType}
//             </p>

//             <h2
//               className="
//                 mt-1
//                 line-clamp-1
//                 text-xl
//                 font-extrabold
//                 text-white
//               "
//             >
//               {title}
//             </h2>
//           </div>

//         </div>

//         {/* =================================================
//             OWNER CONTENT
//         ================================================= */}

//         <div className="p-5">

//           {/* LOCATION */}

//           <p
//             className="
//               flex
//               items-center
//               gap-1.5
//               text-sm
//               text-[#718177]
//             "
//           >
//             <MapPin
//               size={15}
//               className="shrink-0 text-[#B99852]"
//             />

//             <span className="line-clamp-1">
//               {area}
//               {area && city ? ", " : ""}
//               {city}
//             </span>
//           </p>

//           {/* PRICE */}

//           <div className="mt-4 flex items-end justify-between gap-3">

//             <div>
//               <p
//                 className="
//                   text-[10px]
//                   font-bold
//                   uppercase
//                   tracking-wider
//                   text-[#8A968D]
//                 "
//               >
//                 Asking Price
//               </p>

//               <p
//                 className="
//                   mt-1
//                   text-xl
//                   font-extrabold
//                   text-[#123F32]
//                 "
//               >
//                 {price}

//                 {purpose?.toLowerCase() ===
//                   "rent" && (
//                   <span
//                     className="
//                       ml-1
//                       text-xs
//                       font-medium
//                       text-[#718177]
//                     "
//                   >
//                     / month
//                   </span>
//                 )}
//               </p>
//             </div>

//             {category && (
//               <span
//                 className="
//                   rounded-full
//                   bg-[#E5E8DE]
//                   px-3
//                   py-1.5
//                   text-[11px]
//                   font-bold
//                   text-[#416353]
//                 "
//               >
//                 {category}
//               </span>
//             )}

//           </div>

//           {/* =================================================
//               PROPERTY QUICK DETAILS
//           ================================================= */}

//           <div
//             className="
//               mt-5
//               grid
//               grid-cols-3
//               divide-x
//               divide-[#DDD5C7]
//               rounded-xl
//               border
//               border-[#DDD5C7]
//               bg-[#F3F0E8]
//               py-3
//             "
//           >

//             <div className="px-3 text-center">

//               <div className="flex items-center justify-center gap-1.5">

//                 <BedDouble
//                   size={15}
//                   className="text-[#174B3B]"
//                 />

//                 <span
//                   className="
//                     text-sm
//                     font-extrabold
//                     text-[#123F32]
//                   "
//                 >
//                   {beds ?? "--"}
//                 </span>

//               </div>

//               <p
//                 className="
//                   mt-1
//                   text-[10px]
//                   font-medium
//                   text-[#718177]
//                 "
//               >
//                 Bedrooms
//               </p>

//             </div>

//             <div className="px-3 text-center">

//               <div className="flex items-center justify-center gap-1.5">

//                 <Car
//                   size={15}
//                   className="text-[#174B3B]"
//                 />

//                 <span
//                   className="
//                     text-sm
//                     font-extrabold
//                     text-[#123F32]
//                   "
//                 >
//                   {parking ?? "--"}
//                 </span>

//               </div>

//               <p
//                 className="
//                   mt-1
//                   text-[10px]
//                   font-medium
//                   text-[#718177]
//                 "
//               >
//                 Parking
//               </p>

//             </div>

//             <div className="px-3 text-center">

//               <div className="flex items-center justify-center gap-1.5">

//                 <Maximize
//                   size={15}
//                   className="text-[#174B3B]"
//                 />

//                 <span
//                   className="
//                     text-sm
//                     font-extrabold
//                     text-[#123F32]
//                   "
//                 >
//                   {areaValue ?? "--"}
//                 </span>

//               </div>

//               <p
//                 className="
//                   mt-1
//                   text-[10px]
//                   font-medium
//                   text-[#718177]
//                 "
//               >
//                 Sq.ft
//               </p>

//             </div>

//           </div>

//           {/* =================================================
//               OWNER PERFORMANCE
//           ================================================= */}

//           <div
//             className="
//               mt-4
//               grid
//               grid-cols-3
//               gap-2
//               border-t
//               border-[#DDD5C7]
//               pt-4
//             "
//           >

//             <div>
//               <p
//                 className="
//                   flex
//                   items-center
//                   gap-1
//                   text-xs
//                   font-bold
//                   text-[#416353]
//                 "
//               >
//                 <Eye size={13} />
//                 {views}
//               </p>

//               <p
//                 className="
//                   mt-1
//                   text-[10px]
//                   text-[#8A968D]
//                 "
//               >
//                 Views
//               </p>
//             </div>

//             <div>
//               <p
//                 className="
//                   flex
//                   items-center
//                   gap-1
//                   text-xs
//                   font-bold
//                   text-[#416353]
//                 "
//               >
//                 <Heart size={13} />
//                 {saves}
//               </p>

//               <p
//                 className="
//                   mt-1
//                   text-[10px]
//                   text-[#8A968D]
//                 "
//               >
//                 Saves
//               </p>
//             </div>

//             <div>
//               <p
//                 className="
//                   flex
//                   items-center
//                   gap-1
//                   text-xs
//                   font-bold
//                   text-[#416353]
//                 "
//               >
//                 <MessageSquare size={13} />
//                 {enquiries}
//               </p>

//               <p
//                 className="
//                   mt-1
//                   text-[10px]
//                   text-[#8A968D]
//                 "
//               >
//                 Enquiries
//               </p>
//             </div>

//           </div>

//           {/* =================================================
//               LISTED DATE
//           ================================================= */}

//           {listedDate && (
//             <p
//               className="
//                 mt-4
//                 text-[10px]
//                 text-[#8A968D]
//               "
//             >
//               Listed on {listedDate}
//             </p>
//           )}

//           {/* =================================================
//               OWNER ACTIONS
//           ================================================= */}

//           <div className="mt-4 grid grid-cols-[1fr_1fr_46px] gap-2">

//             {/* ---------------------------------------------
//                 VIEW OWNER PROPERTY
//                 IMPORTANT:
//                 OWNER -> /owner/properties/[id]
//             --------------------------------------------- */}

//             <Link
//               href={
//                 documentId
//                   ? `/owner/properties/${documentId}`
//                   : "#"
//               }
//               className="
//                 flex
//                 items-center
//                 justify-center
//                 gap-1.5
//                 rounded-xl
//                 bg-[#174B3B]
//                 px-3
//                 py-3
//                 text-xs
//                 font-extrabold
//                 text-white
//                 transition
//                 hover:bg-[#123F32]
//               "
//             >
//               <Eye size={14} />
//               View
//             </Link>

//             {/* ---------------------------------------------
//                 EDIT
//             --------------------------------------------- */}

//             <Link
//               href={
//                 documentId
//                   ? `/owner/properties/${documentId}/edit`
//                   : "#"
//               }
//               className="
//                 flex
//                 items-center
//                 justify-center
//                 gap-1.5
//                 rounded-xl
//                 border
//                 border-[#B99852]
//                 bg-[#F3F0E8]
//                 px-3
//                 py-3
//                 text-xs
//                 font-extrabold
//                 text-[#174B3B]
//                 transition
//                 hover:bg-[#E5D3A8]
//               "
//             >
//               <Pencil size={14} />
//               Edit
//             </Link>

//             {/* ---------------------------------------------
//                 MORE
//             --------------------------------------------- */}

//             <div className="relative">

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowMore(
//                     (value) => !value
//                   )
//                 }
//                 className="
//                   flex
//                   h-full
//                   w-full
//                   items-center
//                   justify-center
//                   rounded-xl
//                   border
//                   border-[#D9D1C2]
//                   bg-[#F3F0E8]
//                   text-[#416353]
//                   transition
//                   hover:border-[#B99852]
//                   hover:bg-[#E5E8DE]
//                 "
//                 aria-label="More actions"
//               >
//                 <MoreVertical size={17} />
//               </button>

//               {showMore && (
//                 <div
//                   className="
//                     absolute
//                     bottom-12
//                     right-0
//                     z-30
//                     w-40
//                     overflow-hidden
//                     rounded-xl
//                     border
//                     border-[#D9D1C2]
//                     bg-[#F7F0E3]
//                     p-1.5
//                     shadow-[0_18px_40px_rgba(30,61,48,0.18)]
//                   "
//                 >

//                   <Link
//                     href={
//                       documentId
//                         ? `/owner/properties/${documentId}`
//                         : "#"
//                     }
//                     onClick={() =>
//                       setShowMore(false)
//                     }
//                     className="
//                       flex
//                       items-center
//                       gap-2
//                       rounded-lg
//                       px-3
//                       py-2.5
//                       text-xs
//                       font-semibold
//                       text-[#174B3B]
//                       hover:bg-[#E5E8DE]
//                     "
//                   >
//                     <ExternalLink size={13} />
//                     View Property
//                   </Link>

//                   <Link
//                     href={
//                       documentId
//                         ? `/owner/properties/${documentId}/edit`
//                         : "#"
//                     }
//                     onClick={() =>
//                       setShowMore(false)
//                     }
//                     className="
//                       flex
//                       items-center
//                       gap-2
//                       rounded-lg
//                       px-3
//                       py-2.5
//                       text-xs
//                       font-semibold
//                       text-[#174B3B]
//                       hover:bg-[#E5E8DE]
//                     "
//                   >
//                     <Pencil size={13} />
//                     Edit Property
//                   </Link>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowMore(false);

//                       toast(
//                         "Delete action will be connected next."
//                       );
//                     }}
//                     className="
//                       flex
//                       w-full
//                       items-center
//                       gap-2
//                       rounded-lg
//                       px-3
//                       py-2.5
//                       text-left
//                       text-xs
//                       font-semibold
//                       text-red-500
//                       hover:bg-red-50
//                     "
//                   >
//                     <Trash2 size={13} />
//                     Delete
//                   </button>

//                 </div>
//               )}

//             </div>

//           </div>

//           {/* =================================================
//               DRAFT ACTION
//           ================================================= */}

//           {ownerStatus === "DRAFT" && (
//             <Link
//               href={
//                 documentId
//                   ? `/owner/properties/${documentId}/edit`
//                   : "#"
//               }
//               className="
//                 mt-2
//                 flex
//                 w-full
//                 items-center
//                 justify-center
//                 rounded-xl
//                 bg-[#EFE3F5]
//                 px-3
//                 py-2.5
//                 text-xs
//                 font-extrabold
//                 text-[#7C3AED]
//                 transition
//                 hover:bg-[#E4D4ED]
//               "
//             >
//               Continue Editing
//             </Link>
//           )}

//         </div>
//       </article>
//     );
//   }

//   /* =====================================================
//      USER PROPERTY CARD
//      FLOW UNCHANGED
//   ===================================================== */

//   let statusClass =
//     "bg-yellow-100 text-yellow-700";

//   if (status === "Available") {
//     statusClass =
//       "bg-green-100 text-green-700";
//   }

//   if (status === "Sold") {
//     statusClass =
//       "bg-red-100 text-red-700";
//   }

//   return (
//     <article
//       className="
//         overflow-hidden
//         rounded-lg
//         border
//         border-[#D9D1C2]
//         bg-[#F7F0E3]
//         shadow-[0_8px_24px_rgba(30,61,48,0.08)]
//         transition
//         duration-300
//         hover:-translate-y-1
//         hover:border-[#B99852]
//         hover:shadow-[0_18px_34px_rgba(30,61,48,0.15)]
//       "
//     >

//       {/* IMAGE */}

//       <div
//         className="
//           relative
//           h-60
//           w-full
//           overflow-hidden
//           bg-[#DDE6DE]
//         "
//       >

//         <Image
//           src={imageUrl}
//           alt={title}
//           fill
//           sizes="
//             (max-width: 768px) 100vw,
//             400px
//           "
//           className="
//             object-cover
//             transition
//             duration-500
//             hover:scale-105
//           "
//           unoptimized
//         />

//         <span
//           className="
//             absolute
//             left-4
//             top-4
//             rounded-full
//             bg-[#174B3B]
//             px-3
//             py-1
//             text-xs
//             font-bold
//             text-[#F7F0E3]
//             shadow
//           "
//         >
//           {propertyType}
//         </span>

//         <span
//           className="
//             absolute
//             right-4
//             top-4
//             rounded-full
//             bg-[#F7F0E3]
//             px-3
//             py-1
//             text-xs
//             font-bold
//             text-[#174B3B]
//             shadow
//           "
//         >
//           {purpose}
//         </span>

//       </div>

//       {/* CONTENT */}

//       <div className="p-5">

//         <h2
//           className="
//             line-clamp-1
//             text-xl
//             font-extrabold
//             text-[#123F32]
//           "
//         >
//           {title}
//         </h2>

//         <p
//           className="
//             mt-3
//             flex
//             items-center
//             gap-2
//             text-sm
//             text-[#718177]
//           "
//         >
//           <MapPin
//             size={16}
//             className="text-[#B99852]"
//           />

//           <span>
//             {area}
//             {area && city ? ", " : ""}
//             {city}
//           </span>
//         </p>

//         <div className="mt-4 flex flex-wrap gap-2">

//           {category && (
//             <span
//               className="
//                 rounded-full
//                 bg-[#E5E8DE]
//                 px-3
//                 py-1
//                 text-xs
//                 font-semibold
//                 text-[#416353]
//               "
//             >
//               {category}
//             </span>
//           )}

//           <span
//             className={`
//               rounded-full
//               px-3
//               py-1
//               text-xs
//               font-semibold
//               ${statusClass}
//             `}
//           >
//             {status}
//           </span>

//         </div>

//         <div
//           className="
//             mt-6
//             grid
//             grid-cols-[1fr_1fr_52px]
//             gap-3
//           "
//         >

//           {/* USER VIEW — SAME FLOW */}

//           <Link
//             href={`/user/property/${documentId}`}
//             className="
//               rounded-lg
//               bg-[#174B3B]
//               px-3
//               py-3
//               text-center
//               text-sm
//               font-bold
//               text-[#F7F0E3]
//               transition
//               hover:bg-[#123F32]
//             "
//           >
//             View Details
//           </Link>

//           {/* CONTACT OWNER */}

//           <Link
//             href={`/user/contact-owner/${documentId}`}
//             className="
//               rounded-lg
//               border
//               border-[#B99852]
//               bg-transparent
//               px-3
//               py-3
//               text-center
//               text-sm
//               font-bold
//               text-[#174B3B]
//               transition
//               hover:bg-[#D7AE62]
//               hover:text-[#123F32]
//             "
//           >
//             Contact Owner
//           </Link>

//           {/* WISHLIST */}

//           <button
//             type="button"
//             onClick={handleWishlist}
//             disabled={loading}
//             className={`
//               flex
//               items-center
//               justify-center
//               rounded-lg
//               border
//               transition
//               ${
//                 liked
//                   ? "border-red-400 bg-red-50"
//                   : "border-[#C9D0C8] bg-transparent hover:border-red-400 hover:bg-red-50"
//               }
//               ${
//                 loading
//                   ? "cursor-not-allowed opacity-50"
//                   : ""
//               }
//             `}
//             aria-label={
//               liked
//                 ? "Remove from wishlist"
//                 : "Add to wishlist"
//             }
//           >
//             <Heart
//               size={22}
//               className={
//                 liked
//                   ? "fill-red-500 text-red-500"
//                   : "text-gray-500"
//               }
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
import { useState, useEffect } from "react";

import {
  Heart,
  MapPin,
  BedDouble,
  Car,
  Maximize,
  Eye,
  Bookmark,
  MessageSquare,
  Pencil,
  MoreVertical,
  Trash2,
  ExternalLink,
  Bath,
  Loader2,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  addToWishlist,
  removeFromWishlist,
  isPropertyInWishlist,
} from "@/services/wishlistService";

import RoleSelectionModal from "@/app/home/RoleSelectionModal";

import {
  getPropertyViews,
  getPropertySaves,
  getPropertyEnquiries,
} from "@/services/activityService";

import { updatePropertyStatus } from "@/services/ownerDashboard";

/* =====================================================
   STRAPI URL
===================================================== */

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

/* =====================================================
   HELPERS
===================================================== */

function getImageUrl(property) {
  let image = property?.CoverImage;

  if (!image) {
    const images = property?.PropertyImages || property?.PropertyImage;
    if (Array.isArray(images) && images.length > 0) {
      image = images[0];
    } else if (images?.data) { // Handle Strapi v4 nested data in card if not normalized
      const imagesArr = Array.isArray(images.data) ? images.data : [images.data];
      const parsedImages = imagesArr.map(img => img?.attributes || img);
      if (parsedImages.length > 0) {
        image = parsedImages[0];
      }
    }
  }

  if (!image) return "https://placehold.co/600x400/F7F0E3/123F32?text=No+Image";

  let url =
    image?.formats?.medium?.url ||
    image?.formats?.small?.url ||
    image?.formats?.thumbnail?.url ||
    image?.url;

  if (!url) return "https://placehold.co/600x400/F7F0E3/123F32?text=No+Image";

  if (url.startsWith("http")) {
    return url;
  }

  return `${STRAPI_URL}${url}`;
}

/* =====================================================
   SAFE VALUE
===================================================== */

function safeValue(value, fallback = "") {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  if (typeof value === "object") {
    if (value?.name) return value.name;
    if (value?.label) return value.label;
    if (value?.value) return value.value;
    return fallback;
  }

  return String(value);
}

/* =====================================================
   STATUS
===================================================== */

function getOwnerStatus(status) {
  const value = safeValue(status, "Available").toLowerCase();

  switch (value) {
    case "available":
    case "active":
      return "ACTIVE";

    case "pending":
      return "PENDING";

    case "draft":
      return "DRAFT";

    case "sold":
      return "SOLD";

    case "rented":
      return "RENTED";

    case "inactive":
      return "INACTIVE";

    case "reserved":
      return "RESERVED";

    default:
      return value.toUpperCase();
  }
}

/* =====================================================
   STATUS COLOR
===================================================== */

function getStatusClass(status) {
  switch (status) {
    case "ACTIVE":
      return "bg-[#0E7658] text-white";

    case "PENDING":
      return "bg-[#E68A17] text-white";

    case "DRAFT":
      return "bg-[#7C3AED] text-white";

    case "SOLD":
      return "bg-[#C92A2A] text-white";

    case "RENTED":
      return "bg-[#8B3FC7] text-white";

    case "INACTIVE":
      return "bg-[#667085] text-white";

    case "RESERVED":
      return "bg-[#A66A12] text-white";

    default:
      return "bg-[#667085] text-white";
  }
}

/* =====================================================
   STATUS IMAGE
===================================================== */

function getImageStatusClass(status) {
  switch (status) {
    case "DRAFT":
      return "scale-[1.03] blur-[2px] opacity-70";

    case "SOLD":
      return "scale-[1.03] brightness-[0.48]";

    case "RENTED":
      return "scale-[1.03] brightness-[0.5]";

    case "RESERVED":
      return "scale-[1.03] brightness-[0.5]";

    case "INACTIVE":
      return "grayscale-[30%] opacity-70";

    default:
      return "";
  }
}

/* =====================================================
   PRICE
===================================================== */

function formatPrice(price, units) {
  if (
    price === null ||
    price === undefined ||
    price === ""
  ) {
    return "--";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return safeValue(price, "--");
  }

  const formatted = new Intl.NumberFormat("en-IN").format(
    numericPrice
  );

  const unit = safeValue(units, "INR").toLowerCase();

  if (unit !== "inr") {
    return `₹${formatted} ${safeValue(units)}`;
  }

  return `₹${formatted}`;
}

/* =====================================================
   DATE
===================================================== */

function formatListedDate(date) {
  if (!date) return "";

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
   COMPONENT
===================================================== */

export default function PropertyCard({
  property,
  ownerMode = false,
  onUpdate,
}) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Mark as Sold/Rented modal state
  const [confirmAction, setConfirmAction] = useState(null); // { label, newStatus }
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [localStatus, setLocalStatus] = useState(null); // optimistic local override after update
  
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingAction, setPendingAction] = useState("");

  const handleProtectedAction = (e, actionType, redirectUrl) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      e.preventDefault();
      setPendingAction(actionType);
      setShowLoginPrompt(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("pendingActionRedirect", redirectUrl);
      }
    }
  };
  const [localSavesCount, setLocalSavesCount] = useState(null);

  // Dynamic activity stats for owner mode
  const [activityStats, setActivityStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const docId = property?.documentId || property?.id;

  useEffect(() => {
    if (!ownerMode || !docId) return;
    let cancelled = false;

    async function fetchStats(isInitial = false) {
      if (isInitial) setStatsLoading(true);
      try {
        const [views, saves, enquiries] = await Promise.all([
          getPropertyViews(docId),
          getPropertySaves(docId),
          getPropertyEnquiries(docId),
        ]);
        if (!cancelled) {
          setActivityStats({
            views: views?.length || 0,
            saves: saves?.length || 0,
            enquiries: enquiries?.length || property?.enquiries?.length || 0,
          });
        }
      } catch {
        if (!cancelled && isInitial) {
          setActivityStats({ views: null, saves: null, enquiries: null });
        }
      } finally {
        if (!cancelled && isInitial) setStatsLoading(false);
      }
    }

    // Fetch immediately on mount
    fetchStats(true);

    // Then poll every 20 seconds so seller sees buyer saves/enquiries live
    const interval = setInterval(() => {
      fetchStats(false);
    }, 20000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [ownerMode, docId]);

  if (!property) return null;

  /* ===================================================
     BASIC DATA
  =================================================== */

  const documentId =
    property?.documentId || property?.id;

  const title = safeValue(
    property?.Title,
    "Untitled Property"
  );

  const city = safeValue(property?.City);
  const area = safeValue(property?.Area);

  const purpose = safeValue(
    property?.Purpose,
    "Sale"
  );

  const propertyType = safeValue(
    property?.Property_Type,
    "Property"
  );

  const category = safeValue(
    property?.Category
  );

  const status = safeValue(
    localStatus ?? property?.PropertyStatus,
    "Available"
  );

  const ownerStatus = getOwnerStatus(status);

  const imageUrl = getImageUrl(property);

  /* ===================================================
     DETAILS
  =================================================== */

  const commonDetails =
    property?.PropertyCommonDetails || {};

  const residentialDetails =
    property?.ResidentialDetails || {};

  const commercialDetails =
    property?.CommercialDetails || {};

  const bedrooms =
    residentialDetails?.Bedrooms ??
    commonDetails?.Bedrooms ??
    property?.Bedrooms ??
    property?.BHK ??
    null;

  const bathrooms =
    residentialDetails?.Bathrooms ??
    commercialDetails?.Bathrooms ??
    commonDetails?.Bathrooms ??
    property?.Bathrooms ??
    null;

  const parking =
    residentialDetails?.Parking ??
    commercialDetails?.Parking ??
    commonDetails?.Parking ??
    property?.Parking ??
    null;

  const builtUpArea =
    commonDetails?.BuiltUpArea ??
    commonDetails?.Built_upArea ??
    commonDetails?.Area ??
    property?.BuiltUpArea ??
    property?.AreaSize ??
    null;

  /* ===================================================
     PRICE
  =================================================== */

  const price = formatPrice(
    property?.Price ?? commonDetails?.Price,
    property?.PriceUnits ??
      commonDetails?.PriceUnits
  );

  /* ===================================================
     STATS
  =================================================== */

  const views = ownerMode && activityStats
    ? activityStats.views
    : (property?.Views ?? property?.views ?? 0);

  const baseSaves = ownerMode && activityStats
    ? activityStats.saves
    : (property?.Saves ?? property?.saves ?? 0);

  useEffect(() => {
    if (baseSaves !== null && baseSaves !== undefined) {
      setLocalSavesCount(baseSaves);
    }
  }, [baseSaves]);

  const saves = localSavesCount ?? baseSaves;

  const enquiries = ownerMode && activityStats
    ? activityStats.enquiries
    : (property?.enquiries?.length ?? property?.Enquiries ?? 0);

  /* ===================================================
     DATE
  =================================================== */

  const listedDate = formatListedDate(
    property?.createdAt ||
      property?.publishedAt
  );

  /* ===================================================
     WISHLIST
  =================================================== */

  const handleWishlist = async () => {
    if (loading) return;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
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

      const alreadyLiked =
        await isPropertyInWishlist(
          documentId
        );

      if (alreadyLiked) {
        await removeFromWishlist(
          documentId
        );

        setLiked(false);
        setLocalSavesCount(prev => Math.max(0, (prev ?? baseSaves) - 1));

        toast.success(
          "Removed from wishlist."
        );
      } else {
        await addToWishlist(
          documentId
        );

        setLiked(true);
        setLocalSavesCount(prev => (prev ?? baseSaves) + 1);

        toast.success(
          "Added to wishlist ❤️"
        );
      }
    } catch (error) {
      console.error(
        "Wishlist Error:",
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

  /* =====================================================
     OWNER CARD
  ===================================================== */

  if (ownerMode) {
    return (
      <>
      <article
        className="
          group
          overflow-hidden
          rounded-2xl
          border
          border-[#3A3329]
          bg-[#171411]
          shadow-[0_12px_35px_rgba(0,0,0,0.16)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-[#B99852]
          hover:shadow-[0_20px_45px_rgba(0,0,0,0.25)]
        "
      >
        {/* =================================================
            IMAGE
        ================================================= */}

        <div
          className="
            relative
            h-[215px]
            w-full
            overflow-hidden
            bg-[#24201B]
          "
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 50vw,
              25vw
            "
            className={`
              object-cover
              transition-all
              duration-500
              group-hover:scale-105
              ${getImageStatusClass(
                ownerStatus
              )}
            `}
            unoptimized
          />

          {/* DARK GRADIENT */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/75
              via-black/10
              to-black/5
            "
          />

          {/* STATUS */}

          <span
            className={`
              absolute
              left-3
              top-3
              rounded-md
              px-3
              py-1.5
              text-[10px]
              font-extrabold
              tracking-wide
              shadow-lg
              ${getStatusClass(
                ownerStatus
              )}
            `}
          >
            {ownerStatus}
          </span>

          {/* BOOKMARK */}

          <button
            type="button"
            className="
              absolute
              right-3
              top-3
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-black/45
              text-white
              backdrop-blur-sm
              transition
              hover:bg-black/70
            "
            aria-label="Bookmark property"
          >
            <Bookmark size={16} />
          </button>

          {/* SOLD */}

          {ownerStatus === "SOLD" && (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-white
                  bg-black/25
                  text-2xl
                  font-bold
                  text-white
                  backdrop-blur-sm
                "
              >
                ✓
              </div>
            </div>
          )}

          {/* RENTED */}

          {ownerStatus === "RENTED" && (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <div
                className="
                  rounded-xl
                  bg-black/50
                  px-6
                  py-3
                  text-lg
                  font-extrabold
                  text-white
                  backdrop-blur-sm
                "
              >
                RENTED
              </div>
            </div>
          )}

          {/* RESERVED */}

          {ownerStatus === "RESERVED" && (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <div
                className="
                  rounded-xl
                  bg-black/50
                  px-6
                  py-3
                  text-lg
                  font-extrabold
                  text-white
                  backdrop-blur-sm
                "
              >
                RESERVED
              </div>
            </div>
          )}

          {/* DRAFT */}

          {ownerStatus === "DRAFT" && (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <div
                className="
                  rounded-xl
                  bg-black/45
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  backdrop-blur-sm
                "
              >
                Continue Editing
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="p-4">

          {/* TITLE */}

          <h2
            className="
              line-clamp-1
              text-[16px]
              font-extrabold
              text-white
            "
          >
            {title}
          </h2>

          {/* LOCATION */}

          <p
            className="
              mt-2
              flex
              items-center
              gap-1.5
              text-xs
              text-[#B8B0A5]
            "
          >
            <MapPin
              size={13}
              className="shrink-0 text-[#D0A54A]"
            />

            <span className="line-clamp-1">
              {area}
              {area && city ? ", " : ""}
              {city}
            </span>
          </p>

          {/* PRICE */}

          <div className="mt-3">
            <span
              className="
                text-lg
                font-extrabold
                text-[#4CCB63]
              "
            >
              {price}
            </span>

            {purpose.toLowerCase() ===
              "rent" && (
              <span
                className="
                  ml-1
                  text-[11px]
                  font-medium
                  text-[#A9A19A]
                "
              >
                / month
              </span>
            )}
          </div>

          {/* FEATURES */}

          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-x-3
              gap-y-2
              text-[10px]
              text-[#C7C0B7]
            "
          >
            {bedrooms !== null && (
              <span className="flex items-center gap-1">
                <BedDouble size={13} />
                {safeValue(bedrooms)} Beds
              </span>
            )}

            {bathrooms !== null && (
              <span className="flex items-center gap-1">
                <Bath size={13} />
                {safeValue(bathrooms)} Baths
              </span>
            )}

            {parking !== null && (
              <span className="flex items-center gap-1">
                <Car size={13} />
                {safeValue(parking)} Parking
              </span>
            )}

            {builtUpArea !== null && (
              <span className="flex items-center gap-1">
                <Maximize size={12} />
                {safeValue(builtUpArea)} sq.ft
              </span>
            )}
          </div>

          {/* CATEGORY */}

          {category && (
            <div className="mt-3">
              <span
                className="
                  rounded
                  bg-[#27231E]
                  px-2
                  py-1
                  text-[10px]
                  font-semibold
                  text-[#C7C0B7]
                "
              >
                {category}
              </span>
            </div>
          )}

          {/* STATS */}

          <div
            className="
              mt-4
              grid
              grid-cols-3
              border-t
              border-[#39332B]
              pt-3
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-1
                  text-xs
                  font-semibold
                  text-[#C1B9AF]
                "
              >
                <Eye size={13} />
                {statsLoading ? (
                  <Loader2 size={13} className="animate-spin text-[#B99852]" />
                ) : (
                  safeValue(views, "0")
                )}
              </div>

              <p
                className="
                  mt-1
                  text-[9px]
                  text-[#817A72]
                "
              >
                Views
              </p>
            </div>

            <div>
              <div
                className="
                  flex
                  items-center
                  gap-1
                  text-xs
                  font-semibold
                  text-[#C1B9AF]
                "
              >
                <Heart size={13} />
                {statsLoading ? (
                  <Loader2 size={13} className="animate-spin text-[#B99852]" />
                ) : (
                  safeValue(saves, "0")
                )}
              </div>

              <p
                className="
                  mt-1
                  text-[9px]
                  text-[#817A72]
                "
              >
                Saves
              </p>
            </div>

            <div>
              <div
                className="
                  flex
                  items-center
                  gap-1
                  text-xs
                  font-semibold
                  text-[#C1B9AF]
                "
              >
                <MessageSquare size={13} />
                {statsLoading ? (
                  <Loader2 size={13} className="animate-spin text-[#B99852]" />
                ) : (
                  safeValue(enquiries, "0")
                )}
              </div>

              <p
                className="
                  mt-1
                  text-[9px]
                  text-[#817A72]
                "
              >
                Enquiries
              </p>
            </div>
          </div>

          {/* DATE */}

          {listedDate && (
            <p
              className="
                mt-3
                text-[9px]
                text-[#817A72]
              "
            >
              Listed on {listedDate}
            </p>
          )}

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="mt-4 flex gap-2">

            {/* VIEW */}

            <Link
              href={`/owner/properties/${documentId}`}
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-1.5
                rounded-lg
                border
                border-[#4A4034]
                bg-[#24201B]
                px-2
                py-2.5
                text-[11px]
                font-bold
                text-white
                transition
                hover:border-[#B99852]
                hover:bg-[#302A23]
              "
            >
              <Eye size={14} />
              View
            </Link>

            {/* EDIT */}

            <Link
              href={`/owner/properties/${documentId}/edit`}
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-1.5
                rounded-lg
                bg-[#806322]
                px-2
                py-2.5
                text-[11px]
                font-bold
                text-[#FFF4D6]
                transition
                hover:bg-[#9A7830]
              "
            >
              <Pencil size={14} />
              Edit
            </Link>

            {/* MORE */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setShowMore(
                    (value) => !value
                  )
                }
                className="
                  flex
                  h-full
                  min-w-[40px]
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[#40382F]
                  bg-[#24201B]
                  text-white
                  transition
                  hover:border-[#B99852]
                "
                aria-label="More actions"
              >
                <MoreVertical size={16} />
              </button>

              {showMore && (
                <div
                  className="
                    absolute
                    bottom-12
                    right-0
                    z-30
                    w-40
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#40382F]
                    bg-[#211D18]
                    p-1
                    shadow-2xl
                  "
                >
                  <Link
                    href={`/owner/properties/${documentId}`}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      px-3
                      py-2.5
                      text-xs
                      text-white
                      hover:bg-[#302A23]
                    "
                  >
                    <ExternalLink size={13} />
                    View Property
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMore(false);
                      toast(
                        "More actions coming soon."
                      );
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-2
                      rounded-lg
                      px-3
                      py-2.5
                      text-left
                      text-xs
                      text-white
                      hover:bg-[#302A23]
                    "
                  >
                    <MoreVertical size={13} />
                    More Options
                  </button>

                  {/* MARK AS SOLD / RENTED */}
                  {ownerStatus === "ACTIVE" && (
                    <>
                      {purpose.toLowerCase() === "sell" || purpose.toLowerCase() === "sale" ? (
                        <button
                          type="button"
                          onClick={() => {
                            setShowMore(false);
                            setConfirmAction({ label: "Sold", newStatus: "Sold" });
                          }}
                          className="
                            flex
                            w-full
                            items-center
                            gap-2
                            rounded-lg
                            px-3
                            py-2.5
                            text-left
                            text-xs
                            text-[#E76F51]
                            hover:bg-[#E76F51]/10
                          "
                        >
                          <CheckCircle size={13} />
                          Mark as Sold
                        </button>
                      ) : purpose.toLowerCase() === "rent" ? (
                        <button
                          type="button"
                          onClick={() => {
                            setShowMore(false);
                            setConfirmAction({ label: "Rented", newStatus: "Rented" });
                          }}
                          className="
                            flex
                            w-full
                            items-center
                            gap-2
                            rounded-lg
                            px-3
                            py-2.5
                            text-left
                            text-xs
                            text-[#8B3FC7]
                            hover:bg-[#8B3FC7]/10
                          "
                        >
                          <CheckCircle size={13} />
                          Mark as Rented
                        </button>
                      ) : null}
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowMore(false);

                      toast.error(
                        "Delete action will be connected next."
                      );
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-2
                      rounded-lg
                      px-3
                      py-2.5
                      text-left
                      text-xs
                      text-red-400
                      hover:bg-red-950/30
                    "
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* DRAFT */}

          {ownerStatus === "DRAFT" && (
            <Link
              href={`/owner/properties/${documentId}/edit`}
              className="
                mt-2
                flex
                w-full
                items-center
                justify-center
                rounded-lg
                bg-[#392449]
                px-3
                py-2
                text-[11px]
                font-bold
                text-[#D99AE8]
                transition
                hover:bg-[#49305C]
              "
            >
              Continue Editing
            </Link>
          )}
        </div>
      </article>

      {/* =================================================
          MARK AS SOLD / RENTED CONFIRMATION MODAL
      ================================================= */}
      {confirmAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => !statusUpdating && setConfirmAction(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[#40382F] bg-[#1C1812] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2A241B]">
                <AlertTriangle size={22} className="text-[#D7AE62]" />
              </div>
              <button
                type="button"
                disabled={statusUpdating}
                onClick={() => setConfirmAction(null)}
                className="rounded-lg p-1 text-[#6B6059] hover:bg-[#2A241B] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <h2 className="mt-4 text-base font-extrabold text-white">
              Mark Property as {confirmAction.label}?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#A9A19A]">
              Are you sure this property has been {confirmAction.label.toLowerCase()}?{" "}
              This will remove it from active{" "}
              {confirmAction.label === "Sold" ? "property availability" : "rental availability"}.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={statusUpdating}
                onClick={() => setConfirmAction(null)}
                className="flex-1 rounded-xl border border-[#40382F] bg-[#24201B] py-2.5 text-sm font-bold text-white transition hover:border-[#B99852] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={statusUpdating}
                onClick={async () => {
                  if (statusUpdating) return;
                  setStatusUpdating(true);
                  try {
                    await updatePropertyStatus(documentId, confirmAction.newStatus);
                    setLocalStatus(confirmAction.newStatus);
                    toast.success(
                      `Property marked as ${confirmAction.label.toLowerCase()} successfully.`
                    );
                    setConfirmAction(null);
                    if (onUpdate) onUpdate();
                  } catch (err) {
                    toast.error(
                      err?.message || `Failed to mark as ${confirmAction.label.toLowerCase()}.`
                    );
                  } finally {
                    setStatusUpdating(false);
                  }
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D7AE62] py-2.5 text-sm font-extrabold text-[#123F32] transition hover:bg-[#C99D4C] disabled:opacity-60"
              >
                {statusUpdating ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Marking...
                  </>
                ) : (
                  `Mark as ${confirmAction.label}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
    );
  }

  /* =====================================================
     USER CARD
     EXISTING USER FLOW SAME
===================================================== */

  let statusClass =
    "bg-yellow-100 text-yellow-700";

  if (status === "Available") {
    statusClass =
      "bg-green-100 text-green-700";
  }

  if (status === "Sold") {
    statusClass =
      "bg-red-100 text-red-700";
  }

  return (
    <>
      <article
        className="
          overflow-hidden
          rounded-2xl
          border
          border-[#D9D1C2]
          bg-[#F7F0E3]
          shadow-[0_8px_24px_rgba(30,61,48,0.08)]
          transition
          duration-300
          hover:-translate-y-1
          hover:border-[#B99852]
          hover:shadow-[0_18px_34px_rgba(30,61,48,0.15)]
        "
      >
        {/* IMAGE */}

        <div
          className="
            relative
            h-60
            w-full
            overflow-hidden
            bg-[#DDE6DE]
          "
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="
              object-cover
              transition
              duration-500
              hover:scale-105
            "
            unoptimized
          />

          <span
            className="
              absolute
              left-4
              top-4
              rounded-full
              bg-[#174B3B]
              px-3
              py-1
              text-xs
              font-bold
              text-[#F7F0E3]
              shadow
            "
          >
            {propertyType}
          </span>

          <span
            className="
              absolute
              right-4
              top-4
              rounded-full
              bg-[#F7F0E3]
              px-3
              py-1
              text-xs
              font-bold
              text-[#174B3B]
              shadow
            "
          >
            {purpose}
          </span>
        </div>

        {/* CONTENT */}

        <div className="p-5">

          <h2
            className="
              line-clamp-1
              text-xl
              font-extrabold
              text-[#123F32]
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-3
              flex
              items-center
              gap-2
              text-sm
              text-[#718177]
            "
          >
            <MapPin
              size={16}
              className="text-[#B99852]"
            />

            <span>
              {area}
              {area && city ? ", " : ""}
              {city}
            </span>
          </p>

          <div className="mt-4 flex flex-wrap gap-2">

            {category && (
              <span
                className="
                  rounded-full
                  bg-[#E5E8DE]
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-[#416353]
                "
              >
                {category}
              </span>
            )}

            <span
              className={`
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${statusClass}
              `}
            >
              {status}
            </span>
          </div>

          <div
            className="
              mt-6
              grid
              grid-cols-[1fr_1fr_52px]
              gap-3
            "
          >

            <Link
              href={`/property/${documentId}`}
              className="
                rounded-lg
                bg-[#174B3B]
                px-3
                py-3
                text-center
                text-sm
                font-bold
                text-[#F7F0E3]
                transition
                hover:bg-[#123F32]
              "
            >
              View Details
            </Link>

            <Link
              href={`/user/contact-owner/${documentId}`}
              onClick={(e) => handleProtectedAction(e, "contact", `/user/contact-owner/${documentId}`)}
              className="
                rounded-lg
                border
                border-[#B99852]
                bg-transparent
                px-3
                py-3
                text-center
                text-sm
                font-bold
                text-[#174B3B]
                transition
                hover:bg-[#D7AE62]
                hover:text-[#123F32]
              "
            >
              Contact Owner
            </Link>

            <button
              type="button"
              onClick={handleWishlist}
              disabled={loading}
              className={`
                flex
                items-center
                justify-center
                rounded-lg
                border
                transition
                ${
                  liked
                    ? "border-red-400 bg-red-50"
                    : "border-[#C9D0C8] bg-transparent hover:border-red-400 hover:bg-red-50"
                }
                ${
                  loading
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }
              `}
              aria-label={
                liked
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              <Heart
                size={22}
                className={
                  liked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500"
                }
              />
            </button>
          </div>
        </div>
      </article>

      {showLoginPrompt && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#fffdf8] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.18)]">
            <h3 className="mb-2 text-xl font-bold text-[#14231C]">Login Required</h3>
            <p className="mb-6 text-sm text-[#61737A]">
              Please login first to {pendingAction === "view" ? "view this property" : "contact the owner"}.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  setShowRoleModal(true);
                }}
                className="rounded-lg bg-[#174B3B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#123F32]"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {showRoleModal && (
        <RoleSelectionModal onClose={() => setShowRoleModal(false)} />
      )}
    </>
  );
}