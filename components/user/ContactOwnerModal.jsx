"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { X, CheckCircle2, MessageSquare, Clock, MapPin, Loader2, Calendar, Phone, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

import { getLoggedInUser, checkExistingEnquiry } from "@/services/enquiry";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

function formatIndianPrice(raw) {
  if (raw === null || raw === undefined || raw === "") return null;
  const num = Number(raw);
  if (isNaN(num) || num <= 0) return typeof raw === "string" && raw.trim() ? raw : null;

  if (num >= 10000000) {
    const cr = num / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    const lac = num / 100000;
    return `₹${lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(2)} Lac`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

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
  const [mounted, setMounted] = useState(false);

  const documentId = property?.documentId || property?.id;
  const title = property?.Title || "Property";
  const area = property?.Area || "";
  const city = property?.City || "";
  const purpose = property?.Purpose || "";
  const propertyType = property?.Property_Type || "";
  const category = property?.Category || "";

  const rawPrice = property?.PropertyCommonDetails?.Price || property?.Price;
  const priceDisplay = formatIndianPrice(rawPrice);

  let imageUrl = "/no-property.png";
  if (property?.CoverImage?.url) {
    imageUrl = property.CoverImage.url;
    if (!imageUrl.startsWith("http")) {
      imageUrl = `${STRAPI_URL}${imageUrl}`;
    }
  } else if (typeof property?.CoverImage === "string") {
    imageUrl = property.CoverImage.startsWith("http") ? property.CoverImage : `${STRAPI_URL}${property.CoverImage}`;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetForm = useCallback(() => {
    setSuccess(false);
    setMessage("");
    setIntent("More Details");
    setVisitDate("");
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const loggedInUser = await getLoggedInUser();
      setUser(loggedInUser);
      if (loggedInUser) {
        setName(loggedInUser.username || "");
      }

      if (documentId) {
        const hasEnquiry = await checkExistingEnquiry(documentId);
        setExistingEnquiry(hasEnquiry);
      }
    } catch (error) {
      console.error("Modal load error:", error);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    if (isOpen && documentId) {
      resetForm();
      loadData();
    }
  }, [isOpen, documentId, resetForm, loadData]);

  const handleSendEnquiry = async (e) => {
    if (e) e.preventDefault();

    if (!user) {
      toast.error("Please login to contact the owner.");
      return;
    }
    
    if (!phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    if (intent === "Schedule a Visit" && !visitDate) {
      toast.error("Please select a preferred visit date and time.");
      return;
    }

    try {
      setSending(true);
      const token = localStorage.getItem("token") || localStorage.getItem("jwt") || localStorage.getItem("strapi_jwt");
      
      const payload = {
        data: {
          Name: name || user.username || "",
          Phone: phone.trim(),
          Email: user.email || "",
          Message: `${intent}: ${message.trim() || "I am interested in this property."}`,
          Statuss: "Pending",
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

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 p-3 sm:p-5 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <Phone size={14} className="text-[var(--text-primary)]" />
            </div>
            <h2 id="contact-modal-title" className="text-base sm:text-lg font-extrabold text-[var(--text-primary)]">
              Contact
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[var(--text-secondary)] transition hover:bg-[var(--border-subtle)] hover:text-[var(--text-primary)]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {loading ? (
            <div className="flex h-72 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--text-primary)]" />
            </div>
          ) : success ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                Enquiry Sent Successfully
              </h3>
              <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                Your enquiry has been shared with the property owner.
              </p>
              
              <div className="mx-auto mt-5 max-w-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-left">
                <p className="font-bold text-sm text-[var(--text-primary)] line-clamp-1">{title}</p>
                <p className="mt-1 flex items-center text-xs text-[var(--text-secondary)]">
                  <MapPin size={12} className="mr-1 shrink-0 text-[var(--text-primary)]" />
                  {[area, city].filter(Boolean).join(", ") || "Location not specified"}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-[var(--border-subtle)] pt-2.5">
                  <span className="text-[11px] font-semibold text-[var(--text-muted)]">Status</span>
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-600 border border-amber-500/20">
                    Pending
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <button 
                  onClick={onClose} 
                  className="hh-btn hh-btn-secondary px-6 py-2.5 text-sm font-bold"
                >
                  Continue Exploring
                </button>
                <Link 
                  href="/user/enquiries" 
                  onClick={onClose}
                  className="hh-btn hh-btn-primary px-6 py-2.5 text-sm font-bold"
                >
                  View My Enquiries
                </Link>
              </div>
            </div>
          ) : existingEnquiry ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <MessageSquare className="h-7 w-7 text-[var(--text-secondary)]" />
              </div>
              <h3 className="mt-4 text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                You&apos;ve already contacted this owner.
              </h3>
              <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                You already have an active enquiry for this property.
              </p>
              
              <div className="mx-auto mt-5 max-w-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-left">
                <p className="font-bold text-sm text-[var(--text-primary)] line-clamp-1">{title}</p>
                <p className="mt-1 flex items-center text-xs text-[var(--text-secondary)]">
                  <MapPin size={12} className="mr-1 shrink-0 text-[var(--text-primary)]" />
                  {[area, city].filter(Boolean).join(", ") || "Location not specified"}
                </p>
                <div className="mt-3 flex items-center gap-1.5 border-t border-[var(--border-subtle)] pt-2.5 text-xs text-[var(--text-muted)]">
                  <Clock size={12} />
                  <span>Enquiry is currently active</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <button 
                  onClick={onClose} 
                  className="hh-btn hh-btn-secondary px-6 py-2.5 text-sm font-bold"
                >
                  Close
                </button>
                <Link 
                  href="/user/enquiries" 
                  onClick={onClose}
                  className="hh-btn hh-btn-primary px-6 py-2.5 text-sm font-bold"
                >
                  View Enquiry
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2">
              {/* Left Column: Property Summary */}
              <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 md:border-b-0 md:border-r flex flex-col justify-between">
                <div>
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                    <Image 
                      src={imageUrl} 
                      alt={title} 
                      fill 
                      className="object-cover" 
                      unoptimized 
                    />
                    {purpose && (
                      <span className="absolute top-2.5 left-2.5 rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--accent-text)]">
                        For {purpose}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-base sm:text-lg font-extrabold text-[var(--text-primary)] line-clamp-2 leading-snug">
                    {title}
                  </h3>

                  {(area || city) && (
                    <p className="mt-1.5 flex items-center text-xs text-[var(--text-secondary)]">
                      <MapPin size={13} className="mr-1 shrink-0 text-[var(--text-primary)]" />
                      {[area, city].filter(Boolean).join(", ")}
                    </p>
                  )}

                  {priceDisplay && (
                    <div className="mt-3 inline-block rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] px-3 py-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                        {purpose === "Rent" ? "Rent" : "Price"}
                      </span>
                      <span className="text-base font-extrabold text-[var(--text-primary)]">
                        {priceDisplay}
                      </span>
                      {purpose === "Rent" && <span className="text-[11px] text-[var(--text-muted)] ml-1">/mo</span>}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {propertyType && (
                      <span className="rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-primary)]">
                        {propertyType}
                      </span>
                    )}
                    {category && (
                      <span className="rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)]">
                        {category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <span>Verified listing by registered owner</span>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <form onSubmit={handleSendEnquiry} className="p-5 sm:p-6 bg-[var(--bg-card)] flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Enquiry Details
                  </p>
                  
                  {/* Intent Selection */}
                  <div className="mt-3">
                    <label className="text-xs font-semibold text-[var(--text-primary)]">
                      What would you like to do?
                    </label>
                    <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                      {["More Details", "Check Availability", "Discuss Price", "Schedule a Visit"].map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setIntent(opt)}
                          className={`rounded-xl border px-2.5 py-2 text-xs font-semibold transition text-center ${
                            intent === opt
                              ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-page)] shadow-sm"
                              : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]/40 hover:text-[var(--text-primary)]"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visit Date if Schedule a Visit */}
                  {intent === "Schedule a Visit" && (
                    <div className="mt-3.5">
                      <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1">
                        <Calendar size={12} /> Preferred Visit Date &amp; Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        required
                        min={new Date().toISOString().slice(0, 16)}
                        className="mt-1.5 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)] transition"
                      />
                    </div>
                  )}

                  {/* Message Field */}
                  <div className="mt-3.5">
                    <label className="text-xs font-semibold text-[var(--text-primary)]">
                      Message <span className="text-[var(--text-muted)] font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell the owner what you'd like to know about this property..."
                      rows={3}
                      className="mt-1.5 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--text-primary)] transition resize-none"
                    />
                  </div>

                  {/* Contact Inputs */}
                  <div className="mt-4 border-t border-[var(--border-subtle)] pt-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                      Your Contact Details
                    </p>
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-0.5">
                          Full Name
                        </label>
                        <div className="relative flex items-center">
                          <User size={12} className="absolute left-3 text-[var(--text-muted)]" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] pl-8 pr-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--text-primary)] transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-0.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <Phone size={12} className="absolute left-3 text-[var(--text-muted)]" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter 10-digit phone number"
                            required
                            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] pl-8 pr-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--text-primary)] transition"
                          />
                        </div>
                      </div>

                      {user?.email && (
                        <div>
                          <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-0.5">
                            Email
                          </label>
                          <div className="relative flex items-center">
                            <Mail size={12} className="absolute left-3 text-[var(--text-muted)]" />
                            <input
                              type="email"
                              value={user.email}
                              readOnly
                              disabled
                              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] pl-8 pr-3 py-2 text-xs text-[var(--text-secondary)] outline-none opacity-70 cursor-not-allowed"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="hh-btn hh-btn-secondary flex-1 py-2.5 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !user}
                    className="hh-btn hh-btn-primary flex-1 py-2.5 text-xs font-bold disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Enquiry</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
