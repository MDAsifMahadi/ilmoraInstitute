"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  UserRound,
} from "lucide-react";
import { SITE } from "@/lib/site";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-cream px-4 py-3.5 text-sm text-ink placeholder:text-[#9aa0a8] transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";

const labelClass = "mb-1.5 block text-sm font-semibold text-ink";

export default function AdmissionForm({
  courses,
  phone = SITE.phone,
}: {
  courses: { slug: string; title: string }[];
  phone?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      guardianName: formData.get("guardianName"),
      guardianPhone: formData.get("guardianPhone"),
      studentName: formData.get("studentName"),
      studentAge: formData.get("studentAge"),
      gender: formData.get("gender"),
      course: formData.get("course"),
      preferredTime: formData.get("preferredTime"),
      address: formData.get("address"),
      additional: formData.get("additional"),
    };

    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "সমস্যা হয়েছে");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ভর্তির আবেদন জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-primary-mist p-10 text-center sm:p-14">
        <CheckCircle2 size={60} strokeWidth={2} className="text-primary" />
        <h2 className="mt-5 font-display text-2xl font-bold text-primary sm:text-3xl">
          ভর্তির আবেদন গৃহীত হয়েছে!
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-grey">
          আপনার ভর্তি আবেদন আমাদের কাছে পৌঁছেছে। আমাদের টিম ২৪ ঘণ্টার মধ্যে
          আপনার সাথে যোগাযোগ করে ক্লাসের সময় ও কোর্স চূড়ান্ত করবে। প্রয়োজনে
          সরাসরি যোগাযোগ:{" "}
          <span className="font-semibold text-ink">{phone}</span>
        </p>
        <p className="mt-5 font-serif text-xl text-primary">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <p className="mt-2 text-sm font-semibold text-grey">
          আপনার যাত্রা শুরু হোক বরকতময়।
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-9"
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <UserRound size={18} className="text-primary" />
          অভিভাবকের তথ্য
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="guardianName" className={labelClass}>
              অভিভাবকের নাম *
            </label>
            <input
              id="guardianName"
              name="guardianName"
              required
              placeholder="অভিভাবকের পূর্ণ নাম"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="guardianPhone" className={labelClass}>
              মোবাইল নম্বর *
            </label>
            <input
              id="guardianPhone"
              name="guardianPhone"
              type="tel"
              required
              placeholder="01XXXXXXXXX"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-line pt-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <GraduationCap size={18} className="text-primary" />
          শিক্ষার্থীর তথ্য
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="studentName" className={labelClass}>
              শিক্ষার্থীর নাম *
            </label>
            <input
              id="studentName"
              name="studentName"
              required
              placeholder="শিক্ষার্থীর পূর্ণ নাম"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="studentAge" className={labelClass}>
              বয়স *
            </label>
            <input
              id="studentAge"
              name="studentAge"
              type="number"
              min="4"
              max="70"
              required
              placeholder="যেমন: ১২"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="gender" className={labelClass}>
              লিঙ্গ
            </label>
            <select
              id="gender"
              name="gender"
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                নির্বাচন করুন
              </option>
              <option value="male">পুরুষ</option>
              <option value="female">মহিলা</option>
            </select>
          </div>
          <div>
            <label htmlFor="course" className={labelClass}>
              পছন্দের কোর্স *
            </label>
            <select
              id="course"
              name="course"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                কোর্স নির্বাচন করুন
              </option>
              {courses.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {course.title}
                </option>
              ))}
              <option value="undecided">কোর্স সম্পর্কে পরামর্শ চাই</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="preferredTime" className={labelClass}>
              পছন্দের ক্লাসের সময়
            </label>
            <select
              id="preferredTime"
              name="preferredTime"
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                সময় বেছে নিন
              </option>
              <option>সকাল (সকাল ৯টা - দুপুর ১২টা)</option>
              <option>দুপুর (বিকাল ৩টা - সন্ধ্যা ৫টা)</option>
              <option>সন্ধ্যা (রাত ৭টা - রাত ৯টা)</option>
              <option>কোনো বিশেষ সময় নেই</option>
            </select>
          </div>
          <div>
            <label htmlFor="address" className={labelClass}>
              ঠিকানা
            </label>
            <input
              id="address"
              name="address"
              placeholder="জেলা, উপজেলা, শহর"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="additional" className={labelClass}>
              অতিরিক্ত তথ্য (ঐচ্ছিক)
            </label>
            <input
              id="additional"
              name="additional"
              placeholder="সংক্ষেপে কিছু লিখুন"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-base font-bold text-[#1c1400] shadow-md transition-all hover:-translate-y-0.5 hover:bg-gold-dark hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading ? (
          "আবেদন জমা হচ্ছে..."
        ) : (
          <>
            ভর্তির আবেদন জমা দিন
            <ArrowRight size={18} strokeWidth={2.5} />
          </>
        )}
      </button>
      <p className="text-center text-xs text-grey">
        আবেদন জমা দেওয়ার অর্থ এই নয় যে ভর্তি নিশ্চিত হয়েছে; আমাদের টিম
        যোগাযোগ করে নিশ্চিত করবে।
      </p>
    </form>
  );
}
