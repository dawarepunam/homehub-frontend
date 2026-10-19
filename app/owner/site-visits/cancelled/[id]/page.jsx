"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "../../../Footer";
import { ArrowLeft, XCircle } from "lucide-react";
import { getOwnerEnquiry } from "@/services/enquiry";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export default function CancelledVisitDetailPage({ params }) {
  const router = useRouter();
  
  const unwrappedParams = use(params);
  const id = unwrappedParams?.id;

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVisit() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getOwnerEnquiry(id);
        if (!data) throw new Error("Visit not found.");
        setVisit(data);
      } catch (err) {
        setError(err?.message || "Failed to load visit details.");
      } finally {
        setLoading(false);
      }
    }
    fetchVisit();
  }, [id]);

  function getPropertyRelation() {
    const rel = visit?.property;
    if (!rel) return {};
    if (rel?.data?.attributes) return rel.data.attributes;
    if (rel?.attributes) return rel.attributes;
    if (rel?.data) return rel.data;
    return rel;
  }

  const prop = getPropertyRelation();
  const name = visit?.Name || visit?.name || "Customer";
  const phone = visit?.Phone || visit?.phone || "N/A";
  const email = visit?.Email || visit?.email || "N/A";
  const status = visit?.Status || visit?.status || visit?.Statuss || "Cancelled";
  const message = visit?.Message || visit?.message || "No specific message provided.";
  const cancelReason = visit?.ClosedReason || visit?.closedReason || visit?.CancelReason || visit?.cancelReason || "Customer cancelled";
  const ownerResponse = visit?.OwnerResponse || visit?.ownerResponse || "";

  const propTitle = prop?.Title || prop?.title || prop?.Name || prop?.name || "Untitled Property";
  const propCity = prop?.City || prop?.city || prop?.Location || prop?.location || "";
  const propArea = prop?.Area || prop?.area || prop?.Locality || prop?.locality || "";
  const propType = prop?.PropertyType || prop?.propertyType || prop?.Category || prop?.category || "Apartment";

  const rawPrice = prop?.Price || prop?.price || prop?.ExpectedPrice || prop?.expectedPrice;
  let propPrice = null;
  if (rawPrice) {
    if (typeof rawPrice === "number") {
      if (rawPrice >= 10000000) propPrice = `₹${(rawPrice / 10000000).toFixed(2)} Cr`;
      else if (rawPrice >= 100000) propPrice = `₹${(rawPrice / 100000).toFixed(2)} Lakh`;
      else propPrice = `₹${rawPrice.toLocaleString("en-IN")}`;
    } else {
      propPrice = `₹${rawPrice}`;
    }
  }

  const propImages = prop?.Images || prop?.images || prop?.Media || prop?.media;
  let propImage = null;
  if (Array.isArray(propImages) && propImages.length > 0) {
    const imgObj = propImages[0];
    const url = imgObj?.url || imgObj?.attributes?.url;
    if (url) propImage = url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
  }

  const initials = name.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U";

  if (loading) {
    return (
      <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
        <Header />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">
          <div className="seller-card p-12 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[var(--seller-primary)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[var(--seller-text)] font-semibold mt-4 text-sm">Loading details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
        <Header />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">
          <div className="seller-card p-10 text-center">
            <h2 className="text-lg font-bold text-[var(--seller-text)]">Visit Detail Not Found</h2>
            <Link href="/owner/site-visits/cancelled" className="mt-4 inline-block px-4 py-2 bg-[var(--seller-primary)] text-[var(--seller-bg)] text-xs font-bold rounded-xl">
              ← Back to Cancelled
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
      <Header />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--seller-text-muted)]">
          <Link href="/owner" className="hover:text-[var(--seller-text)]">Home</Link>
          <span>›</span>
          <Link href="/owner/site-visits/upcoming" className="hover:text-[var(--seller-text)]">Site Visits</Link>
          <span>›</span>
          <Link href="/owner/site-visits/cancelled" className="hover:text-[var(--seller-text)]">Cancelled</Link>
          <span>›</span>
          <span className="text-[var(--seller-text)]">Details</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--seller-text)]">
            Cancelled Visit
          </h1>
          <Link
            href="/owner/site-visits/cancelled"
            className="px-4 py-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] text-xs font-semibold hover:border-[var(--seller-border-focus)] transition"
          >
            ← Back to Cancelled
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-4">
            
            {/* Customer Banner */}
            <div className="seller-card p-5 sm:p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--seller-bg)] text-[var(--seller-text)] flex items-center justify-center font-bold text-base shrink-0 border border-[var(--seller-border)]">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[var(--seller-text)] truncate">{name}</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-500 uppercase tracking-wider">
                    Cancelled
                  </span>
                </div>
                <p className="text-xs text-[var(--seller-text-muted)] mt-0.5 truncate">
                  ☎ {phone} | ✉ {email}
                </p>
                <p className="text-xs text-red-500 mt-1 font-medium">
                  Cancellation Reason: {cancelReason}
                </p>
              </div>
            </div>

            {/* Property Card */}
            <div className="seller-card p-5 sm:p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--seller-text-subtle)] mb-4">Property Details</h3>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {propImage && (
                  <img src={propImage} alt={propTitle} className="w-24 h-24 rounded-xl object-cover border border-[var(--seller-border)] shrink-0" />
                )}
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[var(--seller-text)]">{propTitle}</h4>
                  <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">📍 {[propArea, propCity].filter(Boolean).join(", ")}</p>
                  {propPrice && <p className="text-xs sm:text-sm font-extrabold text-[var(--seller-text)] mt-1">{propPrice}</p>}
                  <p className="text-xs text-[var(--seller-text-muted)] mt-1">Type: {propType}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="seller-card p-5 sm:p-6 space-y-4">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--seller-text-subtle)] mb-1.5">Original Enquiry Message</h4>
                <p className="text-xs text-[var(--seller-text)] bg-[var(--seller-bg)] p-3 rounded-xl border border-[var(--seller-border)] italic">&quot;{message}&quot;</p>
              </div>

              {ownerResponse && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--seller-text-subtle)] mb-1.5">Cancellation Note</h4>
                  <p className="text-xs text-[var(--seller-text)] bg-[var(--seller-bg)] p-3 rounded-xl border border-[var(--seller-border)]">{ownerResponse}</p>
                </div>
              )}
            </div>

          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <div className="seller-card p-5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--seller-text-subtle)] mb-3">Customer Contact</h4>
              {phone && phone !== "N/A" && (
                <a
                  href={`tel:${phone}`}
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 transition block shadow-2xs mb-2"
                >
                  📞 Call Customer
                </a>
              )}
              {email && email !== "N/A" && (
                <a
                  href={`mailto:${email}`}
                  className="w-full text-center px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-semibold text-xs hover:border-[var(--seller-border-focus)] transition block"
                >
                  ✉ Send Email
                </a>
              )}
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
