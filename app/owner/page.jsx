"use client";

import { useEffect, useMemo, useState } from "react";

import Header from "@/components/Header";
import Footer from "./Footer";
import OwnerWelcome from "@/components/OwnerWelcome";
import SummaryCards from "@/components/SummaryCards";
import PropertySection from "@/components/PropertySection";

import {
  getOwnerDashboard,
  getOwnerProperties,
} from "@/services/ownerDashboard";

// =====================================================
// OWNER DASHBOARD PAGE
// Route: /owner
// =====================================================

export default function OwnerDashboardPage() {
  // =====================================================
  // STATE
  // =====================================================

  const [dashboard, setDashboard] = useState(null);
  const [owner, setOwner] = useState(null);
  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // LOAD ALL DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setErrorMessage("");

        // Run both requests in parallel for speed
        const [dashboardData, ownerData] = await Promise.all([
          getOwnerDashboard(),
          getOwnerProperties(),
        ]);

        if (!mounted) return;

        setDashboard(dashboardData || null);
        setOwner(ownerData?.owner || null);
        setProperties(
          Array.isArray(ownerData?.properties) ? ownerData.properties : []
        );
      } catch (error) {
        console.error("OWNER DASHBOARD PAGE ERROR:", error);
        if (mounted) {
          setErrorMessage(
            error?.message || "Unable to load your dashboard. Please try again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // DYNAMIC PROPERTY TYPE COUNTS FOR SUMMARY CARDS
  // =====================================================

  const counts = useMemo(() => {
    const residential = properties.filter(
      (p) =>
        p?.Property_Type?.toString().trim().toLowerCase() === "residential"
    ).length;

    const commercial = properties.filter(
      (p) =>
        p?.Property_Type?.toString().trim().toLowerCase() === "commercial"
    ).length;

    const industrial = properties.filter(
      (p) =>
        p?.Property_Type?.toString().trim().toLowerCase() === "industrial"
    ).length;

    return { residential, commercial, industrial };
  }, [properties]);

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F0E8] px-4">
        <div className="rounded-2xl border border-[#D9D1C2] bg-[#F7F0E3] px-8 py-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#D9D1C2] border-t-[#174B3B]" />
          <p className="text-sm font-semibold text-[#416353]">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (errorMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F0E8] px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-[#F7F0E3] p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
            !
          </div>

          <h1 className="mt-5 text-xl font-bold text-red-600">
            Unable to load dashboard
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#718177]">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-[#174B3B] px-5 py-3 text-sm font-bold text-[#F7F0E3] transition hover:bg-[#123F32]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // =====================================================
  // DASHBOARD PAGE
  // =====================================================

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F0E8]">

      {/* ================================================
          OWNER HEADER
      ================================================ */}
      <Header headerData={dashboard?.header} />

      {/* ================================================
          MAIN CONTENT
      ================================================ */}
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-10">

        {/* ================================================
            OWNER WELCOME
        ================================================ */}
        <OwnerWelcome
          welcomeData={dashboard?.welcome}
          owner={owner}
          properties={properties}
        />

        {/* ================================================
            SUMMARY CARDS — Residential / Commercial / Industrial
        ================================================ */}
        <SummaryCards counts={counts} />

        {/* ================================================
            YOUR PROPERTIES — max 4, links to /owner/properties
        ================================================ */}
        <PropertySection properties={properties} />

      </main>

      {/* ================================================
          OWNER FOOTER
      ================================================ */}
      <Footer
        data={
          dashboard?.Footer ||
          dashboard?.footer ||
          null
        }
      />

    </div>
  );
}
