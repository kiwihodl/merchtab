"use client";

import { Product, ProductVariant } from "@/app/lib/shopify/types";
import { useProduct } from "../product/product-context";
import { useCart } from "./cart-context";
import { useFormState } from "react-dom";
import clsx from "clsx";
import { PlusIcon } from "@heroicons/react/24/outline";
import { addItem } from "./actions";
import { useTransition } from "react";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  isLoading,
  isPending,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  isLoading: boolean;
  isPending: boolean;
}) {
  const buttonClasses =
    "relative flex items-center justify-center rounded-full bg-accent px-4 py-2 tracking-wide text-black transition duration-theme-default hover:bg-accent/90";
  const disabledClasses =
    "cursor-not-allowed opacity-60 hover:opacity-60 bg-neutral-600 hover:bg-neutral-600";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        Add to Cart
      </button>
    );
  }

  if (isLoading || isPending) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Adding...
      </button>
    );
  }

  return (
    <button aria-label="Add to cart" className={buttonClasses}>
      Add To Cart
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem, isOperationPending } = useCart();
  const { state } = useProduct();
  const [isSubmitting, startTransition] = useTransition();

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  );

  if (!finalVariant || !selectedVariantId) {
    return null;
  }

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await addItem(null, selectedVariantId);
        addCartItem(finalVariant, product);
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        isLoading={isOperationPending(selectedVariantId)}
        isPending={isSubmitting}
      />
    </form>
  );
}
