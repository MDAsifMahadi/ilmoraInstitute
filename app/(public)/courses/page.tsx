import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CourseCard from "@/components/CourseCard";
import AdmissionCTA from "@/components/AdmissionCTA";
import Reveal from "@/components/Reveal";
import { prisma } from "@/lib/prisma";
import { toCourseCardData } from "@/lib/course-utils";

export const metadata = {
  title: "কোর্সসমূহ",
  description:
    "ইলমুরা ইনস্টিটিউটের সকল কুরআন কোর্স — হরফ শেখা থেকে তাজবীদসহ শুদ্ধ তিলাওয়াত পর্যন্ত।",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    select: {
      slug: true,
      title: true,
      badge: true,
      level: true,
      duration: true,
      sessionsPerWeek: true,
      shortDescription: true,
      image: true,
    },
  });

  return (
    <>
      <PageHeader
        eyebrow="কোর্সসমূহ"
        title="কুরআন শেখার ধাপে ধাপে রোডম্যাপ"
        description="আপনার বর্তমান দক্ষতা অনুযায়ী সঠিক কোর্সটি বেছে নিন। প্রতিটি কোর্স লাইভ ক্লাসে পরিচালিত হয় এবং ভর্তির পর শিক্ষার্থীকে সঠিক লেভেলে নির্ধারণ করা হয়।"
        breadcrumbs={[{ label: "হোম", href: "/" }, { label: "কোর্সসমূহ" }]}
      />

      <section className="bg-cream py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white py-20 text-center">
              <h2 className="font-display text-xl font-bold text-ink">
                এই মুহূর্তে কোনো কোর্স খোলা নেই
              </h2>
              <p className="mt-2 text-sm text-grey">
                শীঘ্রই নতুন কোর্স যুক্ত হবে। অনুগ্রহ করে আবার দেখুন।
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-[#1c1400] transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                আমাদের সাথে যোগাযোগ করুন
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <Reveal key={course.slug} delay={index * 60}>
                  <CourseCard course={toCourseCardData(course)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <HelpCircle size={40} className="mx-auto text-primary" strokeWidth={1.8} />
          <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            কোন কোর্সটি আপনার জন্য <span className="text-gold">উপযুক্ত?</span>
          </h2>
          <p className="mt-3 text-base leading-relaxed text-grey">
            শুরুতে সঠিক লেভেল নির্বাচন গুরুত্বপূর্ণ। আবেদন করলে আমাদের অভিজ্ঞ
            শিক্ষক আপনার বর্তমান দক্ষতা যাচাই করে সঠিক কোর্সের পরামর্শ দেবেন।
            তাই দ্বিধা না করে আবেদন করুন।
          </p>
          <Link
            href="/admission"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-bold text-[#1c1400] shadow-md transition-all hover:-translate-y-1 hover:bg-gold-dark hover:shadow-xl"
          >
            ভর্তি ফরম পূরণ করুন
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      <AdmissionCTA />
    </>
  );
}