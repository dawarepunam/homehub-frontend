import UserHeader from "@/components/user/UserHeader";
import AreaConverterClient from "@/components/user/AreaConverterClient";
import { getUserSiteSettings } from "@/services/userSiteSettings";

export const metadata = {
  title: "Area Converter | HomeHub",
  description:
    "Convert property area between Square Feet, Square Meter, Square Yard, Acre, and Guntha instantly.",
};

export default async function AreaConverterPage() {
  const siteSettings = await getUserSiteSettings();

  return (
    <main className="min-h-screen" style={{ background: "#F5F3EE" }}>
      <UserHeader headerData={siteSettings?.UserHeader} />
      <AreaConverterClient />
    </main>
  );
}
