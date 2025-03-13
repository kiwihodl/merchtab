"use client";

import { useProduct } from "./product-context";
import { Gallery } from "./gallery";
import { ProductVariant } from "@/app/lib/shopify/types";
import React from "react";

interface Image {
  src: string;
  name: string;
}

interface ProductGalleryProps {
  images: Image[];
  variants: ProductVariant[];
}

export function ProductGallery({
  images = [],
  variants = [],
}: ProductGalleryProps) {
  const { state, updateImage, updateOption } = useProduct();
  const lastColorUpdate = React.useRef<string | null>(null);
  const lastImageUpdate = React.useRef<string | null>(null);

  // Memoize the selected variant to prevent recalculation on every render
  const selectedVariant = React.useMemo(() => {
    if (!variants.length) return null;
    return (
      variants.find((variant) =>
        variant.selectedOptions.every(
          (opt) =>
            state[opt.name.toLowerCase()] === opt.value ||
            (!state[opt.name.toLowerCase()] &&
              opt.name.toLowerCase() !== "color")
        )
      ) || null
    );
  }, [variants, state]);

  // Memoize the selected variant image
  const selectedVariantImage = React.useMemo(() => {
    if (!images.length) return null;
    return (
      images.find((image) => image.src === state.image) || images[0] || null
    );
  }, [images, state.image]);

  // Set initial color if not set
  React.useEffect(() => {
    if (!variants.length || state.color) return;

    const firstAvailableVariant = variants.find(
      (v) =>
        v.availableForSale &&
        v.selectedOptions.some((opt) => opt.name.toLowerCase() === "color")
    );

    if (firstAvailableVariant) {
      const colorOption = firstAvailableVariant.selectedOptions.find(
        (opt) => opt.name.toLowerCase() === "color"
      );
      if (colorOption) {
        updateOption("color", colorOption.value);
      }
    }
  }, [variants, state.color, updateOption]);

  // Update image when variant changes
  React.useEffect(() => {
    if (!variants.length || !images.length || !selectedVariant?.image?.url)
      return;

    // Only update if the color has changed and the image is different
    if (
      state.color !== lastColorUpdate.current &&
      selectedVariant.image.url !== lastImageUpdate.current
    ) {
      lastColorUpdate.current = state.color;
      lastImageUpdate.current = selectedVariant.image.url;
      updateImage(selectedVariant.image.url);
    }
  }, [selectedVariant?.image?.url, variants, images, updateImage, state.color]);

  const handleImageUpdate = (image: Image) => {
    if (!image?.src || image.src === lastImageUpdate.current) return;
    lastImageUpdate.current = image.src;
    updateImage(image.src);
  };

  if (!images.length || !variants.length) {
    return (
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-2xl bg-neutral-900" />
    );
  }

  return (
    <Gallery
      images={images}
      variants={variants}
      selectedVariant={selectedVariant}
      selectedVariantImage={selectedVariantImage}
      updateImage={handleImageUpdate}
      pending={false}
    />
  );
}
