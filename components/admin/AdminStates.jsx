"use client";

import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function AdminLoadingState({ message = "Loading..." }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: 320, gap: 16,
    }}>
      <Loader2 size={32} className="animate-spin" color="#D7AE62" />
      <p style={{ color: "#6b7f6b", fontSize: 14, fontWeight: 600 }}>{message}</p>
    </div>
  );
}

export function AdminErrorState({ message = "Unable to load data.", onRetry }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: 320, gap: 16, textAlign: "center", padding: "32px 24px",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "rgba(155,104,72,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <AlertCircle size={26} color="#9B6848" />
      </div>
      <div>
        <p style={{ color: "#17231E", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Something went wrong</p>
        <p style={{ color: "#7a8f7a", fontSize: 13, maxWidth: 320 }}>{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: "#0D3326", color: "#F5EDD9", border: "none",
            borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function AdminEmptyState({ title = "Nothing here yet", description = "No records to display.", icon: Icon }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", textAlign: "center", gap: 12,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        background: "rgba(215,174,98,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {Icon ? <Icon size={22} color="#D7AE62" /> : <CheckCircle2 size={22} color="#D7AE62" />}
      </div>
      <p style={{ color: "#17231E", fontWeight: 700, fontSize: 14 }}>{title}</p>
      <p style={{ color: "#8a9a8a", fontSize: 13, maxWidth: 280 }}>{description}</p>
    </div>
  );
}
