import Link from "next/link";
import { CircleDot, Mail, MessageCircle, Phone } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import AdmissionForm from "@/components/AdmissionForm";
import { prisma } from "@/lib/prisma";
import { getSiteData, getSiteInfo } from "@/lib/site-data";

export const metadata = {
  title: "ভর্তি তথ্য",
  description:
    "ইলমুরা ইনস্টিটিউটে অনলাইন ভর্তি — মাত্র কয়েক মিনিটে ফরম পূরণ করে আপনার কুরআন শিক্ষার যাত্রা শুরু করুন।",
};

export const dynamic = "force-dynamic";

export default async function AdmissionPage() {
  const [{ ADMISSION_STEPS }, { SITE }] = await Promise.all([
    getSiteData(),
    getSiteInfo(),
  ]);

  const activeCourses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    select: { slug: true, title: true },
  });

  return (
    <>
      <PageHeader
        eyebrow="ভর্তি তথ্য"
        title="অনলাইনে ভর্তি হোন — কুরআন শেখা শুরু হোক আজ"
        description="নিচের ফরমটি পূরণ করুন। আমাদের টিম ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করে কোর্স, ক্লাসের সময় ও ভর্তির বাকি ধাপগুলো নিশ্চিত করবে।"
        breadcrumbs={[{ label: "হোম", href: "/" }, { label: "ভর্তি তথ্য" }]}
      />

      <section className="bg-cream py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <aside className="space-y-6">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-extrabold text-ink">
                ভর্তি প্রক্রিয়া
              </h2>
              <ol className="mt-5 space-y-5">
                {ADMISSION_STEPS.map((step, idx) => (
                  <li key={step.step} className="relative flex gap-4">
                    {idx < ADMISSION_STEPS.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[18px] top-10 h-[calc(100%-24px)] w-px bg-gold/50"
                      />
                    )}
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border-2 border-gold bg-gold/15 font-display text-sm font-black text-[#1c1400]">
                      {step.step}
                    </span>
                    <div>
                      <p className="font-bold text-ink">{step.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-grey">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-primary-dark via-primary to-[#0f7b42] p-6 text-white shadow-md">
              <h2 className="font-display text-lg font-extrabold">
                যেসব কোর্সে ভর্তি চলছে
              </h2>
              <ul className="mt-4 space-y-2.5">
                {activeCourses.map((course) => (
                  <li
                    key={course.slug}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <CircleDot size={13} className="flex-none text-gold" />
                    <Link
                      href={`/courses/${course.slug}`}
                      className="transition-colors hover:text-gold"
                    >
                      {course.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-extrabold text-ink">
                সরাসরি যোগাযোগ
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-grey">
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-primary-mist text-primary">
                    <Phone size={16} />
                  </span>
                  {SITE.phone}
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-primary-mist text-primary">
                    <Mail size={16} />
                  </span>
                  {SITE.email}
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-primary-mist text-primary">
                    <MessageCircle size={16} />
                  </span>
                  অথবা{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-primary underline"
                  >
                    যোগাযোগ পেজ
                  </Link>{" "}
                  ব্যবহার করুন
                </li>
              </ul>
            </div>
          </aside>

          <AdmissionForm courses={activeCourses} phone={SITE.phone} />
        </div>
      </section>
    </>
  );
}