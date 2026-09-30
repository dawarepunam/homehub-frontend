"use client";

import { useState, useEffect } from "react";
import {
  getPropertyViews,
  getPropertySaves,
  getPropertyEnquiries,
} from "@/services/activityService";
import { Users, Heart, MessageSquare, Loader2, Calendar } from "lucide-react";

export default function PropertyActivitySection({ propertyDocumentId }) {
  const [activeTab, setActiveTab] = useState("views");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ views: [], saves: [], enquiries: [] });

  useEffect(() => {
    if (!propertyDocumentId) return;
    let isMounted = true;
    
    async function loadData() {
      setLoading(true);
      try {
        const [views, saves, enquiries] = await Promise.all([
          getPropertyViews(propertyDocumentId),
          getPropertySaves(propertyDocumentId),
          getPropertyEnquiries(propertyDocumentId),
        ]);
        if (isMounted) {
          setStats({ views, saves, enquiries });
        }
      } catch (err) {
        console.warn("Failed to load property activity", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    loadData();
    return () => { isMounted = false; };
  }, [propertyDocumentId]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const renderEmptyState = (message) => (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9D1C2] bg-white py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F0E8] text-[#718177]">
        <Users size={20} />
      </div>
      <p className="mt-4 text-sm font-semibold text-[#123F32]">{message}</p>
    </div>
  );

  return (
    <section className="mt-5 rounded-3xl border border-[#D9D1C2] bg-[#F7F0E3] p-6 shadow-sm sm:p-7">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5E8DE] text-[#174B3B]">
          <Users size={19} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-[#123F32]">Buyer Activity</h2>
          <p className="text-xs text-[#718177]">See who is interacting with your property</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-[#E0D8CA] pb-4">
        <button
          onClick={() => setActiveTab("views")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${activeTab === "views" ? "bg-[#174B3B] text-white" : "bg-transparent text-[#416353] hover:bg-[#E5E8DE]"}`}
        >
          <Users size={16} /> Views ({stats.views.length})
        </button>
        <button
          onClick={() => setActiveTab("saves")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${activeTab === "saves" ? "bg-[#174B3B] text-white" : "bg-transparent text-[#416353] hover:bg-[#E5E8DE]"}`}
        >
          <Heart size={16} /> Saves ({stats.saves.length})
        </button>
        <button
          onClick={() => setActiveTab("enquiries")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${activeTab === "enquiries" ? "bg-[#174B3B] text-white" : "bg-transparent text-[#416353] hover:bg-[#E5E8DE]"}`}
        >
          <MessageSquare size={16} /> Enquiries ({stats.enquiries.length})
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin text-[#B99852]" size={32} />
          </div>
        ) : (
          <div>
            {activeTab === "views" && (
              <div className="space-y-3">
                {stats.views.length === 0 ? renderEmptyState("No buyers have viewed this property yet.") : 
                  stats.views.map((viewer, idx) => (
                    <div key={viewer.id || idx} className="flex items-center justify-between rounded-xl border border-[#E0D8CA] bg-white p-4">
                      <div>
                        <p className="font-bold text-[#123F32]">{viewer.username || viewer.name || viewer.email || "Guest Buyer"}</p>
                        <p className="mt-1 text-xs text-[#718177] flex items-center gap-1">
                          <Calendar size={12} /> {formatDate(viewer.viewDate)}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
            
            {activeTab === "saves" && (
              <div className="space-y-3">
                {stats.saves.length === 0 ? renderEmptyState("No buyers have saved this property yet.") : 
                  stats.saves.map((saver, idx) => (
                    <div key={saver.id || idx} className="flex items-center justify-between rounded-xl border border-[#E0D8CA] bg-white p-4">
                      <div>
                        <p className="font-bold text-[#123F32]">{saver.username || saver.name || saver.email || "Guest Buyer"}</p>
                        <p className="mt-1 text-xs text-[#718177] flex items-center gap-1">
                          <Calendar size={12} /> {formatDate(saver.saveDate)}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}

            {activeTab === "enquiries" && (
              <div className="space-y-3">
                {stats.enquiries.length === 0 ? renderEmptyState("No enquiries yet.") : 
                  stats.enquiries.map((enq, idx) => {
                    const enqAttr = enq.attributes || enq;
                    return (
                      <div key={enq.id || idx} className="flex flex-col gap-2 rounded-xl border border-[#E0D8CA] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-bold text-[#123F32]">{enqAttr.Name || "Interested Buyer"}</p>
                          <p className="mt-1 text-xs text-[#718177] flex items-center gap-1">
                            <Calendar size={12} /> {formatDate(enqAttr.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 sm:text-right">
                          <p className="text-sm font-semibold text-[#416353]">{enqAttr.Phone}</p>
                          <p className="text-xs text-[#718177]">{enqAttr.Email}</p>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
