# Ilmora Institute — Site Content Dynamic + Admin Dashboard (Progress Tracker)

> এই ফাইলটা রাখা হয়েছে যাতে context/history clear হলেও পরের কাজ মনে থাকে।
> সর্বশেষ আপডেট: 2026-09-25 (Site Content audit ও hero Arabic field)

## Boss-এর মূল নির্দেশ
- site.ts-এর **সব ডেটা ডায়নামিক** করতে হবে (DB থেকে আসবে)।
- **Admin Dashboard-এ একটা সেকশন** বানাতে হবে যেখান থেকে এই সব ডেটা আপডেট করা যাবে।
- **ওয়েবসাইটের থিম কালার** খেয়াল রাখতে হবে (primary green #0e6b3a, gold #f2b705, cream bg, line border)।

## ✅ সম্পন্ন (দ্বিতীয় সেশন 2026-09-24)
- [x] Prisma মডেল: `SiteSettings`, `Teacher`, `GalleryItem`, `Video`, `Testimonial`, `Stat`, `Feature`, `AdmissionStep`, `FAQ` (prisma/schema.prisma)
- [x] `lib/site.ts` — static fallback data + types (fallback only)
- [x] `lib/site-data.ts` — DB থেকে ডেটা লোড; DB না থাকলে fallback (getSiteData / getSiteInfo)
- [x] `lib/icons.ts` — Feature icon mapping (lucide)
- [x] CRUD API:
  - `GET/PUT /api/site/settings` — site info + logos
  - `GET/POST /api/site/[collection]` — teachers, gallery, videos, testimonials, stats, features, steps, faq
  - `PATCH/DELETE /api/site/[collection]/[id]`
  - `POST /api/upload` — Cloudinary image upload (admin auth)
- [x] **Admin "Site Content" সেকশন** `/admin/site` (SiteContentManager.tsx)
  - [x] Sidebar-এ মেনু আইটেম (Site Content, icon: Globe) — Sidebar.tsx
  - [x] Settings ট্যাব — name, nameLatin, hero tagline, hero Arabic line, description, phone, whatsapp, email, address, social links, admissionOpen, header/footer logo
  - [x] Teachers ট্যাব — CRUD (photo, name, subject, experience, bio, grad)
  - [x] Gallery ট্যাব — CRUD (alt, url + image upload)
  - [x] Videos ট্যাব — CRUD (title, category, description, youtubeId)
  - [x] Testimonials ট্যাব — CRUD (quote, name, relation)
  - [x] Stats ট্যাব — CRUD (label, value)
  - [x] Features ট্যাব — CRUD (icon select, title, description)
  - [x] Admission Steps ট্যাব — CRUD (step, title, description)
  - [x] FAQ ট্যাব — CRUD (question, answer)
- [x] Public pages সব dynamic: home, about, admission, contact, gallery, teachers, videos (getSiteData/getSiteInfo)
- [x] Homepage hero: `SITE.tagline`, `SITE.description`, `HERO_IMAGE`, admission toggle এবং প্রথম stat DB-driven; hero logo intentionally removed
- [x] Header uses the primary wide Site Content logo; compact logo remains for footer/fallback
- [x] `prisma/seed.ts` — site content seed যোগ (idempotent: count চেক করে skip)
  - SiteSettings: ১টি (logo /site/logo.png ইত্যাদি)
  - Teachers: ৬, Gallery: ৬, Videos: ৪, Testimonials: ৩, Stats: ৪, Features: ৬, Steps: ৩, FAQ: ৪
- [x] `public/site/` — gallery + logo ছবির লোকাল কপি (DB path `/site/...`)
- [x] Teacher photo upload: Cloudinary preview/change/remove এবং public circular-photo display (photo না থাকলে initials fallback)
- [x] Testimonial photo upload: student/guardian image, dashboard preview এবং homepage circular avatar (photo না থাকলে initials fallback)
- [x] Upload hardening: 5MB/type/signature validation, actionable configuration errors, retry-safe file input
- [x] Git commit `0880841` — "feat: dynamic site content + admin Site Content manager + seed data"

## ✅ যাচাই সম্পন্ন (২০২৬-০৯-২৫)
- [x] Hero image: `/admin/site` Settings থেকে Cloudinary upload/preview/remove; homepage DB-driven, default `/site/new-journey.jpg`
- [x] Hero Arabic line (`اقرأ بسم ربك الذي خلق`) Prisma, admin, API, fallback এবং homepage-এ DB-driven
- [x] Site Content-এর ৮টি collection-এর temporary CRUD audit: create/patch/delete/count restore সব সফল
- [x] Gallery-তে image required; image ছাড়া create/remove `400` হিসেবে reject হয়
- [x] Unknown fields, malformed JSON, invalid Cloudinary URL ও invalid YouTube ID reject হয়
- [x] Teacher/Testimonial/Gallery image upload, PATCH, remove, record delete ও Cloudinary asset cleanup যাচাই
- [x] Upload না করে cancel করলে pending Cloudinary asset cleanup হয়
- [x] Public `/`, `/teachers`, `/gallery`, `/videos`, `/about`, `/admission`, `/contact` সব `200`
- [x] Primary header logo, dynamic phone/metadata, admission CTA, ASCII/Bengali stats, route revalidation যাচাই
- [x] `npm run lint`, `npx tsc --noEmit`, `npx prisma validate`, `npm run db:seed`, `npm run build` সফল

> Existing user content বা dashboard update seed দ্বারা overwrite হয় না; audit-এর সব temporary record/image মুছে দেওয়া হয়েছে।

## 🔜 ভবিষ্যতে করতে পারে (Boss-এর ইচ্ছা অনুযায়ী)
- [ ] Settings পেজ `/admin/settings` — এখন "Coming Soon" (আলাদা কাজ)
- [ ] Site Content-এ reorder/drag-drop (sortOrder)
- [ ] Homepage-এ courses dynamic (ইতিমধ্যে prisma থেকে আসে)

## ✅ এনভায়রনমেন্ট ও initialization
- Local `.env`-এ database, auth, admin এবং Cloudinary-এর সব variable configured।
- Fresh database initialization: `npm run db:setup` (`prisma db push` + non-destructive seed)।
- Admin password `.env`-এর `ADMIN_PASSWORD` value-তে reset করা হয়েছে; future seed run existing password overwrite করে না।
- MongoDB-তে custom id দেওয়া যায় না — siteSettings seed-এ findFirst/create প্যাটার্ন ব্যবহার করা হয়েছে।

## থিম টোকেন (globals.css)
- primary #0e6b3a · primary-dark #0a5230 · primary-light #12894a · primary-mist #e7f2eb
- gold #f2b705 · gold-dark #d9a400 · gold-soft #fdf4d3
- ink #111111 · cream #f7f8f5 · line #e4e6e0 · grey #55595f
- Admin UI-তে `bg-primary`, `text-primary`, `border-line`, `bg-cream`, `text-grey`, `bg-primary-mist` ইত্যাদি ব্যবহার করতে হবে।