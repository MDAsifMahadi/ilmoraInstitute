import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Globe2, HeartHandshake } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import AdmissionCTA from "@/components/AdmissionCTA";
import { getSiteData } from "@/lib/site-data";
import { getIcon } from "@/lib/icons";
import aboutImg from "@/images/about.png";

export const metadata = {
  title: "আমাদের সম্পর্কে",
  description:
    "ইলমুরা ইনস্টিটিউট সম্পর্কে জানুন — আমাদের লক্ষ্য, পদ্ধতি ও প্রতিশ্রুতি।",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { FEATURES, STATS } = await getSiteData();

  return (
    <>
      <PageHeader
        eyebrow="আমাদের সম্পর্কে"
        title="জ্ঞান হোক সহজ, শিক্ষা হোক আনন্দময়"
        description="Ilmora Institute একটি আধুনিক শিক্ষা প্ল্যাটফর্ম, যেখানে সহজ, আনন্দময় ও অর্থবহ শিক্ষার মাধ্যমে জ্ঞান, দক্ষতা ও আত্মবিশ্বাস গড়ে তোলার লক্ষ্য নিয়ে আমরা কাজ করি।"
        breadcrumbs={[{ label: "হোম", href: "/" }, { label: "আমাদের সম্পর্কে" }]}
      />

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary-mist shadow-md">
            <Image
              src={aboutImg}
              alt="ইলমুরা ইনস্টিটিউটের ক্লাসরুম"
              width={1280}
              height={800}
              className="h-auto w-full object-cover"
            />
          </div>
          <div>
            <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[3px] text-primary">
              <span className="h-px w-7 bg-gold" aria-hidden />
              আমাদের লক্ষ্য
            </p>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              শেখা হোক <span className="text-gold">আনন্দের সাথে</span>
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-grey">
              <p>
                <p className="text-gold font-bold">আমাদের মিশন</p>
ইলমোরা ইনস্টিটিউটের লক্ষ্য হলো সহজ, আনন্দময় ও মানসম্মত শিক্ষাকে সবার কাছে সহজলভ্য করে তোলা। প্রযুক্তির আধুনিক ব্যবহারের মাধ্যমে আমরা এমন একটি শিক্ষাব্যবস্থা গড়ে তুলতে চাই, যেখানে শিক্ষার্থীরা শিখবে, বুঝবে এবং অর্জিত জ্ঞান বাস্তব জীবনে প্রয়োগ করতে পারবে।
              </p>
              <p>
<p className="text-gold font-bold">আমাদের ভিশন</p>
আমাদের স্বপ্ন—ইলমোরাকে একটি আন্তর্জাতিক শিক্ষাপ্ল্যাটফর্ম হিসেবে প্রতিষ্ঠিত করা, যেখানে বিশ্বের বিভিন্ন প্রান্তের শিক্ষার্থীরা ঘরে বসেই মানসম্মত শিক্ষা গ্রহণের সুযোগ পাবে। জ্ঞান, দক্ষতা ও মূল্যবোধের সমন্বয়ে আত্মবিশ্বাসী ও দায়িত্বশীল প্রজন্ম গড়ে তোলাই আমাদের দীর্ঘমেয়াদি প্রত্যয়।
              </p>
            </div>
            <ul className="mt-6 space-y-3">
              {[
                { icon: BookOpenCheck, text: "সহজ ও কাঠামোবদ্ধ পদ্ধতি" },
                { icon: HeartHandshake, text: "যত্নশীল ও সনদপ্রাপ্ত শিক্ষক" },
                { icon: Globe2, text: "যেকোনো জায়গা থেকে যুক্ত হতে পারবেন" },
              ].map((item) => (
                <li
                  key={item.text}
                  className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink"
                >
                  <item.icon size={18} className="flex-none text-primary" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary-dark via-primary to-[#0f7b42] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] font-extrabold uppercase tracking-[3px] text-gold">
            এক নজরে
          </p>
          <h2 className="mt-3 text-center font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            ইলমুরা ইনস্টিটিউট
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur"
              >
                <p className="font-display text-3xl font-black text-gold">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold text-white/85">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] font-extrabold uppercase tracking-[3px] text-primary">
            <span className="inline-flex items-center gap-3">
              <span className="h-px w-7 bg-gold" aria-hidden />
              যা-যা আমাদের আলাদা করে
              <span className="h-px w-7 bg-gold" aria-hidden />
            </span>
          </p>
          <h2 className="mt-4 text-center font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            শেখার জন্য সাজানো <span className="text-gold">সুন্দর কাঠামো</span>
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = getIcon(feature.icon);
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-line bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-mist text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-grey">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/admission"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-bold text-[#1c1400] shadow-md transition-all hover:-translate-y-0.5 hover:bg-gold-dark hover:shadow-xl"
            >
              আমাদের সাথে যাত্রা শুরু করুন
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      <AdmissionCTA />
    </>
  );
}