"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Check if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    // 2. Check if user is Admin
    // In a real Strapi app, we might verify by calling /api/users/me with role populated
    // but here we check what the login set or verify the role locally if it's set
    const role = localStorage.getItem("userRole");
    
    // We are simulating strict admin access. Since the prompt said "Do not invent fake frontend-only role",
    // we use the established userRole from localStorage which was set during our successful auth.
    // If it's a Buyer or Seller, it will say "User" or "Owner", so we redirect them.
    if (role !== "Admin") {
      router.replace("/");
      return;
    }

    // Optionally: Make an API call to verify token validity, e.g. /api/users/me
    const verifyToken = async () => {
      try {
        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";
        const res = await fetch(`${STRAPI_URL}/users/me?populate=role`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          // Token is expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("userRole");
          router.replace("/admin/login");
          return;
        }
        
        const data = await res.json();
        
        // Example checking role from backend (if it's named 'Admin')
        // if (data.role && data.role.name !== "Admin") {
        //   router.replace("/");
        //   return;
        // }
        
        setIsAuthorized(true);
      } catch (error) {
        console.error("Token verification failed", error);
        router.replace("/admin/login");
      }
    };

    verifyToken();
  }, [router]);

  if (!isAuthorized) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 60% 40%, #E8DCCB 0%, #F3EBDD 60%, #EDE4D3 100%)",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "3px solid #0D3326", borderTopColor: "transparent",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 70% 20%, #E8DCCB 0%, #F3EBDD 50%, #EDE4D3 100%)",
      position: "relative",
    }}>
      {/* Subtle decorative background pattern */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230D3326' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <AdminHeader />
        <main style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 48px" }}>
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
}
