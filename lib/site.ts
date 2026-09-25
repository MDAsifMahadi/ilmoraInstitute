// ============================================================
// Types
// ============================================================

export type SiteInfo = {
  name: string;
  nameLatin: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  youtube: string;
  linkedin: string;
  x: string;
  heroArabicText: string;
  admissionOpen: boolean;
};

export type Teacher = {
  name: string;
  subject: string;
  image?: string;
  experience: string;
  bio: string;
  grad: string;
};

export type GalleryItem = {
  src: string; // image URL (Cloudinary) or local path
  alt: string;
};

export type Video = {
  id: string; // YouTube video ID
  title: string;
  category: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  relation: string;
  image?: string;
};

export type Stat = {
  label: string;
  value: string;
};

export type Feature = {
  icon: string; // Lucide icon name (e.g. "Route", "MonitorPlay")
  title: string;
  description: string;
};

export type AdmissionStep = {
  step: string;
  title: string;
  description: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type SiteData = {
  SITE: SiteInfo;
  TEACHERS: Teacher[];
  GALLERY: GalleryItem[];
  VIDEOS: Video[];
  TESTIMONIALS: Testimonial[];
  STATS: Stat[];
  FEATURES: Feature[];
  ADMISSION_STEPS: AdmissionStep[];
  FAQ: FaqItem[];
  LOGO: string;
  LOGO_NAV: string;
  LOGO_HERO: string;
  HERO_IMAGE: string;
};

// ============================================================
// Static fallback data (used when the database is unavailable)
// ============================================================

export const SITE: SiteInfo = {
  name: "ইলমুরা ইনস্টিটিউট",
  nameLatin: "Ilmora Institute",
  tagline: "আলিফ থেকে সুন্দরতম কুরআন তিলাওয়াত — যাত্রা শুরু হোক আজই",
  description:
    "ইলমুরা ইনস্টিটিউট একটি অনলাইন কুরআন শিক্ষা প্ল্যাটফর্ম। একেবারে হরফ শেখা থেকে শুরু করে তাজবীদসহ শুদ্ধ তিলাওয়াত — সবকিছু আমরা শেখাই ধাপে ধাপে।",
  phone: "+880 1XXX-XXXXXX",
  whatsapp: "+880 1XXX-XXXXXX",
  email: "ilmora.institute@gmail.com",
  address: "ঢাকা, বাংলাদেশ",
  facebook: "https://facebook.com/ilmurainstitute",
  youtube: "https://youtube.com/@ilmurainstitute",
  linkedin: "",
  x: "",
  heroArabicText: "اقرأ بسم ربك الذي خلق",
  admissionOpen: true,
};

export const TEACHERS: Teacher[] = [
  {
    name: "ডেমো শিক্ষক ১",
    subject: "নূরানী ও নাযিরা",
    experience: "৮+ বছরের অভিজ্ঞতা",
    grad: "মাদরাসা আলিয়া (কামিল) ও তাজবীদ সনদ",
    bio: "শিশুদের ভালোবেসে হরফ শেখানোতে বিশেষ দক্ষ। নূরানী পদ্ধতিতে হাজারো শিশুকে কুরআন শিখিয়েছেন।",
  },
  {
    name: "ডেমো শিক্ষক ২",
    subject: "তাজবীদ ও নাযিরা",
    experience: "১০+ বছরের অভিজ্ঞতা",
    grad: "ইযযাহ ও তাজবীদ সনদপ্রাপ্ত",
    bio: "তাজবীদ নিয়মের চমৎকার ব্যাখ্যাকারী। প্রাপ্তবয়স্ক শিক্ষার্থীদের জন্য বিশেষ ক্লাস পরিচালনা করেন।",
  },
  {
    name: "ডেমো শিক্ষক ৩",
    subject: "হিফজুল কুরআন",
    experience: "১২+ বছরের অভিজ্ঞতা",
    grad: "মাওলানা (ফাযিল) ও হিফজ সনদ",
    bio: "হিফজখানায় দীর্ঘ অভিজ্ঞতা। মুখস্থের সঠিক কৌশল ও দীর্ঘমেয়াদি স্মৃতিতে বিশেষজ্ঞ।",
  },
  {
    name: "ডেমো শিক্ষক ৪",
    subject: "নূরানী (শিশু)",
    experience: "৫+ বছরের অভিজ্ঞতা",
    grad: "আলিম ও শিশু শিক্ষণ কোর্স",
    bio: "ছোটদের জন্য আনন্দময় ক্লাসরুম। খেলাধুলার মাধ্যমে হরফ শেখানোয় পারদর্শী।",
  },
  {
    name: "ডেমো শিক্ষক ৫",
    subject: "নাযিরা ও আম্মাপাড়া (মহিলা)",
    experience: "৭+ বছরের অভিজ্ঞতা",
    grad: "মহিলা মাদরাসা (আলিম) ও তাজবীদ",
    bio: "গৃহিণী ও নারী শিক্ষার্থীদের জন্য সহজ ও নমনীয় সময়সূচিতে ক্লাস পরিচালনা করেন।",
  },
  {
    name: "ডেমো শিক্ষক ৬",
    subject: "তিলাওয়াত ও সনদ",
    experience: "১৫+ বছরের অভিজ্ঞতা",
    grad: "মিশরের আল-আজহার গ্রাজুয়েট",
    bio: "আন্তর্জাতিক সনদপ্রাপ্ত ক্বারী। তিলাওয়াতের সৌন্দর্য ও সনদধারী শিক্ষার্থী তৈরিতে খ্যাত।",
  },
];

export const GALLERY: GalleryItem[] = [
  { src: "/site/foundation.jpg", alt: "ভিত্তি কোর্স - কুরআন লেভেল ১" },
  { src: "/site/quran-reading.jpg", alt: "কুরআন রিডিং লেভেল ২" },
  { src: "/site/tajweed.jpg", alt: "তাজবীদ ও নাযিরা লেভেল ৩" },
  { src: "/site/advanced-a.jpg", alt: "এডভান্সড নাযিরা - এ" },
  { src: "/site/advanced-b.jpg", alt: "এডভান্সড নাযিরা - বি" },
  { src: "/site/new-journey.jpg", alt: "নতুন যাত্রা কোর্স" },
];

// NOTE: এখানে ডেমো (Placeholder) YouTube ভিডিও ID ব্যবহার করা হয়েছে।
// নিজস্ব ভিডিওর YouTube ভিডিও আইডি বসিয়ে দিন।
export const VIDEOS: Video[] = [
  {
    id: "UDvh63xHVa0",
    title: "সূরা ফাতিহা — শেখ মিশারী রশিদ আল-আফাসি",
    category: "তিলাওয়াত",
    description:
      "কুরআন তিলাওয়াতের সৌন্দর্য অনুধাবনের জন্য একটি চমৎকার তিলাওয়াত।",
  },
  {
    id: "gRZZKOVk2hg",
    title: "সূরা আল-ফাতিহা — চমৎকার কুরআন তিলাওয়াত",
    category: "তিলাওয়াত",
    description:
      "শিক্ষার্থীদের তিলাওয়াত শোনা ও অনুশীলনের জন্য নির্বাচিত তিলাওয়াত।",
  },
  {
    id: "OoVhY3rcXS8",
    title: "নূরানী কায়দা লেসন ১ — আরবি হরফ পরিচিতি",
    category: "শিক্ষামূলক",
    description:
      "প্রথম ধাপে আরবি হরফ চেনার জন্য সহজ ও ধাপে ধাপে নির্দেশনা।",
  },
  {
    id: "_pPYkzirnvA",
    title: "আলিফ বা তা — আরবি বর্ণমালা শেখা",
    category: "শিক্ষামূলক",
    description:
      "শিশু ও শিক্ষানবিশদের জন্য আরবি বর্ণমালার উচ্চারণসহ পাঠ।",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "আমার মেয়ে ইলমুরা ইনস্টিটিউটে ভর্তির পর তিন মাসেই হরফ থেকে সূরা ফাতিহা পড়তে শুরু করেছে। আল্লাহপাকের কাছে রইল শুকরিয়া।",
    name: "ডেমো অভিভাবক ১",
    relation: "অভিভাবক",
  },
  {
    quote:
      "তাজবীদ কোর্সটি আমার জন্য ছিল চমৎকার। শিক্ষক প্রতিটি নিয়ম এত সুন্দরভাবে বোঝান যে ক্লাসের পরেই নিজে চর্চা করা সহজ লাগে।",
    name: "ডেমো শিক্ষার্থী ২",
    relation: "লেভেল ৩ শিক্ষার্থী",
  },
  {
    quote:
      "চাকরিজীবীদের জন্য সময়সূচি একদম নমনীয়। রাতের ক্লাসে আমার মতো সবাই অংশ নিতে পারছে। শিক্ষক স্যার খুবই যত্নশীল।",
    name: "ডেমো শিক্ষার্থী ৩",
    relation: "এডভান্সড নাযিরা শিক্ষার্থী",
  },
];

export const STATS: Stat[] = [
  { label: "শিক্ষার্থী", value: "৫০০+" },
  { label: "অভিজ্ঞ শিক্ষক", value: "১৫+" },
  { label: "চলমান কোর্স", value: "৬+" },
  { label: "শিক্ষার্থী সন্তুষ্টি", value: "৯৮%" },
];

export const FEATURES: Feature[] = [
  {
    icon: "Route",
    title: "হরফ থেকে তিলাওয়াত",
    description:
      "একেবারে শূন্য থেকে শুরু করে তাজবীদসহ শুদ্ধ তিলাওয়াত পর্যন্ত সম্পূর্ণ ধাপে ধাপে কাঠামো।",
  },
  {
    icon: "MonitorPlay",
    title: "সরাসরি লাইভ ক্লাস",
    description:
      "প্রতি ক্লাসে শিক্ষকের সামনে পাঠদান, ভুল সংশোধন ও বাড়ির কাজের প্রতিক্রিয়া।",
  },
  {
    icon: "Home",
    title: "বাড়িতে বসেই শিখুন",
    description:
      "দেশ-বিদেশের যেকোনো জায়গা থেকে ইন্টারনেট থাকলেই আপনি লাইভ ক্লাসে যুক্ত হতে পারবেন।",
  },
  {
    icon: "CalendarDays",
    title: "নমনীয় সময়সূচি",
    description:
      "শিশু, শিক্ষার্থী, চাকরিজীবী কিংবা গৃহিণী — সবার সুবিধামতো ক্লাসের সময় বেছে নেওয়ার সুযোগ।",
  },
  {
    icon: "ClipboardCheck",
    title: "নিয়মিত মূল্যায়ন",
    description:
      "মাসিক পরীক্ষা ও অগ্রগতি রিপোর্টের মাধ্যমে শিক্ষার মান এবং অগ্রগতি যাচাই করা হয়।",
  },
  {
    icon: "Award",
    title: "সনদ ও ইজাজাহ",
    description:
      "কোর্স সম্পন্নকারী শিক্ষার্থীদের জন্য সনদ এবং উন্নত স্তরে শিক্ষকের কাছ থেকে ইজাজাহ।",
  },
];

export const ADMISSION_STEPS: AdmissionStep[] = [
  {
    step: "০১",
    title: "ফরম পূরণ করুন",
    description:
      "অনলাইন ভর্তি ফরম পূরণ করুন — মাত্র কয়েক মিনিটে সম্পন্ন হয়।",
  },
  {
    step: "০২",
    title: "যোগাযোগ ও নিশ্চিতকরণ",
    description:
      "আমাদের টিম আপনার সাথে যোগাযোগ করে ক্লাসের সময় ও কোর্স চূড়ান্ত করবে।",
  },
  {
    step: "০৩",
    title: "ক্লাস শুরু",
    description:
      "সব প্রস্তুতি শেষে মনোনীত কোর্সে লাইভ ক্লাসে অংশ নিতে শুরু করুন।",
  },
];

export const FAQ: FaqItem[] = [
  {
    q: "কোন বয়স থেকে ভর্তি হওয়া যায়?",
    a: "৫ বছর বয়স থেকে শুরু করে যেকোনো বয়সে ভর্তি হওয়া যায়। 'নতুন যাত্রা' কোর্সটি বিশেষভাবে beginners-দের জন্য।",
  },
  {
    q: "অনলাইনে কীভাবে ক্লাস হয়?",
    a: "প্রতিটি ক্লাস ভিডিও কনফারেন্সের মাধ্যমে লাইভ হয়। লিংকটি প্রতিটি ক্লাসের আগে পাঠানো হয়।",
  },
  {
    q: "প্রতিদিন কতক্ষণ ক্লাস হয়?",
    a: "কোর্সভেদে প্রতিদিন ৩০-৪৫ মিনিট। সপ্তাহে ২ থেকে ৫ দিন ক্লাস হয় — যা শিক্ষার্থীর সুবিধামতো সাজানো যায়।",
  },
  {
    q: "কোর্সের ফি কীভাবে নির্ধারিত হয়?",
    a: "কোর্স ও সময়সূচির ভিত্তিতে ফি ভিন্ন হয়ে থাকে। বিশদ জানতে যোগাযোগ পেজ থেকে আমাদের সাথে যুক্ত হন।",
  },
];

export const LOGO = "/site/logo.png";
export const LOGO_NAV = "/site/logo-nav.png";
export const LOGO_HERO = "/site/logo-hero.png";
export const HERO_IMAGE = "/site/new-journey.jpg";

export const FALLBACK_SITE_DATA: SiteData = {
  SITE,
  TEACHERS,
  GALLERY,
  VIDEOS,
  TESTIMONIALS,
  STATS,
  FEATURES,
  ADMISSION_STEPS,
  FAQ,
  LOGO,
  LOGO_NAV,
  LOGO_HERO,
  HERO_IMAGE,
};