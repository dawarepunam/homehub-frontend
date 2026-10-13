import { ShieldCheck, Headset, Percent, FileText } from "lucide-react";

const REASONS = [
  {
    title: "100% Verified Properties",
    desc: "Every property goes through a rigorous physical verification process before being listed.",
    icon: ShieldCheck,
  },
  {
    title: "Zero Brokerage",
    desc: "Connect directly with owners and builders. No hidden fees or commissions.",
    icon: Percent,
  },
  {
    title: "Legal Assistance",
    desc: "Get help with property documentation, registration, and legal verification.",
    icon: FileText,
  },
  {
    title: "Dedicated Support",
    desc: "Our relationship managers assist you from property discovery to final handover.",
    icon: Headset,
  },
];

export default function WhyChooseHomeHub() {
  return (
    <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-card)] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center justify-center text-center">
          <h2 className="hh-section-title">Why Choose HomeHub?</h2>
          <p className="hh-section-subtitle mt-3">
            We make your property journey smooth, transparent, and hassle-free.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-all duration-200 hover:-translate-y-1 hover:shadow-sm">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
                <reason.icon size={26} />
              </div>
              <h3 className="mb-2 text-base font-bold text-[var(--text-primary)]">{reason.title}</h3>
              <p className="text-xs leading-relaxed text-[var(--text-muted)]">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
