import Link from "next/link";
import { ArrowRight, Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-cream px-4 py-20">
      <div className="text-center">
        <p className="font-display text-7xl font-black tracking-tight text-primary">
          ৪০৪
        </p>
        <p className="mt-2 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[3px] text-grey">
          <Compass size={14} />
          পেজটি পাওয়া যায়নি
        </p>
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          আপনি যে পেজটি খুঁজছেন তা নেই
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-grey">
          পেজটি সরিয়ে ফেলা হয়েছে অথবা বর্তমানে অনুপলব্ধ। ফিরে যান হোম পেজে,
          অথবা কুরআন শিক্ষা শুরু করতে ভর্তি হোন।
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Home size={18} />
            হোম পেজে ফিরুন
          </Link>
          <Link
            href="/admission"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-base font-bold text-[#1c1400] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-gold-dark hover:shadow-md"
          >
            ভর্তি হোন
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}