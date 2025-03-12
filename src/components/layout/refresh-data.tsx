"use client";

import { revalidateProducts } from "../cart/actions";
import { useTransition } from "react";

export function RefreshData() {
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      await revalidateProducts();
      // Force a hard refresh of the page
      window.location.reload();
    });
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      className="fixed bottom-4 right-4 z-50 rounded-full bg-accent px-4 py-2 text-sm font-medium text-black transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Refreshing..." : "Refresh Product Data"}
    </button>
  );
}
