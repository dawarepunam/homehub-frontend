"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { X, CheckCircle2, MessageSquare, Clock, MapPin, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { getLoggedInUser, checkExistingEnquiry, sendEnquiry } from "@/services/enquiry";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

export default function ContactOwnerModal({ isOpen, onClose, property }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [existingEnquiry, setExistingEnquiry] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [intent, setIntent] = useState("More Details");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [visitDate, setVisitDate] = useState("");

  const documentId = property?.documentId;
  const title = property?.Title || "Property";
  const area = property?.Area || "";
  const city = property?.City || "";
  const purpose = property?.Purpose || "";
  const propertyType = property?.Property_Type || "";
  const category = property?.Category || "";

  let imageUrl = "/no-property.png";
  if (property?.CoverImage?.url) {
    imageUrl = property.CoverImage.url;
    if (!imageUrl.startsWith("http")) {
      imageUrl = `${STRAPI_URL}${imageUrl}`;
    }
  }

  useEffect(() => {
    if (isOpen && documentId) {
      loadData();
    } else {
      // Reset state when closed
      setSuccess(false);
      setMessage("");
      setIntent("More Details");
    }
  }, [isOpen, documentId]);

  async function loadData() {
    try {
      setLoading(true);
      const loggedInUser = await getLoggedInUser();
      setUser(loggedInUser);
      if (loggedInUser) {
        setName(loggedInUser.username || "");
      }

      const hasEnquiry = await checkExistingEnquiry(documentId);
      setExistingEnquiry(hasEnquiry);
    } catch (error) {
      console.error("Modal load error:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSendEnquiry = async () => {
    if (!user) {
      toast.error("Please login to contact the owner.");
      return;
    }
    
    if (!phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    try {
      setSending(true);
      // We write a custom fetch to bypass services/enquiry.js because
      // sendEnquiry hardcodes "Status" instead of the schema's "Statuss"
      // and doesn't handle validation errors cleanly.
      const token = localStorage.getItem("token") || localStorage.getItem("jwt") || localStorage.getItem("strapi_jwt");
      
      const payload = {
        data: {
          Name: name || user.username || "",
          Phone: phone,
          Email: user.email || "",
          Message: `${intent}: ${message || "I am interested in this property."}`,
          Statuss: "Pending", // Correct enum field name
          VisitDate: intent === "Schedule a Visit" && visitDate ? new Date(visitDate).toISOString() : null,
          property: documentId,
          users_permissions_user: user.id || user.documentId,
        },
      };

      const res = await fetch(`${STRAPI_URL}/api/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.error?.message || result?.message || "Failed to send enquiry.");
      }

      setSuccess(true);
      setExistingEnquiry(true);
      toast.success("Enquiry sent successfully!");
    } catch (error) {
      console.error("Failed to send enquiry:", error);
      toast.error(error?.message || "Failed to send enquiry.");
    } finally {
      setSending(false);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#FDFBF7] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-emerald-900">Contact Owner</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-900" />
          </div>
        ) : success ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-700" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-emerald-900">Enquiry Sent Successfully</h3>
            <p className="mt-2 text-stone-600">Your enquiry has been shared with the property owner.</p>
            
            <div className="mx-auto mt-6 max-w-sm rounded-xl border border-stone-200 bg-white p-4 text-left">
              <p className="font-semibold text-emerald-900">{title}</p>
              <p className="mt-1 flex items-center text-sm text-stone-600">
                <MapPin size={14} className="mr-1" />
                {area}{area && city ? ", " : ""}{city}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Pending</span>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button onClick={onClose} className="rounded-lg border border-stone-300 bg-white px-6 py-2.5 font-semibold text-stone-700 transition hover:bg-stone-50">
                Continue Exploring
              </button>
              <Link href="/user/enquiries" className="rounded-lg bg-amber-500 px-6 py-2.5 font-semibold text-emerald-900 transition hover:bg-amber-400">
                View My Enquiries
              </Link>
            </div>
          </div>
        ) : existingEnquiry ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
              <MessageSquare className="h-8 w-8 text-stone-500" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-emerald-900">You've already contacted this owner.</h3>
            
            <div className="mx-auto mt-6 max-w-sm rounded-xl border border-stone-200 bg-white p-4 text-left">
              <p className="font-semibold text-emerald-900">{title}</p>
              <div className="mt-3 flex items-center gap-2">
                <Clock size={14} className="text-stone-500" />
                <span className="text-sm font-medium text-stone-600">Enquiry is active</span>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button onClick={onClose} className="rounded-lg border border-stone-300 bg-white px-6 py-2.5 font-semibold text-stone-700 transition hover:bg-stone-50">
                Close
              </button>
              <Link href="/user/enquiries" className="rounded-lg bg-amber-500 px-6 py-2.5 font-semibold text-emerald-900 transition hover:bg-amber-400">
                View Enquiry
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2">
            {/* Left: Property Info */}
            <div className="border-b border-stone-200 bg-white p-6 md:border-b-0 md:border-r">
              <div className="relative h-48 w-full overflow-hidden rounded-xl">
                <Image src={imageUrl} alt={title} fill className="object-cover" unoptimized />
              </div>
              <h3 className="mt-4 text-xl font-bold text-emerald-900">{title}</h3>
              <p className="mt-2 flex items-center text-stone-600">
                <MapPin size={16} className="mr-1 text-emerald-700" />
                {area}{area && city ? ", " : ""}{city}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {propertyType && <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">{propertyType}</span>}
                {category && <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">{category}</span>}
                {purpose && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{purpose}</span>}
              </div>
            </div>

            {/* Right: Form */}
            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-900">I'm interested in this property</p>
              
              <div className="mt-4">
                <label className="text-sm font-medium text-stone-700">What would you like to do?</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {["More Details", "Check Availability", "Discuss Price", "Schedule a Visit"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setIntent(opt)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        intent === opt
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                          : "border-stone-200 bg-white text-stone-600 hover:border-emerald-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-stone-700">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell the owner what you'd like to know about this property..."
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-white p-3 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {intent === "Schedule a Visit" && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-stone-700">Preferred Visit Date & Time</label>
                  <input
                    type="datetime-local"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    className="mt-2 w-full rounded-xl border border-stone-200 bg-white p-3 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              )}

              <div className="mt-5 border-t border-stone-200 pt-5">
                <p className="text-xs font-medium uppercase text-stone-500">Your contact details</p>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-600">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-600">Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      required
                      className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-600">Email</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-stone-300 bg-white py-3 font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEnquiry}
                  disabled={sending || !user}
                  className="flex-1 rounded-xl bg-amber-500 py-3 font-semibold text-emerald-900 transition hover:bg-amber-400 disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Enquiry"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
