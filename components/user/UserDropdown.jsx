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
import { ArrowRight, ChevronRight, Building, Home, Factory } from "lucide-react";

export default function UserDropdown({ menuItem }) {
  if (!menuItem) return null;

  const dropdownItems = [...(menuItem.DropdownItem || [])]
    .filter((item) => item && item.IsActive && item.Text && item.Slug)
    .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));

  if (dropdownItems.length === 0) {
    return null;
  }

  // Tailored categories per property type
  let popularCategories = [];
  let quickLinks = [];
  let IconComponent = Home;

  if (menuItem.Title === "Residential") {
    popularCategories = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Villas", "Plots"];
    quickLinks = ["Properties for Sale", "Properties for Rent", "View All Residential"];
    IconComponent = Home;
  } else if (menuItem.Title === "Commercial") {
    popularCategories = ["Office Spaces", "Shops", "Showrooms", "Warehouses", "Co-working"];
    quickLinks = ["Commercial for Sale", "Commercial for Rent", "View All Commercial"];
    IconComponent = Building;
  } else if (menuItem.Title === "Industrial") {
    popularCategories = ["Factory", "Industrial Shed", "Warehouse", "Industrial Land"];
    quickLinks = ["Industrial for Sale", "Industrial for Rent", "View All Industrial"];
    IconComponent = Factory;
  }

  return (
    <div
      className="w-auto overflow-hidden rounded-2xl bg-[var(--bg-card)] shadow-2xl border border-[var(--border-subtle)] text-[var(--text-primary)] transition-all"
      style={{
        width: "max-content",
        maxWidth: "min(680px, calc(100vw - 32px))",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 sm:p-6">
        
        {/* Column 1: Popular Categories */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2">
            <IconComponent size={14} className="text-[var(--accent)] shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Popular {menuItem.Title}
            </h4>
          </div>
          <ul className="flex flex-col gap-1.5 pt-1">
            {popularCategories.map((cat, idx) => (
              <li key={idx}>
                <Link
                  href={`/user/properties?type=${encodeURIComponent(menuItem.Slug)}&category=${encodeURIComponent(cat.toLowerCase())}`}
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all"
                >
                  <span>{cat}</span>
                  <ChevronRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--text-muted)]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Buy / Rent (Dynamic from Strapi) */}
        <div className="flex flex-col gap-4">
          <div className="border-b border-[var(--border-subtle)] pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Explore by Purpose
            </h4>
          </div>
          <div className="flex flex-col gap-3">
            {dropdownItems.map((item, index) => (
              <div key={item.id || index} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 transition hover:border-[var(--border-focus)]">
                <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)] block">
                  {item.Text}
                </span>
                <Link
                  href={`/user/properties?type=${encodeURIComponent(menuItem.Slug)}&purpose=${encodeURIComponent(item.Slug)}`}
                  className="mt-1 flex items-center justify-between text-xs sm:text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors group"
                >
                  <span>Browse {item.Text}</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1 text-[var(--text-muted)]" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Quick Links */}
        <div className="flex flex-col gap-2.5 bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-subtle)]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-2 pt-1">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  href={`/user/properties?type=${encodeURIComponent(menuItem.Slug)}`}
                  className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors group py-1"
                >
                  <span className="truncate">{link}</span>
                  <ArrowRight size={13} className="shrink-0 transition-transform group-hover:translate-x-1 text-[var(--text-muted)]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
