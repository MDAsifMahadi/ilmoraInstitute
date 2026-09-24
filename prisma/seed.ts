import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { FALLBACK_SITE_DATA } from "../lib/site";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword || adminPassword.length < 8) {
    throw new Error(
      "ADMIN_EMAIL and an ADMIN_PASSWORD of at least 8 characters must be configured before seeding."
    );
  }
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
    select: { id: true },
  });

  if (existingAdmin) {
    console.log(`Admin user already exists: ${adminEmail}`);
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Admin",
        role: "admin",
      },
    });
    console.log(`Admin user created: ${adminEmail}`);
  }

  // Create Categories
  const quranCategory = await prisma.category.upsert({
    where: { slug: "quran" },
    update: {},
    create: {
      name: "কুরআন শিক্ষা",
      slug: "quran",
      shortDescription: "কুরআন শেখার সম্পূর্ণ ধাপে ধাপে কাঠামো",
      description:
        "হরফ শেখা থেকে শুরু করে তাজবীদসহ শুদ্ধ তিলাওয়াত — সম্পূর্ণ কুরআন শিক্ষা কার্যক্রম।",
      sortOrder: 1,
      isPublished: true,
    },
  });

  const arabicCategory = await prisma.category.upsert({
    where: { slug: "arabic" },
    update: {},
    create: {
      name: "আরবি ভাষা",
      slug: "arabic",
      shortDescription: "আরবি ভাষা শেখার কোর্স",
      description:
        "আরবি ভাষার মৌলিক থেকে উন্নত স্তর পর্যন্ত শিক্ষা।",
      sortOrder: 2,
      isPublished: false,
    },
  });

  // Create Courses under Quran Category
  const quranCourses = [
    {
      title: "ভিত্তি কোর্স - কুরআন লেভেল ১",
      slug: "foundation-quran-level-1",
      badge: "শিক্ষানবিস",
      icon: "BookOpen",
      outcomes: [
        "আরবি ২৯টি হরফ সঠিক উচ্চারণে শেখা",
        "যুক্তাক্ষর ও বর্ণমালার সংমিশ্রণ পড়া",
        "সহজ শব্দ ও বাক্যাংশ পড়া অনুশীলন",
        "প্রতিটি দিন বাড়ির কাজ ও শিক্ষকের প্রতিক্রিয়া",
      ],
      curriculum: [
        "নূরানী মশক পরিচিতি",
        "হরফ চেনা ও উচ্চারণ (মাখরাজ)",
        "হরকত ও যুক্তাক্ষর",
        "মদ, সাকিন ও তানভীন প্রকারভেদ",
        "সহজ শব্দ মিলিয়ে পড়া",
      ],
      tagline:
        "নূরানী পদ্ধতিতে আরবি হরফ চেনা ও পড়ার ভিত্তি গড়ে তুলুন।",
      shortDescription:
        "আরবি বর্ণমালা, হরফের উচ্চারণ (মাখরাজ) এবং যুক্ত অক্ষর — সম্পূর্ণ নূরানী নিয়মে।",
      description:
        "কুরআন শিক্ষার প্রথম ধাপ। এ কোর্সে শিক্ষার্থী আরবি ২৯টি হরফ চেনা থেকে শুরু করে ধাপে ধাপে মিশকত নিয়মে পড়া শেখে।",
      duration: "৬ মাস",
      sessionsPerWeek: "সপ্তাহে ৫ দিন",
      ageRange: "৬+",
      format: "অনলাইন (লাইভ ক্লাস)",
      price: "ডেমো মূল্য",
      sortOrder: 1,
      isPublished: true,
      pinOnHome: true,
    },
    {
      title: "কুরআন রিডিং - লেভেল ২",
      slug: "quran-reading-level-2",
      badge: "প্রাথমিক",
      icon: "BookOpenText",
      outcomes: [
        "কুরআনের আয়াত ধীরে ও স্পষ্টভাবে পড়া",
        "নিয়মিত তিলাওয়াতের অভ্যাস গড়ে তোলা",
        "শিক্ষকের সামনে প্রতিদিন পাঠদান",
        "পঠনগত সাধারণ ভুল চিহ্নিত করা",
      ],
      curriculum: [
        "পাঠ পরিকল্পনা ও দৈনিক অগ্রগতি",
        "মধ্যম মাপের সূরা তিলাওয়াত",
        "সূরা ফাতেহা ও ছোট সূরা নির্ধারিত পাঠ",
        "পঠনে থামা ও মদ এর প্রয়োগ",
        "মাসিক মূল্যায়ন পরীক্ষা",
      ],
      tagline:
        "কুরআন শরীফ সঠিকভাবে পড়তে পারার প্রথম ধাপ।",
      shortDescription:
        "লেভেল ১-এর পরে সরাসরি কুরআন মাজীদ পড়ার অনুশীলন, ধীরে ও শুদ্ধভাবে।",
      description:
        "ভিত্তি তৈরি হয়ে গেলে শিক্ষার্থীরা এখানে সরাসরি কুরআন শরীফের আয়াত তিলাওয়াত করতে শুরু করে।",
      duration: "৬ মাস",
      sessionsPerWeek: "সপ্তাহে ৫ দিন",
      ageRange: "লেভেল ১ সম্পন্নকারী",
      format: "অনলাইন (লাইভ ক্লাস)",
      price: "ডেমো মূল্য",
      sortOrder: 2,
      isPublished: true,
      pinOnHome: true,
    },
    {
      title: "তাজবীদ ও নাযিরা - লেভেল ৩",
      slug: "tajweed-and-nazirah-level-3",
      badge: "মধ্যম পর্যায়",
      icon: "ScrollText",
      outcomes: [
        "নুন ও মীম সাকিনের সকল বিধান বাস্তবে প্রয়োগ",
        "মদ, গুন্নাহ, কলকলার সঠিক উচ্চারণ",
        "তরতীল তথা ধীরে সুন্দরভাবে তিলাওয়াত",
        "শিক্ষকের কাছ থেকে স্বীকৃতিপত্রের (ইজাজাহ) প্রস্তুতি",
      ],
      curriculum: [
        "তাজবীদের মৌলিক ধারণা ও গুরুত্ব",
        "নুন সাকিন ও তানভীনের বিধান",
        "মীম সাকিন ও মদের বিধান",
        "কলকলা, ক্বল্বালাহ ও অন্যান্য সিফাত",
        "পূর্ণ কুরআন তিলাওয়াত অনুশীলন ও মূল্যায়ন",
      ],
      tagline:
        "তাজবীদের নিয়ম মেনে শুদ্ধভাবে কুরআন তিলাওয়াতের অভ্যাস।",
      shortDescription:
        "নুন সাকিন, মীম সাকিন, মদ, গুন্নাহ ও অন্যান্য তাজবীদ বিধি প্রয়োগসহ পূর্ণ তিলাওয়াত।",
      description:
        "তাজবীদের বিস্তারিত নিয়ম বাস্তবে প্রয়োগ করতে শেখা হয় এ স্তরে।",
      duration: "৮ মাস",
      sessionsPerWeek: "সপ্তাহে ৫ দিন",
      ageRange: "লেভেল ২ সম্পন্নকারী",
      format: "অনলাইন (লাইভ ক্লাস)",
      price: "ডেমো মূল্য",
      sortOrder: 3,
      isPublished: true,
      pinOnHome: true,
    },
    {
      title: "এডভান্সড নাযিরা - এ",
      slug: "advanced-nazirah-a",
      badge: "উন্নত পর্যায়",
      icon: "BookOpen",
      outcomes: [
        "তাজবীদ প্রয়োগে ধারাবাহিক তিলাওয়াত",
        "দীর্ঘ সূরা তিলাওয়াতের দক্ষতা",
        "শিক্ষকের কাছ থেকে সূক্ষ্ম ত্রুটি শুধরে নেওয়া",
        "স্ব-মূল্যায়ন ও রেকর্ডিং বিশ্লেষণ",
      ],
      curriculum: [
        "তিলাওয়াত পরিমার্জন কৌশল",
        "মধ্যম ও দীর্ঘ সূরা তিলাওয়াত",
        "তাজবীদ পুনর্বীক্ষণ ও প্রয়োগ",
        "রেকর্ডিং ও সমালোচনামূলক শ্রবণ",
      ],
      tagline:
        "তাজবীদ প্রয়োগসহ ধারাবাহিক ও সুন্দর তিলাওয়াতের পর্যায়।",
      shortDescription:
        "তাজবীদসহ নাযিরা পড়ার দক্ষতা আরও পরিমার্জন এবং আত্মবিশ্বাস তৈরি।",
      description:
        "এ স্তরে শিক্ষার্থী তাজবীদ প্রয়োগের পাশাপাশি ধারাবাহিক তিলাওয়াত ও প্রতিটি আয়াতের সঠিক উচ্চারণে যত্নশীল হয়।",
      duration: "৬ মাস",
      sessionsPerWeek: "সপ্তাহে ৩ দিন",
      ageRange: "লেভেল ৩ সম্পন্নকারী",
      format: "অনলাইন (লাইভ ক্লাস)",
      price: "ডেমো মূল্য",
      sortOrder: 4,
      isPublished: true,
    },
    {
      title: "এডভান্সড নাযিরা - বি",
      slug: "advanced-nazirah-b",
      badge: "সনদ পর্যায়",
      icon: "Award",
      outcomes: [
        "সম্পূর্ণ কুরআন তাজবীদসহ তিলাওয়াত",
        "সনদ তথা ইজাজাহ অর্জনের প্রস্তুতি",
        "নিজে শিক্ষা দেওয়ার যোগ্যতা তৈরি",
        "কুরআন তিলাওয়াতে আত্মবিশ্বাসী হওয়া",
      ],
      curriculum: [
        "পূর্ণ কুরআন তিলাওয়াত অনুশীলন",
        "সনদ ও ইসনাদ বিষয়ে ধারণা",
        "শিক্ষণ পদ্ধতি: নাযিরা শিক্ষা দেওয়া",
        "ফাইনাল অ্যাসেসমেন্ট ও সনদ",
      ],
      tagline:
        "তাজবীদ থেকে তিলাওয়াতের পরিপূর্ণতা — সনদ অর্জনের প্রস্তুতি।",
      shortDescription:
        "সম্পূর্ণ কুরআন তাজবীদসহ তিলাওয়াত এবং শিক্ষকের কাছ থেকে সনদ প্রাপ্তির লক্ষ্য।",
      description:
        "এটি সর্বোচ্চ নাযিরা স্তর। শিক্ষার্থী সম্পূর্ণ কুরআন একাধিকবার তিলাওয়াত করে।",
      duration: "৬ মাস",
      sessionsPerWeek: "সপ্তাহে ৩ দিন",
      ageRange: "Advanced A সম্পন্নকারী",
      format: "অনলাইন (লাইভ ক্লাস)",
      price: "ডেমো মূল্য",
      sortOrder: 5,
      isPublished: true,
    },
    {
      title: "নতুন যাত্রা",
      slug: "new-journey",
      badge: "সব বয়সি",
      icon: "Sparkles",
      outcomes: [
        "শূন্য থেকে হরফ শেখার সুযোগ",
        "নিজের গতিতে শেখার নমনীয় ক্লাস",
        "ইতিবাচক ও উৎসাহব্যঞ্জক পরিবেশ",
        "বয়সভেদে মানসিক প্রস্তুতি ও তত্ত্বাবধান",
      ],
      curriculum: [
        "প্রথম পরিচিতি: হরফ ও তার উচ্চারণ",
        "সহজ মশক ও হরকত",
        "ছোট সূরা মুখস্থ ও তিলাওয়াত",
        "অভিভাবক সহায়িকা ও হোমওয়ার্ক",
      ],
      tagline:
        "যেকোনো বয়সে নতুন করে কুরআন শেখার সুযোগ — সবার জন্য।",
      shortDescription:
        "এখন পর্যন্ত কুরআন শেখা হয়নি, বা অনেক আগে ছেড়ে দিয়েছেন — ভয় নেই, শুরু করুন নতুন যাত্রা।",
      description:
        "নতুন যাত্রা এমন সব শিক্ষার্থীদের জন্য যারা প্রথমবার কুরআন শিখতে চান বা দীর্ঘদিন বিরতির পর আবার শুরু করতে চান।",
      duration: "৩ মাস",
      sessionsPerWeek: "সপ্তাহে ২ দিন",
      ageRange: "সব বয়সে (৫+)",
      format: "অনলাইন (লাইভ ক্লাস)",
      price: "ডেমো মূল্য",
      sortOrder: 6,
      isPublished: true,
    },
  ];

  for (const course of quranCourses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: {
        ...course,
        categoryId: quranCategory.id,
      },
    });
  }

  // Create a placeholder Arabic course
  await prisma.course.upsert({
    where: { slug: "basic-arabic" },
    update: {},
    create: {
      categoryId: arabicCategory.id,
      title: "মৌলিক আরবি",
      slug: "basic-arabic",
      tagline: "আরবি ভাষার মৌলিক ব্যাকরণ ও শব্দভান্ডার",
      shortDescription: "আরবি বর্ণমালা, সংখ্যা ও সাধারণ কথোপকথন।",
      description:
        "আরবি ভাষার মৌলিক শিক্ষা — বর্ণমালা, সংখ্যা, সাধারণ বাক্য ও কথোপকথন।",
      duration: "৪ মাস",
      sessionsPerWeek: "সপ্তাহে ৩ দিন",
      ageRange: "১০+",
      format: "অনলাইন (লাইভ ক্লাস)",
      price: "ডেমো মূল্য",
      sortOrder: 1,
      isPublished: false,
    },
  });

  // ============================================================
  // Site Content (dynamic data — editable from Admin → Site Content)
  // ============================================================

  // Site settings (single row). Never update an existing row here: after the
  // initial import, this record is owned by Admin → Site Content.
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        ...FALLBACK_SITE_DATA.SITE,
        logo: FALLBACK_SITE_DATA.LOGO,
        logoNav: FALLBACK_SITE_DATA.LOGO_NAV,
        logoHero: FALLBACK_SITE_DATA.LOGO_HERO,
        heroImage: FALLBACK_SITE_DATA.HERO_IMAGE,
      },
    });
    console.log("Seeded site settings from lib/site.ts.");
  } else {
    console.log("Site settings already exist; preserving dashboard updates.");
  }

  // Teachers
  const teacherCount = await prisma.teacher.count();
  if (teacherCount === 0) {
    const teachers = FALLBACK_SITE_DATA.TEACHERS;
    for (const teacher of teachers) {
      await prisma.teacher.create({ data: teacher });
    }
    console.log(`Seeded ${teachers.length} teachers from lib/site.ts.`);
  } else {
    console.log(`Teachers already exist (${teacherCount}), skipping.`);
  }

  // Gallery
  const galleryCount = await prisma.galleryItem.count();
  if (galleryCount === 0) {
    const gallery = FALLBACK_SITE_DATA.GALLERY.map(({ src, alt }) => ({
      url: src,
      alt,
    }));
    for (const item of gallery) {
      await prisma.galleryItem.create({ data: item });
    }
    console.log(`Seeded ${gallery.length} gallery items from lib/site.ts.`);
  } else {
    console.log(`Gallery already has items (${galleryCount}), skipping.`);
  }

  // Videos (placeholder YouTube IDs — নিজস্ব ভিডিও আইডি বসিয়ে নিন)
  const videoCount = await prisma.video.count();
  if (videoCount === 0) {
    const videos = FALLBACK_SITE_DATA.VIDEOS.map(
      ({ id, title, category, description }) => ({
        youtubeId: id,
        title,
        category,
        description,
      }),
    );
    for (const video of videos) {
      await prisma.video.create({ data: video });
    }
    console.log(`Seeded ${videos.length} videos from lib/site.ts.`);
  } else {
    console.log(`Videos already exist (${videoCount}), skipping.`);
  }

  // Testimonials
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    const testimonials = FALLBACK_SITE_DATA.TESTIMONIALS;
    for (const testimonial of testimonials) {
      await prisma.testimonial.create({ data: testimonial });
    }
    console.log(
      `Seeded ${testimonials.length} testimonials from lib/site.ts.`
    );
  } else {
    console.log(`Testimonials already exist (${testimonialCount}), skipping.`);
  }

  // Stats
  const statCount = await prisma.stat.count();
  if (statCount === 0) {
    const stats = FALLBACK_SITE_DATA.STATS;
    for (const stat of stats) {
      await prisma.stat.create({ data: stat });
    }
    console.log(`Seeded ${stats.length} stats from lib/site.ts.`);
  } else {
    console.log(`Stats already exist (${statCount}), skipping.`);
  }

  // Features
  const featureCount = await prisma.feature.count();
  if (featureCount === 0) {
    const features = FALLBACK_SITE_DATA.FEATURES;
    for (const feature of features) {
      await prisma.feature.create({ data: feature });
    }
    console.log(`Seeded ${features.length} features from lib/site.ts.`);
  } else {
    console.log(`Features already exist (${featureCount}), skipping.`);
  }

  // Admission steps
  const stepCount = await prisma.admissionStep.count();
  if (stepCount === 0) {
    const steps = FALLBACK_SITE_DATA.ADMISSION_STEPS;
    for (const step of steps) {
      await prisma.admissionStep.create({ data: step });
    }
    console.log(`Seeded ${steps.length} admission steps from lib/site.ts.`);
  } else {
    console.log(`Admission steps already exist (${stepCount}), skipping.`);
  }

  // FAQ
  const faqCount = await prisma.fAQ.count();
  if (faqCount === 0) {
    const faqs = FALLBACK_SITE_DATA.FAQ.map(({ q, a }) => ({
      question: q,
      answer: a,
    }));
    for (const faq of faqs) {
      await prisma.fAQ.create({ data: faq });
    }
    console.log(`Seeded ${faqs.length} FAQs from lib/site.ts.`);
  } else {
    console.log(`FAQs already exist (${faqCount}), skipping.`);
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
