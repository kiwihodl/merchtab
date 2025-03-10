import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { defaultSort, sorting } from "@/app/lib/constants";
import { getProducts } from "@/app/lib/shopify";
import Collections from "@/components/layout/search/collections";
import FilterList from "@/components/layout/search/filter";

export const metadata = {
  title: "Shop - Sovereign University",
  description: "Browse our collection of products.",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getProducts({ sortKey, reverse, query: searchValue });

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
      <div className="hidden md:block order-first w-full flex-none md:w-[200px]">
        <div className="bg-black p-4">
          <FilterList list={sorting} title="Sort by" />
          <div className="mt-8">
            <Collections />
          </div>
        </div>
      </div>
      <div className="order-last min-h-screen w-full md:order-none">
        <div className="w-full px-6">
          {searchValue ? (
            <p className="mb-4 font-blinker">
              {products.length === 0
                ? "There are no products that match "
                : `Showing ${products.length} ${products.length > 1 ? "results" : "result"} for `}
              <span className="font-bold">&quot;{searchValue}&quot;</span>
            </p>
          ) : null}

          {products.length > 0 ? (
            <Grid className="grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              <ProductGridItems products={products} />
            </Grid>
          ) : null}
        </div>
      </div>
    </div>
  );
}
