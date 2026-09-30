"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  MapPin,
  IndianRupee,
  Home,
  Tag,
  Bed,
  Pencil,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronRight,
  Bell,
  Loader2,
  Calendar,
  Info,
} from "lucide-react";
import { getUserProfile, updateUserProfile } from "@/services/userProfile";


// ─── Constants (mirrors PropertyRequirementClient) ──────────────────────────
const PROPERTY_CATEGORIES = ["Residential", "Commercial", "Industrial"];
const PROPERTY_TYPES = {
  Residential: ["Apartment", "Villa", "Independent House", "Plot", "Penthouse"],
  Commercial: ["Office Space", "Retail Shop", "Warehouse", "Commercial Land"],
  Industrial: ["Factory", "Industrial Land", "Warehouse"],
};
const BHK_OPTIONS = ["1", "2", "3", "4", "5+"];

// ─── Format budget in Indian format (₹40L / ₹1.2Cr) ─────────────────────────
function formatBudget(val) {
  if (!val || isNaN(val)) return null;
  const n = Number(val);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(0)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

// ─── Build search URL from saved prefs ───────────────────────────────────────
function buildSearchUrl(prefs) {
  if (!prefs) return "/user/search";
  const params = new URLSearchParams();
  if (prefs.PreferredCity) params.set("city", prefs.PreferredCity);
  if (prefs.PreferredArea) params.set("area", prefs.PreferredArea);
  if (prefs.PreferredCategory) params.set("type", prefs.PreferredCategory);
  if (prefs.PropertyType) params.set("category", prefs.PropertyType);
  if (prefs.Purpose) params.set("purpose", prefs.Purpose);
  return `/user/search?${params.toString()}`;
}

// ─── Journey Side Card ────────────────────────────────────────────────────────
function SearchJourneyCard({ hasSearch }) {
  const steps = [
    { label: "Search Properties", sub: "You started your search", done: true },
    { label: "Apply Filters", sub: "You set your preferences", done: hasSearch },
    { label: "Save Your Search", sub: hasSearch ? "You saved your search" : "Save a search to get alerts", done: hasSearch },
    { label: "Get Matching Properties", sub: "We'll notify you about new matches", done: false },
    { label: "Find Your Home", sub: "Your dream home is closer", done: false },
  ];

  return (
    <div className="rounded-2xl border border-[#E5DDD0] bg-white shadow-sm p-6">
      <h3 className="font-bold text-[#0D3326] text-base">Your Search Journey</h3>
      <p className="text-xs text-[#0D3326]/60 mt-0.5 mb-5">From search to your dream home</p>

      <div className="relative space-y-5">
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-[#E5DDD0]" />

        {steps.map((step, i) => (
          <div key={i} className={`flex items-start gap-3 relative z-10 ${!step.done && i > 0 ? "opacity-50" : ""}`}>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${step.done ? "border-[#D7AE62] bg-[#FBF4E6]" : "border-[#E5DDD0] bg-white"}`}>
              <Search className={`w-4 h-4 ${step.done ? "text-[#D7AE62]" : "text-[#0D3326]/30"}`} />
            </div>
            <div className="pt-1 flex-1 min-w-0">
              <p className={`text-sm font-bold truncate ${step.done ? "text-[#0D3326]" : "text-[#0D3326]/50"}`}>{step.label}</p>
              <p className="text-xs text-[#0D3326]/50 mt-0.5">{step.sub}</p>
            </div>
            {step.done && (
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-1.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Search Form Modal ────────────────────────────────────────────────────────
function SearchFormModal({ initial, onClose, onSave }) {
  const [purpose, setPurpose] = useState(initial?.Purpose || "Buy");
  const [category, setCategory] = useState(initial?.PropertyType || "");
  const [propertyType, setPropertyType] = useState(initial?.PreferredCategory || "");
  const [city, setCity] = useState(initial?.PreferredCity || "");
  const [area, setArea] = useState(initial?.PreferredArea || "");
  const [minBudget, setMinBudget] = useState(initial?.MinimumBudget?.toString() || "");
  const [maxBudget, setMaxBudget] = useState(initial?.MaximumBudget?.toString() || "");
  const [bhk, setBhk] = useState(initial?.BHK || "");
  const [searchName, setSearchName] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPropertyType("");
    if (cat !== "Residential") setBhk("");
  };

  const handleSubmit = async () => {
    setErr("");
    if (!purpose) return setErr("Please select Buy or Rent.");
    if (minBudget && maxBudget && Number(minBudget) > Number(maxBudget))
      return setErr("Max budget must be ≥ min budget.");

    setSaving(true);
    try {
      await onSave({
        Purpose: purpose,
        PropertyType: category || null,
        PreferredCategory: propertyType || null,
        PreferredCity: city || null,
        PreferredArea: area || null,
        MinimumBudget: minBudget ? parseInt(minBudget) : null,
        MaximumBudget: maxBudget ? parseInt(maxBudget) : null,
        BHK: category === "Residential" ? bhk || null : null,
      });
    } catch (e) {
      setErr(e?.message || "Failed to save search.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5DDD0] overflow-y-auto max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5DDD0] bg-[#FBF4E6]/60">
          <div>
            <h2 className="font-bold text-[#0D3326] text-lg">
              {initial ? "Edit Search" : "Create New Search"}
            </h2>
            <p className="text-xs text-[#0D3326]/60 mt-0.5">
              Save your property search and get notified about matching properties.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#E5DDD0]/60 transition-colors">
            <X className="w-5 h-5 text-[#0D3326]/60" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {err && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {err}
            </div>
          )}

          {/* Note about single search */}
          <div className="flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Your property requirement is saved as your primary search. Saving a new one will replace the existing one.</span>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">Looking for</label>
            <div className="flex gap-3">
              {["Buy", "Rent"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPurpose(p)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-bold transition ${
                    purpose === p
                      ? "border-[#D7AE62] bg-[#FBF4E6] text-[#9A7230]"
                      : "border-[#E5DDD0] bg-white text-[#0D3326]/70 hover:border-[#D7AE62]/50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">Location</label>
              <input
                type="text"
                placeholder="Select Location"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/50 px-3 py-2.5 text-sm text-[#0D3326] outline-none focus:border-[#D7AE62] focus:bg-white placeholder:text-[#0D3326]/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">Area / Locality</label>
              <input
                type="text"
                placeholder="Select Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/50 px-3 py-2.5 text-sm text-[#0D3326] outline-none focus:border-[#D7AE62] focus:bg-white placeholder:text-[#0D3326]/30"
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">Property Type</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/50 px-3 py-2.5 text-sm text-[#0D3326] outline-none focus:border-[#D7AE62] focus:bg-white"
              >
                <option value="">Select Type</option>
                {PROPERTY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">Category / BHK</label>
              {category === "Residential" ? (
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/50 px-3 py-2.5 text-sm text-[#0D3326] outline-none focus:border-[#D7AE62] focus:bg-white"
                >
                  <option value="">Select BHK</option>
                  {BHK_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b} BHK</option>
                  ))}
                </select>
              ) : (
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  disabled={!category}
                  className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/50 px-3 py-2.5 text-sm text-[#0D3326] outline-none focus:border-[#D7AE62] focus:bg-white disabled:opacity-50"
                >
                  <option value="">Select Category</option>
                  {(PROPERTY_TYPES[category] || []).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">Min Budget (₹)</label>
              <input
                type="number"
                placeholder="Min"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/50 px-3 py-2.5 text-sm text-[#0D3326] outline-none focus:border-[#D7AE62] focus:bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">Max Budget (₹)</label>
              <input
                type="number"
                placeholder="Max"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/50 px-3 py-2.5 text-sm text-[#0D3326] outline-none focus:border-[#D7AE62] focus:bg-white"
              />
            </div>
          </div>

          {/* Search Name (display only — not saved to Strapi; shown as label) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">Search Name (optional label)</label>
            <input
              type="text"
              placeholder={`e.g. ${bhk ? bhk + " BHK" : ""} ${propertyType || category || "Property"} in ${city || "…"}`.trim()}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/50 px-3 py-2.5 text-sm text-[#0D3326] outline-none focus:border-[#D7AE62] focus:bg-white placeholder:text-[#0D3326]/30"
            />
            <p className="text-[10px] text-[#0D3326]/40">This name is used only as a display label in the UI.</p>
          </div>

          {/* Alert note */}
          <div className="flex items-center gap-2 rounded-xl border border-[#E5DDD0] p-3">
            <Bell className="w-4 h-4 text-[#D7AE62] shrink-0" />
            <p className="text-xs text-[#0D3326]/70">
              <span className="font-bold">Alert: </span>Property alerts are managed under <Link href="/user/profile/property-alerts" className="underline hover:text-[#0D3326]">Property Alerts</Link>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5DDD0] bg-white">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-bold text-[#0D3326]/70 border border-[#E5DDD0] rounded-xl hover:bg-[#F7F4EF] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-[#D7AE62] text-white rounded-xl hover:bg-[#C49A4F] transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Search
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({ onCancel, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E5DDD0] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <h2 className="font-bold text-[#0D3326]">Delete Saved Search?</h2>
        </div>
        <p className="text-sm text-[#0D3326]/70 mb-6">
          This will permanently remove your saved property requirement. You can create a new one anytime.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-bold border border-[#E5DDD0] rounded-xl text-[#0D3326]/70 hover:bg-[#F7F4EF] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Loading Card ────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#E5DDD0] bg-white shadow-sm p-6 space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-5 w-40 bg-[#EAE5DC] rounded" />
          <div className="h-4 w-24 bg-[#EAE5DC] rounded" />
        </div>
        <div className="h-4 w-20 bg-[#EAE5DC] rounded" />
      </div>
      <div className="flex gap-4">
        <div className="h-4 w-28 bg-[#EAE5DC] rounded" />
        <div className="h-4 w-28 bg-[#EAE5DC] rounded" />
      </div>
      <div className="flex gap-4">
        <div className="h-4 w-36 bg-[#EAE5DC] rounded" />
        <div className="h-4 w-36 bg-[#EAE5DC] rounded" />
      </div>
      <div className="flex gap-3 pt-2">
        <div className="h-9 w-32 bg-[#EAE5DC] rounded-xl" />
        <div className="h-9 w-24 bg-[#EAE5DC] rounded-xl" />
      </div>
    </div>
  );
}

// ─── Saved Search Card ────────────────────────────────────────────────────────
function SavedSearchCard({ prefs, updatedAt, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const searchUrl = buildSearchUrl(prefs);

  // Build a display name from the stored data
  const parts = [];
  if (prefs.BHK) parts.push(`${prefs.BHK} BHK`);
  if (prefs.PreferredCategory) parts.push(prefs.PreferredCategory);
  else if (prefs.PropertyType) parts.push(prefs.PropertyType);
  if (prefs.PreferredCity) parts.push(`in ${prefs.PreferredCity}`);
  const displayName = parts.length > 0 ? parts.join(" ") : "Property Requirement";

  const minB = formatBudget(prefs.MinimumBudget);
  const maxB = formatBudget(prefs.MaximumBudget);
  const budgetStr = minB && maxB ? `${minB} – ${maxB}` : minB || maxB || null;

  const updatedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <div className="rounded-2xl border border-[#E5DDD0] bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5 sm:p-6">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-[#0D3326] truncate">{displayName}</h3>
              <button
                onClick={onEdit}
                title="Edit search"
                className="p-1 rounded-full text-[#0D3326]/40 hover:text-[#D7AE62] hover:bg-[#FBF4E6] transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {prefs.Purpose && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0D3326] text-[#D7AE62]">
                  {prefs.Purpose}
                </span>
              )}
              {prefs.PreferredCategory && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F7F4EF] text-[#0D3326]/80 border border-[#E5DDD0]">
                  {prefs.PreferredCategory}
                </span>
              )}
            </div>
          </div>

          {/* Alert Status & Menu */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Alert Active
            </div>

            {/* 3-dot menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-full hover:bg-[#F7F4EF] transition-colors text-[#0D3326]/50"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-[#E5DDD0] bg-white shadow-xl overflow-hidden">
                    <Link
                      href={searchUrl}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-[#0D3326] hover:bg-[#F7F4EF] transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ExternalLink className="w-4 h-4 text-[#0D3326]/50" />
                      View Properties
                    </Link>
                    <button
                      className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-[#0D3326] hover:bg-[#F7F4EF] transition-colors w-full"
                      onClick={() => { setMenuOpen(false); onEdit(); }}
                    >
                      <Pencil className="w-4 h-4 text-[#0D3326]/50" />
                      Edit Search
                    </button>
                    <Link
                      href="/user/profile/property-alerts"
                      className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-[#0D3326] hover:bg-[#F7F4EF] transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Bell className="w-4 h-4 text-[#0D3326]/50" />
                      Manage Alert
                    </Link>
                    <div className="border-t border-[#E5DDD0]" />
                    <button
                      className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors w-full"
                      onClick={() => { setMenuOpen(false); onDelete(); }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Search
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Details row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm mb-4">
          {(prefs.PreferredCity || prefs.PreferredArea) && (
            <div className="flex items-center gap-2 text-[#0D3326]/70">
              <MapPin className="w-4 h-4 text-[#D7AE62] shrink-0" />
              <span className="truncate">
                {[prefs.PreferredCity, prefs.PreferredArea].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
          {prefs.PropertyType && (
            <div className="flex items-center gap-2 text-[#0D3326]/70">
              <Home className="w-4 h-4 text-[#D7AE62] shrink-0" />
              <span>{prefs.PropertyType}</span>
            </div>
          )}
          {prefs.BHK && (
            <div className="flex items-center gap-2 text-[#0D3326]/70">
              <Bed className="w-4 h-4 text-[#D7AE62] shrink-0" />
              <span>{prefs.BHK} BHK</span>
            </div>
          )}
          {budgetStr && (
            <div className="flex items-center gap-2 text-[#0D3326]/70">
              <IndianRupee className="w-4 h-4 text-[#D7AE62] shrink-0" />
              <span>{budgetStr}</span>
            </div>
          )}
          {updatedDate && (
            <div className="flex items-center gap-2 text-[#0D3326]/50 text-xs">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Updated {updatedDate}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#E5DDD0]">
          <Link
            href={searchUrl}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0D3326] text-[#D7AE62] text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="w-4 h-4" />
            View Properties
          </Link>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-5 py-2 rounded-xl border border-[#E5DDD0] text-[#0D3326]/80 text-sm font-bold hover:bg-[#F7F4EF] transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit Search
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-100 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SavedSearchesClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [prefs, setPrefs] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const p = await getUserProfile();
      setProfile(p || null);
      const savedPrefs = p?.PropertyPreferences;
      // Only treat it as a saved search if at least one meaningful field is set
      const hasPrefs = savedPrefs && (
        savedPrefs.Purpose || savedPrefs.PropertyType ||
        savedPrefs.PreferredCity || savedPrefs.PreferredArea ||
        savedPrefs.MinimumBudget || savedPrefs.MaximumBudget
      );
      setPrefs(hasPrefs ? savedPrefs : null);
    } catch (e) {
      console.error("SavedSearches: load error", e);
      setError(e?.message || "Failed to load saved searches.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (newPrefs) => {
    if (!profile?.documentId) throw new Error("User profile not found. Please re-login.");

    const payload = {
      PropertyPreferences: {
        ...newPrefs,
      },
    };
    
    if (profile.PropertyPreferences?.id) {
      payload.PropertyPreferences.id = profile.PropertyPreferences.id;
    }

    await updateUserProfile(profile.documentId, payload);
    setShowForm(false);
    showToast(editMode ? "Search updated successfully!" : "Search saved successfully!");
    await loadData();
  };

  const handleDelete = async () => {
    if (!profile?.documentId) return;
    try {
      setDeleting(true);

      const payload = {
        PropertyPreferences: null,
      };

      await updateUserProfile(profile.documentId, payload);
      setShowDeleteConfirm(false);
      showToast("Search deleted.");
      await loadData();
    } catch (e) {
      console.error("Delete error:", e);
      setError("Failed to delete search. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const openCreate = () => { setEditMode(false); setShowForm(true); };
  const openEdit = () => { setEditMode(true); setShowForm(true); };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-green-200 bg-white px-5 py-3 shadow-xl text-sm font-bold text-green-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <SearchFormModal
          initial={editMode ? prefs : null}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}

      {/* Page */}
      <div className="space-y-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0D3326]">Saved Searches</h1>
            <p className="mt-1 text-sm text-[#0D3326]/70">
              Manage your saved property searches and alerts.
            </p>
          </div>
          {!loading && !error && !prefs && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D3326] text-[#D7AE62] text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create New Search
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 space-y-4">

            {/* Loading */}
            {loading && <SkeletonCard />}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <h3 className="font-bold text-[#0D3326] mb-1">Unable to load your saved searches</h3>
                <p className="text-sm text-[#0D3326]/60 mb-5">{error}</p>
                <button
                  onClick={loadData}
                  className="px-6 py-2.5 rounded-xl bg-[#0D3326] text-[#D7AE62] text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && !prefs && (
              <div className="rounded-2xl border border-dashed border-[#D7AE62]/50 bg-[#FBF4E6]/30 p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#FBF4E6] border border-[#D7AE62]/30 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-[#D7AE62]" />
                </div>
                <h3 className="text-lg font-bold text-[#0D3326] mb-2">No Saved Searches Yet</h3>
                <p className="text-sm text-[#0D3326]/60 mb-6 max-w-xs mx-auto">
                  Save your property search preferences and we'll help you find matching properties.
                </p>
                <button
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0D3326] text-[#D7AE62] text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Search
                </button>
              </div>
            )}

            {/* Saved search card */}
            {!loading && !error && prefs && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#0D3326]/60">1 saved search</p>
                  <button
                    onClick={openCreate}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5DDD0] bg-white text-xs font-bold text-[#0D3326] hover:bg-[#F7F4EF] transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Replace / Create New
                  </button>
                </div>

                <SavedSearchCard
                  prefs={prefs}
                  updatedAt={profile?.updatedAt}
                  onEdit={openEdit}
                  onDelete={() => setShowDeleteConfirm(true)}
                />

                {/* Note about backend */}
                <div className="flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Currently, HomeHub supports one saved property requirement per account. 
                    Multiple saved searches will be available in a future update.
                  </span>
                </div>
              </div>
            )}

            {/* Continue exploring */}
            <div className="pt-4 border-t border-[#E5DDD0]">
              <h3 className="font-bold text-[#0D3326] mb-1">Continue Exploring</h3>
              <p className="text-xs text-[#0D3326]/60 mb-4">Discover more properties and manage your search.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label: "Search Properties", sub: "Find your next home", href: "/user/search", icon: Search },
                  { label: "Saved Properties", sub: "View your saved listings", href: "/user/profile/activity", icon: Home },
                  { label: "My Enquiries", sub: "Track your enquiries", href: "/user/profile/activity", icon: Tag },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E5DDD0] hover:border-[#D7AE62] transition-colors group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-50 p-2 rounded-full group-hover:bg-[#FBF4E6] transition-colors">
                        <item.icon className="w-4 h-4 text-[#0D3326] group-hover:text-[#D7AE62]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#0D3326] text-sm">{item.label}</p>
                        <p className="text-xs text-[#0D3326]/50">{item.sub}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#0D3326]/20 group-hover:text-[#D7AE62]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="hidden lg:block w-72 shrink-0 space-y-5">
            <SearchJourneyCard hasSearch={!!prefs} />

            <div className="rounded-2xl border border-[#E5DDD0] bg-[#F8F6F3] p-5 text-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-[#E5DDD0]">
                <Search className="w-6 h-6 text-[#D7AE62]" />
              </div>
              <h4 className="font-bold text-[#0D3326] text-sm mb-1">Looking for something specific?</h4>
              <p className="text-xs text-[#0D3326]/60 mb-4">
                Update your requirements to get better property recommendations.
              </p>
              <Link
                href="/user/profile/requirements"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#D7AE62] text-white font-bold text-sm rounded-xl hover:bg-[#C49A4F] transition-colors gap-1.5"
              >
                Update Requirement <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
