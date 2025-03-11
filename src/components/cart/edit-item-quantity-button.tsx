"use client";

import { CartItem } from "@/app/lib/shopify/types";
import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { updateItemQuantity } from "./actions";
import { useFormState } from "react-dom";

function SubmitButton({
  type,
  disabled,
}: {
  type: "plus" | "minus";
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;

  return (
    <button
      type="submit"
      className={clsx(
        "ease flex h-full min-w-[32px] max-w-[32px] flex-none items-center justify-center px-2",
        {
          "cursor-not-allowed opacity-50": isDisabled,
          "hover:opacity-50": !isDisabled,
        }
      )}
      disabled={isDisabled}
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
  item,
  type,
  optimisticUpdate,
  disabled,
}: {
  item: CartItem;
  type: "plus" | "minus";
  optimisticUpdate: any;
  disabled?: boolean;
}) {
  const [message, formAction] = useFormState(updateItemQuantity, null);
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };
  const actionWithVariant = formAction.bind(null, payload);

  return (
    <form
      action={async () => {
        optimisticUpdate(payload.merchandiseId, type);
        await actionWithVariant();
      }}
    >
      <SubmitButton type={type} disabled={disabled} />
      <p aria-label="polite" className="sr-only" role="status">
        {message ?? ""}
      </p>
    </form>
  );
}
