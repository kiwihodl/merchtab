import { getCollections, getCollectionProducts } from "@/app/lib/shopify";
import FilterList from "./filter";
import { Suspense } from "react";
import clsx from "clsx";

export async function CollectionList() {
  // console.log("CollectionList is being rendered");
  const collections = await getCollections();
  // console.log("Collections from Shopify:", collections);

  if (!collections?.length) {
    return null;
  }

  const allCollections = [
    {
      handle: "",
      title: "All",
      description: "All products",
      seo: {
        title: "All",
        description: "All products",
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    ...collections.filter(
      (collection) =>
        collection.handle === "frontpage" || collection.handle === "men"
    ),
  ];

  // console.log("Active collections including 'All':", allCollections);

  return <FilterList list={allCollections} title="Collections" />;
}

const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded";
const activeAndTitles = "bg-neutral-800 dark:bg-neutral-300";
const items = "bg-neutral-400 dark:bg-neutral-700";

export default function Collections() {
  // console.log("Collections component is being rendered");
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
