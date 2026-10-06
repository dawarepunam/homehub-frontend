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
    <section className="bg-[#F6F0E5] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-extrabold text-[#0D3326] sm:text-3xl">Why Choose HomeHub?</h2>
          <p className="mt-4 text-sm text-[#52645B] sm:text-base">
            We make your property journey smooth, transparent, and hassle-free.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAE2D1]">
                <reason.icon size={32} className="text-[#D7AE62]" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#0D3326]">{reason.title}</h3>
              <p className="text-sm leading-relaxed text-[#52645B]">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
