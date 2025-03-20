"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useRef, useState } from "react";
import { useCart } from "./cart-context";
import { createUrl } from "@/app/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Price from "../price";
import OpenCart from "./open-cart";
import CloseCart from "./close-cart";
import { DEFAULT_OPTION } from "@/app/lib/constants";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import { useFormStatus } from "react-dom";
import LoadingDots from "../loading-dots";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem, pendingOperations } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }

      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  const items = cart?.lines || [];
  const subtotal = cart?.cost.subtotalAmount.amount || "0";
  const tax = cart?.cost.totalTaxAmount.amount || "0";
  const total = (Number(subtotal) + Number(tax)).toString();

  const isItemLoading = (merchandiseId: string) => {
    return pendingOperations.some(
      (op) =>
        op.payload.merchandiseId === merchandiseId ||
        (op.type === "ADD" && op.payload.variant.id === merchandiseId)
    );
  };

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 pb-10 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">My Cart</p>
                <button
                  aria-label="Close cart"
                  onClick={closeCart}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="flex flex-col items-center justify-between h-full">
                  <div className="flex flex-col items-center justify-center flex-grow mt-4">
                    <ShoppingCartIcon className="h-16 text-neutral-500" />
                    <p className="mt-6 text-center text-2xl font-bold">
                      Your Cart is Empty.
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="w-full rounded-full border border-accent bg-black p-3 text-center text-sm font-medium text-accent opacity-90 hover:opacity-100 md:hidden"
                  >
                    Keep Shopping
                  </button>
                </div>
              ) : (
                <div className="flex h-full flex-col">
                  <div className="flex-1 min-h-0 overflow-auto pb-[250px]">
                    <ul className="py-4 px-6 border-t border-b border-neutral-200 dark:border-neutral-700 mt-4">
                      {items.map((item, i) => {
                        const isLoading = isItemLoading(item.merchandise.id);
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[
                                name.toLocaleLowerCase()
                              ] = value;
                            }
                          }
                        );
                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams)
                        );

                        return (
                          <li
                            key={i}
                            className={`flex w-full flex-col pb-4 mb-4 relative ${i === 0 ? "mt-4" : ""} ${isLoading ? "opacity-50" : ""}`}
                          >
                            <div className="absolute -left-3 -top-2.5 z-[9999]">
                              <DeleteItemButton
                                item={item}
                                disabled={isLoading}
                              />
                            </div>
                            <div className="flex justify-between items-start">
                              <div className="flex flex-row space-x-4">
                                <div className="relative h-[64px] w-[64px] min-w-[64px] min-h-[64px] overflow-hidden rounded-2xl border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900">
                                  <Image
                                    className="h-full w-full object-cover rounded-2xl"
                                    width={64}
                                    height={64}
                                    alt={
                                      item.merchandise.product.featuredImage
                                        .altText ||
                                      item.merchandise.product.title
                                    }
                                    src={
                                      item.merchandise.product.featuredImage.url
                                    }
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <Link
                                    href={merchandiseUrl}
                                    onClick={closeCart}
                                    className="z-30"
                                  >
                                    <div className="flex flex-col text-base max-w-[150px]">
                                      <span className="leading-tight">
                                        {item.merchandise.product.title}
                                        {item.merchandise.title !==
                                          DEFAULT_OPTION && (
                                          <span className="text-black dark:text-white">
                                            {" - "}
                                            {item.merchandise.title}
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  </Link>
                                  <Price
                                    className="text-sm text-black dark:text-white mt-1"
                                    amount={item.cost.totalAmount.amount}
                                    currencyCode={
                                      item.cost.totalAmount.currencyCode
                                    }
                                  />
                                </div>
                              </div>
                              <div className="flex h-9 flex-row items-center rounded-full border border-accent">
                                <EditItemQuantityButton
                                  merchandiseId={item.merchandise.id}
                                  quantity={item.quantity}
                                  disabled={isLoading}
                                />
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="fixed bottom-0 right-0 w-full md:w-[390px] bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-700 z-[10000]">
                    <div className="flex flex-col gap-3 p-6 bg-white/95 dark:bg-black/95 backdrop-blur-xl">
                      <div className="text-sm text-black dark:text-white">
                        <div className="mb-3 flex items-center justify-between border-b-[0.5px] border-accent pb-1">
                          <p>Taxes</p>
                          <Price
                            className="text-right text-base text-black dark:text-white"
                            amount={tax}
                            currencyCode={cart.cost.totalTaxAmount.currencyCode}
                          />
                        </div>
                        <div className="mb-3 flex items-center justify-between border-b-[0.5px] border-accent pb-1 pt-1">
                          <p>Shipping</p>
                          <p className="text-right">Calculated at checkout</p>
                        </div>
                        <div className="mb-3 flex items-center justify-between border-b-[0.5px] border-accent pb-1 pt-1">
                          <p>Total</p>
                          <Price
                            className="text-right text-base text-black dark:text-white"
                            amount={total}
                            currencyCode={cart.cost.subtotalAmount.currencyCode}
                          />
                        </div>
                      </div>
                      <button
                        onClick={closeCart}
                        className="w-full rounded-full border border-accent bg-black p-3 text-center text-sm font-medium text-accent opacity-90 hover:opacity-100 md:hidden"
                      >
                        Keep Shopping
                      </button>
                      <div className="checkout-button-wrapper">
                        <form action={redirectToCheckout}>
                          <CheckoutButton />
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="block w-full rounded-full bg-accent p-3 text-center text-sm font-medium text-black opacity-90 hover:opacity-100"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-black" /> : "Proceed to Checkout"}
    </button>
  );
}