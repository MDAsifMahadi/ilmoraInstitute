"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, Phone, Send } from "lucide-react";
import { SITE } from "@/lib/site";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-cream px-4 py-3.5 text-sm text-ink placeholder:text-[#9aa0a8] transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";

const labelClass = "mb-1.5 block text-sm font-semibold text-ink";

export default function ContactForm({ phone = SITE.phone }: { phone?: string }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: অ্যাডমিন/ব্যাকএন্ডে সংযোগ হলে এখানে ডেটা পাঠানো হবে।
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-primary/20 bg-primary-mist p-10 text-center">
        <CheckCircle2 size={56} strokeWidth={2} className="text-primary" />
        <h3 className="mt-5 font-display text-2xl font-bold text-primary">
          মেসেজটি সফলভাবে পাঠানো হয়েছে
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-grey">
          ধন্যবাদ! আমাদের টিম যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করবে। জরুরি
          প্রয়োজনে সরাসরি কল করুন —{" "}
          <span className="font-semibold text-ink">{phone}</span>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            আপনার নাম *
          </label>
          <input id="name" name="name" required placeholder="আপনার নাম" className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            মোবাইল নম্বর *
          </label>
          <input id="phone" name="phone" type="tel" required placeholder="01XXXXXXXXX" className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          ইমেইল
        </label>
        <input id="email" name="email" type="email" placeholder="example@email.com" className={inputClass} />
      </div>
      <div>
        <label htmlFor="subject" className={labelClass}>
          বিষয় *
        </label>
        <select id="subject" name="subject" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            বিষয় নির্বাচন করুন
          </option>
          <option>ভর্তি সম্পর্কে জিজ্ঞাসা</option>
          <option>কোর্স সম্পর্কে জানতে চাই</option>
          <option>সময়সূচি / ক্লাস সংক্রান্ত</option>
          <option>ফি সম্পর্কিত</option>
          <option>অন্যান্য</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className={labelClass}>
          বার্তা *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="আপনার বার্তা লিখুন…"
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg"
      >
        <Send size={17} strokeWidth={2.5} />
        মেসেজ পাঠান
      </button>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-grey">
        <Phone size={12} />
        জরুরি প্রয়োজনে {phone}
      </p>
    </form>
  );
}