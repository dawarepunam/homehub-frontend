import Link from "next/link";
import { Calculator, ArrowRightLeft, TrendingUp, CheckCircle } from "lucide-react";

const TOOLS = [
  {
    id: "emi",
    title: "EMI Calculator",
    desc: "Calculate your estimated monthly installment for home loans",
    icon: Calculator,
    href: "/user/tools/emi-calculator",
    color: "#0D3326",
    bg: "#F5F3EE",
  },
  {
    id: "area",
    title: "Area Converter",
    desc: "Quickly convert between Sq.ft, Sq.m, Acres, and Hectares",
    icon: ArrowRightLeft,
    href: "/user/tools/area-converter",
    color: "#D7AE62",
    bg: "#FFFBEB",
  },
  {
    id: "valuation",
    title: "Property Valuation",
    desc: "Get an estimated market value for properties in any area",
    icon: TrendingUp,
    href: "/user/tools/valuation",
    color: "#226E58",
    bg: "#E8F5EE",
  },
  {
    id: "eligibility",
    title: "Eligibility Check",
    desc: "Check your home loan eligibility instantly based on income",
    icon: CheckCircle,
    href: "/user/tools/eligibility",
    color: "#8B5E1A",
    bg: "#FDF8F0",
  },
];

export default function HomeHubTools() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold" style={{ color: "#0D3326" }}>HomeHub Tools</h2>
        <p className="mt-2 text-gray-600">Smart tools to help you make better real estate decisions.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group flex flex-col items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#D7AE62] hover:shadow-lg"
          >
            <div 
              className="flex h-14 w-14 items-center justify-center rounded-2xl transition-all group-hover:scale-110"
              style={{ backgroundColor: tool.bg }}
            >
              <tool.icon size={26} style={{ color: tool.color }} />
            </div>
            
            <div>
              <h3 className="text-lg font-bold" style={{ color: "#0D3326" }}>{tool.title}</h3>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
