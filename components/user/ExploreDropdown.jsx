"use client";

import Link from "next/link";
import { ArrowRight, Calculator, Map, Heart, History, Compass, Search } from "lucide-react";

export default function ExploreDropdown() {
  return (
    <div
      className="w-auto overflow-hidden rounded-2xl bg-[var(--bg-card)] shadow-2xl transition-all border border-[var(--border-subtle)] text-[var(--text-primary)]"
      style={{
        width: "max-content",
        maxWidth: "min(640px, calc(100vw - 32px))",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 sm:p-6">
        
        {/* Column 1: Explore Properties */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2">
            Explore Properties
          </h4>
          <ul className="flex flex-col gap-2.5 mt-1">
            <li>
              <Link href="/user/properties" className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <Search size={14} className="text-[var(--text-muted)]" /> All Properties
              </Link>
            </li>
            <li>
              <Link href="/user/search?tag=new" className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <Compass size={14} className="text-[var(--text-muted)]" /> New Projects
              </Link>
            </li>
            <li>
              <Link href="/user/search?type=Residential" className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <ArrowRight size={13} className="text-[var(--text-muted)]" /> Residential
              </Link>
            </li>
            <li>
              <Link href="/user/search?type=Commercial" className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <ArrowRight size={13} className="text-[var(--text-muted)]" /> Commercial
              </Link>
            </li>
            <li>
              <Link href="/user/search?type=Industrial" className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <ArrowRight size={13} className="text-[var(--text-muted)]" /> Industrial
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Tools */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2">
            Tools
          </h4>
          <ul className="flex flex-col gap-2.5 mt-1">
            <li>
              <Link href="/user/tools/emi-calculator" className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <Calculator size={14} className="text-[var(--text-muted)]" /> EMI Calculator
              </Link>
            </li>
            <li>
              <Link href="/user/tools/eligibility" className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <Calculator size={14} className="text-[var(--text-muted)]" /> Affordability
              </Link>
            </li>
            <li>
              <Link href="/user/tools/valuation" className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <Calculator size={14} className="text-[var(--text-muted)]" /> Property Value
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Discover */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2">
            Discover
          </h4>
          <ul className="flex flex-col gap-2.5 mt-1">
            <li>
              <Link href="/user/wishlist" className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <Heart size={14} className="text-[var(--text-muted)]" /> Saved Properties
              </Link>
            </li>
            <li>
              <Link href="/user/search" className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <Map size={14} className="text-[var(--text-muted)]" /> Popular Locations
              </Link>
            </li>
            <li>
              <Link href="/user/enquiries" className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <History size={14} className="text-[var(--text-muted)]" /> Recently Viewed
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
