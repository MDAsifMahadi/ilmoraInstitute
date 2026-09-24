export default function CourseCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="aspect-[16/10] w-full animate-pulse bg-cream" />
      <div className="flex flex-1 flex-col p-6">
        <div className="h-3 w-24 animate-pulse rounded-full bg-cream" />
        <div className="mt-3 h-5 w-3/4 animate-pulse rounded-lg bg-cream" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-cream" />
        <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-cream" />
        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <div className="h-4 w-28 animate-pulse rounded bg-cream" />
          <div className="h-4 w-16 animate-pulse rounded bg-cream" />
        </div>
      </div>
    </div>
  );
}