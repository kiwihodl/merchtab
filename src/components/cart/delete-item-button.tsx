"use client";

import { CartItem } from "@/app/lib/shopify/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCart } from "./cart-context";

export function DeleteItemButton({
  item,
  disabled,
}: {
  item: CartItem;
  disabled?: boolean;
}) {
  const { updateCartItem } = useCart();
  const merchandiseId = item.merchandise.id;

  return (
    <button
      onClick={() => updateCartItem(merchandiseId, "delete")}
      aria-label="Remove cart item"
      className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-900 hover:opacity-70 dark:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled}
    >
      <XMarkIcon className="h-5 w-5 text-accent" />
    </button>
  );
}
