import { prisma } from "@/lib/prisma";
import SiteContentManager from "@/components/admin/SiteContentManager";

export const metadata = {
  title: "Site Content",
};

export const dynamic = "force-dynamic";

export default async function SiteContentPage() {
  const [
    settings,
    teachers,
    gallery,
    videos,
    testimonials,
    stats,
    features,
    admissionSteps,
    faq,
  ] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.teacher.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.galleryItem.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.video.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.stat.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.feature.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.admissionStep.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.fAQ.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <SiteContentManager
      initialSettings={settings as never}
      initialTeachers={teachers as never}
      initialGallery={gallery as never}
      initialVideos={videos as never}
      initialTestimonials={testimonials as never}
      initialStats={stats as never}
      initialFeatures={features as never}
      initialSteps={admissionSteps as never}
      initialFaq={faq as never}
    />
  );
}