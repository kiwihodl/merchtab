import { GridTileImage } from "@/components/grid/tile";
import { Gallery } from "@/components/product/gallery";
import { ProductProvider } from "@/components/product/product-context";
import { ProductDescription } from "@/components/product/product-description";
import { HIDDEN_PRODUCT_TAG } from "@/app/lib/constants";
import { getProduct, getProductRecommendations } from "@/app/lib/shopify";
import { Image } from "@/app/lib/shopify/types";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ProductGallery } from "@/components/product/product-gallery";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const firstImage = product.images[0];
  const featuredImage = product.featuredImage;
  const imageUrl = featuredImage?.url || firstImage?.url;

  if (!imageUrl) {
    return {
      title: product.seo.title || product.title,
      description: product.seo.description || product.description,
    };
  }

  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);
  const imageAlt =
    featuredImage?.altText || firstImage?.altText || product.title;

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: {
      title: product.seo.title || product.title,
      description: product.seo.description || product.description,
      type: "website",
      url: `https://sovereignuniversity.vercel.app/product/${params.handle}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      siteName: "Sovereign University",
    },
    twitter: {
      card: "summary_large_image",
      site: "@SovereignUni",
      creator: "@SovereignUni",
      title: product.seo.title || product.title,
      description: product.seo.description || product.description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProduct(params.handle);
  if (!product) return notFound();

  return (
    <ProductProvider>
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-2xl bg-black p-8 md:p-12 relative">
          <Link
            href="/"
            className="absolute -left-2 top-7 md:top-14 p-4 text-white hover:text-accent transition-colors"
            aria-label="Back to shop"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="h-full w-full basis-full lg:basis-4/6">
              <div className="mb-2 md:mb-3 -mb-4 md:-mb-6">
                <h1 className="text-4xl md:text-5xl font-medium text-white text-center">
                  {product.title}
                </h1>
              </div>
              <Suspense
                fallback={
                  <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-2xl" />
                }
              >
                <ProductGallery
                  images={product.images.map((image: Image) => ({
                    src: image.url,
                    name: image.altText || "Product image",
                  }))}
                  variants={product.variants}
                />
              </Suspense>
            </div>
            <div className="basis-full lg:basis-2/6">
              <Suspense fallback={null}>
                <ProductDescription product={product} showTitle={false} />
              </Suspense>
            </div>
          </div>
        </div>
        <RelatedProducts id={product.id} />
      </div>
    </ProductProvider>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold text-white text-center">
        Related Products
      </h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 hover:border-accent"
          >
            <Link
              className="relative h-full w-full"
              href={`/product/${product.handle}`}
              prefetch={true}
            >
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode,
                  position: "center",
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
