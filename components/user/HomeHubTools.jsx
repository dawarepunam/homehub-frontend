import Link from "next/link";
import { Calculator, ArrowRightLeft, TrendingUp, CheckCircle, ArrowUpRight } from "lucide-react";

const TOOLS = [
  {
    id: "emi",
    title: "EMI Calculator",
    desc: "Calculate your estimated monthly installment for home loans instantly.",
    icon: Calculator,
    href: "/user/tools/emi-calculator",
    tag: "Financial",
  },
  {
    id: "area",
    title: "Area Converter",
    desc: "Convert between Sq.ft, Sq.m, Acres, and Hectares with a single tap.",
    icon: ArrowRightLeft,
    href: "/user/tools/area-converter",
    tag: "Utility",
  },
  {
    id: "valuation",
    title: "Property Valuation",
    desc: "Get an estimated market value for properties in any area across India.",
    icon: TrendingUp,
    href: "/user/tools/valuation",
    tag: "Insight",
  },
  {
    id: "eligibility",
    title: "Eligibility Check",
    desc: "Check your home loan eligibility instantly based on your income profile.",
    icon: CheckCircle,
    href: "/user/tools/eligibility",
    tag: "Financial",
  },
];

export default function HomeHubTools() {
  return (
    <section className="bg-[var(--bg-page)] border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

        {/* ── Section Header ── */}
        <div className="mb-12 flex flex-col items-center text-center gap-3">
          <span className="hh-eyebrow">
            <span className="hh-eyebrow-dot" aria-hidden="true" />
            Smart Tools
          </span>
          <h2 className="hh-section-title">HomeHub Tools</h2>
          <p className="hh-section-subtitle max-w-lg">
            Smart, free tools to help you make confident real estate decisions.
          </p>
        </div>

        {/* ── Tool Cards ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group flex flex-col gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-focus)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
            >
              {/* Header row: Icon + Tag */}
              <div className="flex items-start justify-between gap-2">
                <div className="hh-icon-box">
                  <tool.icon size={22} strokeWidth={1.75} />
                </div>
                <span className="shrink-0 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  {tool.tag}
                </span>
              </div>

              {/* Title + Desc */}
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug mb-1.5">
                  {tool.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                  {tool.desc}
                </p>
              </div>

              {/* Footer CTA */}
              <div className="flex items-center gap-1.5 border-t border-[var(--border-subtle)] pt-3 mt-auto">
                <span className="text-xs font-semibold text-[var(--text-muted)] transition-colors duration-200 group-hover:text-[var(--text-primary)]">
                  Open Tool
                </span>
                <ArrowUpRight
                  size={13}
                  strokeWidth={2.5}
                  className="text-[var(--text-muted)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--text-primary)]"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
