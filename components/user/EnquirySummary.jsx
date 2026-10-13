"use client";

import { MessageSquare, Clock, Users, CalendarDays, CheckCircle2 } from "lucide-react";

export default function EnquirySummary({ counts, activeFilter, onFilterChange }) {
  const summaryCards = [
    { label: "All",        filterKey: "All",        count: counts.all || 0,        icon: MessageSquare },
    { label: "Pending",    filterKey: "Pending",    count: counts.pending || 0,    icon: Clock },
    { label: "Contacted",  filterKey: "Contacted",  count: counts.contacted || 0,  icon: Users },
    { label: "Site Visits",filterKey: "Site Visit", count: counts.siteVisits || 0, icon: CalendarDays },
    { label: "Closed",     filterKey: "Closed",     count: counts.closed || 0,     icon: CheckCircle2 },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {summaryCards.map((card, index) => {
        const isActive = activeFilter === card.filterKey;
        return (
          <button
            key={index}
            onClick={() => onFilterChange && onFilterChange(card.filterKey)}
            className={`flex flex-col items-start rounded-2xl border p-4 text-left shadow-sm transition hover:shadow-md ${
              isActive
                ? "border-[var(--text-primary)] bg-[var(--bg-card)] ring-2 ring-[var(--text-primary)]"
                : "border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--text-primary)]/40"
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <p className={`text-sm font-semibold ${isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                {card.label}
              </p>
              <div className="rounded-full p-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                <card.icon size={16} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-[var(--text-primary)]">{card.count}</p>
          </button>
        );
      })}
    </div>
  );
}
