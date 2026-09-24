"use client";

import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function TogglePublishButton({
  id,
  isPublished,
  type,
}: {
  id: string;
  isPublished: boolean;
  type: "category" | "course";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/${type}s/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // silent
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
        isPublished
          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "bg-grey/10 text-grey hover:bg-grey/20"
      }`}
    >
      {isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
      {isPublished ? "Published" : "Draft"}
    </button>
  );
}
