"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { getUserProfile, updateUserProfile } from "@/services/userProfile";

const PROPERTY_CATEGORIES = ["Residential", "Commercial", "Industrial"];

const PROPERTY_TYPES = {
  Residential: ["Apartment", "Villa", "Independent House", "Plot", "Penthouse"],
  Commercial: ["Office Space", "Retail Shop", "Warehouse", "Commercial Land"],
  Industrial: ["Factory", "Industrial Land", "Warehouse"],
};

const BHK_OPTIONS = ["1", "2", "3", "4", "5+"];

export default function PropertyRequirementClient() {
  const router = useRouter();

  // Loading state
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Form State
  const [purpose, setPurpose] = useState("Buy");
  const [category, setCategory] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [bhk, setBhk] = useState("");

  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch initial profile data on client side
  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);

        if (profile?.PropertyPreferences) {
          const prefs = profile.PropertyPreferences;
          setPurpose(prefs.Purpose || "Buy");
          setCategory(prefs.PropertyType || "");
          setPropertyType(prefs.PreferredCategory || "");
          setCity(prefs.PreferredCity || "");
          setArea(prefs.PreferredArea || "");
          setMinBudget(prefs.MinimumBudget?.toString() || "");
          setMaxBudget(prefs.MaximumBudget?.toString() || "");
          setBhk(prefs.BHK || "");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsPageLoading(false);
      }
    }

    loadProfile();
  }, []);

  // Handle Category Change
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    setPropertyType(""); // Reset property type when category changes
    if (newCat !== "Residential") {
      setBhk(""); // Clear BHK if not residential
    }
  };

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    // Validation
    if (!purpose) return setErrorMsg("Please select a purpose.");
    if (!category) return setErrorMsg("Please select a property category.");
    if (minBudget && maxBudget && parseInt(minBudget) > parseInt(maxBudget)) {
      return setErrorMsg("Maximum budget cannot be less than minimum budget.");
    }

    if (!userProfile?.documentId) {
      return setErrorMsg("User profile not found. Please relogin.");
    }

    try {
      setIsSaving(true);
      
      const payload = {
        PropertyPreferences: {
          id: userProfile.PropertyPreferences?.id,
          Purpose: purpose,
          PropertyType: category,
          PreferredCategory: propertyType,
          PreferredCity: city,
          PreferredArea: area,
          MinimumBudget: minBudget ? parseInt(minBudget) : null,
          MaximumBudget: maxBudget ? parseInt(maxBudget) : null,
          BHK: category === "Residential" ? bhk : null,
        }
      };

      await updateUserProfile(userProfile.documentId, payload);
      
      setSuccessMsg("Requirement saved successfully");
      router.refresh();
      
    } catch (err) {
      console.error(err);
      setErrorMsg("Unable to save your requirement. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="rounded-2xl border border-[#E5DDD0] bg-white p-6 md:p-8 shadow-sm">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-1/3 rounded bg-[#EAE5DC]"></div>
          <div className="h-10 w-full rounded bg-[#EAE5DC]"></div>
          <div className="h-10 w-full rounded bg-[#EAE5DC]"></div>
          <div className="h-10 w-full rounded bg-[#EAE5DC]"></div>
        </div>
      </div>
    );
  }

  const isEditing = !!userProfile?.PropertyPreferences?.id;

  return (
    <div className="rounded-2xl border border-[#E5DDD0] bg-white shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="border-b border-[#E5DDD0] bg-[#FBF4E6]/50 px-6 py-5 md:px-8">
        <h2 className="text-xl font-bold text-[#0D3326]">Property Search Requirement</h2>
        <p className="mt-1 text-sm text-[#0D3326]/70">
          Tell us what you're looking for and we'll help you find the right property.
        </p>
      </div>

      {/* Form Content */}
      <div className="p-6 md:p-8 space-y-8">
        
        {/* Messages */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-600">
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-[#E8F0EB] p-4 text-sm font-semibold text-[#0D3326]">
            <CheckCircle2 size={16} className="text-[#0D3326]" />
            {successMsg}
          </div>
        )}

        {/* 1. Purpose */}
        <div className="space-y-3">
          <label className="block text-[13px] font-bold uppercase tracking-wider text-[#0D3326]/60">
            I am looking to
          </label>
          <div className="flex flex-wrap gap-3">
            {["Buy", "Rent"].map((p) => (
              <button
                key={p}
                onClick={() => setPurpose(p)}
                className={`rounded-xl border px-6 py-2.5 text-sm font-bold transition ${
                  purpose === p
                    ? "border-[#D7AE62] bg-[#FBF4E6] text-[#9A7230] shadow-sm"
                    : "border-[#E5DDD0] bg-white text-[#0D3326]/70 hover:border-[#D7AE62]/50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-[#E5DDD0]" />

        {/* 2. Category */}
        <div className="space-y-3">
          <label className="block text-[13px] font-bold uppercase tracking-wider text-[#0D3326]/60">
            Property Category
          </label>
          <div className="flex flex-wrap gap-3">
            {PROPERTY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-xl border px-6 py-2.5 text-sm font-bold transition ${
                  category === cat
                    ? "border-[#D7AE62] bg-[#FBF4E6] text-[#9A7230] shadow-sm"
                    : "border-[#E5DDD0] bg-white text-[#0D3326]/70 hover:border-[#D7AE62]/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Property Type (Dynamic) */}
        {category && (
          <div className="space-y-3">
            <label className="block text-[13px] font-bold uppercase tracking-wider text-[#0D3326]/60">
              Property Type
            </label>
            <div className="relative">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/50 px-4 py-3.5 text-sm font-bold text-[#0D3326] outline-none transition focus:border-[#D7AE62] focus:bg-white"
              >
                <option value="">Select Property Type</option>
                {PROPERTY_TYPES[category]?.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 4. Location */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <label className="block text-[13px] font-bold uppercase tracking-wider text-[#0D3326]/60">
              Preferred City
            </label>
            <input
              type="text"
              placeholder="e.g. Pune"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/50 px-4 py-3.5 text-sm font-bold text-[#0D3326] outline-none transition focus:border-[#D7AE62] focus:bg-white placeholder:text-[#0D3326]/30 placeholder:font-medium"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-[13px] font-bold uppercase tracking-wider text-[#0D3326]/60">
              Preferred Area
            </label>
            <input
              type="text"
              placeholder="e.g. Koregaon Park"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/50 px-4 py-3.5 text-sm font-bold text-[#0D3326] outline-none transition focus:border-[#D7AE62] focus:bg-white placeholder:text-[#0D3326]/30 placeholder:font-medium"
            />
          </div>
        </div>

        {/* 5. Budget */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <label className="block text-[13px] font-bold uppercase tracking-wider text-[#0D3326]/60">
              Minimum Budget (₹)
            </label>
            <input
              type="number"
              placeholder="0"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/50 px-4 py-3.5 text-sm font-bold text-[#0D3326] outline-none transition focus:border-[#D7AE62] focus:bg-white placeholder:text-[#0D3326]/30 placeholder:font-medium"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-[13px] font-bold uppercase tracking-wider text-[#0D3326]/60">
              Maximum Budget (₹)
            </label>
            <input
              type="number"
              placeholder="No limit"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/50 px-4 py-3.5 text-sm font-bold text-[#0D3326] outline-none transition focus:border-[#D7AE62] focus:bg-white placeholder:text-[#0D3326]/30 placeholder:font-medium"
            />
          </div>
        </div>

        {/* 6. BHK (Residential Only) */}
        {category === "Residential" && (
          <>
            <hr className="border-[#E5DDD0]" />
            <div className="space-y-3">
              <label className="block text-[13px] font-bold uppercase tracking-wider text-[#0D3326]/60">
                BHK
              </label>
              <div className="flex flex-wrap gap-3">
                {BHK_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setBhk(opt)}
                    className={`rounded-xl border px-6 py-2.5 text-sm font-bold transition ${
                      bhk === opt
                        ? "border-[#D7AE62] bg-[#FBF4E6] text-[#9A7230] shadow-sm"
                        : "border-[#E5DDD0] bg-white text-[#0D3326]/70 hover:border-[#D7AE62]/50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <hr className="border-[#E5DDD0]" />

        {/* Actions */}
        <div className="flex items-center justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0D3326] px-8 py-3.5 text-sm font-bold text-[#D7AE62] transition hover:opacity-90 disabled:opacity-70"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            {isEditing ? "Update Requirement" : "Save Requirement"}
          </button>
        </div>

      </div>
    </div>
  );
}
