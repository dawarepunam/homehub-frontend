// "use client";

// import Link from "next/link";

// export default function ProfileCard() {

//   const user =
//     typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem("user") || "{}")
//       : {};

//   const username = user?.username || "Guest User";

//   const email = user?.email || "Not Available";

//   return (

//     <div className="space-y-8">

//       {/* Profile Card */}

//       <div className="rounded-3xl bg-white p-8 shadow-lg">

//         <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

//           <div className="flex items-center gap-6">

//             <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">

//               {username.charAt(0).toUpperCase()}

//             </div>

//             <div>

//               <h2 className="text-3xl font-bold">

//                 {username}

//               </h2>

//               <p className="mt-2 text-gray-500">

//                 {email}

//               </p>

//               <span className="mt-3 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">

//                 ✓ Verified Member

//               </span>

//             </div>

//           </div>

//           <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">

//             Edit Profile

//           </button>

//         </div>

//       </div>

//       {/* Personal Information */}

//       <div className="rounded-3xl bg-white p-8 shadow-lg">

//         <h3 className="mb-6 text-2xl font-bold">

//           Personal Information

//         </h3>

//         <div className="grid gap-6 md:grid-cols-2">

//           <div>

//             <label className="text-sm text-gray-500">

//               Username

//             </label>

//             <p className="mt-2 font-semibold">

//               {username}

//             </p>

//           </div>

//           <div>

//             <label className="text-sm text-gray-500">

//               Email

//             </label>

//             <p className="mt-2 font-semibold">

//               {email}

//             </p>

//           </div>

//           <div>

//             <label className="text-sm text-gray-500">

//               Mobile

//             </label>

//             <p className="mt-2 font-semibold text-gray-400">

//               Not Added

//             </p>

//           </div>

//           <div>

//             <label className="text-sm text-gray-500">

//               City

//             </label>

//             <p className="mt-2 font-semibold text-gray-400">

//               Not Added

//             </p>

//           </div>

//         </div>

//       </div>

//       {/* Quick Actions */}

//       <div className="rounded-3xl bg-white p-8 shadow-lg">

//         <h3 className="mb-6 text-2xl font-bold">

//           Quick Actions

//         </h3>

//         <div className="grid gap-5 md:grid-cols-2">

//           <Link
//             href="/user/wishlist"
//             className="rounded-xl border p-5 transition hover:border-blue-600 hover:bg-blue-50"
//           >
//             ❤️ Wishlist
//           </Link>

//           <Link
//             href="/user/enquiries"
//             className="rounded-xl border p-5 transition hover:border-blue-600 hover:bg-blue-50"
//           >
//             📩 My Enquiries
//           </Link>

//           <Link
//             href="/user/saved-properties"
//             className="rounded-xl border p-5 transition hover:border-blue-600 hover:bg-blue-50"
//           >
//             🏠 Saved Properties
//           </Link>

//           <Link
//             href="/user/settings"
//             className="rounded-xl border p-5 transition hover:border-blue-600 hover:bg-blue-50"
//           >
//             ⚙ Settings
//           </Link>

//         </div>

//       </div>

//       {/* Account Status */}

//       <div className="rounded-3xl bg-white p-8 shadow-lg">

//         <h3 className="mb-6 text-2xl font-bold">

//           Account Status

//         </h3>

//         <div className="space-y-3">

//           <p>✅ Registered User</p>

//           <p>✅ Login Successful</p>

//           <p>🟢 Account Active</p>

//         </div>

//       </div>

//     </div>

//   );

// // }
"use client";

import Link from "next/link";
import {
  Camera,
  Pencil,
  MapPin,
  BadgeCheck,
  Building2,
  Calendar,
  Mail,
} from "lucide-react";
export default function ProfileCard({ profile }) {
  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
    "http://localhost:1337";
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const profileData = profile?.ProfileDetails || {};
  const settings = profile?.Settings || {};

  const username = user?.username || "Guest User";
  const email = user?.email || "Not Available";

  const fullName =
    `${profileData.FirstName || ""} ${profileData.LastName || ""}`.trim() ||
    username;
  const profileImage = profileData?.ProfileImage?.url
    ? `${STRAPI_URL}${profileData.ProfileImage.url}`
    : null;

  const coverImage = profileData?.CoverImage?.url
    ? `${STRAPI_URL}${profileData.CoverImage.url}`
    : null;
  return (
    <div className="space-y-8">
      {/* Profile Card */}
      {/* <div className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-3xl font-bold">{fullName}</h2>

              <p className="mt-2 text-gray-500">{email}</p>

              {profileData.IsVerified ? (
                <span className="mt-3 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                  ✓ Verified Member
                </span>
              ) : (
                <span className="mt-3 inline-block rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700">
                  Pending Verification
                </span>
              )}
            </div>
          </div>

          <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
            Edit Profile
          </button>
        </div>
      </div> */}
      {/* Premium Profile Hero */}

      <div className="overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* Cover Image */}

        <div
          className="relative h-72 w-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700"
          style={
            coverImage
              ? {
                  backgroundImage: `url(${coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
          <button className="absolute right-6 top-6 flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur transition hover:bg-white">
            <Camera size={18} />
            Change Cover
          </button>
        </div>

        {/* Profile */}

        <div className="relative px-10 pb-10">
          <div className="-mt-20 flex flex-col items-center lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col items-center lg:flex-row lg:items-end lg:gap-8">
              {/* Avatar */}

              <div className="relative">
                <div className="h-40 w-40 overflow-hidden rounded-full border-[8px] border-white bg-white shadow-2xl">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-6xl font-bold text-white">
                      {fullName.charAt(0)}
                    </div>
                  )}
                </div>

                <button className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:scale-110">
                  <Camera size={20} />
                </button>
              </div>

              {/* Details */}

              <div className="mt-6 text-center lg:mt-0 lg:text-left">
                <h1 className="text-4xl font-extrabold text-slate-800">
                  {fullName}
                </h1>

                <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-lg text-slate-500 lg:justify-start">
                  <Building2 size={18} />

                  {profileData.Occupation || "Professional"}

                  <span>•</span>

                  {profileData.Company || "HomeHub"}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                  <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                    <MapPin size={18} className="text-blue-600" />

                    <span className="font-medium">
                      {profileData.City || "City"},{" "}
                      {profileData.State || "State"}
                    </span>
                  </div>

                  {profileData.IsVerified ? (
                    <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 font-medium text-green-700">
                      <BadgeCheck size={18} />
                      Verified Member
                    </div>
                  ) : (
                    <div className="rounded-full bg-yellow-100 px-4 py-2 font-medium text-yellow-700">
                      Verification Pending
                    </div>
                  )}
                </div>

                <p className="mt-5 max-w-2xl text-slate-500">
                  {profileData.Bio ||
                    "Welcome to your HomeHub profile. Manage your account, wishlist and enquiries from here."}
                </p>
              </div>
            </div>

            {/* Buttons */}

            <div className="mt-8 flex flex-wrap gap-4 lg:mt-0">
              <Link
                href="/user/profile/edit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-7 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
              >
                <Pencil size={18} />
                Edit Profile
              </Link>
              <button className="rounded-xl border border-blue-600 bg-white px-7 py-3 font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white">
                View Public Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Personal Information */}
      <div className="rounded-3xl bg-gradient-to-br from-white to-slate-50">
        <h3 className="mb-6 text-2xl font-bold">Personal Information</h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm text-gray-500">First Name</label>

            <p className="mt-2 font-semibold">{profileData.FirstName || "-"}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Last Name</label>

            <p className="mt-2 font-semibold">{profileData.LastName || "-"}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>

            <p className="mt-2 font-semibold">{email}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Phone</label>

            <p className="mt-2 font-semibold">{profileData.Phone || "-"}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Gender</label>

            <p className="mt-2 font-semibold">{profileData.Gender || "-"}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Date of Birth</label>

            <p className="mt-2 font-semibold">{profileData.DOB || "-"}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Occupation</label>

            <p className="mt-2 font-semibold">
              {profileData.Occupation || "-"}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Company</label>

            <p className="mt-2 font-semibold">{profileData.Company || "-"}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">City</label>

            <p className="mt-2 font-semibold">{profileData.City || "-"}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">State</label>

            <p className="mt-2 font-semibold">{profileData.State || "-"}</p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">Address</label>

            <p className="mt-2 font-semibold">{profileData.Address || "-"}</p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">Bio</label>

            <p className="mt-2 font-semibold">{profileData.Bio || "-"}</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h3 className="mb-6 text-2xl font-bold">Notification Settings</h3>

        <div className="space-y-5">
          <p>
            Email Notification :
            <strong className="ml-2">
              {settings.Email_Notification ? "Enabled" : "Disabled"}
            </strong>
          </p>

          <p>
            SMS Notification :
            <strong className="ml-2">
              {settings.SMS_Notification ? "Enabled" : "Disabled"}
            </strong>
          </p>

          <p>
            Push Notification :
            <strong className="ml-2">
              {settings.Push_Notification ? "Enabled" : "Disabled"}
            </strong>
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h3 className="mb-6 text-2xl font-bold">Quick Actions</h3>

        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href="/user/wishlist"
            className="rounded-xl border p-5 transition hover:border-blue-600 hover:bg-blue-50"
          >
            ❤️ Wishlist
          </Link>

          <Link
            href="/user/enquiries"
            className="rounded-xl border p-5 transition hover:border-blue-600 hover:bg-blue-50"
          >
            📩 My Enquiries
          </Link>

          <Link
            href="/user/settings"
            className="rounded-xl border p-5 transition hover:border-blue-600 hover:bg-blue-50"
          >
            ⚙ Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
