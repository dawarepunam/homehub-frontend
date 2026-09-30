// import Link from "next/link";
// import { getProperties } from "@/services/property";

// export default async function SearchPage({ searchParams }) {
//   const properties = await getProperties();

//   const city = searchParams.city || "";
//   const area = searchParams.area || "";
//   const type = searchParams.type || "";
//   const category = searchParams.category || "";

//   const filteredProperties = properties.filter((property) => {
//     return (
//       property.City === city &&
//       property.Area === area &&
//       property.Property_Type === type &&
//       property.Category === category
//     );
//   });

//   return (
//     <main className="min-h-screen bg-gray-100 p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Search Result</h1>

//         <p className="mt-2 text-gray-600">
//           {city} / {area} / {type} / {category}
//         </p>
//       </div>

//       {/* No Property */}
//       {filteredProperties.length === 0 ? (
//         <div className="rounded-xl bg-white p-10 text-center shadow">
//           <h2 className="text-2xl font-semibold">No Property Found</h2>

//           <p className="mt-3 text-gray-500">Try another search.</p>

//           <Link
//             href="/user"
//             className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white"
//           >
//             Back
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {filteredProperties.map((property) => (
//             <div
//               key={property.id}
//               className="overflow-hidden rounded-xl bg-white shadow-lg"
//             >
//               <img
//                 src={
//                   property.CoverImage?.url
//                     ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${property.CoverImage.url}`
//                     : "/no-image.png"
//                 }
//                 alt={property.Title}
//                 className="h-56 w-full object-cover"
//               />

//               <div className="p-5">
//                 <h2 className="text-xl font-bold">{property.Title}</h2>

//                 <p className="mt-2 text-gray-500">{property.Address}</p>

//                 <div className="mt-4 flex justify-between text-sm">
//                   <span>{property.Property_Type}</span>

//                   <span>{property.Category}</span>
//                 </div>

//                 <div className="mt-4">
//                   <Link
//                     href={`/user/property/${property.documentId}`}
//                     className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-white"
//                   >
//                     View Details
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// // }
// import Link from "next/link";
// import { getProperties } from "@/services/property";

// export default async function SearchPage({ searchParams }) {
//   const properties = await getProperties();

//   const city = searchParams?.city || "";
//   const area = searchParams?.area || "";
//   const type = searchParams?.type || "";
//   const category = searchParams?.category || "";

//   const filteredProperties = properties.filter((property) => {
//     return (
//       property.City?.trim().toLowerCase() === city.trim().toLowerCase() &&
//       property.Area?.trim().toLowerCase() === area.trim().toLowerCase() &&
//       property.Property_Type?.trim().toLowerCase() ===
//         type.trim().toLowerCase() &&
//       property.Category?.trim().toLowerCase() === category.trim().toLowerCase()
//     );
//   });

//   return (
//     <main className="min-h-screen bg-gray-100 px-6 py-10">
//       {/* Heading */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Search Result</h1>

//         <p className="mt-2 text-gray-500">
//           {city} / {area} / {type} / {category}
//         </p>

//         <p className="mt-1 text-sm text-blue-600">
//           {filteredProperties.length} Properties Found
//         </p>
//       </div>

//       {/* No Result */}
//       {filteredProperties.length === 0 ? (
//         <div className="rounded-2xl bg-white p-10 text-center shadow">
//           <h2 className="text-2xl font-semibold">No Property Found</h2>

//           <p className="mt-3 text-gray-500">No matching property available.</p>

//           <Link
//             href="/user"
//             className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white"
//           >
//             Back To Home
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {filteredProperties.map((property) => (
//             <div
//               key={property.id}
//               className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
//             >
//               <img
//                 src={
//                   property.CoverImage?.url
//                     ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${property.CoverImage.url}`
//                     : "/no-image.png"
//                 }
//                 alt={property.Title}
//                 className="h-56 w-full object-cover"
//               />

//               <div className="p-5">
//                 <h2 className="text-xl font-bold">{property.Title}</h2>

//                 <p className="mt-2 text-gray-500">{property.Address}</p>

//                 <div className="mt-4 flex justify-between text-sm text-gray-600">
//                   <span>{property.Property_Type}</span>

//                   <span>{property.Category}</span>
//                 </div>

//                 <div className="mt-5">
//                   <Link
//                     href={`/user/property/${property.documentId}`}
//                     className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-white"
//                   >
//                     View Details
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }
// import Link from "next/link";
// import { getProperties } from "@/services/property";

// export default async function SearchPage({ searchParams }) {
//   // Next.js 15/16
//   const params = await searchParams;

//   const properties = await getProperties();

//   const city = params?.city || "";
//   const area = params?.area || "";
//   const type = params?.type || "";
//   const category = params?.category || "";

//   // Debug Logs
//   console.log("========== SEARCH PARAMS ==========");
//   console.log({
//     city,
//     area,
//     type,
//     category,
//   });

//   console.log("========== PROPERTIES ==========");
//   console.log(properties);

//   const filteredProperties = properties.filter((property) => {
//     return (
//       property.City?.trim().toLowerCase() === city.trim().toLowerCase() &&
//       property.Area?.trim().toLowerCase() === area.trim().toLowerCase() &&
//       property.Property_Type?.trim().toLowerCase() ===
//         type.trim().toLowerCase() &&
//       property.Category?.trim().toLowerCase() === category.trim().toLowerCase()
//     );
//   });

//   console.log("========== FILTERED PROPERTIES ==========");
//   console.log(filteredProperties);

//   return (
//     <main className="min-h-screen bg-gray-100 px-6 py-10">
//       {/* Heading */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Search Result</h1>

//         <p className="mt-2 text-gray-500">
//           {city} / {area} / {type} / {category}
//         </p>

//         <p className="mt-1 text-sm text-blue-600">
//           {filteredProperties.length} Properties Found
//         </p>
//       </div>

//       {/* No Result */}
//       {filteredProperties.length === 0 ? (
//         <div className="rounded-2xl bg-white p-10 text-center shadow">
//           <h2 className="text-2xl font-semibold">No Property Found</h2>

//           <p className="mt-3 text-gray-500">No matching property available.</p>

//           <Link
//             href="/user"
//             className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white"
//           >
//             Back To Home
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {filteredProperties.map((property) => (
//             <div
//               key={property.id}
//               className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
//             >
//               <img
//                 src={
//                   property.CoverImage?.url
//                     ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${property.CoverImage.url}`
//                     : "/no-image.png"
//                 }
//                 alt={property.Title}
//                 className="h-56 w-full object-cover"
//               />

//               <div className="p-5">
//                 <h2 className="text-xl font-bold">{property.Title}</h2>

//                 <p className="mt-2 text-gray-500">{property.Address}</p>

//                 <div className="mt-4 flex justify-between text-sm text-gray-600">
//                   <span>{property.Property_Type}</span>
//                   <span>{property.Category}</span>
//                 </div>

//                 <div className="mt-5">
//                   <Link
//                     href={`/user/property/${property.documentId}`}
//                     className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-white"
//                   >
//                     View Details
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// // }
// import Link from "next/link";

// import UserHeader from "@/components/user/UserHeader";
// import Footer from "@/components/Footer";

// import { getProperties } from "@/services/property";
// import { getUserSiteSettings } from "@/services/userSiteSettings";

// export default async function SearchPage({ searchParams }) {
//   // Next.js 15/16
//   const params = await searchParams;

//   // Load Data
//   const siteSettings = await getUserSiteSettings();
//   const properties = await getProperties();

//   const city = params?.city || "";
//   const area = params?.area || "";
//   const type = params?.type || "";
//   const category = params?.category || "";

//   // Debug Logs
//   console.log("========== SEARCH PARAMS ==========");
//   console.log({
//     city,
//     area,
//     type,
//     category,
//   });

//   console.log("========== PROPERTIES ==========");
//   console.log(properties);

//   const filteredProperties = properties.filter((property) => {
//     return (
//       property.City?.trim().toLowerCase() === city.trim().toLowerCase() &&
//       property.Area?.trim().toLowerCase() === area.trim().toLowerCase() &&
//       property.Property_Type?.trim().toLowerCase() ===
//         type.trim().toLowerCase() &&
//       property.Category?.trim().toLowerCase() === category.trim().toLowerCase()
//     );
//   });

//   console.log("========== FILTERED PROPERTIES ==========");
//   console.log(filteredProperties);

//   return (
//     <>
//       {/* Header */}
//       <UserHeader headerData={siteSettings?.UserHeader} />

//       {/* Search Result */}
//       <main className="min-h-screen bg-gray-100 px-6 py-10">
//         <div className="mx-auto max-w-7xl">
//           {/* Heading */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold">Search Result</h1>

//             <p className="mt-2 text-gray-500">
//               {city} / {area} / {type} / {category}
//             </p>

//             <p className="mt-1 text-sm text-blue-600">
//               {filteredProperties.length} Properties Found
//             </p>
//           </div>

//           {/* No Result */}
//           {filteredProperties.length === 0 ? (
//             <div className="rounded-2xl bg-white p-10 text-center shadow">
//               <h2 className="text-2xl font-semibold">No Property Found</h2>

//               <p className="mt-3 text-gray-500">
//                 No matching property available.
//               </p>

//               <Link
//                 href="/user"
//                 className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
//               >
//                 Back To Home
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {filteredProperties.map((property) => (
//                 <div
//                   key={property.id}
//                   className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
//                 >
//                   <img
//                     src={
//                       property.CoverImage?.url
//                         ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${property.CoverImage.url}`
//                         : "/no-image.png"
//                     }
//                     alt={property.Title}
//                     className="h-56 w-full object-cover"
//                   />

//                   <div className="p-5">
//                     <h2 className="text-xl font-bold">{property.Title}</h2>

//                     <p className="mt-2 text-gray-500">{property.Address}</p>

//                     <div className="mt-4 flex justify-between text-sm text-gray-600">
//                       <span>{property.Property_Type}</span>

//                       <span>{property.Category}</span>
//                     </div>

//                     <div className="mt-5">
//                       <Link
//                         href={`/user/property/${property.documentId}`}
//                         className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
//                       >
//                         View Details
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Footer */}
//       <Footer />
//     </>
//   );
// // }
// import Link from "next/link";

// import UserHeader from "@/components/user/UserHeader";
// import Footer from "@/components/Footer";

// import { getProperties } from "@/services/property";
// import { getUserSiteSettings } from "@/services/userSiteSettings";

// export default async function SearchPage({ searchParams }) {
//   const params = await searchParams;

//   const siteSettings = await getUserSiteSettings();
//   const properties = await getProperties();

//   const city = params?.city || "";
//   const area = params?.area || "";
//   const type = params?.type || "";
//   const category = params?.category || "";
//   const purpose = params?.purpose || "";

//   const filteredProperties = properties.filter((property) => {
//     const cityMatch =
//       !city ||
//       property.City?.trim().toLowerCase() === city.trim().toLowerCase();

//     const areaMatch =
//       !area ||
//       property.Area?.trim().toLowerCase() === area.trim().toLowerCase();

//     const typeMatch =
//       !type ||
//       property.Property_Type?.trim().toLowerCase() ===
//         type.trim().toLowerCase();

//     const categoryMatch =
//       !category ||
//       property.Category?.trim().toLowerCase() === category.trim().toLowerCase();

//     const purposeMatch =
//       !purpose ||
//       property.Purpose?.trim().toLowerCase() === purpose.trim().toLowerCase();

//     return cityMatch && areaMatch && typeMatch && categoryMatch && purposeMatch;
//   });

//   return (
//     <>
//       {/* Header */}
//       <UserHeader headerData={siteSettings?.UserHeader} />

//       {/* Search Result */}
//       <main className="min-h-screen bg-gray-100 px-6 py-10">
//         <div className="mx-auto max-w-7xl">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold">Search Results</h1>

//             <p className="mt-2 text-gray-500">
//               {purpose && (
//                 <>
//                   <span className="font-semibold">{purpose}</span>
//                   {" / "}
//                 </>
//               )}

//               {city && `${city} / `}
//               {area && `${area} / `}
//               {type && `${type} / `}
//               {category}
//             </p>

//             <p className="mt-2 text-blue-600 font-semibold">
//               {filteredProperties.length} Properties Found
//             </p>
//           </div>

//           {filteredProperties.length === 0 ? (
//             <div className="rounded-2xl bg-white p-12 text-center shadow">
//               <h2 className="text-2xl font-bold">No Property Found</h2>

//               <p className="mt-3 text-gray-500">
//                 Try changing your search filters.
//               </p>

//               <Link
//                 href="/user"
//                 className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
//               >
//                 Back To Home
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {filteredProperties.map((property) => (
//                 <div
//                   key={property.id}
//                   className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
//                 >
//                   <img
//                     src={
//                       property.CoverImage?.url
//                         ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${property.CoverImage.url}`
//                         : "/no-image.png"
//                     }
//                     alt={property.Title}
//                     className="h-56 w-full object-cover"
//                   />

//                   <div className="p-5">
//                     <h2 className="text-xl font-bold">{property.Title}</h2>

//                     <p className="mt-2 text-gray-500">{property.Address}</p>

//                     <div className="mt-4 flex flex-wrap gap-2">
//                       <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700">
//                         {property.Property_Type}
//                       </span>

//                       <span className="rounded bg-green-100 px-3 py-1 text-sm text-green-700">
//                         {property.Category}
//                       </span>

//                       <span className="rounded bg-orange-100 px-3 py-1 text-sm text-orange-700">
//                         {property.Purpose}
//                       </span>
//                     </div>

//                     <div className="mt-5">
//                       <Link
//                         href={`/user/property/${property.documentId}`}
//                         className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
//                       >
//                         View Details
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Footer */}
//       <Footer />
//     </>
//   );
// }
import UserHeader from "@/components/user/UserHeader";
import UserSearchClient from "@/components/user/UserSearchClient";
import { getUserSiteSettings } from "@/services/userSiteSettings";
import { Suspense } from "react";

export default async function SearchPage() {
  // Load Site Settings for Header & Footer
  const siteSettings = await getUserSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFBF7]">
      {/* Header */}
      <UserHeader headerData={siteSettings?.UserHeader} />

      {/* Main Content (Client Component with suspense boundary for useSearchParams) */}
      <Suspense fallback={
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-900 border-t-transparent"></div>
        </div>
      }>
        <UserSearchClient />
      </Suspense>
    </div>
  );
}
