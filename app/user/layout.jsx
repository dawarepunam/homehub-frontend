// "use client";

// import { Toaster } from "react-hot-toast";

// export const metadata = {
//   title: "HomeHub User",
// };

// export default function UserLayout({ children }) {
//   return (
//     <div className="min-h-screen bg-gray-100">

//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//         }}
//       />

//       {children}

//     </div>
//   );
// }

import Providers from "@/components/Providers";
import BuyerFooter from "@/components/user/BuyerFooter";
import { getUserSiteSettings } from "@/services/userSiteSettings";

export const metadata = {
  title: "HomeHub User",
};

export default async function UserLayout({ children }) {
  const siteSettings = await getUserSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Providers />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <BuyerFooter data={siteSettings?.Footer} />
    </div>
  );
}
