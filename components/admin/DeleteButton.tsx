"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteButton({
  id,
  type,
}: {
  id: string;
  type: "category" | "course";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/${type}s/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      setLoading(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-red-600">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="rounded border border-line px-2 py-1 text-xs text-grey hover:bg-cream"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-grey transition-colors hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 size={16} />
    </button>
  );
}
