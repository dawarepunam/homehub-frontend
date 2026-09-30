// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { ArrowLeft, CheckCircle2, MapPin } from "lucide-react";

// import PropertyCard from "./PropertyCard";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// const getMediaUrl = (media) => {
//   if (!media) return null;

//   const url =
//     media?.url || media?.formats?.large?.url || media?.formats?.medium?.url;

//   if (!url) return null;

//   return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
// };

// const getGallery = (property) => {
//   const gallery =
//     property?.Gallery ||
//     property?.GalleryImages ||
//     property?.PropertyGallery ||
//     property?.PropertyImage ||
//     property?.Images ||
//     [];

//   return Array.isArray(gallery) ? gallery.map(getMediaUrl).filter(Boolean) : [];
// };

// const renderValue = (value) => {
//   if (value === null || value === undefined || value === "") return "-";
//   if (Array.isArray(value)) return value.join(", ");
//   if (typeof value === "object") return null;

//   return value.toString();
// };

// const renderRichText = (description) => {
//   if (!description) return "No description available.";
//   if (typeof description === "string") return description;

//   if (Array.isArray(description)) {
//     return description
//       .map((block) =>
//         block?.children?.map((child) => child?.text || "").join(" "),
//       )
//       .filter(Boolean)
//       .join("\n\n");
//   }

//   return "No description available.";
// };

// const DetailGrid = ({ title, items }) => {
//   const visibleItems = items.filter((item) => renderValue(item.value));

//   if (visibleItems.length === 0) return null;

//   return (
//     <section className="rounded-lg border bg-white p-6 shadow-sm">
//       <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

//       <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {visibleItems.map((item) => (
//           <div key={item.label} className="rounded-lg bg-gray-50 p-4">
//             <p className="text-sm font-medium text-gray-500">{item.label}</p>
//             <p className="mt-2 font-semibold text-gray-900">
//               {renderValue(item.value)}
//             </p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// const ObjectDetails = ({ title, data }) => {
//   if (!data || typeof data !== "object") return null;

//   const items = Object.entries(data)
//     .filter(
//       ([key]) => !["id", "documentId", "createdAt", "updatedAt"].includes(key),
//     )
//     .map(([key, value]) => ({
//       label: key.replace(/_/g, " "),
//       value,
//     }));

//   return <DetailGrid title={title} items={items} />;
// };

// export default function PropertyDetails({ property, relatedProperties = [] }) {
//   if (!property) {
//     return (
//       <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
//         <h2 className="text-3xl font-bold text-gray-900">Property Not Found</h2>

//         <Link
//           href="/user"
//           className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
//         >
//           <ArrowLeft size={18} />
//           Back
//         </Link>
//       </section>
//     );
//   }

//   const coverImage = getMediaUrl(property?.CoverImage) || "/no-property.png";
//   const gallery = getGallery(property);
//   const commonDetails = property?.PropertyCommonDetails || {};
//   const residentialDetails =
//     property?.ResidentialDetails ||
//     property?.ResidentialPropertyDetails ||
//     property?.PropertyResidentialDetails;
//   const description = renderRichText(property?.Description);
//   const features =
//     property?.PropertyFeatures ||
//     property?.Features ||
//     property?.Amenities ||
//     [];

//   const strapiOverview = Array.isArray(property?.PropertyOverview)
//     ? property.PropertyOverview.map((item) => ({
//         label: item.Title,
//         value: item.Value,
//       }))
//     : [];

//   const overviewItems = [
//     ...strapiOverview,
//     { label: "Price", value: commonDetails.Price },
//     {
//       label: "Carpet Area",
//       value:
//         `${commonDetails.CarpetArea || "-"} ${commonDetails.Area_Unit || ""}`.trim(),
//     },
//     {
//       label: "Built-up Area",
//       value:
//         `${commonDetails.Built_upArea || "-"} ${commonDetails.Area_Unit || ""}`.trim(),
//     },
//     { label: "Parking", value: commonDetails.Parking },
//     { label: "Facing", value: commonDetails.Facing },
//     { label: "Property Age", value: commonDetails.PropertyAge },
//     { label: "Available From", value: commonDetails.AvailableForm },
//     { label: "Status", value: property.PropertyStatus },
//     { label: "Category", value: property.Category },
//   ];

//   const featureList = Array.isArray(features)
//     ? features
//     : features
//       ? features.toString().split(",")
//       : [];

//   return (
//     <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//       <button
//         type="button"
//         onClick={() => window.history.back()}
//         className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-700"
//       >
//         <ArrowLeft size={16} />
//         Back
//       </button>

//       <div className="mt-6 overflow-hidden rounded-lg border bg-white shadow-sm">
//         <img
//           src={coverImage}
//           alt={property.Title}
//           className="h-[320px] w-full object-cover sm:h-[460px]"
//         />
//       </div>

//       {gallery.length > 0 && (
//         <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           {gallery.map((image) => (
//             <img
//               key={image}
//               src={image}
//               alt={property.Title}
//               className="h-36 w-full rounded-lg object-cover"
//             />
//           ))}
//         </div>
//       )}

//       <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
//         <div className="space-y-8">
//           <section className="rounded-lg border bg-white p-6 shadow-sm">
//             <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
//                   {property.Title}
//                 </h1>

//                 <p className="mt-3 flex items-center gap-2 text-gray-600">
//                   <MapPin size={18} className="shrink-0 text-blue-600" />
//                   {property.Area}
//                   {property.Area && property.City ? ", " : ""}
//                   {property.City}
//                 </p>
//               </div>

//               <p className="text-2xl font-bold text-blue-600">
//                 {commonDetails.Price || "Price on Request"}
//               </p>
//             </div>

//             <div className="mt-5 flex flex-wrap gap-3">
//               <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
//                 {property.Purpose}
//               </span>

//               <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
//                 {property.Property_Type}
//               </span>
//             </div>
//           </section>

//           <section className="rounded-lg border bg-white p-6 shadow-sm">
//             <h2 className="text-2xl font-bold text-gray-900">Description</h2>
//             <div className="mt-4 whitespace-pre-line leading-7 text-gray-700">
//               {description}
//             </div>
//           </section>

//           <DetailGrid title="Property Overview" items={overviewItems} />

//           {featureList.length > 0 && (
//             <section className="rounded-lg border bg-white p-6 shadow-sm">
//               <h2 className="text-2xl font-bold text-gray-900">
//                 Property Features
//               </h2>

//               <div className="mt-5 grid gap-3 sm:grid-cols-2">
//                 {featureList.map((feature) => (
//                   <div
//                     key={feature.id || feature.Name || feature}
//                     className="flex items-center gap-3 text-gray-700"
//                   >
//                     <CheckCircle2
//                       size={18}
//                       className="shrink-0 text-emerald-600"
//                     />
//                     <span>
//                       {feature.Name ||
//                         feature.Title ||
//                         feature.Text ||
//                         renderValue(feature)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}

//           <ObjectDetails
//             title="Residential Details"
//             data={residentialDetails}
//           />
//         </div>

//         <aside className="h-fit rounded-lg border bg-white p-6 shadow-sm">
//           <p className="text-sm font-semibold text-gray-500">
//             Interested in this property?
//           </p>

//           <Link
//             href={`/user/contact-owner/${property.documentId}`}
//             className="mt-4 block rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
//           >
//             Contact Owner
//           </Link>
//         </aside>
//       </div>

//       {relatedProperties.length > 0 && (
//         <section className="mt-12">
//           <h2 className="text-2xl font-bold text-gray-900">
//             Related Properties
//           </h2>

//           <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {relatedProperties.map((item) => (
//               <PropertyCard key={item.documentId || item.id} property={item} />
//             ))}
//           </div>
//         </section>
//       )}
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  MapPin,
  Phone,
  Share2,
  Image as ImageIcon,
  X,
  ChevronDown,
  ChevronUp,
  BedDouble,
  Bath,
  Maximize,
  Sofa,
  CarFront,
  SearchX,
  ArrowUpDown,
  ShieldCheck,
  Camera,
  Zap,
  Dumbbell,
  Waves,
  Trees,
  Club,
  Droplets,
  Flame,
  Car,
  Wifi,
  PhoneCall,
  Wind
} from "lucide-react";

import PropertyCard from "./PropertyCard";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

// =====================================================
// MEDIA URL
// =====================================================

const getMediaUrl = (media) => {
  if (!media) return null;

  const url =
    media?.url ||
    media?.formats?.large?.url ||
    media?.formats?.medium?.url ||
    media?.formats?.small?.url;

  if (!url) return null;

  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
};



  // =====================================================
  // GALLERY
  // =====================================================

const getGallery = (property) => {
  const gallery =
    property?.PropertyImage ||
    property?.PropertyImages ||
    property?.Gallery ||
    property?.GalleryImages ||
    property?.PropertyGallery ||
    property?.Images ||
    [];

  if (!Array.isArray(gallery)) return [];
  return gallery.map(getMediaUrl).filter(Boolean);
};

// =====================================================
// VALUE FORMATTER
// =====================================================

const renderValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return "-";
  return value.toString();
};

// =====================================================
// RICH TEXT
// =====================================================

const renderRichText = (description) => {
  if (!description) return "No description available.";
  if (typeof description === "string") return description;

  if (Array.isArray(description)) {
    return description
      .map((block) =>
        block?.children?.map((child) => child?.text || "").join("")
      )
      .filter(Boolean)
      .join("\n\n");
  }

  return "No description available.";
};

// =====================================================
// DETAIL GRID
// =====================================================

function DetailGrid({ title, items }) {
  const visibleItems = items.filter(
    (item) => item?.value !== null && item?.value !== undefined && item?.value !== "" && item?.value !== "-"
  );

  if (visibleItems.length === 0) return null;

  return (
    <section className="rounded-2xl border border-[#E5DDD0] bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-extrabold text-[#0D3326]">{title}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex flex-col border-b border-[#E5DDD0]/50 pb-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#0D3326]/50">
              {item.label}
            </span>
            <span className="mt-1 font-bold text-[#0D3326]">
              {renderValue(item.value)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// =====================================================
// PROPERTY DETAILS COMPONENT
// =====================================================

export default function PropertyDetails({ property, relatedProperties = [] }) {
  const [liked, setLiked] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Prevent scroll when lightbox is open
  useEffect(() => {
    if (showLightbox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLightbox]);

  // ===================================================
  // NOT FOUND STATE
  // ===================================================

  if (!property) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4 py-20 bg-[#F7F4EF]">
        <div className="w-full max-w-lg rounded-2xl border border-[#E5DDD0] bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F0EBE2]">
            <SearchX size={28} className="text-[#0D3326]/40" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold text-[#0D3326]">Property Not Found</h2>
          <p className="mt-2 text-sm text-[#0D3326]/60">The property may have been removed or is no longer available.</p>
          <Link
            href="/user"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-3 font-bold text-[#D7AE62] transition hover:opacity-90"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </section>
    );
  }

  // ===================================================
  // DATA EXTRACTION
  // ===================================================

  const coverImage = getMediaUrl(property?.CoverImage) || "/no-property.png";
  const gallery = getGallery(property);
  const allImages = useMemo(() => {
    return [coverImage, ...gallery.filter((image) => image !== coverImage)];
  }, [coverImage, gallery]);

  const commonDetails = property?.PropertyCommonDetails || {};
  const residentialDetails =
    property?.ResidentialDetails || property?.ResidentialPropertyDetails || property?.PropertyResidentialDetails;

  const descriptionText = renderRichText(property?.Description);
  const isLongDescription = descriptionText.length > 400;

  // ===================================================
  // FEATURES / AMENITIES
  // ===================================================

  const rawAmenities = property?.PropertyAmenities || {};
  const fallbackFeatures = Array.isArray(property?.Features) ? property.Features : 
                           typeof property?.Features === "string" ? property.Features.split(",") : [];

  const amenityIconMap = {
    Parking: { icon: CarFront, label: "Parking" },
    Lift: { icon: ArrowUpDown, label: "Elevator / Lift" },
    Security: { icon: ShieldCheck, label: "24/7 Security" },
    CCTV: { icon: Camera, label: "CCTV Surveillance" },
    PowerBackup: { icon: Zap, label: "Power Backup" },
    Gym: { icon: Dumbbell, label: "Gymnasium" },
    SwimmingPool: { icon: Waves, label: "Swimming Pool" },
    Garden: { icon: Trees, label: "Garden / Park" },
    ClubHouse: { icon: Club, label: "Club House" },
    WaterSupply: { icon: Droplets, label: "24/7 Water Supply" },
    FireSafety: { icon: Flame, label: "Fire Safety" },
    VisitorParking: { icon: Car, label: "Visitor Parking" },
    Wifi: { icon: Wifi, label: "Wi-Fi" },
    Intercom: { icon: PhoneCall, label: "Intercom" },
    AC: { icon: Wind, label: "Air Conditioning" }
  };

  const featureList = [];

  // Parse existing boolean component
  if (typeof rawAmenities === "object" && Object.keys(rawAmenities).length > 0) {
    Object.entries(rawAmenities).forEach(([key, value]) => {
      if (value === true && !['id', '__component'].includes(key)) {
        const mapped = amenityIconMap[key] || { icon: CheckCircle2, label: key.replace(/([A-Z])/g, ' $1').trim() };
        featureList.push(mapped);
      }
    });
  }

  // Parse fallback features if any
  fallbackFeatures.forEach(feature => {
    const featureStr = renderValue(feature).trim();
    if (featureStr && !featureList.some(f => f.label.toLowerCase() === featureStr.toLowerCase())) {
      featureList.push({ icon: CheckCircle2, label: featureStr });
    }
  });

  const areaUnit = commonDetails?.Area_Unit || commonDetails?.AreaUnit || "";
  const carpetArea = commonDetails?.CarpetArea ? `${commonDetails.CarpetArea} ${areaUnit}`.trim() : null;
  const builtupArea = commonDetails?.Built_upArea ? `${commonDetails.Built_upArea} ${areaUnit}`.trim() : null;

  // Overview Items
  const strapiOverview = Array.isArray(property?.PropertyOverview)
    ? property.PropertyOverview.map((item) => ({ label: item?.Title, value: item?.Value }))
    : [];

  const overviewItems = [
    ...strapiOverview,
    { label: "Price", value: commonDetails?.Price || property?.Price },
    { label: "Carpet Area", value: carpetArea },
    { label: "Built-up Area", value: builtupArea },
    { label: "Floor", value: residentialDetails?.Floor_No || commonDetails?.Floor },
    { label: "Total Floors", value: residentialDetails?.Total_Floors || commonDetails?.TotalFloors },
    { label: "Furnishing", value: residentialDetails?.Furnishing || commonDetails?.Furnishing },
    { label: "Parking", value: commonDetails?.Parking },
    { label: "Facing", value: commonDetails?.Facing },
    { label: "Property Age", value: commonDetails?.PropertyAge },
    { label: "Possession / Available", value: commonDetails?.AvailableForm || commonDetails?.AvailableFrom },
    { label: "Status", value: property?.PropertyStatus },
    { label: "Listed On", value: property?.publishedAt ? new Date(property.publishedAt).toLocaleDateString() : null },
  ];

  const displayPrice = commonDetails?.Price || property?.Price || "Price on Request";
  const beds = residentialDetails?.Bedrooms || commonDetails?.Bedrooms || property?.Bedrooms;
  const baths = residentialDetails?.Bathrooms || commonDetails?.Bathrooms || property?.Bathrooms;
  const furnish = residentialDetails?.Furnishing || commonDetails?.Furnishing;
  const park = commonDetails?.Parking;
  const propArea = carpetArea || builtupArea || property?.Area;

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: property.Title,
        text: `Check out this property on HomeHub`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="bg-[#F7F4EF] min-h-screen pb-24 lg:pb-12 relative">
      
      {/* ── Lightbox Modal ── */}
      {showLightbox && (
        <div className="fixed inset-0 z-[99999] flex flex-col bg-black">
          <div className="flex items-center justify-between p-4 sm:p-6">
            <div className="text-white font-semibold text-sm">
              {lightboxIndex + 1} / {allImages.length}
            </div>
            <button
              onClick={() => setShowLightbox(false)}
              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={allImages[lightboxIndex]}
              alt={`Gallery Image ${lightboxIndex + 1}`}
              className="max-h-full max-w-full object-contain select-none"
            />
          </div>
          <div className="flex items-center justify-center gap-6 p-6">
            <button
              onClick={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
              className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="hidden sm:flex gap-2 overflow-x-auto max-w-[50vw] px-2 snap-x hide-scrollbar">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition snap-center ${
                    lightboxIndex === idx ? "border-[#D7AE62]" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <button
              onClick={() => setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
              className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition transform rotate-180"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ── Main Content Container ── */}
      <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5DDD0] bg-white px-3 py-1.5 text-sm font-bold text-[#0D3326] transition hover:border-[#D7AE62] hover:text-[#D7AE62] shadow-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border border-[#E5DDD0] bg-white px-3 py-1.5 text-sm font-bold text-[#0D3326] transition hover:border-[#D7AE62] hover:text-[#D7AE62] shadow-sm"
            >
              <Share2 size={15} /> Share
            </button>
            <button
              type="button"
              onClick={() => setLiked(!liked)}
              className="flex items-center gap-1.5 rounded-lg border border-[#E5DDD0] bg-white px-3 py-1.5 text-sm font-bold transition shadow-sm hover:border-red-300"
              style={{ color: liked ? "#EF4444" : "#0D3326" }}
            >
              <Heart size={15} className={liked ? "fill-red-500 text-red-500" : ""} /> Save
            </button>
          </div>
        </div>

        {/* ── Premium Image Gallery ── */}
        <div className="relative mb-8 grid grid-cols-1 gap-2 lg:grid-cols-[2fr_1fr] h-[300px] sm:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden shadow-sm bg-[#EAE5DC]">
          <div
            className="relative h-full w-full cursor-pointer overflow-hidden group"
            onClick={() => { setLightboxIndex(0); setShowLightbox(true); }}
          >
            <img src={allImages[0]} alt="Primary" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            
            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <div className="flex gap-2">
                {property?.Purpose && (
                  <span className="rounded bg-[#0D3326] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#D7AE62] shadow">
                    For {property.Purpose}
                  </span>
                )}
                {property?.PropertyStatus && (
                  <span className="rounded bg-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#0D3326] shadow">
                    {property.PropertyStatus}
                  </span>
                )}
              </div>
            </div>
            {/* Hover overlay indicator */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all rounded-full bg-black/50 px-4 py-2 text-sm text-white flex items-center gap-2 backdrop-blur">
                <Maximize size={16}/> Enlarge
              </span>
            </div>
          </div>

          <div className="hidden lg:grid grid-rows-2 gap-2 h-full">
            {allImages.slice(1, 3).map((img, idx) => (
              <div
                key={idx}
                className="relative h-full w-full cursor-pointer overflow-hidden group"
                onClick={() => { setLightboxIndex(idx + 1); setShowLightbox(true); }}
              >
                <img src={img} alt={`Gallery ${idx+1}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
              </div>
            ))}
            {allImages.length === 2 && <div className="bg-[#E5DDD0] h-full w-full" />}
            {allImages.length === 1 && <div className="bg-[#E5DDD0] h-full w-full row-span-2" />}
          </div>

          <button
            onClick={() => { setLightboxIndex(0); setShowLightbox(true); }}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-bold text-[#0D3326] backdrop-blur transition hover:bg-white shadow"
          >
            <ImageIcon size={16} /> 1 / {allImages.length} Photos
          </button>
        </div>

        {/* ── Two Column Layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* Left Column: Content */}
          <div className="flex-1 w-full space-y-8">
            
            {/* Title & Price Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#D7AE62]">
                  {property?.Property_Type || ""} {property?.Category ? `• ${property.Category}` : ""}
                </p>
                <h1 className="mt-2 text-2xl font-extrabold text-[#0D3326] sm:text-3xl leading-tight">
                  {property.Title}
                </h1>
                <p className="mt-3 flex items-center gap-2 text-sm font-medium text-[#0D3326]/70">
                  <MapPin size={16} className="text-[#D7AE62]" />
                  {[property.Area, property.City, property.State].filter(Boolean).join(", ") || "Location not specified"}
                </p>
              </div>
              <div className="sm:text-right shrink-0">
                <p className="text-3xl font-extrabold text-[#0D3326]">{displayPrice}</p>
                {property?.Purpose === "Rent" && <p className="text-xs font-bold text-[#0D3326]/50 uppercase tracking-wide mt-1">Per Month</p>}
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="flex flex-wrap gap-4 border-y border-[#E5DDD0]/60 py-5">
              {beds && (
                <div className="flex items-center gap-3 pr-4 border-r border-[#E5DDD0]/60 last:border-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAE5DC] text-[#0D3326]">
                    <BedDouble size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#0D3326]/50">Bedrooms</p>
                    <p className="text-sm font-bold text-[#0D3326]">{beds}</p>
                  </div>
                </div>
              )}
              {baths && (
                <div className="flex items-center gap-3 pr-4 border-r border-[#E5DDD0]/60 last:border-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAE5DC] text-[#0D3326]">
                    <Bath size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#0D3326]/50">Bathrooms</p>
                    <p className="text-sm font-bold text-[#0D3326]">{baths}</p>
                  </div>
                </div>
              )}
              {propArea && (
                <div className="flex items-center gap-3 pr-4 border-r border-[#E5DDD0]/60 last:border-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAE5DC] text-[#0D3326]">
                    <Maximize size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#0D3326]/50">Area</p>
                    <p className="text-sm font-bold text-[#0D3326]">{propArea}</p>
                  </div>
                </div>
              )}
              {furnish && (
                <div className="flex items-center gap-3 pr-4 border-r border-[#E5DDD0]/60 last:border-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAE5DC] text-[#0D3326]">
                    <Sofa size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#0D3326]/50">Furnishing</p>
                    <p className="text-sm font-bold text-[#0D3326]">{furnish}</p>
                  </div>
                </div>
              )}
              {park && (
                <div className="flex items-center gap-3 pr-4 border-r border-[#E5DDD0]/60 last:border-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAE5DC] text-[#0D3326]">
                    <CarFront size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#0D3326]/50">Parking</p>
                    <p className="text-sm font-bold text-[#0D3326]">{park}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description Section */}
            <section className="rounded-2xl border border-[#E5DDD0] bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-extrabold text-[#0D3326]">About This Property</h2>
              <div className="mt-4 relative">
                <div
                  className={`text-sm leading-relaxed text-[#0D3326]/80 whitespace-pre-line overflow-hidden transition-all duration-300 ${
                    !isDescExpanded && isLongDescription ? "max-h-[140px]" : "max-h-none"
                  }`}
                >
                  {descriptionText}
                </div>
                {!isDescExpanded && isLongDescription && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>
              {isLongDescription && (
                <button
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="mt-4 flex items-center gap-1.5 text-sm font-bold text-[#D7AE62] hover:text-[#C99A40] transition"
                >
                  {isDescExpanded ? (
                    <>Read Less <ChevronUp size={16} /></>
                  ) : (
                    <>Read More <ChevronDown size={16} /></>
                  )}
                </button>
              )}
            </section>

            {/* Property Overview Grid */}
            <DetailGrid title="Property Overview" items={overviewItems} />

            {/* Amenities Section */}
            {featureList.length > 0 && (
              <section className="rounded-2xl border border-[#E5DDD0] bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-extrabold text-[#0D3326]">Amenities & Features</h2>
                <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {featureList.map((feature, index) => {
                    const IconComp = feature?.icon || CheckCircle2;
                    const label = feature?.label || feature?.Name || feature?.Title || feature?.Text || renderValue(feature);
                    return (
                      <div key={index} className="flex flex-col items-start gap-2 rounded-xl border border-[#E5DDD0]/50 bg-[#F7F4EF]/50 p-4 transition-all hover:border-[#D7AE62]/50 hover:shadow-md group">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0D3326] text-[#D7AE62] transition-transform group-hover:scale-110">
                          <IconComp size={18} />
                        </div>
                        <span className="text-sm font-semibold text-[#0D3326] mt-1">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Location Section */}
            <section className="rounded-2xl border border-[#E5DDD0] bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-extrabold text-[#0D3326]">Location</h2>
              <div className="mt-6 flex items-start gap-4 rounded-xl bg-[#F7F4EF] p-5 border border-[#E5DDD0]/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <MapPin size={22} className="text-[#0D3326]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0D3326]">Property Address</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#0D3326]/70">
                    {[
                      property.Address,
                      property.Locality,
                      property.Area,
                      property.City,
                      property.State,
                      property.PinCode,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Address not provided by the owner."}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Action Card (Desktop Only) */}
          <aside className="hidden lg:block w-[360px] shrink-0 sticky top-6">
            <div className="rounded-2xl border border-[#E5DDD0] bg-white p-6 shadow-lg shadow-[#0D3326]/5">
              <h3 className="text-lg font-extrabold text-[#0D3326]">Interested in this property?</h3>
              <p className="mt-2 text-sm text-[#0D3326]/60 leading-relaxed">
                Connect with the owner directly to arrange a viewing or negotiate terms.
              </p>
              
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={`/user/contact-owner/${property.documentId || property.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D3326] px-5 py-3.5 text-sm font-bold text-[#D7AE62] transition hover:bg-[#154635] shadow-sm"
                >
                  <Phone size={18} /> Contact Owner
                </Link>
                <button
                  type="button"
                  onClick={() => setLiked(!liked)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#0D3326] bg-white px-5 py-3 text-sm font-bold text-[#0D3326] transition hover:bg-[#0D3326]/5"
                >
                  <Heart size={18} className={liked ? "fill-[#0D3326]" : ""} /> 
                  {liked ? "Saved to Wishlist" : "Save Property"}
                </button>
              </div>

              <div className="mt-6 rounded-xl bg-[#F7F4EF] p-4 border border-[#E5DDD0]/50 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#0D3326]/40">Listed By</p>
                <p className="mt-1 text-sm font-extrabold text-[#0D3326]">Owner</p>
                {property.publishedAt && (
                  <p className="mt-1 text-xs text-[#0D3326]/60">
                    Posted on {new Date(property.publishedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* ── Similar Properties ── */}
        {relatedProperties.length > 0 && (
          <section className="mt-16 border-t border-[#E5DDD0] pt-12">
            <h2 className="text-2xl font-extrabold text-[#0D3326]">You May Also Like</h2>
            <p className="mt-2 text-sm text-[#0D3326]/60">Explore similar properties in this category.</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {relatedProperties.map((item) => (
                <PropertyCard key={item.documentId || item.id} property={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Mobile Sticky Bottom Action Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 border-t border-[#E5DDD0] bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:hidden">
        <button
          onClick={() => setLiked(!liked)}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#0D3326] bg-white text-sm font-bold text-[#0D3326] transition hover:bg-[#0D3326]/5"
        >
          <Heart size={18} className={liked ? "fill-[#0D3326]" : ""} /> Save
        </button>
        <Link
          href={`/user/contact-owner/${property.documentId || property.id}`}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0D3326] text-sm font-bold text-[#D7AE62] shadow-sm transition hover:opacity-90"
        >
          <Phone size={18} /> Contact
        </Link>
      </div>

    </div>
  );
}