"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { GridTileImage } from "../grid/tile";
import { useProduct } from "./product-context";
import { useTransition } from "react";
import { ProductVariant } from "@/app/lib/shopify/types";

export default function Gallery({
  images,
  variants,
}: {
  images: { src: string; altText: string }[];
  variants: ProductVariant[];
}) {
  const { state, updateImage } = useProduct();
  const [isPending, startTransition] = useTransition();
  const imageIndex = state.image ? parseInt(state.image) : 0;

  // Find the current variant based on selected options
  const currentVariant = variants.find((variant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );

  // Use variant image if available, otherwise use the gallery image
  const currentImage = currentVariant?.image
    ? {
        src: currentVariant.image.url,
        altText: currentVariant.image.altText,
      }
    : images[imageIndex];

  const handleImageUpdate = (index: number) => {
    startTransition(() => {
      updateImage(index.toString());
    });
  };

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    "h-full px-6 transition-all duration-theme-default ease-in-out hover:scale-110 hover:text-accent flex items-center justify-center";

  return (
    <form>
      <div className="relative aspect-square h-full max-h-[550px] w-full">
        <div className="relative h-full w-full">
          {currentImage && (
            <div className="h-full w-full flex justify-center items-center">
              <Image
                className="rounded-2xl"
                src={currentImage.src}
                alt={currentImage.altText}
                priority={true}
                width={550}
                height={550}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
        </div>
      </div>
      {images.length > 1 ? (
        <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {images.map((image, index) => {
            // Check if this thumbnail matches the current variant's image
            const isActive = currentVariant?.image
              ? image.src === currentVariant.image.url
              : index === imageIndex;

            return (
              <li key={image.src} className="h-20 w-20">
                <button
                  type="button"
                  onClick={() => handleImageUpdate(index)}
                  disabled={isPending}
                  aria-label="Select product image"
                  className={`h-full w-full transition-opacity ${
                    isPending ? "opacity-50" : ""
                  }`}
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    active={isActive}
                    width={80}
                    height={80}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}
