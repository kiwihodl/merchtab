"use client";

import clsx from "clsx";
import { useCart } from "./cart-context";

function SubmitButton({
  type,
  onClick,
  disabled,
}: {
  type: "plus" | "minus";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "ease flex h-full min-w-[32px] max-w-[32px] flex-none items-center justify-center",
        {
          "cursor-not-allowed opacity-50": disabled,
          "hover:opacity-50": !disabled,
        }
      )}
      disabled={disabled}
      aria-label={type === "minus" ? "Decrease quantity" : "Increase quantity"}
    >
      {type === "minus" ? (
        <svg
          className="h-4 w-4 text-black dark:text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
        </svg>
      ) : (
        <svg
          className="h-4 w-4 text-black dark:text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  merchandiseId,
  quantity,
  disabled,
}: {
  merchandiseId: string;
  quantity: number;
  disabled?: boolean;
}) {
  const { updateCartItem } = useCart();

  return (
    <div className="flex items-center">
      <SubmitButton
        type="minus"
        onClick={() => updateCartItem(merchandiseId, "minus")}
        disabled={disabled || quantity <= 1}
      />
      <p className="w-6 text-center">
        <span className="w-full text-sm">{quantity}</span>
      </p>
      <SubmitButton
        type="plus"
        onClick={() => updateCartItem(merchandiseId, "plus")}
        disabled={disabled}
      />
    </div>
  );
}
