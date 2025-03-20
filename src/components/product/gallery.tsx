"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useTransition, useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { ProductVariant } from "@/app/lib/shopify/types";

interface Image {
  src: string;
  name: string;
}

interface GalleryProps {
  images: Image[];
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  selectedVariantImage: Image | null;
  updateImage: (image: Image) => void;
  pending: boolean;
}

export function Gallery({
  images,
  variants,
  selectedVariant,
  selectedVariantImage,
  updateImage,
  pending,
}: GalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const currentIndex = images.findIndex(
    (img) => img.src === selectedVariantImage?.src
  );

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleMediaSelect = (image: Image) => {
    if (!image?.src) return;

    // If we're in the modal, update the image
    if (isModalOpen) {
      updateImage(image);
      return;
    }

    // If clicking the main image, open the modal
    if (image.src === selectedVariantImage?.src) {
      setIsModalOpen(true);
    } else {
      // If clicking a thumbnail, update the image
      updateImage(image);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsZoomed(false);
  };

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    setTouchEnd({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0 && currentIndex > 0) {
        handleMediaSelect(images[currentIndex - 1]);
      } else if (deltaX < 0 && currentIndex < images.length - 1) {
        handleMediaSelect(images[currentIndex + 1]);
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isModalOpen) return;

    switch (e.key) {
      case "Escape":
        handleModalClose();
        break;
      case "ArrowLeft":
        if (currentIndex > 0) {
          handleMediaSelect(images[currentIndex - 1]);
        }
        break;
      case "ArrowRight":
        if (currentIndex < images.length - 1) {
          handleMediaSelect(images[currentIndex + 1]);
        }
        break;
      case " ":
        e.preventDefault();
        handleZoom();
        break;
    }
  };

  const renderMedia = (image: Image, isModal = false) => {
    return (
      <Image
        src={image.src}
        alt={image.name}
        width={isModal ? 1200 : 800}
        height={isModal ? 800 : 600}
        className="rounded-2xl"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          borderRadius: "1rem",
        }}
        priority={!isModal}
        sizes={isModal ? "80vw" : "(min-width: 768px) 50vw, 100vw"}
        quality={isModal ? 90 : 75}
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
          '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#CCCCCC"/></svg>'
        ).toString("base64")}`}
        onClick={isModal ? handleZoom : undefined}
      />
    );
  };

  if (!selectedVariantImage) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span>No media available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-[550px] mx-auto mb-8">
      <div
        className="relative w-full aspect-[3/4] max-w-[550px] mx-auto overflow-hidden cursor-pointer rounded-2xl"
        role="button"
        tabIndex={0}
        onClick={() => setIsModalOpen(true)}
        onKeyDown={handleKeyDown}
        aria-label="main media"
      >
        {pending && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/50"
            data-testid="loading"
          >
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-2xl mt-12 md:mt-20">
          <Image
            src={selectedVariantImage.src}
            alt={selectedVariantImage.name}
            width={800}
            height={600}
            className="rounded-2xl"
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
            }}
            priority={true}
            sizes="(min-width: 768px) 50vw, 100vw"
            quality={75}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
              '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#CCCCCC"/></svg>'
            ).toString("base64")}`}
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="relative w-full px-10 -mt-4">
          {images.length > 3 && (
            <button
              className="absolute top-1/2 -translate-y-1/2 left-0 w-8 h-8 flex items-center justify-center bg-black/50 border-none rounded-full text-white cursor-pointer transition-colors hover:bg-black/70 z-10"
              onClick={() => {
                if (sliderRef.current) {
                  const scrollAmount = sliderRef.current.offsetWidth * 0.8;
                  sliderRef.current.scrollBy({
                    left: -scrollAmount,
                    behavior: "smooth",
                  });
                  // If at first image, wrap to last image, otherwise go to previous
                  const newIndex =
                    currentIndex === 0 ? images.length - 1 : currentIndex - 1;
                  handleMediaSelect(images[newIndex]);
                }
              }}
              aria-label="Previous images"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}
          <div
            className="snap-x snap-mandatory scrollbar-none scroll-smooth flex gap-2 py-2 overflow-x-auto justify-center"
            ref={sliderRef}
            role="list"
          >
            {images.map((image) => (
              <button
                key={image.src}
                className={clsx(
                  "flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-colors rounded-2xl md:w-[4.5rem] md:h-[4.5rem] lg:w-20 lg:h-20",
                  image.src === selectedVariantImage.src
                    ? "border-accent"
                    : "border-transparent hover:border-accent/50"
                )}
                onClick={() => handleMediaSelect(image)}
                aria-label={`View ${image.name}`}
                aria-current={
                  image.src === selectedVariantImage.src ? "true" : undefined
                }
              >
                {renderMedia(image)}
              </button>
            ))}
          </div>
          {images.length > 3 && (
            <button
              className="absolute top-1/2 -translate-y-1/2 right-0 w-8 h-8 flex items-center justify-center bg-black/50 border-none rounded-full text-white cursor-pointer transition-colors hover:bg-black/70 z-10"
              onClick={() => {
                if (sliderRef.current) {
                  const scrollAmount = sliderRef.current.offsetWidth * 0.8;
                  sliderRef.current.scrollBy({
                    left: scrollAmount,
                    behavior: "smooth",
                  });
                  // If at last image, wrap to first image, otherwise go to next
                  const newIndex =
                    currentIndex === images.length - 1 ? 0 : currentIndex + 1;
                  handleMediaSelect(images[newIndex]);
                }
              }}
              aria-label="Next images"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          ref={modalRef}
          role="dialog"
          aria-label="Media gallery modal"
          onKeyDown={handleKeyDown}
        >
          <div className="relative w-full max-w-[80rem] h-full flex items-center justify-center">
            <button
              className="absolute right-4 top-4 text-white bg-transparent border-none p-2 cursor-pointer transition-colors hover:text-white/70"
              onClick={handleModalClose}
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <div
              className="touch-pan-y touch-pinch-zoom cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={selectedVariantImage.src}
                alt={selectedVariantImage.name}
                width={1200}
                height={800}
                className={clsx(
                  "w-full h-full object-contain transition-transform duration-300",
                  isZoomed && "scale-150"
                )}
                priority={false}
                sizes="80vw"
                quality={90}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
                  '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#CCCCCC"/></svg>'
                ).toString("base64")}`}
                onClick={handleZoom}
              />
            </div>
            {currentIndex > 0 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-transparent border-none p-2 cursor-pointer transition-colors hover:text-white/70"
                onClick={() => handleMediaSelect(images[currentIndex - 1])}
                aria-label="Previous media"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
            )}
            {currentIndex < images.length - 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-transparent border-none p-2 cursor-pointer transition-colors hover:text-white/70"
                onClick={() => handleMediaSelect(images[currentIndex + 1])}
                aria-label="Next media"
              >
                <ArrowRightIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
