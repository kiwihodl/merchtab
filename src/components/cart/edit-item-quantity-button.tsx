"use client";

import { CartItem } from "@/app/lib/shopify/types";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { updateItemQuantity } from "./actions";
import { useFormState } from "react-dom";

function SubmitButton({ type }: { type: "plus" | "minus" }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={clsx(
        "ease flex h-full min-w-[32px] max-w-[32px] flex-none items-center justify-center px-2",
        {
          "cursor-not-allowed": pending,
          "hover:opacity-50": !pending,
        }
      )}
      disabled={pending}
    >
      {type === "minus" ? (
        <MinusIcon className="h-4 w-4 text-black dark:text-white" />
      ) : (
        <PlusIcon className="h-4 w-4 text-black dark:text-white" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: {
  item: CartItem;
  type: "plus" | "minus";
  optimisticUpdate: any;
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
      <SubmitButton type={type} />
      <p aria-label="polite" className="sr-only" role="status">
        {message ?? ""}
      </p>
    </form>
  );
}
