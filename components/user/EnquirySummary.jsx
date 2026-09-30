"use client";

import { MessageSquare, Clock, Users, CalendarDays, CheckCircle2 } from "lucide-react";

export default function EnquirySummary({ counts, activeFilter, onFilterChange }) {
  const summaryCards = [
    { label: "All",        filterKey: "All",        count: counts.all || 0,        icon: MessageSquare, colorClass: "text-emerald-900", bgClass: "bg-emerald-100" },
    { label: "Pending",    filterKey: "Pending",    count: counts.pending || 0,    icon: Clock,         colorClass: "text-amber-700",  bgClass: "bg-amber-100"  },
    { label: "Contacted",  filterKey: "Contacted",  count: counts.contacted || 0,  icon: Users,         colorClass: "text-emerald-700", bgClass: "bg-emerald-100" },
    { label: "Site Visits",filterKey: "Site Visit", count: counts.siteVisits || 0, icon: CalendarDays,  colorClass: "text-emerald-600", bgClass: "bg-emerald-50"  },
    { label: "Closed",     filterKey: "Closed",     count: counts.closed || 0,     icon: CheckCircle2,  colorClass: "text-stone-500",  bgClass: "bg-stone-100"  },
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
              isActive ? "border-amber-500 bg-amber-50/30" : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <p className={`text-sm font-semibold ${isActive ? "text-emerald-900" : "text-stone-600"}`}>
                {card.label}
              </p>
              <div className={`rounded-full p-2 ${card.bgClass}`}>
                <card.icon size={16} className={card.colorClass} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-emerald-900">{card.count}</p>
          </button>
        );
      })}
    </div>
  );
}
