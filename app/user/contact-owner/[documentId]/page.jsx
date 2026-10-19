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

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [message, setMessage] = useState("I am interested in this property.");

  useEffect(() => {
    async function loadData() {
      try {
        const loggedInUser = await getLoggedInUser();
        const propertyData = await getPropertyForEnquiry(documentId);

        setUser(loggedInUser);
        setProperty(propertyData);
        // Pre-fill phone if available on user profile
        if (loggedInUser?.phone || loggedInUser?.phoneNumber) {
          const raw = String(loggedInUser.phone || loggedInUser.phoneNumber).replace(/\D/g, "");
          if (raw.length === 10 && /^[6-9]/.test(raw)) {
            setPhone(raw);
          }
        }
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

  function validatePhoneNumber(num) {
    const cleaned = String(num || "").trim();
    if (!cleaned) {
      return "Phone number is required.";
    }
    if (!/^\d+$/.test(cleaned)) {
      return "Phone number must contain only numeric digits (no letters, spaces, or symbols).";
    }
    if (cleaned.length !== 10) {
      return "Phone number must be exactly 10 digits.";
    }
    if (!/^[6-9]/.test(cleaned)) {
      return "Phone number must start with 6, 7, 8, or 9.";
    }
    return "";
  }

  function handlePhoneChange(e) {
    const rawVal = e.target.value;
    // Strip non-digits and cap at 10 digits
    const digitsOnly = rawVal.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);

    if (phoneError) {
      const err = validatePhoneNumber(digitsOnly);
      setPhoneError(err);
    }
  }

  function handleContactOwner() {
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    const err = validatePhoneNumber(phone);
    if (err) {
      setPhoneError(err);
      toast.error(err);
      return;
    }

    setPhoneError("");
    setShowConfirmation(true);
  }

  async function handleSendRequest() {
    if (!property || !user) return;

    // Strict validation check in submission handler
    const err = validatePhoneNumber(phone);
    if (err) {
      setPhoneError(err);
      toast.error(err);
      setShowConfirmation(false);
      return;
    }

    try {
      setSending(true);

      await sendEnquiry({
        propertyDocumentId: property.documentId,
        name: user.username || "",
        phone: phone.trim(),
        email: user.email || "",
        message: message.trim() || "I am interested in this property.",
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
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] text-[var(--text-primary)]">
        <p className="font-bold tracking-widest uppercase">Loading...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] text-[var(--text-primary)]">
        <p className="text-xl font-extrabold">Property not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] p-6">
      <div className="mx-auto max-w-2xl mt-12">
        <button
          onClick={() => router.back()}
          className="mb-8 text-sm font-bold tracking-wide uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="rounded-[var(--radius-card)] bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 shadow-[var(--shadow-card)]">
          <h1 className="text-3xl font-extrabold tracking-tight">Contact Owner</h1>

          <p className="mt-2 text-[var(--text-muted)] font-medium">
            Send an enquiry to the property owner.
          </p>

          <div className="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-page)] p-6">
            <h2 className="text-xl font-extrabold">{property.Title}</h2>

            <p className="mt-2 text-sm text-[var(--text-muted)] font-medium">
              📍 {property.Area}
              {property.Area && property.City ? ", " : ""}
              {property.City}
            </p>

            <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
              <p className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)] mb-2">Logged in as</p>
              <p className="font-extrabold text-lg">{user?.username}</p>
              <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
            </div>
          </div>

          {/* Form fields */}
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="buyer-phone-input" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-sm font-bold text-[var(--text-muted)] select-none">
                  +91
                </span>
                <input
                  id="buyer-phone-input"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={() => setPhoneError(validatePhoneNumber(phone))}
                  placeholder="Enter 10-digit mobile number (e.g. 9876543210)"
                  maxLength={10}
                  className={`w-full rounded-2xl border bg-[var(--bg-page)] pl-14 pr-4 py-3.5 text-sm font-semibold outline-none transition ${
                    phoneError
                      ? "border-red-500 focus:border-red-600 bg-red-50/10"
                      : "border-[var(--border-subtle)] focus:border-[var(--text-primary)]"
                  }`}
                />
              </div>

              {phoneError ? (
                <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
                  <span>⚠</span> {phoneError}
                </p>
              ) : (
                <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">
                  Must be exactly 10 digits starting with 6, 7, 8, or 9.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="buyer-message-input" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Message <span className="text-[var(--text-muted)] font-normal text-[11px]">(optional)</span>
              </label>
              <textarea
                id="buyer-message-input"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I am interested in this property."
                className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-page)] p-4 text-sm font-medium outline-none transition focus:border-[var(--text-primary)] resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleContactOwner}
            className="mt-8 w-full rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] py-4 font-extrabold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity"
          >
            Contact Owner
          </button>
        </div>
      </div>

      {/* CONFIRMATION POPUP */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[var(--radius-card)] bg-[var(--bg-card)] p-8 shadow-2xl border border-[var(--border-subtle)] text-[var(--text-primary)]">
            <h2 className="text-2xl font-extrabold tracking-tight mb-3">
              Confirm Enquiry
            </h2>

            <p className="text-[var(--text-muted)] font-medium mb-4">
              Your contact details will be shared with the property owner:
            </p>

            <div className="bg-[var(--bg-page)] p-4 rounded-xl border border-[var(--border-subtle)] mb-6 text-sm space-y-1">
              <p><span className="text-[var(--text-muted)]">Name:</span> <strong className="font-bold">{user?.username}</strong></p>
              <p><span className="text-[var(--text-muted)]">Phone:</span> <strong className="font-bold">+91 {phone}</strong></p>
              <p><span className="text-[var(--text-muted)]">Email:</span> <strong className="font-bold">{user?.email}</strong></p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                disabled={sending}
                className="flex-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-page)] py-3 font-bold text-sm uppercase tracking-widest hover:border-[var(--text-primary)] transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendRequest}
                disabled={sending}
                className="flex-1 rounded-full bg-[var(--text-primary)] py-3 font-bold text-[var(--bg-page)] text-sm uppercase tracking-widest hover:opacity-80 transition-opacity"
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
