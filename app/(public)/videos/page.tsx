import Link from "next/link";
import { Lightbulb } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import VideoCard from "@/components/VideoCard";
import AdmissionCTA from "@/components/AdmissionCTA";
import Reveal from "@/components/Reveal";
import { getSiteData } from "@/lib/site-data";

export const metadata = {
  title: "ভিডিও",
  description:
    "ইলমুরা ইনস্টিটিউটের শিক্ষামূলক ভিডিও ও তিলাওয়াত — দেখে অনুশীলন করুন।",
};

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const { VIDEOS } = await getSiteData();

  return (
    <>
      <PageHeader
        eyebrow="ভিডিও"
        title="শিখুন — দেখুন — অনুশীলন করুন"
        description="নিচের ভিডিওগুলোতে রয়েছে তিলাওয়াত ও শিক্ষামূলক পাঠ। ভিডিও দেখে নিয়মিত অনুশীলন করলে অগ্রগতি অনেক দ্রুত হয়।"
        breadcrumbs={[{ label: "হোম", href: "/" }, { label: "ভিডিও" }]}
      />

      <section className="bg-cream py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {VIDEOS.map((video) => (
              <Reveal key={video.id}>
                <VideoCard video={video} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-10 flex items-center justify-center gap-3 rounded-2xl border border-line bg-white p-5 text-center text-sm text-grey shadow-sm">
              <Lightbulb size={18} className="flex-none text-gold" />
              <span>
                আমাদের নিজস্ব ক্লাসের ভিডিও ও পাঠচক্র শীঘ্রই যুক্ত হচ্ছে। এর
                আগে সরাসরি লাইভ ক্লাসে অংশ নিতে{" "}
                <Link
                  href="/admission"
                  className="font-bold text-primary underline"
                >
                  ভর্তি হোন
                </Link>
                ।
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      <AdmissionCTA />
    </>
  );
}