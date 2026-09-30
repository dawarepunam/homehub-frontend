// import SearchTabs from "./SearchTabs";
// import SearchFilters from "./SearchFilters";

// export default function SearchBox({ searchData }) {
//   if (!searchData) return null;

//   return (
//     <div className="relative z-20 -mt-20 mx-auto w-full max-w-7xl px-4">
//       <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
//         {/* ================= Tabs ================= */}

//         <SearchTabs searchData={searchData} />

//         {/* ================= Filters ================= */}

//         <SearchFilters searchData={searchData} />
//       </div>
//     </div>
//   );
// // }
// "use client";

// import { useState } from "react";

// import SearchTabs from "./SearchTabs";
// import SearchFilters from "./SearchFilters";

// export default function SearchBox({ searchData }) {
//   if (!searchData) return null;

//   // ===============================
//   // Active Purpose (Buy / Rent / Sale)
//   // ===============================

//   const defaultPurpose =
//     searchData.SearchTabs?.find((item) => item.isDefault)?.value || "Buy";

//   const [activePurpose, setActivePurpose] = useState(defaultPurpose);

//   return (
//     <div className="relative z-20 -mt-20 mx-auto w-full max-w-7xl px-4">
//       <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
//         {/* ================= Tabs ================= */}

//         <SearchTabs
//           searchData={searchData}
//           activePurpose={activePurpose}
//           onPurposeChange={setActivePurpose}
//         />

//         {/* ================= Filters ================= */}

//         <SearchFilters searchData={searchData} activePurpose={activePurpose} />
//       </div>
//     </div>
//   );
// }
// "use client";

// import { useState } from "react";

// import SearchTabs from "./SearchTabs";
// import SearchFilters from "./SearchFilters";

// export default function SearchBox({ searchData }) {
//   // ===============================
//   // Default Purpose
//   // ===============================

//   const defaultPurpose =
//     searchData?.SearchTabs?.find((item) => item.isDefault)?.value ||
//     searchData?.SearchTabs?.[0]?.value ||
//     "buy";

//   // ===============================
//   // Active Purpose
//   // ===============================

//   const [activePurpose, setActivePurpose] = useState(defaultPurpose);

//   // ===============================
//   // No Data
//   // ===============================

//   if (!searchData) {
//     return null;
//   }

//   return (
//     <div className="relative z-20 -mt-20 mx-auto w-full max-w-7xl px-4">
//       <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
//         {/* ================= Tabs ================= */}

//         <SearchTabs
//           searchData={searchData}
//           activePurpose={activePurpose}
//           onPurposeChange={setActivePurpose}
//         />

//         {/* ================= Filters ================= */}

//         <SearchFilters searchData={searchData} activePurpose={activePurpose} />
//       </div>
//     </div>
//   );
// // }
// "use client";

// import { useState } from "react";

// import SearchTabs from "./SearchTabs";
// import SearchFilters from "./SearchFilters";

// export default function SearchBox({ searchData }) {
//   if (!searchData) return null;

//   // ===============================
//   // Default Purpose
//   // ===============================

//   const defaultPurpose =
//     searchData.SearchTabs?.find((item) => item.isDefault)?.value ||
//     searchData.SearchTabs?.[0]?.value ||
//     "buy";

//   // ===============================
//   // Active Purpose
//   // ===============================

//   const [activePurpose, setActivePurpose] = useState(defaultPurpose);

//   return (
//     <div className="relative z-30 mx-auto -mt-32 w-full max-w-7xl px-6">
//       <div className="overflow-hidden rounded-[30px] border border-gray-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
//         {/* Search Tabs */}

//         <SearchTabs
//           searchData={searchData}
//           activePurpose={activePurpose}
//           onPurposeChange={setActivePurpose}
//         />

//         {/* Search Filters */}

//         <div className="border-t border-gray-100 px-6 py-6">
//           <SearchFilters
//             searchData={searchData}
//             activePurpose={activePurpose}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
// "use client";

// import { useState } from "react";

// import SearchTabs from "./SearchTabs";
// import SearchFilters from "./SearchFilters";

// export default function SearchBox({ searchData }) {
//   if (!searchData) return null;

//   // ===============================
//   // Default Purpose
//   // ===============================

//   const defaultPurpose =
//     searchData.SearchTabs?.find((item) => item.isDefault)?.value ||
//     searchData.SearchTabs?.[0]?.value ||
//     "buy";

//   // ===============================
//   // Active Purpose
//   // ===============================

//   const [activePurpose, setActivePurpose] = useState(defaultPurpose);

//   return (
//     <section className="relative z-30 mx-auto -mt-44 w-full max-w-7xl px-6 lg:px-8">
//       <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.18)]">
//         {/* ================= Search Tabs ================= */}

//         <SearchTabs
//           searchData={searchData}
//           activePurpose={activePurpose}
//           onPurposeChange={setActivePurpose}
//         />

//         {/* ================= Search Filters ================= */}

//         <div className="border-t border-gray-100 px-8 py-7">
//           <SearchFilters
//             searchData={searchData}
//             activePurpose={activePurpose}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { useState } from "react";

import SearchTabs from "./SearchTabs";
import SearchFilters from "./SearchFilters";

export default function SearchBox({ searchData }) {
  const defaultPurpose =
    searchData?.SearchTabs?.find((item) => item.isDefault)?.value ||
    searchData?.SearchTabs?.[0]?.value ||
    "buy";

  const [activePurpose, setActivePurpose] = useState(defaultPurpose);

  if (!searchData) return null;

  return (
    <section className="relative z-30 mx-auto -mt-28 w-full max-w-7xl px-6 lg:px-8">
      <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-[#D7AE62]/30">

        <SearchTabs
          searchData={searchData}
          activePurpose={activePurpose}
          onPurposeChange={setActivePurpose}
        />

        <div className="border-t border-gray-100 px-8 py-7">
          <SearchFilters
            searchData={searchData}
            activePurpose={activePurpose}
          />
        </div>

      </div>
    </section>
  );
}