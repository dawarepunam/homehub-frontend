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
import { getOwnerEnquiries } from "@/services/enquiry";

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
  const [totalLeads, setTotalLeads] = useState(null);

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

        // Run all three requests in parallel for speed
        const [dashboardData, ownerData, enquiriesData] = await Promise.all([
          getOwnerDashboard(),
          getOwnerProperties(),
          getOwnerEnquiries().catch(() => []),
        ]);

        if (!mounted) return;

        setDashboard(dashboardData || null);
        setOwner(ownerData?.owner || null);

        const ownedProps = Array.isArray(ownerData?.properties)
          ? ownerData.properties
          : [];
        setProperties(ownedProps);

        // Total leads = number of enquiries for this owner's properties
        if (Array.isArray(enquiriesData)) {
          setTotalLeads(enquiriesData.length);
        }
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
      <main
        className="flex min-h-screen items-center justify-center px-4"
        style={{ backgroundColor: "var(--seller-bg)" }}
      >
        <div
          className="rounded-2xl px-8 py-8 text-center shadow-sm"
          style={{
            backgroundColor: "var(--seller-surface)",
            border: "1px solid var(--seller-border)",
            color: "var(--seller-text)",
          }}
        >
          <div
            className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4"
            style={{
              borderColor: "var(--seller-border)",
              borderTopColor: "var(--seller-text)",
            }}
          />
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--seller-text-muted)" }}
          >
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
      <main
        className="flex min-h-screen items-center justify-center px-4"
        style={{ backgroundColor: "var(--seller-bg)" }}
      >
        <div
          className="w-full max-w-lg rounded-2xl p-8 text-center shadow-sm"
          style={{
            backgroundColor: "var(--seller-surface)",
            border: "1px solid var(--seller-border)",
          }}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl font-bold text-red-500">
            !
          </div>

          <h1
            className="mt-5 text-xl font-bold"
            style={{ color: "var(--seller-text)" }}
          >
            Unable to load dashboard
          </h1>

          <p
            className="mt-3 text-sm leading-6"
            style={{ color: "var(--seller-text-muted)" }}
          >
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl px-5 py-3 text-sm font-bold transition hover:opacity-90"
            style={{
              backgroundColor: "var(--seller-text)",
              color: "var(--seller-surface)",
            }}
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
    <div className="seller-page-wrapper flex min-h-screen flex-col">

      {/* ================================================
          OWNER HEADER
      ================================================ */}
      <Header headerData={dashboard?.header} />

      {/* ================================================
          MAIN CONTENT
      ================================================ */}
      <main className="mx-auto w-full max-w-[1400px] flex-1 pb-12 pt-4 sm:pt-5">

        {/* ================================================
            OWNER WELCOME
        ================================================ */}
        <OwnerWelcome
          welcomeData={dashboard?.welcome}
          owner={owner}
          properties={properties}
          totalLeads={totalLeads}
        />

        {/* ================================================
            SUMMARY CARDS — Residential / Commercial / Industrial
        ================================================ */}
        <div className="px-4 sm:px-6 lg:px-10">
          <SummaryCards counts={counts} />

          {/* ================================================
              YOUR PROPERTIES — max 4, links to /owner/properties
          ================================================ */}
          <PropertySection properties={properties} />
        </div>

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
