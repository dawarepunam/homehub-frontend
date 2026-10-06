"use client";

import { usePathname } from "next/navigation";
import BuyerFooter from "./BuyerFooter";

export default function ConditionalBuyerFooter({ data }) {
  const pathname = usePathname();
  
  // Hide footer on user authentication pages
  if (pathname === "/user/login" || pathname === "/user/register") {
    return null;
  }
  
  return <BuyerFooter data={data} />;
}
