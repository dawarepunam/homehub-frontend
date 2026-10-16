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
    if (!dateString) return "Recent";
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
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text-muted)]">
        <Users size={18} />
      </div>
      <p className="mt-3 text-xs font-medium text-[var(--seller-text-muted)]">{message}</p>
    </div>
  );

  return (
    <section className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-6 shadow-xs">
      <div className="flex items-center gap-3 border-b border-[var(--seller-border)] pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] text-[var(--seller-text)]">
          <Users size={16} />
        </div>
        <div>
          <h2 className="text-base font-bold text-[var(--seller-text)]">Buyer Activity</h2>
          <p className="text-[11px] text-[var(--seller-text-muted)]">Real engagement metrics from genuine buyers</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5 border-b border-[var(--seller-border)] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("views")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            activeTab === "views"
              ? "bg-[var(--seller-primary)] text-[var(--seller-surface)] shadow-xs"
              : "bg-[var(--seller-bg-subtle)] text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] hover:bg-[var(--seller-surface-hover)]"
          }`}
        >
          <Users size={13} />
          <span>Views ({stats.views.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("saves")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            activeTab === "saves"
              ? "bg-[var(--seller-primary)] text-[var(--seller-surface)] shadow-xs"
              : "bg-[var(--seller-bg-subtle)] text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] hover:bg-[var(--seller-surface-hover)]"
          }`}
        >
          <Heart size={13} />
          <span>Saves ({stats.saves.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("enquiries")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            activeTab === "enquiries"
              ? "bg-[var(--seller-primary)] text-[var(--seller-surface)] shadow-xs"
              : "bg-[var(--seller-bg-subtle)] text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] hover:bg-[var(--seller-surface-hover)]"
          }`}
        >
          <MessageSquare size={13} />
          <span>Enquiries ({stats.enquiries.length})</span>
        </button>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-[var(--seller-text-muted)]" size={24} />
          </div>
        ) : (
          <div>
            {activeTab === "views" && (
              <div className="space-y-2">
                {stats.views.length === 0 ? renderEmptyState("No buyers have viewed this property yet.") : 
                  stats.views.map((viewer, idx) => (
                    <div key={viewer.id || idx} className="flex items-center justify-between rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] p-3 text-xs">
                      <div>
                        <p className="font-semibold text-[var(--seller-text)]">{viewer.username || viewer.name || viewer.email || "Verified Buyer"}</p>
                        <p className="mt-0.5 text-[11px] text-[var(--seller-text-muted)] flex items-center gap-1">
                          <Calendar size={11} /> {formatDate(viewer.viewDate)}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
            
            {activeTab === "saves" && (
              <div className="space-y-2">
                {stats.saves.length === 0 ? renderEmptyState("No buyers have saved this property yet.") : 
                  stats.saves.map((saver, idx) => (
                    <div key={saver.id || idx} className="flex items-center justify-between rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] p-3 text-xs">
                      <div>
                        <p className="font-semibold text-[var(--seller-text)]">{saver.username || saver.name || saver.email || "Verified Buyer"}</p>
                        <p className="mt-0.5 text-[11px] text-[var(--seller-text-muted)] flex items-center gap-1">
                          <Calendar size={11} /> {formatDate(saver.saveDate)}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}

            {activeTab === "enquiries" && (
              <div className="space-y-2">
                {stats.enquiries.length === 0 ? renderEmptyState("No enquiries yet.") : 
                  stats.enquiries.map((enq, idx) => {
                    const enqAttr = enq.attributes || enq;
                    return (
                      <div key={enq.id || idx} className="flex flex-col gap-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] p-3 sm:flex-row sm:items-center sm:justify-between text-xs">
                        <div>
                          <p className="font-semibold text-[var(--seller-text)]">{enqAttr.Name || "Interested Buyer"}</p>
                          <p className="mt-0.5 text-[11px] text-[var(--seller-text-muted)] flex items-center gap-1">
                            <Calendar size={11} /> {formatDate(enqAttr.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-0.5 sm:text-right">
                          {enqAttr.Phone && <p className="font-medium text-[var(--seller-text)]">{enqAttr.Phone}</p>}
                          {enqAttr.Email && <p className="text-[11px] text-[var(--seller-text-muted)]">{enqAttr.Email}</p>}
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
