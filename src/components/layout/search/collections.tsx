import { getCollections, getCollectionProducts } from "@/app/lib/shopify";
import FilterList from "./filter";
import { Suspense } from "react";
import clsx from "clsx";

async function CollectionList() {
  console.log("CollectionList is being rendered");
  const collections = await getCollections();
  console.log("Collections from Shopify:", collections);

  // Always include "All" collection
  const allCollection = {
    handle: "",
    title: "All",
    description: "All products",
    seo: {
      title: "All",
      description: "All products",
    },
    path: "/search",
    updatedAt: new Date().toISOString(),
  };

  // Get products for each collection (excluding "All")
  const collectionsWithProducts = await Promise.all(
    collections
      .filter((collection) => collection.handle !== "") // Exclude "All" collection
      .map(async (collection) => {
        try {
          const products = await getCollectionProducts({
            collection: collection.handle,
          });
          return {
            ...collection,
            hasProducts: products.length > 0,
          };
        } catch (error) {
          console.error(
            `Error fetching products for collection ${collection.handle}:`,
            error
          );
          return {
            ...collection,
            hasProducts: false,
          };
        }
      })
  );

  // Filter out collections with no products
  const activeCollections = collectionsWithProducts
    .filter((collection) => collection.hasProducts)
    .map(({ hasProducts, ...collection }) => collection);

  // Combine "All" with active collections
  const allCollections = [allCollection, ...activeCollections];

  console.log("Active collections including 'All':", allCollections);
  return <FilterList list={allCollections} title="Collections" />;
}

const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded";
const activeAndTitles = "bg-neutral-800 dark:bg-neutral-300";
const items = "bg-neutral-400 dark:bg-neutral-700";

export default function Collections() {
  console.log("Collections component is being rendered");
  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="h-[400px] w-full py-4">
            <div className={clsx(skeleton, activeAndTitles)} />
            <div className={clsx(skeleton, activeAndTitles)} />
            <div className={clsx(skeleton, items)} />
            <div className={clsx(skeleton, items)} />
            <div className={clsx(skeleton, items)} />
            <div className={clsx(skeleton, items)} />
            <div className={clsx(skeleton, items)} />
            <div className={clsx(skeleton, items)} />
            <div className={clsx(skeleton, items)} />
            <div className={clsx(skeleton, items)} />
          </div>
        }
      >
        <CollectionList />
      </Suspense>
    </div>
  );
}
