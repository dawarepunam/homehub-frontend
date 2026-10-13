import Link from "next/link";
import { Calculator, ArrowRightLeft, TrendingUp, CheckCircle } from "lucide-react";

const TOOLS = [
  {
    id: "emi",
    title: "EMI Calculator",
    desc: "Calculate your estimated monthly installment for home loans",
    icon: Calculator,
    href: "/user/tools/emi-calculator",
  },
  {
    id: "area",
    title: "Area Converter",
    desc: "Quickly convert between Sq.ft, Sq.m, Acres, and Hectares",
    icon: ArrowRightLeft,
    href: "/user/tools/area-converter",
  },
  {
    id: "valuation",
    title: "Property Valuation",
    desc: "Get an estimated market value for properties in any area",
    icon: TrendingUp,
    href: "/user/tools/valuation",
  },
  {
    id: "eligibility",
    title: "Eligibility Check",
    desc: "Check your home loan eligibility instantly based on income",
    icon: CheckCircle,
    href: "/user/tools/eligibility",
  },
];

export default function HomeHubTools() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center justify-center text-center">
        <h2 className="hh-section-title">HomeHub Tools</h2>
        <p className="hh-section-subtitle mt-3">Smart tools to help you make better real estate decisions.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group flex flex-col items-start gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border-focus)] hover:shadow-md"
          >
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition-transform duration-200 group-hover:scale-105"
            >
              <tool.icon size={22} />
            </div>
            
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">{tool.title}</h3>
              <p className="mt-1.5 text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
