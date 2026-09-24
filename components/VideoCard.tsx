import { PlayCircle } from "lucide-react";
import type { Video } from "@/lib/site";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-video w-full bg-ink">
        <iframe
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gold backdrop-blur">
          <PlayCircle size={13} />
          {video.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-bold leading-snug text-ink transition-colors group-hover:text-primary">
          {video.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-grey">
          {video.description}
        </p>
      </div>
    </div>
  );
}