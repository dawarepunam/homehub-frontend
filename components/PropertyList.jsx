// import PropertyCard from "./PropertyCard";

// export default function PropertyList({ properties }) {
//   if (properties.length === 0) {
//     return (
//       <div className="mt-8 rounded-lg border bg-white p-6 text-center">
//         <h2 className="text-lg font-semibold">
//           No Properties Found
//         </h2>
//       </div>
//     );
//   }

//   return (
//     <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//       {properties.map((property) => (
//         <PropertyCard
//           key={property.documentId}
//           property={property}
//         />
//       ))}
//     </section>
//   );
// }


// "use client";

// import PropertyCard from "./PropertyCard";

// export default function PropertyList({ properties = [] }) {
//   // =====================================================
//   // EMPTY STATE
//   // =====================================================

//   if (!Array.isArray(properties) || properties.length === 0) {
//     return (
//       <section className="mt-8 w-full">
//         <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[#D9D1C2] bg-[#F7F0E3] px-6 py-12 text-center shadow-sm">
          
//           {/* ICON */}
//           <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E5E8DE]">
//             <span className="text-2xl text-[#174B3B]">
//               🏠
//             </span>
//           </div>

//           <h2 className="text-xl font-extrabold text-[#123F32]">
//             No Properties Found
//           </h2>

//           <p className="mt-2 max-w-md text-sm leading-6 text-[#718177]">
//             You have not added any properties yet.
//             Once you add a property, it will appear here.
//           </p>
//         </div>
//       </section>
//     );
//   }

//   // =====================================================
//   // PROPERTY LIST
//   // =====================================================

//   return (
//     <section className="mt-8 w-full">

//       {/* =================================================
//           LIST HEADER
//       ================================================= */}

//       <div className="mb-5 flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-extrabold text-[#123F32]">
//             Your Properties
//           </h2>

//           <p className="mt-1 text-sm text-[#718177]">
//             {properties.length}{" "}
//             {properties.length === 1
//               ? "property"
//               : "properties"}{" "}
//             listed
//           </p>
//         </div>
//       </div>

//       {/* =================================================
//           PROPERTY GRID
//       ================================================= */}

//       <div
//         className="
//           grid
//           grid-cols-1
//           gap-5
//           sm:grid-cols-2
//           lg:grid-cols-3
//           xl:grid-cols-4
//         "
//       >
//         {properties.map((property, index) => (
//           <PropertyCard
//             key={
//               property?.documentId ||
//               property?.id ||
//               `property-${index}`
//             }
//             property={property}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

// "use client";

// import PropertyCard from "./PropertyCard";

// export default function PropertyList({ properties = [] }) {
//   // =====================================================
//   // EMPTY STATE
//   // =====================================================

//   if (!Array.isArray(properties) || properties.length === 0) {
//     return (
//       <section className="mt-8 w-full">
//         <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[#D9D1C2] bg-[#F7F0E3] px-6 py-12 text-center shadow-sm">
//           <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E5E8DE]">
//             <span className="text-2xl">🏠</span>
//           </div>

//           <h2 className="text-xl font-extrabold text-[#123F32]">
//             No Properties Found
//           </h2>

//           <p className="mt-2 max-w-md text-sm leading-6 text-[#718177]">
//             You have not added any properties yet.
//             Once you add a property, it will appear here.
//           </p>
//         </div>
//       </section>
//     );
//   }

//   // =====================================================
//   // PROPERTY LIST
//   // =====================================================

//   return (
//     <section className="mt-8 w-full">

//       {/* =================================================
//           SECTION HEADER
//       ================================================= */}

//       <div className="mb-5 flex items-end justify-between">
//         <div>
//           <h2 className="text-xl font-extrabold text-[#123F32]">
//             Your Properties
//           </h2>

//           <p className="mt-1 text-sm text-[#718177]">
//             {properties.length}{" "}
//             {properties.length === 1
//               ? "property"
//               : "properties"}{" "}
//             listed
//           </p>
//         </div>
//       </div>

//       {/* =================================================
//           OWNER PROPERTY GRID
//       ================================================= */}

//       <div
//         className="
//           grid
//           grid-cols-1
//           gap-5
//           sm:grid-cols-2
//           lg:grid-cols-3
//           xl:grid-cols-4
//         "
//       >
//         {properties.map((property, index) => (
//           <PropertyCard
//             key={
//               property?.documentId ||
//               property?.id ||
//               `property-${index}`
//             }
//             property={property}
//             ownerMode={true}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";

import PropertyCard from "./PropertyCard";

export default function PropertyList({ properties = [], onUpdate }) {
  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!Array.isArray(properties) || properties.length === 0) {
    return (
      <section className="mt-8 w-full">
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-[#D9D1C2] bg-[#F7F0E3] px-6 py-12 text-center shadow-[0_10px_30px_rgba(30,61,48,0.06)]">
          
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5E8DE]">
            <span className="text-2xl">🏠</span>
          </div>

          <h2 className="text-xl font-extrabold text-[#123F32]">
            No Properties Found
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-[#718177]">
            You have not added any properties yet. Once you add a
            property, it will appear here automatically.
          </p>

          <a
            href="/owner/properties/add"
            className="mt-6 inline-flex items-center rounded-xl bg-[#174B3B] px-5 py-3 text-sm font-bold text-[#F7F0E3] transition hover:bg-[#123F32]"
          >
            + Add Property
          </a>
        </div>
      </section>
    );
  }

  // =====================================================
  // PROPERTY LIST
  // =====================================================

  return (
    <section className="mt-8 w-full">

      {/* =================================================
          SECTION HEADER
      ================================================= */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-[#123F32]">
              Your Properties
            </h2>

            <span className="rounded-full bg-[#E5E8DE] px-3 py-1 text-xs font-bold text-[#416353]">
              {properties.length}
            </span>
          </div>

          <p className="mt-1 text-sm text-[#718177]">
            Manage properties listed by you
          </p>
        </div>

        {/* PROPERTY COUNT */}

        <div className="text-sm font-semibold text-[#718177]">
          Showing{" "}
          <span className="font-extrabold text-[#174B3B]">
            {properties.length}
          </span>{" "}
          {properties.length === 1 ? "property" : "properties"}
        </div>
      </div>

      {/* =================================================
          OWNER PROPERTY GRID
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {properties.map((property, index) => (
          <PropertyCard
            key={
              property?.documentId ||
              property?.id ||
              `property-${index}`
            }
            property={property}
            ownerMode={true}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </section>
  );
}