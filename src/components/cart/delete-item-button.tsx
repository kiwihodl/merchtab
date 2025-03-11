"use client";

import { CartItem } from "@/app/lib/shopify/types";
import { useFormState } from "react-dom";
import { removeItem } from "./actions";

export function DeleteItemButton({
  item,
  optimisticUpdate,
  disabled,
}: {
  item: CartItem;
  optimisticUpdate: any;
  disabled?: boolean;
}) {
  const [message, formAction] = useFormState(removeItem, null);
  const merchandiseId = item.merchandise.id;
  const actionWithVariant = formAction.bind(null, merchandiseId);

  return (
    <form
      action={async () => {
        optimisticUpdate(merchandiseId, "delete");
        await actionWithVariant();
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-900 hover:opacity-70 dark:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        <svg
          className="h-5 w-5 text-accent"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message ?? ""}
      </p>
    </form>
  );
}
