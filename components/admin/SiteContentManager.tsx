"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Settings as SettingsIcon,
  Users,
  Image as ImageIcon,
  Video,
  MessageSquare,
  BarChart3,
  Sparkles,
  ListOrdered,
  HelpCircle,
  Loader2,
  Check,
  Globe,
  Upload,
  X,
} from "lucide-react";
import CollectionManager, {
  inputClass,
  labelClass,
  type CollectionConfig,
} from "./CollectionManager";
import {
  deleteUploadedImage,
  uploadImage,
} from "@/lib/image-upload-client";

// ============================================================
// Types
// ============================================================

interface SiteSettingsData {
  id?: string;
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
}

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: "settings", label: "Site Settings", icon: <SettingsIcon size={16} /> },
  { id: "teachers", label: "Teachers", icon: <Users size={16} /> },
  { id: "gallery", label: "Gallery", icon: <ImageIcon size={16} /> },
  { id: "videos", label: "Videos", icon: <Video size={16} /> },
  { id: "testimonials", label: "Testimonials", icon: <MessageSquare size={16} /> },
  { id: "stats", label: "Stats", icon: <BarChart3 size={16} /> },
  { id: "features", label: "Features", icon: <Sparkles size={16} /> },
  { id: "steps", label: "Admission Steps", icon: <ListOrdered size={16} /> },
  { id: "faq", label: "FAQ", icon: <HelpCircle size={16} /> },
];

// ============================================================
// Collection configs (mirror lib/site.ts data shapes)
// ============================================================

const FEATURE_ICONS = [
  { value: "Route", label: "Route" },
  { value: "MonitorPlay", label: "Monitor Play" },
  { value: "Home", label: "Home" },
  { value: "CalendarDays", label: "Calendar Days" },
  { value: "ClipboardCheck", label: "Clipboard Check" },
  { value: "Award", label: "Award" },
  { value: "BookOpen", label: "Book Open" },
  { value: "BookOpenText", label: "Book Open Text" },
  { value: "ScrollText", label: "Scroll Text" },
  { value: "Sparkles", label: "Sparkles" },
  { value: "GraduationCap", label: "Graduation Cap" },
  { value: "Library", label: "Library" },
  { value: "PenLine", label: "Pen Line" },
  { value: "Mic", label: "Mic" },
];

const COLLECTIONS: CollectionConfig[] = [
  {
    key: "teachers",
    title: "Teachers",
    description: "শিক্ষকবৃন্দ — ছবি, নাম, বিষয়, অভিজ্ঞতা ও পরিচিতি",
    fields: [
      {
        name: "image",
        label: "Photo",
        type: "image",
        hint: "JPG, PNG, WebP or GIF — max 5MB. A square photo works best.",
      },
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "subject", label: "Subject", type: "text", required: true, half: true },
      { name: "experience", label: "Experience", type: "text", half: true },
      { name: "grad", label: "Graduation / Certificate", type: "text", half: true },
      { name: "bio", label: "Bio", type: "textarea", rows: 4 },
    ],
    renderItem: (item) => ({
      title: (item.name as string) || "",
      subtitle: [item.subject, item.experience].filter(Boolean).join(" · "),
      image: (item.image as string) || null,
    }),
  },
  {
    key: "gallery",
    title: "Gallery",
    description: "গ্যালারির ছবি — ক্লাউডিনারি আপলোড",
    fields: [
      { name: "alt", label: "Alt Text", type: "text", required: true },
      { name: "url", label: "Image", type: "image", required: true },
    ],
    renderItem: (item) => ({
      title: (item.alt as string) || "",
      image: (item.url as string) || null,
    }),
  },
  {
    key: "videos",
    title: "Videos",
    description: "ইউটিউব ভিডিও — ID, শিরোনাম, ক্যাটাগরি",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "youtubeId", label: "YouTube Video ID", type: "text", required: true, half: true },
      { name: "category", label: "Category", type: "text", half: true },
      { name: "description", label: "Description", type: "textarea", rows: 3 },
    ],
    renderItem: (item) => ({
      title: (item.title as string) || "",
      subtitle: (item.category as string) || "",
    }),
  },
  {
    key: "testimonials",
    title: "Testimonials",
    description: "শিক্ষার্থী ও অভিভাবকদের ছবি ও মতামত",
    fields: [
      {
        name: "image",
        label: "Student / Guardian Photo",
        type: "image",
        hint: "JPG, PNG, WebP or GIF — max 5MB. A square photo works best.",
      },
      { name: "quote", label: "Quote", type: "textarea", required: true, rows: 3 },
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "relation", label: "Relation", type: "text", half: true },
    ],
    renderItem: (item) => ({
      title: (item.name as string) || "",
      subtitle: (item.relation as string) || "",
      image: (item.image as string) || null,
    }),
  },
  {
    key: "stats",
    title: "Stats",
    description: "হোমপেজের পরিসংখ্যান (শিক্ষার্থী, শিক্ষক, কোর্স...)",
    fields: [
      { name: "label", label: "Label", type: "text", required: true, half: true },
      { name: "value", label: "Value", type: "text", required: true, half: true },
    ],
    renderItem: (item) => ({
      title: (item.label as string) || "",
      subtitle: (item.value as string) || "",
    }),
  },
  {
    key: "features",
    title: "Features",
    description: "হোমপেজের ফিচার কার্ড — আইকন, শিরোনাম, বিবরণ",
    fields: [
      { name: "icon", label: "Icon", type: "select", options: FEATURE_ICONS, half: true },
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "description", label: "Description", type: "textarea", required: true, rows: 3 },
    ],
    renderItem: (item) => ({
      title: (item.title as string) || "",
      subtitle: (item.icon as string) || "",
    }),
  },
  {
    key: "steps",
    title: "Admission Steps",
    description: "ভর্তি প্রক্রিয়ার ধাপগুলো",
    fields: [
      { name: "step", label: "Step Number", type: "text", required: true, half: true },
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "description", label: "Description", type: "textarea", rows: 3 },
    ],
    renderItem: (item) => ({
      title: `${item.step || "—"} · ${item.title || ""}`,
      subtitle: (item.description as string) || "",
    }),
  },
  {
    key: "faq",
    title: "FAQ",
    description: "সাধারণ জিজ্ঞাসা — প্রশ্ন ও উত্তর",
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true, rows: 4 },
    ],
    renderItem: (item) => ({
      title: (item.question as string) || "",
      subtitle: (item.answer as string) || "",
    }),
  },
];

// ============================================================
// Main Component
// ============================================================

export default function SiteContentManager({
  initialSettings,
  initialTeachers,
  initialGallery,
  initialVideos,
  initialTestimonials,
  initialStats,
  initialFeatures,
  initialSteps,
  initialFaq,
}: {
  initialSettings: SiteSettingsData | null;
  initialTeachers: Record<string, unknown>[];
  initialGallery: Record<string, unknown>[];
  initialVideos: Record<string, unknown>[];
  initialTestimonials: Record<string, unknown>[];
  initialStats: Record<string, unknown>[];
  initialFeatures: Record<string, unknown>[];
  initialSteps: Record<string, unknown>[];
  initialFaq: Record<string, unknown>[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("settings");
  const [settings, setSettings] = useState<SiteSettingsData | null>(
    initialSettings
  );
  const [prevSettings, setPrevSettings] = useState(initialSettings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [heroImage, setHeroImage] = useState<string | null>(
    initialSettings?.heroImage || null
  );
  const [heroImageUploading, setHeroImageUploading] = useState(false);
  const [heroImageError, setHeroImageError] = useState("");
  const [pendingHeroImage, setPendingHeroImage] = useState<string | null>(null);

  if (prevSettings !== initialSettings) {
    setPrevSettings(initialSettings);
    setSettings(initialSettings);
    setHeroImage(initialSettings?.heroImage || null);
    setPendingHeroImage(null);
  }

  const collectionMap: Record<string, { config: CollectionConfig; items: Record<string, unknown>[] }> = {
    teachers: { config: COLLECTIONS[0], items: initialTeachers },
    gallery: { config: COLLECTIONS[1], items: initialGallery },
    videos: { config: COLLECTIONS[2], items: initialVideos },
    testimonials: { config: COLLECTIONS[3], items: initialTestimonials },
    stats: { config: COLLECTIONS[4], items: initialStats },
    features: { config: COLLECTIONS[5], items: initialFeatures },
    steps: { config: COLLECTIONS[6], items: initialSteps },
    faq: { config: COLLECTIONS[7], items: initialFaq },
  };

  async function handleHeroImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file || heroImageUploading) return;

    setHeroImageUploading(true);
    setHeroImageError("");
    try {
      const uploadedUrl = await uploadImage(file);
      if (pendingHeroImage && pendingHeroImage !== uploadedUrl) {
        try {
          await deleteUploadedImage(pendingHeroImage);
        } catch (cleanupError) {
          console.warn("Could not clean up previous hero image:", cleanupError);
        }
      }
      setHeroImage(uploadedUrl);
      setPendingHeroImage(uploadedUrl);
    } catch (error) {
      setHeroImageError(
        error instanceof Error
          ? error.message
          : "Hero image upload failed. Please try again."
      );
    } finally {
      input.value = "";
      setHeroImageUploading(false);
    }
  }

  async function handleRemoveHeroImage() {
    if (pendingHeroImage) {
      try {
        await deleteUploadedImage(pendingHeroImage);
      } catch (cleanupError) {
        console.warn("Could not clean up pending hero image:", cleanupError);
      }
    }
    setPendingHeroImage(null);
    setHeroImage(null);
    setHeroImageError("");
  }

  async function handleSaveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (heroImageUploading) return;
    setSavingSettings(true);
    setSettingsError("");
    setSettingsSuccess(false);

    const form = new FormData(e.currentTarget);

    const data = {
      name: (form.get("name") as string) || "",
      nameLatin: (form.get("nameLatin") as string) || null,
      tagline: (form.get("tagline") as string) || null,
      description: (form.get("description") as string) || null,
      phone: (form.get("phone") as string) || null,
      whatsapp: (form.get("whatsapp") as string) || null,
      email: (form.get("email") as string) || null,
      address: (form.get("address") as string) || null,
      facebook: (form.get("facebook") as string) || null,
      youtube: (form.get("youtube") as string) || null,
      heroArabicText: (form.get("heroArabicText") as string) || null,
      admissionOpen: form.get("admissionOpen") === "on",
      logo: (form.get("logo") as string) || null,
      logoNav: (form.get("logoNav") as string) || null,
      // Kept for backwards compatibility; the hero no longer renders a logo.
      logoHero: settings?.logoHero || null,
      heroImage,
    };

    try {
      const res = await fetch("/api/site/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save settings");
      }

      setPendingHeroImage(null);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 2500);
      router.refresh();
    } catch (err) {
      setSettingsError(
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setSavingSettings(false);
    }
  }

  const activeCollection = collectionMap[activeTab];
  const settingsValue = settings || ({} as SiteSettingsData);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-mist text-primary">
            <Globe size={20} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-ink">Site Content</h1>
            <p className="mt-0.5 text-sm text-grey">
              ওয়েবসাইটের সব কনটেন্ট এখান থেকে আপডেট করুন — DB-তে সংরক্ষিত হয়
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-line bg-white p-2 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "text-grey hover:bg-cream hover:text-ink"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings tab */}
      {activeTab === "settings" && (
        <div className="rounded-2xl border border-line bg-white shadow-sm">
          <div className="border-b border-line px-5 py-4 sm:px-6">
            <h2 className="text-base font-bold text-ink">Site Settings</h2>
            <p className="mt-0.5 text-xs text-grey">
              নাম, tagline, description ও admission status — homepage hero-তে; logo header/footer-এ ব্যবহৃত হয়
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="p-5 sm:p-6">
            {settingsError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {settingsError}
              </div>
            )}
            {settingsSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <Check size={16} />
                Settings saved successfully!
              </div>
            )}

            <div className="space-y-5">
              {/* Name + Latin */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Site Name (বাংলা) *
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    defaultValue={settingsValue.name || ""}
                    placeholder="ইলমুরা ইনস্টিটিউট"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="nameLatin" className={labelClass}>
                    Site Name (English)
                  </label>
                  <input
                    id="nameLatin"
                    name="nameLatin"
                    defaultValue={settingsValue.nameLatin || ""}
                    placeholder="Ilmora Institute"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label htmlFor="tagline" className={labelClass}>
                  Hero Tagline
                </label>
                <input
                  id="tagline"
                  name="tagline"
                  defaultValue={settingsValue.tagline || ""}
                  placeholder="আলিফ থেকে সুন্দরতম কুরআন তিলাওয়াত..."
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="heroArabicText" className={labelClass}>
                  Hero Arabic Line
                </label>
                <input
                  id="heroArabicText"
                  name="heroArabicText"
                  dir="rtl"
                  lang="ar"
                  defaultValue={settingsValue.heroArabicText || ""}
                  placeholder="اقرأ بسم ربك الذي خلق"
                  className={`${inputClass} text-right`}
                />
                <p className="mt-1.5 text-xs text-grey">
                  Homepage hero-এর Arabic heading এই text থেকে আসবে। খালি রাখলে default text ব্যবহার হবে।
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className={labelClass}>
                  Hero Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={settingsValue.description || ""}
                  placeholder="ইলমুরা ইনস্টিটিউট একটি অনলাইন কুরআন শিক্ষা প্ল্যাটফর্ম..."
                  className={inputClass}
                />
              </div>

              <HeroImageField
                value={heroImage}
                uploading={heroImageUploading}
                error={heroImageError}
                onUpload={handleHeroImageUpload}
                onRemove={handleRemoveHeroImage}
              />

              {/* Contact */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    defaultValue={settingsValue.phone || ""}
                    placeholder="+880 1XXX-XXXXXX"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="whatsapp" className={labelClass}>
                    WhatsApp
                  </label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    defaultValue={settingsValue.whatsapp || ""}
                    placeholder="+880 1XXX-XXXXXX"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={settingsValue.email || ""}
                    placeholder="ilmora.institute@gmail.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="address" className={labelClass}>
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    defaultValue={settingsValue.address || ""}
                    placeholder="ঢাকা, বাংলাদেশ"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="facebook" className={labelClass}>
                    Facebook URL
                  </label>
                  <input
                    id="facebook"
                    name="facebook"
                    defaultValue={settingsValue.facebook || ""}
                    placeholder="https://facebook.com/..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="youtube" className={labelClass}>
                    YouTube URL
                  </label>
                  <input
                    id="youtube"
                    name="youtube"
                    defaultValue={settingsValue.youtube || ""}
                    placeholder="https://youtube.com/@..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Logos */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="logo" className={labelClass}>
                    Header Logo URL (wide)
                  </label>
                  <input
                    id="logo"
                    name="logo"
                    defaultValue={settingsValue.logo || ""}
                    placeholder="Cloudinary URL"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="logoNav" className={labelClass}>
                    Footer / Fallback Logo URL
                  </label>
                  <input
                    id="logoNav"
                    name="logoNav"
                    defaultValue={settingsValue.logoNav || ""}
                    placeholder="Cloudinary URL"
                    className={inputClass}
                  />
                </div>
              </div>
              <p className="text-xs text-grey">
                Header-এর জন্য wide logo এবং footer/fallback-এর জন্য compact logo আলাদা field-এ থাকে।
              </p>

              {/* Admission toggle */}
              <div className="flex items-center gap-2 rounded-xl border border-line bg-cream/40 px-4 py-3">
                <input
                  type="checkbox"
                  name="admissionOpen"
                  defaultChecked={settingsValue.admissionOpen}
                  className="h-4 w-4 rounded border-line text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-ink">
                  ভর্তি চলছে (Admission Open)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <button
                type="submit"
                disabled={savingSettings || heroImageUploading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {(savingSettings || heroImageUploading) && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {savingSettings
                  ? "Saving..."
                  : heroImageUploading
                    ? "Uploading image..."
                    : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Collection tabs */}
      {activeCollection && (
        <CollectionManager
          key={activeTab}
          config={activeCollection.config}
          initialItems={activeCollection.items}
        />
      )}
    </div>
  );
}

function HeroImageField({
  value,
  uploading,
  error,
  onUpload,
  onRemove,
}: {
  value: string | null;
  uploading: boolean;
  error: string;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <div>
      <label className={labelClass}>Hero Image</label>
      {value ? (
        <div className="overflow-hidden rounded-xl border border-line">
          <div className="relative h-48 bg-primary-mist">
            <Image
              src={value}
              alt="Hero image preview"
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-black/40 text-sm font-semibold text-white backdrop-blur-sm">
                <Loader2 size={20} className="animate-spin" />
                Uploading...
              </div>
            )}
            <button
              type="button"
              onClick={onRemove}
              disabled={uploading}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-grey shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              aria-label="Remove hero image"
            >
              <X size={16} />
            </button>
          </div>
          <label
            className={`flex items-center justify-center gap-2 border-t border-line bg-cream/40 px-4 py-3 text-sm font-medium ${
              uploading
                ? "cursor-wait text-grey"
                : "cursor-pointer text-primary hover:bg-primary-mist"
            }`}
          >
            {uploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {uploading ? "Uploading image..." : "Change image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={uploading}
              className="hidden"
              onChange={onUpload}
            />
          </label>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${
            uploading
              ? "cursor-wait border-primary/40 bg-primary/5"
              : "cursor-pointer border-line bg-cream/40 hover:border-primary/40 hover:bg-primary/5"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="animate-spin text-primary" />
              <span className="text-sm font-medium text-ink">
                Uploading image...
              </span>
            </>
          ) : (
            <>
              <Upload size={22} className="text-primary" />
              <span className="text-sm font-medium text-ink">
                Click to upload hero image
              </span>
              <span className="text-xs text-grey">
                JPG, PNG, WebP or GIF — max 5MB
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={uploading}
            className="hidden"
            onChange={onUpload}
          />
        </label>
      )}
      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
      <p className="mt-1.5 text-xs text-grey">
        Homepage hero-এর main image। ছবি না দিলে default New Journey image ব্যবহার হবে।
      </p>
    </div>
  );
}