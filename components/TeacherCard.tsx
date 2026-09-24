import Image from "next/image";
import { Award, GraduationCap } from "lucide-react";
import type { Teacher } from "@/lib/site";

const AVATAR_STYLES = [
  "bg-primary",
  "bg-primary-dark",
  "bg-primary-light",
  "bg-gold-dark",
  "bg-navy",
  "bg-[#0d5c32]",
];

export default function TeacherCard({
  teacher,
  index,
}: {
  teacher: Teacher;
  index: number;
}) {
  const avatarBg = AVATAR_STYLES[index % AVATAR_STYLES.length];
  const initials = teacher.name
    .replace("ডেমো ", "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("");

  return (
    <div className="flex flex-col items-center rounded-2xl border border-line bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div
        className={`relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full font-display text-2xl font-extrabold text-white shadow-md ${
          teacher.image ? "bg-cream" : avatarBg
        }`}
      >
        {teacher.image ? (
          <Image
            src={teacher.image}
            alt={`${teacher.name}-এর ছবি`}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <span aria-hidden>{initials}</span>
        )}
        <span
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-ink shadow-sm"
          aria-hidden
        >
          <GraduationCap size={15} strokeWidth={2.5} />
        </span>
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-ink">
        {teacher.name}
      </h3>
      <p className="mt-1.5 inline-block rounded-full bg-primary-mist px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
        {teacher.subject}
      </p>
      <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dark">
        <Award size={15} />
        {teacher.experience}
      </p>
      <p className="mt-1 text-xs text-grey">{teacher.grad}</p>
      <p className="mt-4 text-sm leading-relaxed text-grey">{teacher.bio}</p>
    </div>
  );
}