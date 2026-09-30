"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Eye, Heart, Calendar, MessageSquare, Clock, CheckCircle2 } from "lucide-react";

import { getMyEnquiries } from "@/services/enquiry";
import { isPropertyInWishlist, addToWishlist, removeFromWishlist } from "@/services/wishlistService";
import toast from "react-hot-toast";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

export default function EnquiryDetailsClient({ documentId }) {
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const enquiries = await getMyEnquiries();
        const found = enquiries.find(e => e.documentId === documentId || String(e.id) === String(documentId));
        if (found) {
          setEnquiry(found);
          
          // Check wishlist status if property exists
          const propId = found.property?.documentId;
          if (propId) {
            const isLiked = await isPropertyInWishlist(propId);
            setLiked(isLiked);
          }
        }
      } catch (error) {
        console.error("Error loading enquiry details:", error);
      } finally {
        setLoading(false);
      }
    }
    if (documentId) loadData();
  }, [documentId]);

  const handleWishlist = async () => {
    if (wishlistLoading) return;
    const propId = enquiry?.property?.documentId;
    if (!propId) return;

    try {
      setWishlistLoading(true);
      if (liked) {
        await removeFromWishlist(propId);
        setLiked(false);
        toast.success("Property removed from wishlist.");
      } else {
        await addToWishlist(propId);
        setLiked(true);
        toast.success("Property added to wishlist ❤️");
      }
    } catch (error) {
      toast.error("Wishlist update failed.");
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><p className="text-emerald-900 font-semibold">Loading enquiry...</p></div>;
  }

  if (!enquiry) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-emerald-900">Enquiry Not Found</h2>
        <p className="mt-2 text-stone-600">The enquiry you are looking for does not exist or you don't have access.</p>
        <Link href="/user/enquiries" className="mt-6 rounded-lg bg-amber-500 px-6 py-3 font-bold text-emerald-900 hover:bg-amber-400">Back to My Enquiries</Link>
      </div>
    );
  }

  const property = enquiry.property;
  const propDocId = property?.documentId || property?.id;
  const title = property?.Title || "Untitled Property";
  const area = property?.Area || "";
  const city = property?.City || "";
  const purpose = property?.Purpose || "";
  const propertyType = property?.Property_Type || "";
  const category = property?.Category || "";
  let price = property?.PropertyCommonDetails?.Price || "Price on Request";
  
  if (typeof price === "object") price = price?.Price || price?.value || "Price on Request";
  else if (typeof price === "number") price = `₹${new Intl.NumberFormat("en-IN").format(price)}`;

  let imageUrl = "/no-property.png";
  if (property?.CoverImage?.url) {
    imageUrl = property.CoverImage.url;
    if (!imageUrl.startsWith("http")) imageUrl = `${STRAPI_URL}${imageUrl}`;
  }

  const status = enquiry?.Status || enquiry?.Statuss || "Pending";
  const statusLower = status.toLowerCase();
  
  const enquiryDate = enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "";

  // Dynamic Timeline builder based on what we know
  const timeline = [];
  timeline.push({ label: "Enquiry Sent", date: enquiryDate, active: true, icon: Clock });
  
  if (statusLower !== "pending") {
    // If not pending, it must have progressed
    if (statusLower.includes("contacted")) {
      timeline.push({ label: "Contacted", active: true, icon: MessageSquare });
    } else if (statusLower.includes("site visit")) {
      timeline.push({ label: "Contacted", active: true, icon: MessageSquare });
      timeline.push({ label: status, active: true, icon: Calendar });
    } else if (statusLower.includes("closed") || statusLower.includes("completed")) {
      timeline.push({ label: "Contacted", active: true, icon: MessageSquare });
      timeline.push({ label: "Closed", active: true, icon: CheckCircle2 });
    } else {
      timeline.push({ label: status, active: true, icon: CheckCircle2 });
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      {/* Back button */}
      <Link href="/user/enquiries" className="mb-6 inline-flex items-center text-sm font-semibold text-stone-500 transition hover:text-emerald-900">
        <ArrowLeft size={16} className="mr-2" /> Back to My Enquiries
      </Link>

      <h1 className="text-3xl font-bold text-emerald-900">Enquiry Details</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_350px]">
        {/* Main Content */}
        <div className="space-y-8">
          
          {/* Property Summary */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-stone-400">Property Summary</h2>
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="relative h-40 w-full sm:w-48 shrink-0 overflow-hidden rounded-xl">
                <Image src={imageUrl} alt={title} fill className="object-cover" unoptimized />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-600">{category}</p>
                <h3 className="mt-1 text-2xl font-bold text-emerald-900">{title}</h3>
                <p className="mt-1 flex items-center text-stone-500">
                  <MapPin size={16} className="mr-1 text-emerald-700" />
                  {area}{area && city ? ", " : ""}{city}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {propertyType && <span className="rounded-md bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">{propertyType}</span>}
                  {purpose && <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{purpose}</span>}
                </div>
                <p className="mt-3 text-lg font-bold text-emerald-800">{price}</p>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3 border-t border-stone-100 pt-6">
              {propDocId && (
                <Link
                  href={`/user/property/${propDocId}`}
                  className="flex flex-1 items-center justify-center rounded-xl bg-amber-500 py-3 text-sm font-bold text-emerald-900 transition hover:bg-amber-400"
                >
                  <Eye size={16} className="mr-2" /> View Property
                </Link>
              )}
              <button
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className={`flex items-center justify-center rounded-xl border px-6 py-3 transition ${
                  liked ? "border-amber-500 bg-amber-50 text-amber-600" : "border-stone-200 bg-white text-stone-600 hover:border-amber-300"
                }`}
              >
                <Heart size={20} className={liked ? "fill-amber-500 text-amber-500" : ""} />
              </button>
            </div>
          </section>

          {/* Your Enquiry */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-stone-400">Your Enquiry</h2>
            <div className="rounded-xl bg-stone-50 p-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-emerald-100 p-2 text-emerald-700">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Message sent on {enquiryDate}</p>
                  <p className="mt-2 text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">{enquiry?.Message || "No message provided."}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Owner Response - If exists */}
          {enquiry?.OwnerResponse && (
            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-stone-400">Owner Response</h2>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-amber-200 p-2 text-amber-800">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">Owner replied</p>
                    <p className="mt-2 text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">{enquiry.OwnerResponse}</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Panel: Status & Timeline */}
        <div className="space-y-8">
          
          {/* Current Status */}
          <section className="rounded-2xl border border-stone-200 bg-emerald-900 p-6 text-white shadow-sm">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-emerald-400">Current Status</h2>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800">
                <CheckCircle2 size={20} className="text-amber-400" />
              </div>
              <div>
                <p className="text-xl font-bold uppercase text-white">{status}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-emerald-200">
              {statusLower === "pending" && "Your enquiry has been sent and is waiting for the owner's response."}
              {statusLower === "contacted" && "The owner has acknowledged your enquiry."}
              {statusLower.includes("site visit") && "A site visit is associated with this enquiry."}
              {(statusLower === "closed" || statusLower === "completed") && "This enquiry has been closed."}
            </p>
          </section>

          {/* Timeline */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xs font-bold uppercase tracking-wider text-stone-400">Enquiry Timeline</h2>
            <div className="relative border-l-2 border-stone-100 ml-4 space-y-8">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className={`absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white ${item.active ? 'bg-amber-500 text-emerald-900' : 'bg-stone-200 text-stone-400'}`}>
                    <item.icon size={12} strokeWidth={3} />
                  </div>
                  <div>
                    <p className={`font-bold ${item.active ? 'text-emerald-900' : 'text-stone-400'}`}>{item.label}</p>
                    {item.date && <p className="text-xs text-stone-500 mt-1">{item.date}</p>}
                  </div>
                </div>
              ))}
              {/* Add greyed out future steps if not closed */}
              {statusLower !== "closed" && statusLower !== "completed" && !statusLower.includes("site visit") && (
                <div className="relative pl-6 opacity-50">
                  <div className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-stone-200 text-stone-400">
                    <CheckCircle2 size={12} strokeWidth={3} />
                  </div>
                  <div>
                    <p className="font-bold text-stone-400">Closed / Completed</p>
                  </div>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
