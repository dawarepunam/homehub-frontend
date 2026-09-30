"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  Briefcase,
  Building2,
  Camera,
  ChevronRight,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import {
  STRAPI_BASE_URL,
  getUserProfile,
  updateUserProfile,
  uploadMedia,
} from "@/services/userProfile";

/* ─── Field Configuration ──────────────────────────────────────────── */

const FIELD_GROUPS = {
  personal: ["FirstName", "LastName", "Phone", "Gender", "DOB"],
  professional: ["Occupation", "Company"],
  address: ["Address", "City", "State", "pincode"],
  bio: ["Bio"],
};

const FIELD_CONFIG = {
  FirstName: { label: "First Name", type: "text", placeholder: "Enter first name", autoComplete: "given-name" },
  LastName: { label: "Last Name", type: "text", placeholder: "Enter last name", autoComplete: "family-name" },
  Phone: { label: "Phone Number", type: "tel", placeholder: "Enter phone number", autoComplete: "tel" },
  Gender: { label: "Gender", type: "select", placeholder: "Select gender", options: ["Male", "Female", "Other"] },
  DOB: { label: "Date of Birth", type: "date" },
  Occupation: { label: "Occupation", type: "text", placeholder: "Enter occupation", autoComplete: "organization-title" },
  Company: { label: "Company", type: "text", placeholder: "Enter company name", autoComplete: "organization" },
  Address: { label: "Address", type: "textarea", placeholder: "Enter your full address", className: "md:col-span-2", rows: 3, autoComplete: "street-address" },
  City: { label: "City", type: "text", placeholder: "Enter city", autoComplete: "address-level2" },
  State: { label: "State", type: "text", placeholder: "Enter state", autoComplete: "address-level1" },
  pincode: { label: "Pincode", type: "text", placeholder: "Enter pincode", autoComplete: "postal-code" },
  Bio: { label: "Bio / About Me", type: "textarea", placeholder: "Write a short introduction about yourself...", className: "md:col-span-2", rows: 5 },
};

const SETTINGS_CONFIG = {
  Email_Notification: { label: "Email Notifications", description: "Receive enquiry updates via email", icon: Mail },
  SMS_Notification: { label: "SMS Notifications", description: "Get SMS alerts for important updates", icon: Phone },
  Push_Notification: { label: "Push Notifications", description: "Browser and device notifications", icon: Bell },
};

const MEDIA_FIELDS = new Set(["ProfileImage", "CoverImage"]);
const SYSTEM_FIELDS = new Set(["id", "documentId", "__component", "createdAt", "updatedAt", "publishedAt", "locale", "localizations"]);

/* ─── Helpers ────────────────────────────────────────────────────────── */

function unwrapStrapiEntity(value) {
  if (!value) return value;
  if (value.data) return unwrapStrapiEntity(value.data);
  if (Array.isArray(value)) return value.map((item) => unwrapStrapiEntity(item));
  if (value.attributes) return { id: value.id, documentId: value.documentId, ...value.attributes };
  return value;
}

function normalizeProfile(profile) {
  const np = unwrapStrapiEntity(profile) || {};
  return {
    ...np,
    ProfileDetails: unwrapStrapiEntity(np.ProfileDetails) || {},
    Settings: unwrapStrapiEntity(np.Settings) || {},
    users_permissions_user: unwrapStrapiEntity(np.users_permissions_user) || {},
  };
}

function getMediaValue(media) {
  const normalized = unwrapStrapiEntity(media);
  if (Array.isArray(normalized)) return getMediaValue(normalized[0]);
  return normalized || null;
}

function getMediaId(media) {
  return getMediaValue(media)?.id || null;
}

function getMediaUrl(media) {
  const normalized = getMediaValue(media);
  const url = normalized?.formats?.large?.url || normalized?.formats?.medium?.url || normalized?.formats?.small?.url || normalized?.url;
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${STRAPI_BASE_URL.replace(/\/$/, "")}${url}`;
}

function isEditableScalar(value) {
  return value === null || value === undefined || ["string", "number", "boolean"].includes(typeof value);
}

function getInitialValues(fields, source) {
  return fields.reduce((values, field) => {
    const value = source[field.name];
    return { ...values, [field.name]: value === null || value === undefined ? "" : value };
  }, {});
}

function getSettingsFields(settings) {
  const knownSettings = Object.keys(SETTINGS_CONFIG);
  const additional = Object.keys(settings).filter((name) =>
    !knownSettings.includes(name) && !SYSTEM_FIELDS.has(name) && isEditableScalar(settings[name])
  );
  return [...knownSettings, ...additional].map((name) => ({
    name,
    label: SETTINGS_CONFIG[name]?.label || name,
    description: SETTINGS_CONFIG[name]?.description || "",
    icon: SETTINGS_CONFIG[name]?.icon || Bell,
  }));
}

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

function FormInput({ field, value, disabled, onChange }) {
  const baseClass =
    "w-full rounded-xl border border-[#E5DDD0] bg-[#FDFAF6] px-4 py-3 text-sm font-semibold text-[#0D3326] outline-none transition placeholder:text-[#0D3326]/30 focus:border-[#0D3326] focus:ring-2 focus:ring-[#0D3326]/10 disabled:cursor-not-allowed disabled:opacity-60";

  if (field.type === "select") {
    return (
      <select
        id={field.name}
        name={field.name}
        value={value || ""}
        disabled={disabled}
        onChange={(e) => onChange(field.name, e.target.value)}
        className={baseClass}
      >
        <option value="">{field.placeholder || "Select option"}</option>
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        id={field.name}
        name={field.name}
        value={value || ""}
        rows={field.rows || 3}
        disabled={disabled}
        placeholder={field.placeholder}
        onChange={(e) => onChange(field.name, e.target.value)}
        className={`${baseClass} min-h-[100px] resize-y leading-6`}
      />
    );
  }

  return (
    <input
      id={field.name}
      name={field.name}
      type={field.type || "text"}
      value={value || ""}
      disabled={disabled}
      placeholder={field.placeholder}
      autoComplete={field.autoComplete}
      onChange={(e) => onChange(field.name, e.target.value)}
      className={baseClass}
    />
  );
}

function FormSection({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-[#E5DDD0] bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#E5DDD0] px-6 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0D3326]">
          <Icon size={16} className="text-[#D7AE62]" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-[#0D3326]">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[11px] font-medium text-[#0D3326]/50">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function FieldGrid({ fields, values, disabled, onChange }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={field.className || ""}>
          <label htmlFor={field.name} className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">
            {field.label}
          </label>
          <FormInput field={field} value={values[field.name]} disabled={disabled} onChange={onChange} />
        </div>
      ))}
    </div>
  );
}

function NotificationToggleRow({ field, value, onChange, disabled }) {
  const Icon = field.icon;
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#E5DDD0] last:border-0">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F4EF]">
          <Icon size={18} className="text-[#0D3326]" />
        </div>
        <div>
          <span className="block text-sm font-bold text-[#0D3326]">{field.label}</span>
          {field.description && <span className="mt-0.5 block text-[11px] text-[#0D3326]/50">{field.description}</span>}
        </div>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(field.name, !value)}
        aria-checked={!!value}
        role="switch"
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${value ? "bg-[#0D3326]" : "bg-[#E5DDD0]"}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────── */

export default function EditProfileForm() {
  const router = useRouter();

  // ── Fetch profile client-side so the JWT from localStorage is available ──
  const [rawProfile, setRawProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setProfileLoading(true);
        setProfileError(null);
        const data = await getUserProfile();
        if (!cancelled) setRawProfile(data);
      } catch (err) {
        if (!cancelled) setProfileError(err?.message || "Failed to load profile.");
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const profile = rawProfile;
  const normalizedProfile = useMemo(() => normalizeProfile(profile), [profile]);
  const profileDetails = useMemo(() => normalizedProfile.ProfileDetails || {}, [normalizedProfile]);
  const settings = useMemo(() => normalizedProfile.Settings || {}, [normalizedProfile]);

  const personalFields = useMemo(() => FIELD_GROUPS.personal.map((name) => ({ name, ...FIELD_CONFIG[name] })), []);
  const professionalFields = useMemo(() => FIELD_GROUPS.professional.map((name) => ({ name, ...FIELD_CONFIG[name] })), []);
  const addressFields = useMemo(() => FIELD_GROUPS.address.map((name) => ({ name, ...FIELD_CONFIG[name] })), []);
  const bioFields = useMemo(() => FIELD_GROUPS.bio.map((name) => ({ name, ...FIELD_CONFIG[name] })), []);
  const settingsFields = useMemo(() => getSettingsFields(settings), [settings]);

  const allProfileFields = useMemo(
    () => [...personalFields, ...professionalFields, ...addressFields, ...bioFields],
    [personalFields, professionalFields, addressFields, bioFields]
  );

  // Re-initialise form values when profile loads from the server
  const [formValues, setFormValues] = useState({});
  const [settingsValues, setSettingsValues] = useState({});
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Seed form values once profile has loaded
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (!profileLoading && !seeded && profileDetails) {
      setFormValues(getInitialValues(allProfileFields, profileDetails));
      setSettingsValues(getInitialValues(settingsFields, settings));
      setProfilePreview(getMediaUrl(profileDetails.ProfileImage) || "");
      setCoverPreview(getMediaUrl(profileDetails.CoverImage) || "");
      setSeeded(true);
    }
  }, [profileLoading, profileDetails, settings, allProfileFields, settingsFields, seeded]);

  useEffect(() => {
    return () => {
      if (profilePreview?.startsWith("blob:")) URL.revokeObjectURL(profilePreview);
      if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    };
  }, [profilePreview, coverPreview]);

  const fullName = `${formValues.FirstName || ""} ${formValues.LastName || ""}`.trim() ||
    normalizedProfile.users_permissions_user?.username || "HomeHub Member";
  const locationStr = [formValues.City, formValues.State].filter(Boolean).join(", ");
  const initials = getInitials(fullName);

  function handleInputChange(name, value) {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSettingsChange(name, value) {
    setSettingsValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(type, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    if (type === "profile") {
      if (profilePreview?.startsWith("blob:")) URL.revokeObjectURL(profilePreview);
      setProfileFile(file);
      setProfilePreview(previewUrl);
    } else {
      if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
      setCoverFile(file);
      setCoverPreview(previewUrl);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const activeDocumentId = normalizedProfile.documentId || normalizedProfile.id;
    if (!activeDocumentId) {
      toast.error("Profile document ID not found. Please refresh and try again.");
      return;
    }
    setIsSaving(true);
    try {
      let uploadedProfileImage = null;
      let uploadedCoverImage = null;
      if (profileFile) uploadedProfileImage = await uploadMedia(profileFile);
      if (coverFile) uploadedCoverImage = await uploadMedia(coverFile);

      const profileDetailsPayload = { ...formValues };
      // Strapi v5 throws "components not related to entity" if we pass a stale ID
      // Omit the ID entirely so Strapi correctly merges/replaces the component

      const existingProfileImageId = getMediaId(profileDetails.ProfileImage);
      const existingCoverImageId = getMediaId(profileDetails.CoverImage);

      if (uploadedProfileImage?.id) {
        profileDetailsPayload.ProfileImage = uploadedProfileImage.id;
      } else if (existingProfileImageId) {
        profileDetailsPayload.ProfileImage = existingProfileImageId;
      }

      if (uploadedCoverImage?.id) {
        profileDetailsPayload.CoverImage = uploadedCoverImage.id;
      } else if (existingCoverImageId) {
        profileDetailsPayload.CoverImage = existingCoverImageId;
      }

      const updatePayload = { ProfileDetails: profileDetailsPayload };

      if (Object.keys(settingsValues).length > 0) {
        updatePayload.Settings = { ...settingsValues };
        // Do not pass Settings.id to prevent relation errors
      }

      await updateUserProfile(activeDocumentId, updatePayload);

      // ─── Sync profile data into localStorage so the Header updates ───
      try {
        const freshProfile = await getUserProfile();
        const freshImage =
          freshProfile?.ProfileDetails?.ProfileImage;
        const getUrl = (media) => {
          const m = media?.data?.attributes || media;
          const url =
            m?.formats?.medium?.url ||
            m?.formats?.small?.url ||
            m?.url;
          if (!url) return null;
          return url.startsWith("http")
            ? url
            : `${STRAPI_BASE_URL.replace(/\/$/, "")}${url}`;
        };
        const imageUrl = getUrl(freshImage);
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.profileImage = imageUrl || null;
          if (formValues.FirstName !== undefined) parsed.firstName = formValues.FirstName || "";
          if (formValues.LastName !== undefined) parsed.lastName = formValues.LastName || "";
          localStorage.setItem("user", JSON.stringify(parsed));
          // Notify same-tab listeners (UserHeader)
          window.dispatchEvent(new Event("userProfileUpdated"));
        }
      } catch (_) {
        // Non-fatal — image will appear after refresh
      }

      toast.success("Profile updated successfully!", {
        style: { background: "#0D3326", color: "#D7AE62", fontWeight: "bold" },
      });
      router.refresh();
      router.push("/user/profile");
    } catch (error) {
      console.error("Profile Save Error:", error);
      toast.error(error?.message || "Unable to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    const isDirty =
      JSON.stringify(formValues) !== JSON.stringify(getInitialValues(allProfileFields, profileDetails)) ||
      JSON.stringify(settingsValues) !== JSON.stringify(getInitialValues(settingsFields, settings)) ||
      profileFile !== null ||
      coverFile !== null;

    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        router.back();
      }
    } else {
      router.back();
    }
  }

  // ── Loading / Error states for profile fetch ──
  if (profileLoading) {
    return (
      <div className="flex flex-col gap-5 pb-20">
        <div className="overflow-hidden rounded-2xl border border-[#E5DDD0] bg-white shadow-sm animate-pulse">
          <div className="h-48 sm:h-56 bg-[#E5DDD0]" />
          <div className="px-8 pb-8 pt-0">
            <div className="-mt-14 flex items-end gap-5">
              <div className="h-28 w-28 rounded-full bg-[#E5DDD0] border-4 border-white" />
              <div className="mb-3 space-y-2">
                <div className="h-7 w-44 rounded-full bg-[#E5DDD0]" />
                <div className="h-4 w-24 rounded-full bg-[#E5DDD0]" />
              </div>
            </div>
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-[#E5DDD0]" />
        ))}
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5DDD0] bg-white p-16 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-lg font-extrabold text-[#0D3326]">Unable to Load Profile</h2>
        <p className="mt-2 text-sm text-[#0D3326]/60">{profileError}</p>
        <button
          type="button"
          onClick={() => { setSeeded(false); setProfileLoading(true); getUserProfile().then(setRawProfile).catch((e) => setProfileError(e?.message)).finally(() => setProfileLoading(false)); }}
          className="mt-6 rounded-xl bg-[#0D3326] px-6 py-3 text-sm font-bold text-[#D7AE62] transition hover:bg-[#0a2b1f]"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5DDD0] bg-white p-16 text-center shadow-sm">
        <h2 className="text-lg font-extrabold text-[#0D3326]">Profile Not Found</h2>
        <p className="mt-2 text-sm text-[#0D3326]/60">
          Your buyer profile could not be found. Please ensure you are logged in.
        </p>
        <a href="/user/login" className="mt-6 rounded-xl bg-[#0D3326] px-6 py-3 text-sm font-bold text-[#D7AE62] transition hover:bg-[#0a2b1f]">
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl space-y-6 pb-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0D3326]/60">
          <Link href="/user" className="flex items-center gap-1 transition hover:text-[#0D3326]">
            <Home size={14} /><span>Home</span>
          </Link>
          <ChevronRight size={12} />
          <Link href="/user/profile" className="transition hover:text-[#0D3326]">My Profile</Link>
          <ChevronRight size={12} />
          <span className="text-[#0D3326]">Edit Profile</span>
        </nav>

        {/* Hero Section */}
        <div className="overflow-hidden rounded-2xl border border-[#E5DDD0] bg-white shadow-sm">
          {/* Cover */}
          <div
            className="relative h-48 w-full sm:h-56"
            style={coverPreview
              ? { backgroundImage: `url(${coverPreview})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: "linear-gradient(135deg, #0D3326 0%, #1a4d3a 60%, #0D3326 100%)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
            <label
              htmlFor="cover-upload"
              className="absolute right-6 top-6 flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#0D3326] shadow-sm transition hover:bg-[#F7F4EF]"
            >
              <Camera size={14} />Change Cover
            </label>
            <input id="cover-upload" type="file" accept="image/*" disabled={isSaving} onChange={(e) => handleImageChange("cover", e)} className="sr-only" />
          </div>

          {/* Profile info below cover */}
          <div className="px-6 pb-6 sm:px-10 sm:pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-14 sm:-mt-16">
                {/* Avatar */}
                <div className="relative shrink-0 z-10">
                  <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-md sm:h-36 sm:w-36">
                    {profilePreview ? (
                      <img src={profilePreview} alt={fullName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#F7F4EF] text-4xl font-extrabold text-[#0D3326]">
                        {initials}
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-1.5 right-1.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#D7AE62] shadow-md transition hover:bg-[#C99A40]"
                    title="Change profile photo"
                  >
                    <Camera size={15} className="text-[#0D3326]" />
                  </label>
                  <input id="profile-upload" type="file" accept="image/*" disabled={isSaving} onChange={(e) => handleImageChange("profile", e)} className="sr-only" />
                </div>

                {/* Name and info */}
                <div className="mb-2">
                  <h1 className="text-2xl font-extrabold text-[#0D3326]">{fullName}</h1>
                  <p className="mt-0.5 text-sm font-semibold text-[#0D3326]/60">Buyer</p>
                  {locationStr && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#0D3326]/60">
                      <MapPin size={13} className="text-[#D7AE62]" />{locationStr}
                    </p>
                  )}
                  {profileDetails?.IsVerified ? (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#E8F4F0] px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                      <BadgeCheck size={12} />Verified
                    </span>
                  ) : (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#F7F4EF] px-2.5 py-1 text-[11px] font-bold text-[#0D3326]/60">
                      <ShieldCheck size={12} />Verification Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pb-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl border border-[#E5DDD0] bg-white px-5 py-2.5 text-sm font-bold text-[#0D3326] transition hover:bg-[#F7F4EF] disabled:opacity-60"
                >
                  <X size={15} />Discard
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-2.5 text-sm font-bold text-[#D7AE62] shadow-sm transition hover:bg-[#0a2b1f] disabled:opacity-60"
                >
                  {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          {/* Left: form sections */}
          <div className="space-y-6">
            <FormSection icon={User} title="Personal Information" subtitle="Basic details visible on your profile">
              <FieldGrid fields={personalFields} values={formValues} disabled={isSaving} onChange={handleInputChange} />
            </FormSection>

            <FormSection icon={Briefcase} title="Professional Information" subtitle="Your work details for a trustworthy profile">
              <FieldGrid fields={professionalFields} values={formValues} disabled={isSaving} onChange={handleInputChange} />
            </FormSection>

            <FormSection icon={MapPin} title="Address" subtitle="Location information shown on your profile">
              <FieldGrid fields={addressFields} values={formValues} disabled={isSaving} onChange={handleInputChange} />
            </FormSection>

            <FormSection icon={User} title="About Me" subtitle="A short introduction that helps owners know you better">
              <FieldGrid fields={bioFields} values={formValues} disabled={isSaving} onChange={handleInputChange} />
            </FormSection>
          </div>

          {/* Right: notifications + submit */}
          <div className="space-y-6">
            <FormSection icon={Bell} title="Notification Preferences" subtitle="Manage how you receive updates">
              {settingsFields.map((field) => (
                <NotificationToggleRow
                  key={field.name}
                  field={field}
                  value={!!settingsValues[field.name]}
                  onChange={handleSettingsChange}
                  disabled={isSaving}
                />
              ))}
            </FormSection>

            {/* Save/Cancel sticky card */}
            <div className="rounded-2xl border border-[#E5DDD0] bg-white p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-[#0D3326]">Save Your Changes</h3>
              <p className="mt-1 text-[11px] text-[#0D3326]/50">Changes will be saved to your HomeHub profile permanently.</p>
              <div className="mt-5 space-y-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D3326] px-6 py-3 text-sm font-bold text-[#D7AE62] shadow-sm transition hover:bg-[#0a2b1f] disabled:opacity-60"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5DDD0] bg-white px-6 py-3 text-sm font-bold text-[#0D3326] transition hover:bg-[#F7F4EF] disabled:opacity-60"
                >
                  <ArrowLeft size={16} />Back to Profile
                </button>
              </div>
            </div>

            {/* Info card */}
            <div className="rounded-2xl border border-[#E5DDD0] bg-[#F7F4EF] p-5">
              <h3 className="text-sm font-extrabold text-[#0D3326]">Profile Tips</h3>
              <ul className="mt-3 space-y-2 text-[12px] text-[#0D3326]/70">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D7AE62]" />
                  Add a clear profile photo to build trust with property owners.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D7AE62]" />
                  Complete your bio to show owners you are a serious buyer.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D7AE62]" />
                  Keep your phone number updated to receive enquiry alerts.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
