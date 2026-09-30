import ClientPage from "./ClientPage";
import HomeHeader from "@/app/home/HomeHeader";
import Footer from "@/app/home/Footer";
import AdviceTools from "@/app/home/AdviceTools";
import Link from "next/link";
import { getHomePage } from "@/services/homePage";

export const metadata = {
  title: "Home Affordability Calculator | HomeHub",
  description: "Find out how much property you can afford based on your monthly income, EMI obligations, and savings.",
};

export default async function HomeAffordabilityToolPage() {
  const homePage = await getHomePage();

  // =========================================
  // RELATED TOOLS (exclude current tool)
  // =========================================

  const adviceSection =
    Array.isArray(homePage?.AdviceTools)
      ? homePage.AdviceTools[0]
      : homePage?.AdviceTools;

  const allTools = Array.isArray(adviceSection?.Tools)
    ? adviceSection.Tools
    : [];

  const relatedTools = allTools.filter((t) => {
    const link = typeof t.Link === "string" ? t.Link.trim() : "";
    return link !== "/tools/home-affordability";
  });

  const relatedToolsData = {
    ...adviceSection,
    Tools: relatedTools,
    SectionLabel: "RELATED SMART TOOLS",
    Title: "Explore Other Property Tools",
    Subtitle: "",
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ========== EXACT HOME PAGE HEADER ========== */}
      <HomeHeader header={homePage?.Header} />

      {/* ========== BACK LINK ========== */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", padding: "24px 24px 0" }}>
        <Link
          href="/home#smart-tools"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: 700,
            color: "#18352a",
            textDecoration: "none",
          }}
        >
          ← Back to Smart Tools
        </Link>
      </div>

      {/* ========== TOOL CONTENT ========== */}
      <div style={{ flex: 1 }}>
        <ClientPage />

        {/* ========== RELATED TOOLS (before footer) ========== */}
        {relatedTools.length > 0 && (
          <AdviceTools data={relatedToolsData} />
        )}
      </div>

      {/* ========== EXACT HOME PAGE FOOTER ========== */}
      <Footer data={homePage?.Footer} />

    </main>
  );
}