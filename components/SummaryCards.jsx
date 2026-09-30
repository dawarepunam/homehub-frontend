import Link from "next/link";
import { Building2, Factory, Home } from "lucide-react";

export default function SummaryCards({ counts }) {
  const cards = [
    {
      title: "Residential",
      count: counts?.residential ?? 0,
      icon: Home,
      accent: "#D7AE62",
      href: "/owner/properties/residential",
    },
    {
      title: "Commercial",
      count: counts?.commercial ?? 0,
      icon: Building2,
      accent: "#78A894",
      href: "/owner/properties/commercial",
    },
    {
      title: "Industrial",
      count: counts?.industrial ?? 0,
      icon: Factory,
      accent: "#B8C9BC",
      href: "/owner/properties/industrial",
    },
  ];

  return (
    <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className="group"
        >
          <div className="relative overflow-hidden rounded-lg border border-[#D9D1C2] bg-[#F7F0E3] p-5 shadow-[0_8px_24px_rgba(30,61,48,0.07)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#B99852] group-hover:shadow-[0_16px_30px_rgba(30,61,48,0.13)]">
            <div
              className="absolute -right-8 -top-8 h-28 w-28 rounded-full border opacity-40"
              style={{ borderColor: card.accent }}
            />

            <div className="relative flex items-start justify-between gap-4">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-lg text-[#123F32]"
                style={{ backgroundColor: `${card.accent}55` }}
              >
                <card.icon size={21} strokeWidth={1.8} />
              </span>

              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#718177]">
                Property type
              </span>
            </div>

            <h3 className="relative mt-6 text-lg font-extrabold text-[#123F32]">
              {card.title}
            </h3>

            <div className="relative mt-2 flex items-baseline gap-2">
              <p className="text-4xl font-extrabold text-[#174B3B]">
                {card.count}
              </p>
              <span className="text-sm font-semibold text-[#718177]">
                {card.count === 1 ? "Property" : "Properties"}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}