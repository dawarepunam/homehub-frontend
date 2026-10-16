import Link from "next/link";
import { Building2, Factory, Home } from "lucide-react";

export default function SummaryCards({ counts }) {
  const cards = [
    {
      title: "Residential",
      count: counts?.residential ?? 0,
      icon: Home,
      href: "/owner/properties/residential",
    },
    {
      title: "Commercial",
      count: counts?.commercial ?? 0,
      icon: Building2,
      href: "/owner/properties/commercial",
    },
    {
      title: "Industrial",
      count: counts?.industrial ?? 0,
      icon: Factory,
      href: "/owner/properties/industrial",
    },
  ];

  return (
    <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className="group block"
        >
          <div className="relative overflow-hidden rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-6 shadow-[var(--seller-shadow)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--seller-border-focus)] hover:shadow-[var(--seller-shadow-hover)]">
            <div className="relative flex items-center justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] text-[var(--seller-text)] transition-transform duration-300 group-hover:scale-105">
                <card.icon size={22} strokeWidth={1.8} />
              </span>

              <span className="rounded-full border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--seller-text-subtle)]">
                Property Type
              </span>
            </div>

            <h3 className="relative mt-5 text-base font-bold text-[var(--seller-text)]">
              {card.title}
            </h3>

            <div className="relative mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-black tracking-tight text-[var(--seller-text)]">
                {card.count}
              </p>
              <span className="text-xs font-semibold text-[var(--seller-text-muted)]">
                {card.count === 1 ? "Listed Property" : "Listed Properties"}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}