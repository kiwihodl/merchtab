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
        <div className="flex items-center gap-4 w-full justify-center lg:justify-start">
          <div className="text-lg text-accent">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
              className="text-accent"
              showCurrency={false}
            />
          </div>
          <div className="w-auto lg:hidden">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center lg:items-start">
        <VariantSelector
          options={product.options}
          variants={product.variants}
        />
        <div className="hidden w-full mt-4 lg:block">
          <AddToCart product={product} />
        </div>
        {product.descriptionHtml ? (
          <Prose
            className="mb-6 text-sm leading-light text-white dark:text-white"
            html={product.descriptionHtml}
          />
        ) : null}
      </div>
    </>
  );
}
