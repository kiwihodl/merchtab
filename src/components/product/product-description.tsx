import { Product } from "@/app/lib/shopify/types";
import Price from "../price";
import VariantSelector from "./variant-selector";
import Prose from "../prose";
import { AddToCart } from "../cart/add-to-cart";

export function ProductDescription({
  product,
  showTitle = true,
}: {
  product: Product;
  showTitle?: boolean;
}) {
  return (
    <>
      <div className="mb-6 flex flex-col items-center border-b pb-6 border-neutral-700 lg:border-neutral-700 lg:items-start">
        {showTitle && (
          <h1 className="mb-2 text-5xl font-medium text-white dark:text-white text-center lg:text-left">
            {product.title}
          </h1>
        )}
        <div className="w-auto min-w-[80px] rounded-full bg-accent px-4 py-2 text-sm text-black">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            className="text-black text-center"
            showCurrency={false}
          />
        </div>
      </div>
      <div className="flex flex-col items-center lg:items-start">
        <VariantSelector
          options={product.options}
          variants={product.variants}
        />
        {product.descriptionHtml ? (
          <Prose
            className="mb-6 text-sm leading-light text-white dark:text-white"
            html={product.descriptionHtml}
          />
        ) : null}
        <AddToCart product={product} />
      </div>
    </>
  );
}
