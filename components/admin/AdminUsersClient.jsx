"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSummaryCard from "@/components/admin/AdminSummaryCard";
import AdminUserCard from "@/components/admin/AdminUserCard";
import { Search, Users, UserCheck, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

// Define Strapi API Configuration
const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token") || localStorage.getItem("jwt");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminUsersClient({ initialFilter = "all" }) {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  useEffect(() => {
    // Basic Auth Check
    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // We fetch users with properties and enquiries to determine metrics and classification.
      // We also populate role to help classification.
      const query = new URLSearchParams({
        "populate[properties]": "*",
        "populate[enquiries]": "*",
        "populate[role]": "*",
      });
      
      const response = await fetch(`${API_URL}/users?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper classification logic matching our architecture rules
  const classifyUser = (u) => {
    const isOwnerRole = u.role?.name === "Owner";
    const propertiesCount = u.properties?.length || 0;
    const enquiriesCount = u.enquiries?.length || 0;
    
    const isSeller = isOwnerRole || propertiesCount > 0;
    const isBuyer = u.role?.name === "Authenticated" || enquiriesCount > 0 || !isSeller;
    
    return { isSeller, isBuyer };
  };

  // Metrics calculation based on real data
  const totalUsers = users.length;
  let buyersCount = 0;
  let sellersCount = 0;
  let activeUsersCount = 0;

  users.forEach((u) => {
    const { isSeller, isBuyer } = classifyUser(u);
    if (isSeller) sellersCount++;
    if (isBuyer) buyersCount++;
    if (!u.blocked) activeUsersCount++;
  });

  // Filter and Search
  const filteredUsers = users.filter((u) => {
    // 1. Filter by Search Query
    const nameMatch = (u.username || u.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (u.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = (u.phone || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchQuery && !nameMatch && !emailMatch && !phoneMatch) {
      return false;
    }
    
    // 2. Filter by Active Filter (All, Buyers, Sellers)
    if (activeFilter === "all") return true;
    
    const { isSeller, isBuyer } = classifyUser(u);
    if (activeFilter === "buyers" && !isBuyer) return false;
    if (activeFilter === "sellers" && !isSeller) return false;
    
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F3EBDD] font-sans">
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0D3326] tracking-tight">Users</h1>
          <p className="mt-2 text-sm text-[#3E4B32] max-w-2xl">
            Manage HomeHub users, buyers and sellers. All data presented is sourced directly from Strapi.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminSummaryCard
            title="Total Users"
            value={loading ? "-" : totalUsers}
            icon={Users}
            surfaceColor="emerald"
          />
          <AdminSummaryCard
            title="Buyers"
            value={loading ? "-" : buyersCount}
            icon={UserCheck}
            surfaceColor="sand"
          />
          <AdminSummaryCard
            title="Sellers"
            value={loading ? "-" : sellersCount}
            icon={Briefcase}
            surfaceColor="earth"
          />
          <AdminSummaryCard
            title="Active Users"
            value={loading ? "-" : activeUsersCount}
            icon={UserCheck}
            surfaceColor="olive"
          />
        </div>

        {/* Search & Filters */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-lg border-0 py-3 pl-10 pr-4 text-[#0D3326] shadow-sm ring-1 ring-inset ring-[#DCCCB0] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#D7AE62] bg-white sm:text-sm sm:leading-6"
            />
          </div>

          <div className="flex gap-2">
            {[
              { id: "all", label: "All Users" },
              { id: "buyers", label: "Buyers" },
              { id: "sellers", label: "Sellers" }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  activeFilter === filter.id
                    ? "bg-[#0D3326] text-white shadow-md"
                    : "bg-white text-[#0D3326] border border-[#DCCCB0] hover:bg-gray-50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Data State */}
        {error ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm border border-red-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">{error}</h3>
            <div className="mt-6">
              <button
                onClick={fetchUsers}
                className="inline-flex items-center rounded-md bg-[#0D3326] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#174638] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Retry
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl bg-white p-6 h-32 border border-gray-100 shadow-sm" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm border border-gray-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">
              {searchQuery ? "No users match your search." : activeFilter === "buyers" ? "No buyers found." : activeFilter === "sellers" ? "No sellers found." : "No users found."}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((user) => (
              <AdminUserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
