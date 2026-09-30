import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import BuyerAccountSidebar from "./BuyerAccountSidebar";

export default function BuyerAccountLayout({ children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-[13px] font-semibold text-[#0D3326]/60">
        <Link href="/user" className="flex items-center gap-1 transition hover:text-[#0D3326]">
          <Home size={13} />
          <span>Home</span>
        </Link>
        <ChevronRight size={11} />
        <span className="text-[#0D3326]">My Account</span>
      </nav>

      {/* Main Layout Container */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-8">
        
        {/* Sidebar (Includes mobile navigation and desktop sidebar) */}
        <BuyerAccountSidebar />

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
}
