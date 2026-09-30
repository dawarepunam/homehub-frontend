"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSummaryCard from "@/components/admin/AdminSummaryCard";
import { 
  User, Mail, Phone, MapPin, Calendar, Briefcase, UserCheck, 
  Home, MessageSquare, Map, Clock, AlertCircle, Search, ChevronRight 
} from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";
const STRAPI_BASE_URL = API_URL.replace("/api", "");

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token") || localStorage.getItem("jwt");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminUserDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    fetchUser();
  }, [id, router]);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        "populate[properties][populate]": "CoverImage",
        "populate[enquiries][populate]": "property",
        "populate[role]": "*",
      });
      
      const response = await fetch(`${API_URL}/users/${id}?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load user details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3EBDD] font-sans">
        <AdminHeader />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-32 rounded-xl bg-white/50 border border-white/20"></div>
            <div className="h-64 rounded-xl bg-white/50 border border-white/20"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#F3EBDD] font-sans">
        <AdminHeader />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-white p-12 text-center shadow-sm border border-red-100">
             <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
             <h3 className="text-lg font-medium text-gray-900">{error || "User not found"}</h3>
             <button
                onClick={() => router.push('/admin/users')}
                className="mt-6 inline-flex items-center rounded-md bg-[#0D3326] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#174638]"
              >
                Back to Users
              </button>
          </div>
        </main>
      </div>
    );
  }

  // Derived classification & data
  const name = user.username || user.name || "Unknown User";
  const isOwnerRole = user.role?.name === "Owner";
  const properties = user.properties || [];
  const enquiries = user.enquiries || [];
  
  const isSeller = isOwnerRole || properties.length > 0;
  const isBuyer = user.role?.name === "Authenticated" || enquiries.length > 0 || !isSeller;
  
  let capabilityLabel = "Buyer";
  if (isBuyer && isSeller) capabilityLabel = "Buyer + Seller";
  else if (isSeller) capabilityLabel = "Seller";

  const isActive = !user.blocked;
  const joinDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) 
    : "Unknown";

  return (
    <div className="min-h-screen bg-[#F3EBDD] font-sans">
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D3326] to-[#174638] p-8 shadow-xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <User className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-[#3E4B32] text-4xl font-bold text-[#D7AE62] border-4 border-white/10 shadow-inner">
              {name.charAt(0).toUpperCase()}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex flex-col md:flex-row items-center gap-3">
                {name}
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${isActive ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                  {isActive ? "Active Account" : "Suspended"}
                </span>
              </h1>
              <p className="text-[#DCCCB0] mt-1 font-medium">{capabilityLabel}</p>
              
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-300">
                {user.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#D7AE62]" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#D7AE62]" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#D7AE62]" />
                    <span>Joined {joinDate}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium border border-white/20">
                 More Actions ▾
               </button>
            </div>
          </div>
        </div>

        {/* Activity Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isSeller && (
            <AdminSummaryCard
              title="Properties"
              value={properties.length}
              icon={Home}
              surfaceColor="emerald"
            />
          )}
          {isBuyer && (
             <AdminSummaryCard
               title="Enquiries"
               value={enquiries.length}
               icon={MessageSquare}
               surfaceColor="sand"
             />
          )}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          
          {/* Account Information */}
          <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#0D3326] mb-4 border-b border-gray-100 pb-2">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <span className="block text-sm font-medium text-gray-500">Name</span>
                <span className="block text-md text-gray-900 font-semibold">{name}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Email</span>
                <span className="block text-md text-gray-900 font-semibold">{user.email || "N/A"}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Phone</span>
                <span className="block text-md text-gray-900 font-semibold">{user.phone || "N/A"}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Role / Capability</span>
                <span className="block text-md text-gray-900 font-semibold">{capabilityLabel}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Joined Date</span>
                <span className="block text-md text-gray-900 font-semibold">{joinDate}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Status</span>
                <span className="block text-md text-gray-900 font-semibold">{isActive ? "Active" : "Suspended"}</span>
              </div>
            </div>
          </section>

          {/* Seller Information (If Seller) */}
          {isSeller && (
            <section className="rounded-xl bg-[#F8F9FA] p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-[#0D3326] mb-4 border-b border-gray-200 pb-2 flex justify-between items-center">
                Seller Overview
              </h2>
              
              <div className="mt-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Properties ({properties.length})</h3>
                {properties.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No properties found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {properties.slice(0, 4).map(prop => (
                      <div key={prop.id} className="flex gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-[#D7AE62] transition-colors group cursor-pointer">
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {prop.CoverImage?.url ? (
                             <img src={`${STRAPI_BASE_URL}${prop.CoverImage.url}`} alt={prop.Title} className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50"><Home className="w-6 h-6" /></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-[#0D3326] truncate group-hover:text-[#174638]">{prop.Title}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> {prop.City || "Unknown location"}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                             <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#0D3326]/10 text-[#0D3326]">{prop.PropertyStatus || "Draft"}</span>
                             <span className="text-sm font-bold text-[#9B6848]">
                               {prop.Price ? `₹${prop.Price.toLocaleString()}` : "Price N/A"}
                             </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {properties.length > 4 && (
                  <button className="mt-4 text-sm font-bold text-[#174638] hover:text-[#0D3326] flex items-center">
                    View all {properties.length} properties <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Buyer Information (If Buyer) */}
          {isBuyer && (
             <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
               <h2 className="text-lg font-bold text-[#0D3326] mb-4 border-b border-gray-100 pb-2">
                 Buyer Activity
               </h2>
               
               <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Recent Enquiries ({enquiries.length})</h3>
                  {enquiries.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No enquiries yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {enquiries.slice(0, 5).map(enq => (
                         <div key={enq.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                            <div>
                               <p className="text-sm font-bold text-gray-900">
                                 {enq.property?.Title ? `Enquiry for ${enq.property.Title}` : "General Enquiry"}
                               </p>
                               <p className="text-xs text-gray-500 mt-1">
                                 {enq.createdAt 
                                    ? new Date(enq.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) 
                                    : "Unknown date"}
                               </p>
                            </div>
                            <div className="mt-2 sm:mt-0">
                               <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                                 {enq.Statuss || "New"}
                               </span>
                            </div>
                         </div>
                      ))}
                    </div>
                  )}
               </div>
             </section>
          )}

        </div>
      </main>
    </div>
  );
}
