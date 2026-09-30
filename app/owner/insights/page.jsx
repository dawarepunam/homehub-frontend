"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InsightsIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/owner/insights/performance");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#064d3b] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold">Loading Insights...</p>
      </div>
    </div>
  );
}
