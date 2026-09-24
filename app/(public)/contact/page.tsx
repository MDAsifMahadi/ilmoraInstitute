import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { getSiteInfo } from "@/lib/site-data";

export const metadata = {
  title: "যোগাযোগ",
  description:
    "ইলমুরা ইনস্টিটিউটের সাথে যোগাযোগ করুন — প্রশ্ন, জিজ্ঞাসা ও ভর্তি সংক্রান্ত তথ্যের জন্য।",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const { SITE } = await getSiteInfo();

  return (
    <>
      <PageHeader
        eyebrow="যোগাযোগ"
        title="আমাদের সাথে যুক্ত হোন"
        description="কোর্স, ভর্তি, সময়সূচি বা অন্য যেকোনো বিষয়ে প্রশ্ন থাকলে সরাসরি মেসেজ করুন। আমরা যত দ্রুত সম্ভব উত্তর দেওয়ার চেষ্টা করব।"
        breadcrumbs={[{ label: "হোম", href: "/" }, { label: "যোগাযোগ" }]}
      />

      <section className="bg-cream py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <aside className="space-y-6">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-extrabold text-ink">
                যোগাযোগের তথ্য
              </h2>
              <ul className="mt-4 space-y-4 text-sm text-grey">
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary-mist text-primary">
                    <Phone size={17} />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">ফোন</p>
                    <p>{SITE.phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary-mist text-primary">
                    <Mail size={17} />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">ইমেইল</p>
                    <p>{SITE.email}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary-mist text-primary">
                    <MapPin size={17} />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">ঠিকানা</p>
                    <p>{SITE.address}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-primary-dark via-primary to-[#0f7b42] p-6 text-white shadow-md">
              <h2 className="font-display text-lg font-extrabold">
                সামাজিক যোগাযোগ
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                নিয়মিত আপডেট, ভিডিও ও কার্যক্রমের খবর পেতে ফলো করুন।
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href={SITE.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-[#1c1400] transition-transform hover:-translate-y-0.5 hover:bg-gold-dark"
                >
                  <FacebookIcon />
                  Facebook
                </a>
                <a
                  href={SITE.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gold px-5 py-2.5 text-sm font-bold text-gold transition-colors hover:bg-gold hover:text-ink"
                >
                  <YoutubeIcon />
                  YouTube
                </a>
                {SITE.whatsapp && (
                  <a
                    href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gold px-5 py-2.5 text-sm font-bold text-gold transition-colors hover:bg-gold hover:text-ink"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </aside>

          <ContactForm phone={SITE.phone} />
        </div>
      </section>
    </>
  );
}

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}