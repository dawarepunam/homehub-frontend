import { ShieldCheck, Headset, Percent, FileText } from "lucide-react";

const REASONS = [
  {
    title: "100% Verified Listings",
    desc: "Every property undergoes rigorous physical verification before being listed on HomeHub.",
    icon: ShieldCheck,
    stat: "100%",
    statLabel: "Verified",
  },
  {
    title: "Zero Brokerage",
    desc: "Connect directly with owners and builders. No hidden fees, no middlemen, no commissions.",
    icon: Percent,
    stat: "₹0",
    statLabel: "Brokerage",
  },
  {
    title: "Legal Assistance",
    desc: "Expert help with property documentation, registration, and full legal verification.",
    icon: FileText,
    stat: "24h",
    statLabel: "Response",
  },
  {
    title: "Dedicated Support",
    desc: "Relationship managers assist you from first discovery through to final property handover.",
    icon: Headset,
    stat: "365",
    statLabel: "Days a Year",
  },
];

export default function WhyChooseHomeHub() {
  return (
    <section className="bg-[var(--bg-card)] border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

        {/* ── Section Header ── */}
        <div className="mb-14 flex flex-col items-center text-center gap-3">
          <span className="hh-eyebrow">
            <span className="hh-eyebrow-dot" aria-hidden="true" />
            Why HomeHub
          </span>
          <h2 className="hh-section-title">Why Choose HomeHub?</h2>
          <p className="hh-section-subtitle max-w-lg">
            We make your property journey smooth, transparent, and completely hassle-free.
          </p>
        </div>

        {/* ── Reason Cards ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason, index) => (
            <div
              key={index}
              className="group flex flex-col gap-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-focus)] hover:shadow-md"
            >
              {/* Stat + Icon row */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="block text-2xl font-extrabold tracking-tight text-[var(--text-primary)] leading-none">
                    {reason.stat}
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-0.5">
                    {reason.statLabel}
                  </span>
                </div>
                <div className="hh-icon-box shrink-0">
                  <reason.icon size={20} strokeWidth={1.75} />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-[var(--border-subtle)]" aria-hidden="true" />

              {/* Text */}
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 leading-snug">
                  {reason.title}
                </h3>
                <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                  {reason.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
