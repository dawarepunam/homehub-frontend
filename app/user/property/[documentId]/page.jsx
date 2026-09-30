// import PropertyDetails from "@/components/user/PropertyDetails";
// import UserHeader from "@/components/user/UserHeader";
// import { getProperty, getRelatedProperties } from "@/services/property";
// import { getUserSiteSettings } from "@/services/userSiteSettings";

// export default async function PropertyPage({ params }) {
//   const resolvedParams = await params;
//   const documentId = resolvedParams?.documentId;

//   const siteSettings = await getUserSiteSettings();
//   const property = await getProperty(documentId);

//   const relatedProperties = property
//     ? await getRelatedProperties(
//         property.Property_Type,
//         property.Purpose,
//         property.documentId,
//       )
//     : [];

//   return (
//     <main className="min-h-screen bg-gray-50">
//       <UserHeader headerData={siteSettings?.UserHeader} />

//       <PropertyDetails
//         property={property}
//         relatedProperties={relatedProperties}
//       />
//     </main>
//   );
// }
import PropertyDetails from "@/components/user/PropertyDetails";
import UserHeader from "@/components/user/UserHeader";
import PropertyViewTracker from "@/components/PropertyViewTracker";

import {
  getProperty,
  getRelatedProperties,
} from "@/services/property";

import { getUserSiteSettings } from "@/services/userSiteSettings";

export default async function PropertyPage({ params }) {
  // =====================================================
  // GET PROPERTY DOCUMENT ID
  // =====================================================

  const resolvedParams = await params;
  const documentId = resolvedParams?.documentId;

  // =====================================================
  // SAFETY CHECK
  // =====================================================

  if (!documentId) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Property Not Found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              The property you are looking for could not be found.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // LOAD DATA FROM STRAPI
  // =====================================================

  const [siteSettings, property] = await Promise.all([
    getUserSiteSettings(),
    getProperty(documentId),
  ]);

  // =====================================================
  // PROPERTY NOT FOUND
  // =====================================================

  if (!property) {
    return (
      <main className="min-h-screen bg-gray-50">
        <UserHeader
          headerData={siteSettings?.UserHeader}
        />

        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="max-w-lg text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
              🏠
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-800">
              Property Not Found
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              This property may have been removed or is
              currently unavailable.
            </p>

          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // LOAD RELATED PROPERTIES
  // =====================================================

  const relatedProperties = await getRelatedProperties(
    property.Property_Type,
    property.Purpose,
    property.documentId,
  );

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-[#F7F4EF] flex flex-col">

      {/* Track buyer view (client-only, no-op if not logged in) */}
      <PropertyViewTracker propertyDocumentId={documentId} />

      {/* ================================================
          USER HEADER
      ================================================= */}

      <UserHeader
        headerData={siteSettings?.UserHeader}
      />

      {/* ================================================
          PROPERTY DETAILS
      ================================================= */}

      <PropertyDetails
        property={property}
        relatedProperties={relatedProperties || []}
      />

    </main>
  );
}