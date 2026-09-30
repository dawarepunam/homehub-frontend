"use client";

import Link from "next/link";
import { User, Mail, Phone, MapPin, Calendar, Building, MessageSquare, Map, ChevronRight } from "lucide-react";

export default function AdminUserCard({ user, onActionClick }) {
  // Safe default parsing
  const name = user?.username || user?.name || "Unknown User";
  const email = user?.email || "No email";
  const phone = user?.phone || "No phone";
  
  // Calculate classification
  const isOwnerRole = user?.role?.name === "Owner";
  const propertiesCount = user?.properties?.length || 0;
  const enquiriesCount = user?.enquiries?.length || 0;
  
  const isSeller = isOwnerRole || propertiesCount > 0;
  const isBuyer = user?.role?.name === "Authenticated" || enquiriesCount > 0 || !isSeller;
  
  let capabilityLabel = "Buyer";
  if (isBuyer && isSeller) capabilityLabel = "Buyer + Seller";
  else if (isSeller) capabilityLabel = "Seller";

  // Active status based on standard Strapi blocked flag
  const isActive = !user?.blocked;

  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) 
    : "Unknown";

  return (
    <div className="group relative overflow-hidden rounded-xl bg-[#0D3326] border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D7AE62]/50 hover:shadow-xl hover:shadow-black/20">
      
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          
          {/* Left: Avatar & Main Info */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#174638] text-lg font-bold text-[#D7AE62] border border-white/10 shadow-inner">
              {name.charAt(0).toUpperCase()}
            </div>
            
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-white leading-tight">
                  {name}
                </h3>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isActive ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                }`}>
                  {isActive ? "Active" : "Suspended"}
                </span>
                <span className="inline-flex items-center rounded-full bg-[#3E4B32] px-2 py-0.5 text-xs font-semibold text-[#DCCCB0]">
                  {capabilityLabel}
                </span>
              </div>
              
              <div className="mt-2 flex flex-col gap-1 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 opacity-70" />
                  <span className="truncate">{email}</span>
                </div>
                {phone !== "No phone" && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 opacity-70" />
                    <span>{phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 opacity-70" />
                  <span>Joined {joinDate}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right: Stats & Action */}
          <div className="flex flex-col items-start sm:items-end justify-between h-full gap-4">
            
            {/* Secondary info reveal on hover */}
            <div className="flex gap-4 opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 text-sm font-medium">
               {isSeller && (
                <div className="flex flex-col items-center">
                  <span className="text-gray-400 text-xs">Properties</span>
                  <span className="text-[#D7AE62]">{propertiesCount}</span>
                </div>
               )}
               {isBuyer && (
                 <div className="flex flex-col items-center">
                   <span className="text-gray-400 text-xs">Enquiries</span>
                   <span className="text-[#D7AE62]">{enquiriesCount}</span>
                 </div>
               )}
            </div>

            <Link 
              href={`/admin/users/${user.id}`}
              className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#D7AE62] hover:text-[#0D3326]"
            >
              View User
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
