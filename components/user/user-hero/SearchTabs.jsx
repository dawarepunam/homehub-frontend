// "use client";

// import { useState } from "react";

// export default function SearchTabs({ searchData }) {
//   if (!searchData) return null;

//   // ===============================
//   // Tabs From Strapi
//   // ===============================

//   const tabs = searchData.SearchTabs || [];

//   if (tabs.length === 0) return null;

//   // ===============================
//   // Default Active Tab
//   // ===============================

//   const defaultTab =
//     tabs.find((tab) => tab.isDefault)?.value || tabs[0]?.value || "";

//   const [activeTab, setActiveTab] = useState(defaultTab);

//   return (
//     <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-6 py-5">
//       {tabs.map((tab) => (
//         <button
//           key={tab.id}
//           type="button"
//           onClick={() => setActiveTab(tab.value)}
//           className={`rounded-xl px-7 py-3 text-base font-semibold transition-all duration-200 ${
//             activeTab === tab.value
//               ? "bg-blue-600 text-white shadow-lg"
//               : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//           }`}
//         >
//           {tab.label}
//         </button>
//       ))}
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";

// export default function SearchTabs({
//   searchData,
//   activePurpose,
//   onPurposeChange,
// }) {
//   if (!searchData) return null;

//   // ===============================
//   // Tabs From Strapi
//   // ===============================

//   const tabs = searchData.SearchTabs || [];

//   if (tabs.length === 0) return null;

//   // ===============================
//   // Default Active Tab
//   // ===============================

//   const defaultTab =
//     tabs.find((tab) => tab.isDefault)?.value || tabs[0]?.value || "";

//   const [activeTab, setActiveTab] = useState(activePurpose || defaultTab);

//   // Parent ला default tab पाठवण्यासाठी

//   useEffect(() => {
//     if (onPurposeChange) {
//       onPurposeChange(activeTab);
//     }
//   }, []);

//   // Tab Click

//   const handleTabClick = (value) => {
//     setActiveTab(value);

//     if (onPurposeChange) {
//       onPurposeChange(value);
//     }
//   };

//   return (
//     <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-6 py-5">
//       {tabs.map((tab) => (
//         <button
//           key={tab.id}
//           type="button"
//           onClick={() => handleTabClick(tab.value)}
//           className={`rounded-xl px-7 py-3 text-base font-semibold transition-all duration-200 ${
//             activeTab === tab.value
//               ? "bg-blue-600 text-white shadow-lg"
//               : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//           }`}
//         >
//           {tab.label}
//         </button>
//       ))}
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";

// export default function SearchTabs({
//   searchData,
//   activePurpose,
//   onPurposeChange,
// }) {
//   if (!searchData) return null;

//   // ===============================
//   // Tabs From Strapi
//   // ===============================

//   const tabs = searchData.SearchTabs || [];

//   if (tabs.length === 0) return null;

//   // ===============================
//   // Default Active Tab
//   // ===============================

//   const defaultTab =
//     tabs.find((tab) => tab.isDefault)?.value || tabs[0]?.value || "";

//   const [activeTab, setActiveTab] = useState(activePurpose || defaultTab);

//   // ===============================
//   // Parent Sync
//   // ===============================

//   useEffect(() => {
//     if (onPurposeChange) {
//       onPurposeChange(activeTab);
//     }
//   }, [activeTab, onPurposeChange]);

//   // ===============================
//   // Update if Parent changes
//   // ===============================

//   useEffect(() => {
//     if (activePurpose && activePurpose !== activeTab) {
//       setActiveTab(activePurpose);
//     }
//   }, [activePurpose, activeTab]);

//   // ===============================
//   // Tab Click
//   // ===============================

//   const handleTabClick = (value) => {
//     setActiveTab(value);
//   };

//   return (
//     <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-6 py-5">
//       {tabs.map((tab) => (
//         <button
//           key={tab.id}
//           type="button"
//           onClick={() => handleTabClick(tab.value)}
//           className={`rounded-xl px-7 py-3 text-base font-semibold transition-all duration-300 ${
//             activeTab === tab.value
//               ? "bg-blue-600 text-white shadow-lg"
//               : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//           }`}
//         >
//           {tab.label}
//         </button>
//       ))}
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";

// export default function SearchTabs({
//   searchData,
//   activePurpose,
//   onPurposeChange,
// }) {
//   const tabs = searchData?.SearchTabs || [];

//   const defaultTab =
//     tabs.find((tab) => tab.isDefault)?.value || tabs[0]?.value || "";

//   const [activeTab, setActiveTab] = useState(activePurpose || defaultTab);

//   // Parent ला active tab पाठव
//   useEffect(() => {
//     onPurposeChange?.(activeTab);
//   }, [activeTab, onPurposeChange]);

//   if (!searchData || tabs.length === 0) {
//     return null;
//   }

//   const handleTabClick = (value) => {
//     setActiveTab(value);
//   };

//   return (
//     <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-6 py-5">
//       {tabs.map((tab) => (
//         <button
//           key={tab.id}
//           type="button"
//           onClick={() => handleTabClick(tab.value)}
//           className={`rounded-xl px-7 py-3 text-base font-semibold transition-all duration-300 ${
//             activeTab === tab.value
//               ? "bg-blue-600 text-white shadow-lg"
//               : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//           }`}
//         >
//           {tab.label}
//         </button>
//       ))}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";

export default function SearchTabs({
  activePurpose,
  onPurposeChange,
}) {
  const tabs = [
    { id: 1, label: "Buy", value: "buy" },
    { id: 2, label: "Rent", value: "rent" },
    { id: 3, label: "Sale", value: "sale" }
  ];

  const defaultTab = "buy";

  const [activeTab, setActiveTab] = useState(activePurpose || defaultTab);

  // Parent state sync
  useEffect(() => {
    if (activePurpose !== activeTab && activePurpose) {
      setActiveTab(activePurpose);
    }
  }, [activePurpose]);

  // Send active tab to parent
  useEffect(() => {
    onPurposeChange?.(activeTab);
  }, [activeTab, onPurposeChange]);

  const handleTabClick = (value) => {
    setActiveTab(value);
    onPurposeChange?.(value);
  };

  return (
    <div className="flex items-center gap-4 border-b border-[#D7AE62]/20 px-6 py-4 bg-white/50 backdrop-blur-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => handleTabClick(tab.value)}
          className={`rounded-xl px-8 py-2.5 text-sm font-bold tracking-wide transition-all duration-300 ${
            activeTab === tab.value
              ? "bg-[#0D3326] text-[#D7AE62] shadow-lg shadow-[#0D3326]/20"
              : "bg-[#F5F3EE] text-[#0D3326]/70 hover:bg-[#D7AE62]/20 hover:text-[#0D3326]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
