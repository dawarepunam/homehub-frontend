"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackButton({ fallback = "/user/properties" }) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Basic check to see if we have history to go back to
    setCanGoBack(window.history.length > 2);
  }, []);

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#E5DDD0] px-4 py-2 text-sm font-bold text-[#0D3326] transition hover:border-[#D7AE62] hover:text-[#D7AE62] shadow-sm"
    >
      <ArrowLeft size={16} />
      Back to Properties
    </button>
  );
}
