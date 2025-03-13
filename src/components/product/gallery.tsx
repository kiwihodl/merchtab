"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useTransition, useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import styles from "./gallery.module.css";
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
        width={1200}
        height={800}
        className={`${isModal ? styles.modal__media : ""} rounded-2xl`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          borderRadius: "1rem",
        }}
        priority={!isModal}
        sizes={isModal ? "80vw" : "100vw"}
        onClick={isModal ? handleZoom : undefined}
      />
    );
  };

  if (!selectedVariantImage) {
    return (
      <div className={styles.placeholder}>
        <span>No media available</span>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      <div
        className={styles.main_media}
        role="button"
        tabIndex={0}
        onClick={() => setIsModalOpen(true)}
        onKeyDown={handleKeyDown}
        aria-label="main media"
      >
        {pending && (
          <div className={styles.loading} data-testid="loading">
            <div className={styles.loading__spinner} />
          </div>
        )}
        <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-2xl mt-12 md:mt-20">
          <Image
            src={selectedVariantImage.src}
            alt={selectedVariantImage.name}
            width={1200}
            height={800}
            className="rounded-2xl"
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
            }}
            priority={true}
            sizes="100vw"
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className={styles.slider_container}>
          {images.length > 2 && (
            <button
              className={`${styles.slider__nav} ${styles.slider__nav_prev}`}
              onClick={() => {
                if (sliderRef.current) {
                  sliderRef.current.scrollBy({
                    left: -200,
                    behavior: "smooth",
                  });
                }
              }}
              aria-label="Previous images"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}
          <div
            className={`${styles.slider} ${images.length <= 2 ? "justify-center" : ""}`}
            ref={sliderRef}
            role="list"
          >
            {images.map((image) => (
              <button
                key={image.src}
                className={`${styles.slider__slide} ${
                  image.src === selectedVariantImage.src ? styles.selected : ""
                }`}
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
          {images.length > 2 && (
            <button
              className={`${styles.slider__nav} ${styles.slider__nav_next}`}
              onClick={() => {
                if (sliderRef.current) {
                  sliderRef.current.scrollBy({
                    left: 200,
                    behavior: "smooth",
                  });
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
          className={styles.modal}
          ref={modalRef}
          role="dialog"
          aria-label="Media gallery modal"
          onKeyDown={handleKeyDown}
        >
          <div className={styles.modal__content}>
            <button
              className={styles.modal__close}
              onClick={handleModalClose}
              aria-label="Close modal"
            >
              ×
            </button>
            <div
              className={styles.touch_area}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {renderMedia(selectedVariantImage, true)}
            </div>
            {currentIndex > 0 && (
              <button
                className={`${styles.modal__nav} ${styles.modal__nav_prev}`}
                onClick={() => handleMediaSelect(images[currentIndex - 1])}
                aria-label="Previous media"
              >
                ‹
              </button>
            )}
            {currentIndex < images.length - 1 && (
              <button
                className={`${styles.modal__nav} ${styles.modal__nav_next}`}
                onClick={() => handleMediaSelect(images[currentIndex + 1])}
                aria-label="Next media"
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
