import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { defaultSort, sorting } from "@/app/lib/constants";
import { getProducts } from "@/app/lib/shopify";

export const metadata = {
  title: "Search Results - Sovereign University",
  description: "Search results for products.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getProducts({ sortKey, reverse, query: searchValue });

  return (
    <div className="w-full px-6">
      <h1 className="mb-4 text-2xl font-bold">Search Results</h1>
      {searchValue ? (
        <p className="mb-4 font-blinker">
          {products.length === 0
            ? "There are no products that match "
            : `Showing ${products.length} ${products.length > 1 ? "results" : "result"} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : (
        <p className="mb-4 font-blinker">Please enter a search term</p>
      )}

      {products.length > 0 ? (
        <Grid className="grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </div>
  );
}
