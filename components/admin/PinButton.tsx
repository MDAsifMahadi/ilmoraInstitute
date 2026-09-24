"use client";

import { useRouter } from "next/navigation";
import { Pin } from "lucide-react";
import { useState } from "react";

export default function PinButton({
  id,
  pinned,
  label = "Pin to home",
}: {
  id: string;
  pinned: boolean;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinOnHome: !pinned }),
      });
      if (res.ok) router.refresh();
    } catch {
      // silent
    }
    setLoading(false);
  }

  return (
    <label
      title={label}
      className={`inline-flex cursor-pointer select-none items-center gap-1.5 transition-colors ${
        pinned ? "text-primary" : "text-grey hover:text-ink"
      } ${loading ? "cursor-wait opacity-60" : ""}`}
    >
      <input
        type="checkbox"
        checked={pinned}
        disabled={loading}
        onChange={toggle}
        className="h-3.5 w-3.5 rounded border-line accent-primary focus:ring-primary/20 disabled:cursor-wait"
      />
      {label && (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium">
          <Pin
            size={11}
            strokeWidth={2.5}
            className={pinned ? "fill-primary text-primary" : ""}
          />
          {label}
        </span>
      )}
    </label>
  );
}