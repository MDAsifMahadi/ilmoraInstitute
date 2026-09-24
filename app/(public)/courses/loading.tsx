import CourseCardSkeleton from "@/components/CourseCardSkeleton";

export default function CoursesLoading() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-dark via-primary to-[#0f7b42] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-pulse">
            <div className="h-3 w-32 rounded-full bg-white/25" />
            <div className="mt-5 h-9 w-3/4 rounded-xl bg-white/20" />
            <div className="mt-5 h-4 w-full rounded bg-white/20" />
            <div className="mt-2 h-4 w-5/6 rounded bg-white/20" />
          </div>
        </div>
      </section>

      <section className="bg-cream py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}