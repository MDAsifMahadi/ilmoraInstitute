export default function CourseDetailLoading() {
  return (
    <>
      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-3 w-10 animate-pulse rounded bg-cream" />
            <div className="h-3 w-3 animate-pulse rounded bg-cream" />
            <div className="h-3 w-24 animate-pulse rounded bg-cream" />
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="aspect-[16/10] w-full animate-pulse rounded-3xl bg-cream" />

            <div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-cream" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-cream" />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-12 w-12 flex-none animate-pulse rounded-2xl bg-cream" />
                <div className="h-8 w-3/4 animate-pulse rounded-xl bg-cream" />
              </div>
              <div className="mt-4 h-4 w-full animate-pulse rounded bg-cream" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-cream" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-cream" />

              <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-line bg-cream p-5 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 flex-none animate-pulse rounded bg-primary/20" />
                    <div className="flex-1">
                      <div className="h-2.5 w-20 animate-pulse rounded bg-cream" />
                      <div className="mt-2 h-4 w-28 animate-pulse rounded bg-cream" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <div className="h-12 w-44 animate-pulse rounded-full bg-cream" />
                <div className="h-12 w-36 animate-pulse rounded-full bg-cream" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-pulse rounded bg-primary/20" />
                  <div className="h-5 w-40 animate-pulse rounded-lg bg-cream" />
                </div>
                <div className="mt-4 space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className="h-5 w-5 flex-none animate-pulse rounded bg-primary/20" />
                      <div className="h-4 w-full animate-pulse rounded bg-cream" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}