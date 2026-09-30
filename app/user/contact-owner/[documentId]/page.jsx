// import Link from "next/link";

// import Header from "@/components/user/UserHeader";
// import Footer from "@/components/Footer";

// import { getProperty } from "@/services/property";
// import { getUserSiteSettings } from "@/services/userSiteSettings";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
//   "http://localhost:1337";

// export default async function ContactOwnerPage({ params }) {

//   const { documentId } = await params;

//   const settings = await getUserSiteSettings();

//   const property = await getProperty(documentId);

//   if (!property) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <h1 className="text-3xl font-bold">
//           Property Not Found
//         </h1>
//       </div>
//     );
//   }

//   const image = property?.CoverImage?.url
//     ? `${STRAPI_URL}${property.CoverImage.url}`
//     : "/no-property.png";

//   return (
//     <div className="min-h-screen bg-gray-100">

//       {/* Header */}
//       <Header headerData={settings?.UserHeader} />

//       {/* Main */}
//       <main className="mx-auto max-w-7xl px-6 py-10">

//         {/* Back */}
//         <Link
//           href={`/user/property/${documentId}`}
//           className="text-blue-600 font-semibold hover:underline"
//         >
//           ← Back to Property
//         </Link>

//         <h1 className="mt-4 text-4xl font-bold">
//           Contact Property Owner
//         </h1>

//         <p className="mt-2 text-gray-500">
//           Send your enquiry directly to the property owner.
//         </p>

//         <div className="mt-10 grid gap-8 lg:grid-cols-2">

//           {/* Left */}
//           <div className="rounded-2xl bg-white p-6 shadow">

//             <img
//               src={image}
//               alt={property.Title}
//               className="h-72 w-full rounded-xl object-cover"
//             />

//             <h2 className="mt-5 text-2xl font-bold">
//               {property.Title}
//             </h2>

//             <p className="mt-2 text-gray-600">
//               📍 {property.Area}, {property.City}
//             </p>

//             <div className="mt-5 flex flex-wrap gap-3">

//               <span className="rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700">
//                 {property.Property_Type}
//               </span>

//               <span className="rounded-full bg-green-100 px-4 py-2 text-sm text-green-700">
//                 {property.Purpose}
//               </span>

//               <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
//                 {property.PropertyStatus}
//               </span>

//             </div>

//             <div className="mt-6">

//               <h3 className="text-xl font-semibold">
//                 Price
//               </h3>

//               <p className="mt-2 text-2xl font-bold text-blue-600">
//                 {property?.PropertyCommonDetails?.Price ||
//                   "Price on Request"}
//               </p>

//             </div>

//           </div>

//           {/* Right */}
//           <div className="rounded-2xl bg-white p-6 shadow">

//             <h2 className="text-2xl font-bold">
//               Contact Owner
//             </h2>

//             <p className="mt-2 text-gray-500">
//               Fill in your details and send an enquiry.
//             </p>

//             <form className="mt-8 space-y-5">

//               <div>

//                 <label className="mb-2 block font-medium">
//                   Full Name
//                 </label>

//                 <input
//                   type="text"
//                   placeholder="Enter your name"
//                   className="w-full rounded-lg border p-3 outline-none focus:border-blue-600"
//                 />

//               </div>

//               <div>

//                 <label className="mb-2 block font-medium">
//                   Phone Number
//                 </label>

//                 <input
//                   type="text"
//                   placeholder="Enter phone number"
//                   className="w-full rounded-lg border p-3 outline-none focus:border-blue-600"
//                 />

//               </div>

//               <div>

//                 <label className="mb-2 block font-medium">
//                   Email
//                 </label>

//                 <input
//                   type="email"
//                   placeholder="Enter email"
//                   className="w-full rounded-lg border p-3 outline-none focus:border-blue-600"
//                 />

//               </div>

//               <div>

//                 <label className="mb-2 block font-medium">
//                   Message
//                 </label>

//                 <textarea
//                   rows={5}
//                   placeholder="I am interested in this property..."
//                   className="w-full rounded-lg border p-3 outline-none focus:border-blue-600"
//                 />

//               </div>

//               <button
//                 type="submit"
//                 className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700"
//               >
//                 Send Enquiry
//               </button>

//             </form>

//           </div>

//         </div>

//       </main>

//       {/* Footer */}
//       <Footer />

//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  getLoggedInUser,
  getPropertyForEnquiry,
  sendEnquiry,
} from "@/services/enquiry";

export default function ContactOwnerPage() {
  const params = useParams();
  const router = useRouter();

  const documentId = params?.documentId;

  const [property, setProperty] = useState(null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const loggedInUser = await getLoggedInUser();

        const propertyData = await getPropertyForEnquiry(documentId);

        setUser(loggedInUser);
        setProperty(propertyData);
      } catch (error) {
        console.error("Contact Owner Error:", error);

        toast.error(error?.message || "Unable to load property.");
      } finally {
        setLoading(false);
      }
    }

    if (documentId) {
      loadData();
    }
  }, [documentId]);

  function handleContactOwner() {
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    setShowConfirmation(true);
  }

  async function handleSendRequest() {
    if (!property || !user) {
      return;
    }

    try {
      setSending(true);

      await sendEnquiry({
        propertyDocumentId: property.documentId,

        name: user.username || "",

        phone: "",

        email: user.email || "",

        message: "I am interested in this property.",
      });

      setShowConfirmation(false);

      toast.success("Enquiry sent successfully!");

      setTimeout(() => {
        router.back();
      }, 1200);
    } catch (error) {
      console.error("Send Enquiry Error:", error);

      toast.error(error?.message || "Failed to send enquiry.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Property not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm font-medium text-blue-600"
        >
          ← Back
        </button>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-gray-900">Contact Owner</h1>

          <p className="mt-2 text-gray-500">
            Send an enquiry to the property owner.
          </p>

          <div className="mt-6 rounded-xl border p-5">
            <h2 className="text-xl font-bold">{property.Title}</h2>

            <p className="mt-2 text-sm text-gray-500">
              {property.Area}
              {property.Area && property.City ? ", " : ""}
              {property.City}
            </p>

            <p className="mt-4 text-sm">Logged in as:</p>

            <p className="font-semibold">{user?.username}</p>

            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          <button
            onClick={handleContactOwner}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Contact Owner
          </button>
        </div>
      </div>

      {/* CONFIRMATION POPUP */}

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">
              Are you interested in this property?
            </h2>

            <p className="mt-3 text-sm text-gray-600">
              Your enquiry will be sent to the property owner.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                disabled={sending}
                className="flex-1 rounded-lg border border-gray-300 py-3 font-medium"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendRequest}
                disabled={sending}
                className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white"
              >
                {sending ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
