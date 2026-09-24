import PageHeader from "@/components/PageHeader";
import GalleryGrid from "@/components/GalleryGrid";
import AdmissionCTA from "@/components/AdmissionCTA";
import Reveal from "@/components/Reveal";
import { getSiteData } from "@/lib/site-data";

export const metadata = {
  title: "গ্যালারি",
  description: "ইলমুরা ইনস্টিটিউটের ক্লাসরুম ও কার্যক্রমের ছবির সংগ্রহ।",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const { GALLERY } = await getSiteData();

  return (
    <>
      <PageHeader
        eyebrow="গ্যালারি"
        title="Our Gallery"
        description="ইলমুরা ইনস্টিটিউটের ক্লাসরুম ও কার্যক্রমের ছবির সংগ্রহ।"
        breadcrumbs={[{ label: "হোম", href: "/" }, { label: "গ্যালারি" }]}
      />

      <section className="bg-cream py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <GalleryGrid items={GALLERY} />
          </Reveal>
        </div>
      </section>

      <AdmissionCTA
        title="আপনার শিক্ষার্থীও হোন আমাদের গ্যালারির অংশ"
        description="ভর্তির আবেদন করুন এবং এগিয়ে চলুন কুরআন শিক্ষার সুন্দর যাত্রায়।"
      />
    </>
  );
}