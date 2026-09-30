"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  User,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  Building2,
  Clock,
} from "lucide-react";
import { getOwnerEnquiries } from "@/services/enquiry";

const PREVIEW_LIMIT = 3;

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();

  const config = {
    new: {
      label: "New",
      bg: "rgba(215,174,98,0.18)",
      color: "#8B6914",
      dot: "#D7AE62",
    },
    contacted: {
      label: "Contacted",
      bg: "rgba(18,63,50,0.12)",
      color: "#174B3B",
      dot: "#78A894",
    },
    "site visit": {
      label: "Site Visit",
      bg: "rgba(120,168,148,0.18)",
      color: "#1A5C47",
      dot: "#78A894",
    },
    closed: {
      label: "Closed",
      bg: "rgba(184,201,188,0.22)",
      color: "#4A5E53",
      dot: "#B8C9BC",
    },
  };

  const c = config[s] || config["new"];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide"
      style={{ background: c.bg, color: c.color }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: c.dot }}
      />
      {c.label}
    </span>
  );
}

// ─── Enquiry Card ─────────────────────────────────────────────────────────────

function EnquiryCard({ enquiry }) {
  const property = enquiry?.property;
  const user = enquiry?.users_permissions_user;

  const name = user?.username || enquiry?.Name || "—";
  const email = user?.email || enquiry?.Email || "—";
  const phone = enquiry?.Phone || "—";
  const message = enquiry?.Message || "";
  const status = enquiry?.Statuss || "New";
  const date = enquiry?.createdAt
    ? new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <Link 
      href="/owner/enquiries/new"
      className="block group relative overflow-hidden rounded-xl border border-[#D9D1C2] bg-[#F7F0E3] p-5 shadow-[0_4px_16px_rgba(30,61,48,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B99852] hover:shadow-[0_8px_24px_rgba(30,61,48,0.12)]"
    >
      {/* subtle circle decoration */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full border border-[#D7AE62]/20" />

      {/* TOP ROW — property + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D7AE62]/20 text-[#174B3B]">
            <Building2 size={16} strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-extrabold text-[#123F32]">
              {property?.Title || "Property"}
            </p>
            {(property?.Area || property?.City) && (
              <p className="mt-0.5 text-xs font-medium text-[#718177]">
                {[property.Area, property.City].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* DIVIDER */}
      <div className="my-4 h-px bg-[#D9D1C2]/60" />

      {/* META INFO */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 sm:grid-cols-4">
        {[
          { Icon: User, value: name },
          { Icon: Mail, value: email },
          { Icon: Phone, value: phone },
          { Icon: Calendar, value: date },
        ].map(({ Icon, value }, i) => (
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            <Icon size={12} className="shrink-0 text-[#718177]" />
            <span className="truncate text-xs font-semibold text-[#374151]">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#EDE8DF] px-4 py-3">
          <MessageSquare
            size={12}
            className="mt-0.5 shrink-0 text-[#8A7B5A]"
          />
          <p
            className="text-xs font-medium leading-relaxed text-[#5A4F3C]"
            style={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {message}
          </p>
        </div>
      )}
    </Link>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function OwnerEnquirySection() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getOwnerEnquiries();
        setEnquiries(data || []);
      } catch (err) {
        console.error("Owner Enquiries Error:", err);
        setError(err?.message || "Failed to load enquiries.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const preview = enquiries.slice(0, PREVIEW_LIMIT);
  const hasMore = enquiries.length > PREVIEW_LIMIT;

  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-[#D9D1C2] bg-[#F7F0E3] shadow-[0_8px_24px_rgba(30,61,48,0.07)]">

      {/* ── HEADER ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9D1C2] px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D7AE62]/22 text-[#174B3B]">
            <MessageSquare size={19} strokeWidth={1.8} />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-[#123F32]">
              Recent Enquiries
            </h2>
            <p className="text-xs font-medium text-[#718177]">
              Latest enquiries for your properties
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!loading && !error && (
            <Link
              href="/owner/enquiries/new"
              className="group inline-flex items-center gap-2 rounded-lg border border-[#174B3B] bg-[#174B3B] px-4 py-2 text-xs font-extrabold text-[#F7F0E3] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D7AE62] hover:bg-[#123F32]"
            >
              View All
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="px-6 py-5">

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#D9D1C2] border-t-[#D7AE62]" />
            <p className="text-sm font-semibold text-[#718177]">
              Loading enquiries...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && enquiries.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D9D1C2] py-14 text-center">
            <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#EDE8DF] text-[#B8C9BC]">
              <Clock size={28} strokeWidth={1.5} />
            </span>
            <p className="text-base font-extrabold text-[#123F32]">
              No enquiries yet
            </p>
            <p className="mt-1 text-xs font-medium text-[#718177]">
              Enquiries from users will appear here.
            </p>
          </div>
        )}

        {/* CARDS */}
        {!loading && !error && preview.length > 0 && (
          <div className="flex flex-col gap-4">
            {preview.map((enquiry) => (
              <EnquiryCard
                key={enquiry.documentId || enquiry.id}
                enquiry={enquiry}
              />
            ))}
          </div>
        )}


      </div>
    </section>
  );
}
