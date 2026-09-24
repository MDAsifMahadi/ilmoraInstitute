"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { GalleryItem } from "@/lib/site";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  const close = useCallback(() => setSelected(null), []);
  const prev = useCallback(
    () => setSelected((s) => (s === null ? s : (s + items.length - 1) % items.length)),
    [items.length]
  );
  const next = useCallback(
    () => setSelected((s) => (s === null ? s : (s + 1) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, close, prev, next]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <button
            key={item.alt}
            type="button"
            onClick={() => setSelected(index)}
            className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-primary-mist shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-gold"
            aria-label={`${item.alt} — বড় করে দেখুন`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-left text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
              <ZoomIn size={15} />
              {item.alt}
            </span>
          </button>
        ))}
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="ছবি প্রিভিউ"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="বন্ধ করুন"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="আগের ছবি"
          >
            <ChevronLeft size={24} />
          </button>

          <figure
            className="max-h-[85vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-auto w-auto max-h-[75vh] overflow-hidden rounded-xl">
              <Image
                src={items[selected].src}
                alt={items[selected].alt}
                className="max-h-[75vh] w-auto rounded-xl object-contain"
                width={1600}
                height={900}
              />
            </div>
            <figcaption className="mt-3 text-center text-sm font-medium text-white">
              {items[selected].alt} ({selected + 1} / {items.length})
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="পরের ছবি"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </>
  );
}