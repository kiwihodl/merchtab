"use client";

import { ProductOption, ProductVariant } from "@/app/lib/shopify/types";
import { useProduct } from "./product-context";
import clsx from "clsx";
import React from "react";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export default function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();

  // Set default size to M if available
  React.useEffect(() => {
    const sizeOption = options.find((opt) => opt.name.toLowerCase() === "size");
    if (sizeOption) {
      const mediumSize = sizeOption.values.find((v) => v.toLowerCase() === "m");
      if (mediumSize && !state["size"]) {
        updateOption("size", mediumSize);
      }
    }
  }, [options, state, updateOption]);

  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {}
    ),
  }));

  return options.map((option) => (
    <form key={option.id} onSubmit={(e) => e.preventDefault()}>
      <dl className="mb-8 flex flex-col items-center lg:items-start">
        <dt className="mb-4 text-lg uppercase tracking-wide text-black dark:text-white">
          {option.name}
        </dt>
        <dd className="flex flex-wrap justify-center lg:justify-start gap-3">
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();

            const isAvailableForSale = combinations.find((combination) => {
              if (!combination.availableForSale) return false;
              return combination[optionNameLowerCase] === value;
            });

            const isActive = state[optionNameLowerCase] === value;

            return (
              <button
                type="button"
                key={value}
                aria-disabled={!isAvailableForSale}
                disabled={!isAvailableForSale}
                title={`${option.name} ${value}${
                  !isAvailableForSale ? " (Out of Stock)" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  updateOption(optionNameLowerCase, value);
                }}
                className={clsx(
                  "flex min-w-[48px] items-center justify-center rounded-full border px-2 py-1 text-sm",
                  {
                    "cursor-default border-accent bg-accent text-black":
                      isActive,
                    "border-neutral-200 bg-neutral-100 text-black hover:border-accent dark:border-neutral-800 dark:bg-neutral-900 dark:text-white":
                      !isActive && isAvailableForSale,
                    "relative z-10 cursor-not-allowed overflow-hidden border-neutral-300 bg-neutral-100 text-neutral-500 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 before:dark:bg-neutral-700":
                      !isAvailableForSale,
                  }
                )}
              >
                {value}
              </button>
            );
          })}
        </dd>
      </dl>
    </form>
  ));
}
