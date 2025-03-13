import { getCollections, getCollectionProducts } from "@/app/lib/shopify";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collections = await getCollections();
    // console.log("Collections API response:", collections);

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
              products,
            };
          } catch (error) {
            // console.error(
            //   `Error fetching products for collection ${collection.handle}:`,
            //   error
            // );
            return {
              ...collection,
              hasProducts: false,
              products: [],
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

    return NextResponse.json(allCollections);
  } catch (error) {
    // console.error("Error in collections API:", error);
    // Even if there's an error, return at least the "All" collection
    return NextResponse.json([
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
    ]);
  }
}
