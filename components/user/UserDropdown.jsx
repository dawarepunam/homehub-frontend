// // "use client";

// // import Link from "next/link";

// // export default function UserDropdown({ menuItem }) {
// //   if (!menuItem) return null;

// //   const dropdownItems = [...(menuItem.DropdownItem || [])]
// //     .filter((item) => item?.IsActive && item?.Text && item?.Purpose)
// //     .reduce((items, item) => {
// //       const purpose = item.Purpose === "Rent" ? "Rent" : "Buy";

// //       if (items.some((current) => current.Purpose === purpose)) {
// //         return items;
// //       }

// //       return [
// //         ...items,
// //         {
// //           ...item,
// //           Text: purpose,
// //           Purpose: purpose,
// //         },
// //       ];
// //     }, [])
// //     .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));

// //   if (dropdownItems.length === 0) {
// //     return null;
// //   }

// //   return (
// //     <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
// //       <div className="bg-blue-600 px-5 py-3">
// //         <h3 className="text-lg font-bold text-white">Residential</h3>
// //       </div>

// //       <div className="py-2">
// //         {dropdownItems.map((item) => (
// //           <Link
// //             key={item.id}
// //             href={`/user/properties?type=Residential&purpose=${item.Purpose}`}
// //             prefetch={false}
// //             className="flex items-center justify-between px-5 py-3 transition hover:bg-blue-50"
// //           >
// //             <div>
// //               <p className="font-semibold text-gray-800">{item.Text}</p>
// //               <p className="text-sm text-gray-500">{item.Purpose}</p>
// //             </div>

// //             <span className="text-lg text-blue-600">→</span>
// //           </Link>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// import Link from "next/link";

// export default function UserDropdown({ menuItem }) {
//   if (!menuItem) return null;

//   const dropdownItems = [...(menuItem.DropdownItem || [])]
//     .filter((item) => item && item.IsActive && item.Text && item.Slug)
//     .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));

//   if (dropdownItems.length === 0) {
//     return null;
//   }

//   return (
//     <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
//       <div className="bg-blue-600 px-5 py-3">
//         <h3 className="text-lg font-bold text-white">{menuItem.Title}</h3>
//       </div>

//       <div className="py-2">
//         {dropdownItems.map((item) => (
//           <Link
//             key={item.id}
//             href={`/user/properties?category=${menuItem.Slug}&purpose=${item.Slug}`}
//             className="flex items-center justify-between px-5 py-3 transition hover:bg-blue-50"
//           >
//             <div>
//               <p className="font-semibold text-gray-800">{item.Text}</p>

//               <p className="text-sm text-gray-500">{item.Purpose}</p>
//             </div>

//             <span className="text-lg text-blue-600">→</span>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
// "use client";

// import Link from "next/link";

// export default function UserDropdown({ menuItem }) {
//   if (!menuItem) return null;

//   const dropdownItems = [...(menuItem.DropdownItem || [])]
//     .filter((item) => item && item.IsActive && item.Text && item.Slug)
//     .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));

//   if (dropdownItems.length === 0) {
//     return null;
//   }

//   return (
//     <div className="absolute left-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl z-50">
//       <div className="bg-blue-600 px-5 py-3">
//         <h3 className="text-lg font-bold text-white">{menuItem.Title}</h3>
//       </div>

//       <div className="py-2">
//         {dropdownItems.map((item) => (
//           <Link
//             key={item.id}
//             href={`/user/properties?category=${menuItem.Slug}&purpose=${item.Slug}`}
//             className="flex items-center justify-between px-5 py-3 hover:bg-blue-50 transition"
//           >
//             <div>
//               <p className="font-semibold text-gray-800">{item.Text}</p>

//               <p className="text-sm text-gray-500">{item.Purpose}</p>
//             </div>

//             <span className="text-blue-600 text-lg">→</span>
//           </Link>
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function UserDropdown({ menuItem }) {
  if (!menuItem) return null;

  const dropdownItems = [...(menuItem.DropdownItem || [])]
    .filter((item) => item && item.IsActive && item.Text && item.Slug)
    .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));

  if (dropdownItems.length === 0) {
    return null;
  }

  // Define static fallback categories since Strapi doesn't provide them via MenuItem yet.
  // In a full implementation, these would come from a "PropertyTypes" relation.
  let popularCategories = [];
  let quickLinks = [];

  if (menuItem.Title === "Residential") {
    popularCategories = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK", "Apartments", "Independent House", "Villa", "Plot / Land", "PG / Co-living"];
    quickLinks = ["Properties for Sale", "Properties for Rent", "New Projects", "View All Residential"];
  } else if (menuItem.Title === "Commercial") {
    popularCategories = ["Office Spaces", "Shops", "Showrooms", "Warehouses", "Commercial Plots", "Co-working Spaces", "Business Centres"];
    quickLinks = ["Commercial for Sale", "Commercial for Rent", "View All Commercial"];
  } else if (menuItem.Title === "Industrial") {
    popularCategories = ["Factory", "Industrial Shed", "Warehouse", "Industrial Land", "Manufacturing Unit", "Logistics / Storage"];
    quickLinks = ["Industrial for Sale", "Industrial for Rent", "View All Industrial"];
  }

  return (
    <div
      className="w-max overflow-hidden rounded-2xl bg-[#F5F3EE] shadow-2xl transition-all"
      style={{ border: "1px solid #D7AE62" }}
    >
      <div className="grid grid-cols-4 gap-8 p-8" style={{ minWidth: "800px" }}>
        
        {/* Column 1: Popular Categories */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-[#0D3326] uppercase tracking-wide border-b border-[#0D3326]/10 pb-2">
            Popular {menuItem.Title}
          </h4>
          <ul className="flex flex-col gap-2.5">
            {popularCategories.map((cat, idx) => (
              <li key={idx}>
                <Link
                  href={`/user/properties?type=${encodeURIComponent(menuItem.Slug)}&category=${encodeURIComponent(cat.toLowerCase())}`}
                  className="text-sm font-semibold text-[#0D3326]/80 hover:text-[#D7AE62] transition-colors"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Buy / Rent (Dynamic from Strapi) */}
        <div className="flex flex-col gap-6">
          {dropdownItems.map((item, index) => (
            <div key={item.id || index} className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-[#0D3326] uppercase tracking-wide border-b border-[#0D3326]/10 pb-2">
                {item.Text}
              </h4>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <Link
                    href={`/user/properties?type=${encodeURIComponent(menuItem.Slug)}&purpose=${encodeURIComponent(item.Slug)}`}
                    className="text-sm font-semibold text-[#0D3326]/80 hover:text-[#D7AE62] transition-colors"
                  >
                    View All {item.Text}
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>

        {/* Column 3: Featured Types (Placeholder) */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-[#0D3326] uppercase tracking-wide border-b border-[#0D3326]/10 pb-2">
            Property Types
          </h4>
          <ul className="flex flex-col gap-2.5">
            {popularCategories.slice(0, 5).map((cat, idx) => (
              <li key={`type-${idx}`}>
                <Link
                  href={`/user/properties?type=${encodeURIComponent(menuItem.Slug)}&category=${encodeURIComponent(cat.toLowerCase())}`}
                  className="text-sm font-semibold text-[#0D3326]/80 hover:text-[#D7AE62] transition-colors"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Quick Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-[#D7AE62] uppercase tracking-wide border-b border-[#D7AE62]/20 pb-2">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-3">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  href={`/user/properties?type=${encodeURIComponent(menuItem.Slug)}`}
                  className="flex items-center gap-2 text-sm font-bold text-[#0D3326] hover:text-[#D7AE62] transition-colors group"
                >
                  {link}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
