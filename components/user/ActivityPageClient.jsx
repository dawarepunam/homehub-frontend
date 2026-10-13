"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Heart, 
  Mail, 
  Calendar, 
  Eye, 
  CheckCircle2, 
  Circle,
  Search,
  ChevronRight,
  Clock,
  AlertCircle
} from "lucide-react";

import { getWishlistProperties } from "@/services/userProfile";
import { getMyEnquiries } from "@/services/enquiry";

export default function ActivityPageClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All Activity");

  // Data
  const [savedProperties, setSavedProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [siteVisits, setSiteVisits] = useState([]);
  const [activities, setActivities] = useState([]);

  // Stats
  const savedCount = savedProperties.length;
  const enquiriesCount = enquiries.length;
  const siteVisitsCount = siteVisits.length;
  const viewedCount = 0; // Not supported by backend yet

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [fetchedWishlist, fetchedEnquiries] = await Promise.all([
        getWishlistProperties().catch(() => []),
        getMyEnquiries().catch(() => [])
      ]);

      const validWishlist = Array.isArray(fetchedWishlist) ? fetchedWishlist : [];
      const validEnquiries = Array.isArray(fetchedEnquiries) ? fetchedEnquiries : [];

      setSavedProperties(validWishlist);

      // Extract site visits from enquiries
      const siteVisitStatuses = [
        "Site Visit Pending",
        "Site Visit",
        "Scheduled",
        "Confirmed",
        "Completed",
        "Cancelled",
        "Rescheduled",
      ];
      
      const parsedEnquiries = validEnquiries.filter(e => !siteVisitStatuses.includes(e?.Status));
      const parsedSiteVisits = validEnquiries.filter(e => siteVisitStatuses.includes(e?.Status));
      
      setEnquiries(parsedEnquiries);
      setSiteVisits(parsedSiteVisits);

      // Build unified activity timeline
      const unifiedActivities = [];

      // 1. Saved Properties
      validWishlist.forEach(prop => {
        if (!prop) return;
        unifiedActivities.push({
          id: `saved-${prop.documentId || prop.id}`,
          type: "Saved",
          title: "Property Saved",
          subtitle: `${prop.BHK || ''} ${prop.PropertyType || 'Property'} • ${prop.Locality || ''}, ${prop.City || ''}`.trim().replace(/^•\s*/, ''),
          description: "Saved to your properties",
          date: new Date(prop.updatedAt || prop.createdAt || Date.now()),
          link: `/property/${prop.documentId || prop.id}`,
          icon: <Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
        });
      });

      // 2. Enquiries
      parsedEnquiries.forEach(enq => {
        if (!enq) return;
        const prop = enq.property || {};
        unifiedActivities.push({
          id: `enquiry-${enq.documentId || enq.id}`,
          type: "Enquiry",
          title: "Enquiry Sent",
          subtitle: `${prop.BHK || ''} ${prop.PropertyType || 'Property'} • ${prop.Locality || ''}, ${prop.City || ''}`.trim().replace(/^•\s*/, ''),
          description: `Enquiry submitted (${enq.Status || 'Pending'})`,
          date: new Date(enq.createdAt || Date.now()),
          link: `/user/enquiries`,
          icon: <Mail className="w-5 h-5 text-[var(--text-primary)]" />
        });
      });

      // 3. Site Visits
      parsedSiteVisits.forEach(visit => {
        if (!visit) return;
        const prop = visit.property || {};
        unifiedActivities.push({
          id: `visit-${visit.documentId || visit.id}`,
          type: "Site Visit",
          title: `Site Visit ${visit.Status}`,
          subtitle: `${prop.BHK || ''} ${prop.PropertyType || 'Property'} • ${prop.Locality || ''}, ${prop.City || ''}`.trim().replace(/^•\s*/, ''),
          description: `Visit ${visit.Status.toLowerCase()}`,
          date: new Date(visit.updatedAt || visit.createdAt || Date.now()),
          link: `/user/profile`,
          icon: <Calendar className="w-5 h-5 text-[var(--text-primary)]" />
        });
      });

      // Sort by date descending
      unifiedActivities.sort((a, b) => b.date - a.date);
      setActivities(unifiedActivities);

    } catch (err) {
      console.error("Error fetching activity data:", err);
      setError("Unable to load your activity.");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredActivities = () => {
    if (activeFilter === "All Activity") return activities;
    if (activeFilter === "Saved") return activities.filter(a => a.type === "Saved");
    if (activeFilter === "Enquiries") return activities.filter(a => a.type === "Enquiry");
    if (activeFilter === "Site Visits") return activities.filter(a => a.type === "Site Visit");
    if (activeFilter === "Viewed") return [];
    return activities;
  };

  const filteredActivities = getFilteredActivities();

  const formatDate = (dateObj) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = dateObj.getDate() === today.getDate() && 
                    dateObj.getMonth() === today.getMonth() && 
                    dateObj.getFullYear() === today.getFullYear();
    
    const isYesterday = dateObj.getDate() === yesterday.getDate() && 
                        dateObj.getMonth() === yesterday.getMonth() && 
                        dateObj.getFullYear() === yesterday.getFullYear();

    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `Today • ${time}`;
    if (isYesterday) return `Yesterday • ${time}`;
    
    return `${dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • ${time}`;
  };

  // Group activities by display date for the timeline
  const groupedActivities = filteredActivities.reduce((acc, activity) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let group = "";
    const dateObj = activity.date;

    const isToday = dateObj.getDate() === today.getDate() && 
                    dateObj.getMonth() === today.getMonth() && 
                    dateObj.getFullYear() === today.getFullYear();
    
    const isYesterday = dateObj.getDate() === yesterday.getDate() && 
                        dateObj.getMonth() === yesterday.getMonth() && 
                        dateObj.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      group = "Today";
    } else if (isYesterday) {
      group = "Yesterday";
    } else {
      group = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    if (!acc[group]) acc[group] = [];
    acc[group].push(activity);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm">
        <div className="w-8 h-8 border-4 border-[var(--border-subtle)] border-t-[var(--text-primary)] rounded-full animate-spin mb-4"></div>
        <p className="text-[var(--text-secondary)]">Loading your activity...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-2xl border border-red-500/20 bg-[var(--bg-card)] p-6 text-center shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-[var(--text-primary)] font-semibold mb-2">{error}</p>
        <p className="text-sm text-[var(--text-secondary)] mb-6">Please try again later.</p>
        <button 
          onClick={fetchData}
          className="hh-btn hh-btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  const hasAnyActivity = activities.length > 0;

  return (
    <div className="space-y-8">
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] p-4 flex flex-col shadow-sm">
          <div className="flex items-center space-x-2 text-[var(--text-secondary)] mb-3">
            <div className="bg-red-500/10 p-1.5 rounded-full">
              <Heart className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-sm font-medium">Saved Properties</span>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-[var(--text-primary)]">{savedCount}</span>
            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] opacity-40" />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] p-4 flex flex-col shadow-sm">
          <div className="flex items-center space-x-2 text-[var(--text-secondary)] mb-3">
            <div className="bg-amber-500/10 p-1.5 rounded-full">
              <Mail className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-sm font-medium">Enquiries</span>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-[var(--text-primary)]">{enquiriesCount}</span>
            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] opacity-40" />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] p-4 flex flex-col shadow-sm">
          <div className="flex items-center space-x-2 text-[var(--text-secondary)] mb-3">
            <div className="bg-blue-500/10 p-1.5 rounded-full">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium">Site Visits</span>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-[var(--text-primary)]">{siteVisitsCount}</span>
            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] opacity-40" />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] p-4 flex flex-col shadow-sm opacity-70">
          <div className="flex items-center space-x-2 text-[var(--text-secondary)] mb-3">
            <div className="bg-emerald-500/10 p-1.5 rounded-full">
              <Eye className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm font-medium">Viewed Properties</span>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-[var(--text-primary)]">{viewedCount}</span>
            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] opacity-40" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* MAIN ACTIVITY TIMELINE */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Recent Activity</h2>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {["All Activity", "Saved", "Viewed", "Enquiries", "Site Visits"].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors border ${
                    activeFilter === filter 
                      ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] border-[var(--btn-primary-bg)]" 
                      : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {!hasAnyActivity && activeFilter === "All Activity" ? (
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-12 text-center shadow-sm">
              <Clock className="w-12 h-12 text-[var(--text-secondary)] opacity-30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">No activity yet</h3>
              <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                Start exploring properties and your activity will appear here.
              </p>
              <Link 
                href="/user/properties"
                className="hh-btn hh-btn-primary"
              >
                Explore Properties
              </Link>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-12 text-center shadow-sm">
              <p className="text-[var(--text-secondary)]">No {activeFilter.toLowerCase()} found.</p>
            </div>
          ) : (
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-sm p-6 relative">
              <div className="absolute left-[39px] top-6 bottom-6 w-px bg-[var(--border-subtle)] z-0"></div>
              
              <div className="space-y-8 relative z-10">
                {Object.entries(groupedActivities).map(([groupDate, items]) => (
                  <div key={groupDate} className="space-y-4">
                    <div className="flex items-center gap-3 bg-[var(--bg-card)]">
                      <div className="w-3 h-3 rounded-full bg-[var(--text-primary)] flex-shrink-0 ml-[10px]"></div>
                      <span className="text-sm font-bold text-[var(--text-primary)]">{groupDate}</span>
                    </div>
                    
                    <div className="space-y-4 pl-10">
                      {items.map(activity => (
                        <Link 
                          key={activity.id} 
                          href={activity.link}
                          className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] transition-all group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-2.5 rounded-full shadow-sm mt-1">
                              {activity.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                {activity.title}
                              </h4>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">{activity.subtitle}</p>
                              <div className="flex items-center gap-2 mt-1.5 text-xs text-[var(--text-secondary)]">
                                <span>{activity.description}</span>
                                <span>•</span>
                                <span>{formatDate(activity.date)}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] opacity-40 group-hover:opacity-100 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR - JOURNEY */}
        <div className="hidden lg:block w-80 space-y-6">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-sm p-6">
            <h3 className="font-bold text-[var(--text-primary)] text-lg">Your Property Journey</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">From search to your dream home</p>
            
            <div className="space-y-6 relative">
              <div className="absolute left-[23px] top-4 bottom-4 w-px bg-[var(--border-subtle)] z-0"></div>
              
              {/* Search */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="bg-emerald-500/10 w-12 h-12 rounded-full flex items-center justify-center border border-[var(--border-subtle)] shrink-0">
                  <Search className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="pt-1 flex-1">
                  <h4 className="font-bold text-[var(--text-primary)] text-sm">Search Properties</h4>
                  <p className="text-xs text-[var(--text-secondary)]">You started your search</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1.5" />
              </div>

              {/* Viewed */}
              <div className="flex items-start gap-4 relative z-10 opacity-60">
                <div className="bg-[var(--bg-surface)] w-12 h-12 rounded-full flex items-center justify-center border border-[var(--border-subtle)] shrink-0">
                  <Eye className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>
                <div className="pt-1 flex-1">
                  <h4 className="font-medium text-[var(--text-primary)] text-sm">Viewed Properties</h4>
                  <p className="text-xs text-[var(--text-secondary)]">Explore properties you like</p>
                </div>
                <Circle className="w-5 h-5 text-[var(--border-subtle)] mt-1.5" />
              </div>

              {/* Saved */}
              <div className={`flex items-start gap-4 relative z-10 ${savedCount === 0 ? 'opacity-60' : ''}`}>
                <div className={`${savedCount > 0 ? 'bg-red-500/10' : 'bg-[var(--bg-surface)]'} w-12 h-12 rounded-full flex items-center justify-center border border-[var(--border-subtle)] shrink-0`}>
                  <Heart className={`w-5 h-5 ${savedCount > 0 ? 'text-red-500' : 'text-[var(--text-secondary)]'}`} />
                </div>
                <div className="pt-1 flex-1">
                  <h4 className={`${savedCount > 0 ? 'font-bold' : 'font-medium'} text-[var(--text-primary)] text-sm`}>Saved Properties</h4>
                  <p className="text-xs text-[var(--text-secondary)]">{savedCount > 0 ? `You saved ${savedCount} properties` : 'Save properties you like'}</p>
                </div>
                {savedCount > 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1.5" />
                ) : (
                  <Circle className="w-5 h-5 text-[var(--border-subtle)] mt-1.5" />
                )}
              </div>

              {/* Enquired */}
              <div className={`flex items-start gap-4 relative z-10 ${enquiriesCount === 0 ? 'opacity-60' : ''}`}>
                <div className={`${enquiriesCount > 0 ? 'bg-amber-500/10' : 'bg-[var(--bg-surface)]'} w-12 h-12 rounded-full flex items-center justify-center border border-[var(--border-subtle)] shrink-0`}>
                  <Mail className={`w-5 h-5 ${enquiriesCount > 0 ? 'text-amber-600' : 'text-[var(--text-secondary)]'}`} />
                </div>
                <div className="pt-1 flex-1">
                  <h4 className={`${enquiriesCount > 0 ? 'font-bold' : 'font-medium'} text-[var(--text-primary)] text-sm`}>Enquired</h4>
                  <p className="text-xs text-[var(--text-secondary)]">{enquiriesCount > 0 ? `You sent ${enquiriesCount} enquiries` : 'Contact property owners'}</p>
                </div>
                {enquiriesCount > 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1.5" />
                ) : (
                  <Circle className="w-5 h-5 text-[var(--border-subtle)] mt-1.5" />
                )}
              </div>

              {/* Site Visit */}
              <div className={`flex items-start gap-4 relative z-10 ${siteVisitsCount === 0 ? 'opacity-60' : ''}`}>
                <div className={`${siteVisitsCount > 0 ? 'bg-blue-500/10' : 'bg-[var(--bg-surface)]'} w-12 h-12 rounded-full flex items-center justify-center border border-[var(--border-subtle)] shrink-0`}>
                  <Calendar className={`w-5 h-5 ${siteVisitsCount > 0 ? 'text-blue-600' : 'text-[var(--text-secondary)]'}`} />
                </div>
                <div className="pt-1 flex-1">
                  <h4 className={`${siteVisitsCount > 0 ? 'font-bold' : 'font-medium'} text-[var(--text-primary)] text-sm`}>Site Visit</h4>
                  <p className="text-xs text-[var(--text-secondary)]">{siteVisitsCount > 0 ? `You have ${siteVisitsCount} site visits` : 'Schedule site visits'}</p>
                </div>
                {siteVisitsCount > 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1.5" />
                ) : (
                  <Circle className="w-5 h-5 text-[var(--border-subtle)] mt-1.5" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 text-center">
            <div className="w-16 h-16 bg-[var(--bg-card)] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-[var(--border-subtle)]">
              <Search className="w-8 h-8 text-[var(--text-primary)]" />
            </div>
            <h4 className="font-bold text-[var(--text-primary)] mb-2">Looking for something specific?</h4>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Update your requirements to get better property recommendations.
            </p>
            <Link 
              href="/user/profile/requirements"
              className="hh-btn hh-btn-primary w-full justify-center"
            >
              Update Requirement <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* CONTINUE EXPLORING */}
      <div className="pt-4 border-t border-[var(--border-subtle)]">
        <h3 className="font-bold text-[var(--text-primary)] mb-1">Continue Exploring</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">Discover more properties and manage your search.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/user/properties" className="flex items-center justify-between p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] hover:border-[var(--text-primary)] transition-colors group">
            <div className="flex items-center gap-3">
              <div className="bg-[var(--bg-surface)] p-2 rounded-full transition-colors">
                <Search className="w-5 h-5 text-[var(--text-primary)]" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--text-primary)] text-sm">Search Properties</h4>
                <p className="text-xs text-[var(--text-secondary)]">Find your next home</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link href="/user/wishlist" className="flex items-center justify-between p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] hover:border-[var(--text-primary)] transition-colors group">
            <div className="flex items-center gap-3">
              <div className="bg-[var(--bg-surface)] p-2 rounded-full transition-colors">
                <Heart className="w-5 h-5 text-[var(--text-primary)]" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--text-primary)] text-sm">Saved Properties</h4>
                <p className="text-xs text-[var(--text-secondary)]">View your saved listings</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link href="/user/enquiries" className="flex items-center justify-between p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] hover:border-[var(--text-primary)] transition-colors group">
            <div className="flex items-center gap-3">
              <div className="bg-[var(--bg-surface)] p-2 rounded-full transition-colors">
                <Mail className="w-5 h-5 text-[var(--text-primary)]" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--text-primary)] text-sm">My Enquiries</h4>
                <p className="text-xs text-[var(--text-secondary)]">Track your enquiries</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
