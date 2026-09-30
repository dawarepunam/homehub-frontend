// import Header from "@/components/user/UserHeader";
// import Footer from "@/components/Footer";
// import ProfileCard from "@/components/user/ProfileCard";

// import { getUserSiteSettings } from "@/services/userSiteSettings";

// export default async function ProfilePage() {

//   const settings = await getUserSiteSettings();

//   return (

//     <div className="min-h-screen flex flex-col bg-gray-100">

//       <Header
//         headerData={settings?.UserHeader}
//       />

//       <main className="flex-1">

//         <div className="mx-auto max-w-7xl px-6 py-10">

//           <h1 className="mb-8 text-4xl font-bold">

//             My Profile

//           </h1>

//           <ProfileCard />

//         </div>

//       </main>

//       <Footer />

//     </div>

//   );

// }
import ProfilePageClient from "@/components/user/ProfilePageClient";

export const metadata = {
  title: "My Profile — HomeHub",
  description: "Manage your HomeHub buyer profile, saved properties, enquiries and account settings.",
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D3326]">My Profile</h1>
        <p className="mt-1 text-sm text-[#0D3326]/70">
          Manage your HomeHub buyer account
        </p>
      </div>
      
      {/* Existing Profile Page Client */}
      <ProfilePageClient />
    </div>
  );
}
