"use client";

import Link from "next/link";
import { ArrowRight, Calculator, Map, Heart, History, Compass, Search } from "lucide-react";

export default function ExploreDropdown() {
  return (
    <div
      className="w-max overflow-hidden rounded-2xl bg-[#F5F3EE] shadow-2xl transition-all"
      style={{ border: "1px solid #D7AE62" }}
    >
      <div className="grid grid-cols-3 gap-8 p-8" style={{ minWidth: "700px" }}>
        
        {/* Column 1: Explore Properties */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-[#0D3326] uppercase tracking-wide border-b border-[#0D3326]/10 pb-2">
            Explore Properties
          </h4>
          <ul className="flex flex-col gap-3 mt-2">
            <li>
              <Link href="/user/properties" className="flex items-center gap-2 text-sm font-semibold text-[#0D3326]/80 hover:text-[#D7AE62] transition-colors">
                <Search size={15} className="text-[#D7AE62]" /> All Properties
              </Link>
            </li>
            <li>
              <Link href="/user/search?tag=new" className="flex items-center gap-2 text-sm font-semibold text-[#0D3326]/80 hover:text-[#D7AE62] transition-colors">
                <Compass size={15} className="text-[#D7AE62]" /> New Projects
              </Link>
            </li>
            <li>
              <Link href="/user/search?type=Residential" className="flex items-center gap-2 text-sm font-semibold text-[#0D3326]/80 hover:text-[#D7AE62] transition-colors">
                <ArrowRight size={14} className="text-[#D7AE62]" /> Residential
              </Link>
            </li>
            <li>
              <Link href="/user/search?type=Commercial" className="flex items-center gap-2 text-sm font-semibold text-[#0D3326]/80 hover:text-[#D7AE62] transition-colors">
                <ArrowRight size={14} className="text-[#D7AE62]" /> Commercial
              </Link>
            </li>
            <li>
              <Link href="/user/search?type=Industrial" className="flex items-center gap-2 text-sm font-semibold text-[#0D3326]/80 hover:text-[#D7AE62] transition-colors">
                <ArrowRight size={14} className="text-[#D7AE62]" /> Industrial
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Tools */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-[#0D3326] uppercase tracking-wide border-b border-[#0D3326]/10 pb-2">
            Tools
          </h4>
          <ul className="flex flex-col gap-3 mt-2">
            <li>
              <Link href="/user/tools/emi-calculator" className="flex items-center gap-2 text-sm font-semibold text-[#0D3326]/80 hover:text-[#D7AE62] transition-colors">
                <Calculator size={15} className="text-[#D7AE62]" /> EMI Calculator
              </Link>
            </li>
            <li>
              <Link href="/user/tools/eligibility" className="flex items-center gap-2 text-sm font-semibold text-[#0D3326]/80 hover:text-[#D7AE62] transition-colors">
                <Calculator size={15} className="text-[#D7AE62]" /> Affordability
              </Link>
            </li>
            <li>
              <Link href="/user/tools/valuation" className="flex items-center gap-2 text-sm font-semibold text-[#0D3326]/80 hover:text-[#D7AE62] transition-colors">
                <Calculator size={15} className="text-[#D7AE62]" /> Property Value
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Discover */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-[#0D3326] uppercase tracking-wide border-b border-[#0D3326]/10 pb-2">
            Discover
          </h4>
          <ul className="flex flex-col gap-3 mt-2">
            <li>
              <Link href="/user/wishlist" className="flex items-center gap-2 text-sm font-semibold text-[#0D3326]/80 hover:text-[#D7AE62] transition-colors">
                <Heart size={15} className="text-[#D7AE62]" /> Saved Properties
              </Link>
            </li>
            <li>
              <Link href="/user/search" className="flex items-center gap-2 text-sm font-semibold text-[#0D3326]/80 hover:text-[#D7AE62] transition-colors">
                <Map size={15} className="text-[#D7AE62]" /> Popular Locations
              </Link>
            </li>
            <li>
              <Link href="/user/enquiries" className="flex items-center gap-2 text-sm font-semibold text-[#0D3326]/80 hover:text-[#D7AE62] transition-colors">
                <History size={15} className="text-[#D7AE62]" /> Recently Viewed
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
