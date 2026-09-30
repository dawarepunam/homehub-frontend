// "use client";

// import { useEffect, useState } from "react";

// import Footer from "@/components/Footer";
// import Header from "@/components/Header";
// import OwnerEnquirySection from "@/components/OwnerEnquirySection";
// import OwnerWelcome from "@/components/OwnerWelcome";
// import PropertySection from "@/components/PropertySection";
// import SummaryCards from "@/components/SummaryCards";

// import {
//   getOwnerDashboard,
//   getOwnerProperties,
// } from "@/services/ownerDashboard";

// export default function Home() {
//   const [dashboard, setDashboard] = useState(null);
//   const [owner, setOwner] = useState(null);
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     async function loadDashboard() {
//       try {
//         setLoading(true);
//         setErrorMessage("");

//         const dashboardData = await getOwnerDashboard();
//         const ownerData = await getOwnerProperties();

//         setDashboard(dashboardData);
//         setOwner(ownerData?.owner || null);
//         setProperties(ownerData?.properties || []);
//       } catch (error) {
//         console.error("OWNER DASHBOARD ERROR:", error);

//         setErrorMessage(
//           error?.message || "Unable to load Owner Dashboard."
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadDashboard();
//   }, []);

//   if (loading) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
//         <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-sm">
//           <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0F6678]" />

//           <p className="text-sm font-medium text-gray-600">
//             Loading Owner Dashboard...
//           </p>
//         </div>
//       </main>
//     );
//   }

//   if (errorMessage) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
//         <div className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
//           <h1 className="text-2xl font-bold text-red-600">
//             Unable to load dashboard
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-gray-600">
//             {errorMessage}
//           </p>

//           <button
//             type="button"
//             onClick={() => window.location.reload()}
//             className="mt-6 rounded-xl bg-[#0F6678] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B5868]"
//           >
//             Try Again
//           </button>
//         </div>
//       </main>
//     );
//   }

//   const counts = {
//     residential: properties.filter(
//       (property) => property?.Property_Type === "Residential"
//     ).length,
//     commercial: properties.filter(
//       (property) => property?.Property_Type === "Commercial"
//     ).length,
//     industrial: properties.filter(
//       (property) => property?.Property_Type === "Industrial"
//     ).length,
//     total: properties.length,
//   };

//   return (
//     <main className="flex min-h-screen flex-col bg-gray-100">
//       <Header headerData={dashboard?.header} />

//       <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
//         <OwnerWelcome
//           welcomeData={dashboard?.welcome}
//           owner={owner}
//           properties={properties}
//         />

//         <SummaryCards counts={counts} />

//         <PropertySection properties={properties} />

//         <OwnerEnquirySection />
//       </div>

//       <Footer footerData={dashboard?.copyright} />
//     </main>
//   );
// }
"use client";

import { useEffect, useState } from "react";

import Footer from "../components/Footer";
import Header from "@/components/Header";
import OwnerEnquirySection from "@/components/OwnerEnquirySection";
import OwnerWelcome from "@/components/OwnerWelcome";
import PropertySection from "@/components/PropertySection";
import SummaryCards from "@/components/SummaryCards";

import {
  getOwnerDashboard,
  getOwnerProperties,
} from "@/services/ownerDashboard";

export default function Home() {
  const [dashboard, setDashboard] = useState(null);
  const [owner, setOwner] = useState(null);
  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // LOAD OWNER DASHBOARD
  // =====================================================

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setErrorMessage("");

        // Get Owner Dashboard content from Strapi
        const dashboardData = await getOwnerDashboard();

        // Get logged-in Owner and his properties
        const ownerData = await getOwnerProperties();

        setDashboard(dashboardData);
        setOwner(ownerData?.owner || null);
        setProperties(ownerData?.properties || []);
      } catch (error) {
        console.error("OWNER DASHBOARD ERROR:", error);

        setErrorMessage(
          error?.message || "Unable to load Owner Dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0F6678]" />

          <p className="text-sm font-medium text-gray-600">
            Loading Owner Dashboard...
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (errorMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">
            Unable to load dashboard
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-[#0F6678] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B5868]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // =====================================================
  // PROPERTY COUNTS
  // =====================================================

  const counts = {
    residential: properties.filter(
      (property) =>
        property?.Property_Type === "Residential"
    ).length,

    commercial: properties.filter(
      (property) =>
        property?.Property_Type === "Commercial"
    ).length,

    industrial: properties.filter(
      (property) =>
        property?.Property_Type === "Industrial"
    ).length,

    total: properties.length,
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <Header headerData={dashboard?.header} />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* =================================================
            OWNER WELCOME
        ================================================= */}

        <OwnerWelcome
          welcomeData={dashboard?.welcome}
          owner={owner}
          properties={properties}
        />

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <SummaryCards counts={counts} />

        {/* =================================================
            OWNER PROPERTIES
        ================================================= */}

        <PropertySection
          properties={properties}
        />

        {/* =================================================
            OWNER ENQUIRIES
        ================================================= */}

        <OwnerEnquirySection />

      </div>

      {/* =================================================
          OWNER FOOTER
      ================================================= */}

      <Footer
        data={dashboard?.Footer}
      />

    </main>
  );
}
