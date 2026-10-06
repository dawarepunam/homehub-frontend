"use client";

import { usePathname } from "next/navigation";
import AdminFooter from "./AdminFooter";

export default function ConditionalAdminFooter() {
  const pathname = usePathname();
  
  if (pathname === "/admin/login") {
    return null;
  }
  
  return <AdminFooter />;
}
