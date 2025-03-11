"use client";

import { useState } from "react";
import { useCart } from "./cart-context";
import { CartModal } from "./modal";

export function CartButton() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-white transition-colors hover:border-neutral-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        {cart?.totalQuantity ? (
          <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white">
            {cart.totalQuantity}
          </div>
        ) : null}
      </button>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
