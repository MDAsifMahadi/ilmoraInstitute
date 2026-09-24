import PageHeader from "@/components/PageHeader";
import TeacherCard from "@/components/TeacherCard";
import AdmissionCTA from "@/components/AdmissionCTA";
import Reveal from "@/components/Reveal";
import { getSiteData } from "@/lib/site-data";

export const metadata = {
  title: "শিক্ষকবৃন্দ",
  description:
    "ইলমুরা ইনস্টিটিউটের অভিজ্ঞ ও সনদপ্রাপ্ত কুরআন শিক্ষকদের পরিচিতি।",
};

export const dynamic = "force-dynamic";

export default async function TeachersPage() {
  const { TEACHERS } = await getSiteData();

  return (
    <>
      <PageHeader
        eyebrow="শিক্ষকবৃন্দ"
        title="আমাদের যত্নশীল ও দক্ষ শিক্ষকগণ"
        description="প্রতিটি শিক্ষার্থীর অগ্রগতিতে সর্বোচ্চ যত্ন নেওয়া হয়। আমাদের শিক্ষকগণ শুধু শেখানই না, প্রতিটি শিক্ষার্থীর মেধা বুঝে বিশেষ তত্ত্বাবধানও করেন।"
        breadcrumbs={[{ label: "হোম", href: "/" }, { label: "শিক্ষকবৃন্দ" }]}
      />

      <section className="bg-cream py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEACHERS.map((teacher, index) => (
              <Reveal key={teacher.name} delay={index * 60}>
                <TeacherCard teacher={teacher} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <AdmissionCTA
        title="সঠিক শিক্ষকের পথপ্রদর্শনে কুরআন শিখুন"
        description="আমাদের অভিজ্ঞ শিক্ষকগণের সাথে যুক্ত থাকতে আজই ভর্তির আবেদন করুন।"
      />
    </>
  );
}