import { prisma } from "@/lib/prisma";
import { safeImageSource } from "@/lib/image-source";
import {
  FALLBACK_SITE_DATA,
  type SiteData,
  type SiteInfo,
} from "@/lib/site";

/**
 * Loads all dynamic site content from the database.
 * If the database is unavailable (e.g. serverless without DB),
 * it falls back to the static data in lib/site.ts.
 */

function normalizeSiteSettings(settings: {
  name: string;
  nameLatin: string | null;
  tagline: string | null;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  facebook: string | null;
  youtube: string | null;
  heroArabicText: string | null;
  admissionOpen: boolean;
  logo: string | null;
  logoNav: string | null;
  logoHero: string | null;
  heroImage: string | null;
} | null): {
  SITE: SiteInfo;
  LOGO: string;
  LOGO_NAV: string;
  LOGO_HERO: string;
  HERO_IMAGE: string;
} {
  if (!settings) {
    return {
      SITE: FALLBACK_SITE_DATA.SITE,
      LOGO: FALLBACK_SITE_DATA.LOGO,
      LOGO_NAV: FALLBACK_SITE_DATA.LOGO_NAV,
      LOGO_HERO: FALLBACK_SITE_DATA.LOGO_HERO,
      HERO_IMAGE: FALLBACK_SITE_DATA.HERO_IMAGE,
    };
  }

  return {
    SITE: {
      name: settings.name || FALLBACK_SITE_DATA.SITE.name,
      nameLatin: settings.nameLatin || FALLBACK_SITE_DATA.SITE.nameLatin,
      tagline: settings.tagline || FALLBACK_SITE_DATA.SITE.tagline,
      description:
        settings.description || FALLBACK_SITE_DATA.SITE.description,
      phone: settings.phone || FALLBACK_SITE_DATA.SITE.phone,
      whatsapp: settings.whatsapp || FALLBACK_SITE_DATA.SITE.whatsapp,
      email: settings.email || FALLBACK_SITE_DATA.SITE.email,
      address: settings.address || FALLBACK_SITE_DATA.SITE.address,
      facebook: settings.facebook || FALLBACK_SITE_DATA.SITE.facebook,
      youtube: settings.youtube || FALLBACK_SITE_DATA.SITE.youtube,
      heroArabicText:
        settings.heroArabicText || FALLBACK_SITE_DATA.SITE.heroArabicText,
      admissionOpen: settings.admissionOpen,
    },
    LOGO: safeImageSource(settings.logo, FALLBACK_SITE_DATA.LOGO),
    LOGO_NAV: safeImageSource(settings.logoNav, FALLBACK_SITE_DATA.LOGO_NAV),
    LOGO_HERO: safeImageSource(
      settings.logoHero,
      FALLBACK_SITE_DATA.LOGO_HERO
    ),
    HERO_IMAGE: safeImageSource(
      settings.heroImage,
      FALLBACK_SITE_DATA.HERO_IMAGE
    ),
  };
}

export async function getSiteData(): Promise<SiteData> {
  try {
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

    const { SITE, LOGO, LOGO_NAV, LOGO_HERO, HERO_IMAGE } =
      normalizeSiteSettings(settings);

    // Once the database is available it is the source of truth. An empty
    // collection is a valid dashboard state and must not restore demo data.
    return {
      SITE,
      LOGO,
      LOGO_NAV,
      LOGO_HERO,
      HERO_IMAGE,
      TEACHERS: teachers.map((teacher) => ({
        name: teacher.name,
        subject: teacher.subject,
        image: safeImageSource(teacher.image),
        experience: teacher.experience ?? "",
        bio: teacher.bio ?? "",
        grad: teacher.grad ?? "",
      })),
      GALLERY: gallery.flatMap((item) => {
        const src = safeImageSource(item.url);
        return src ? [{ src, alt: item.alt }] : [];
      }),
      VIDEOS: videos.map((video) => ({
        id: video.youtubeId,
        title: video.title,
        category: video.category ?? "",
        description: video.description ?? "",
      })),
      TESTIMONIALS: testimonials.map((testimonial) => ({
        quote: testimonial.quote,
        name: testimonial.name,
        relation: testimonial.relation ?? "",
        image: safeImageSource(testimonial.image),
      })),
      STATS: stats.map((stat) => ({
        label: stat.label,
        value: stat.value,
      })),
      FEATURES: features.map((feature) => ({
        icon: feature.icon ?? "Route",
        title: feature.title,
        description: feature.description ?? "",
      })),
      ADMISSION_STEPS: admissionSteps.map((step) => ({
        step: step.step,
        title: step.title,
        description: step.description ?? "",
      })),
      FAQ: faq.map((item) => ({
        q: item.question,
        a: item.answer ?? "",
      })),
    };
  } catch (error) {
    console.warn(
      "[site-data] Database unavailable, using fallback site data:",
      error
    );
    return FALLBACK_SITE_DATA;
  }
}

/** Loads only the site settings (used by header/footer). */
export async function getSiteInfo(): Promise<{
  SITE: SiteInfo;
  LOGO: string;
  LOGO_NAV: string;
}> {
  try {
    const settings = await prisma.siteSettings.findFirst();
    const { SITE, LOGO, LOGO_NAV } = normalizeSiteSettings(settings);
    return { SITE, LOGO, LOGO_NAV };
  } catch (error) {
    console.warn(
      "[site-data] Database unavailable, using fallback site info:",
      error
    );
    return {
      SITE: FALLBACK_SITE_DATA.SITE,
      LOGO: FALLBACK_SITE_DATA.LOGO,
      LOGO_NAV: FALLBACK_SITE_DATA.LOGO_NAV,
    };
  }
}