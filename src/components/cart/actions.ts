"use server";

import { TAGS } from "@/app/lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "@/app/lib/shopify";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  let cartId = cookies().get("cartId")?.value;

  if (!cartId || !selectedVariantId) {
    throw new Error("Error adding item to cart");
  }

  try {
    await addToCart(cartId, [
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);
    revalidateTag(TAGS.cart);
  } catch (error) {
    throw new Error("Error adding item to cart");
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  let cartId = cookies().get("cartId")?.value;
  if (!cartId) {
    throw new Error("Missing cart ID");
  }

  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      throw new Error("Error fetching cart");
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart(cartId, [lineItem.id]);
      } else {
        await updateCart(cartId, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart(cartId, [{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
  } catch (error) {
    console.error(error);
    throw new Error("Error updating item quantity");
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  let cartId = cookies().get("cartId")?.value;

  if (!cartId) {
    throw new Error("Missing cart ID");
  }

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      throw new Error("Error fetching cart");
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart(cartId, [lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      throw new Error("Item not found in cart");
    }
  } catch (error) {
    throw new Error("Error removing item from cart");
  }
}

// export async function redirectToCheckout(formData: FormData): Promise<void> {
//   const cartId = formData.get("cartId")?.toString();
//   if (!cartId) {
//     throw new Error("Missing cart ID");
//   }

//   const cart = await getCart(cartId);
//   if (!cart || !cart.checkoutUrl) {
//     throw new Error("Error fetching cart or missing checkout URL");
//   }

//   redirect(cart.checkoutUrl);
// }

export async function redirectToCheckout(formData: FormData): Promise<void> {
  const cartId =
    formData.get("cartId")?.toString() || cookies().get("cartId")?.value;
  if (!cartId) {
    throw new Error("Missing cart ID");
  }
  const cart = await getCart(cartId);
  if (!cart || !cart.checkoutUrl) {
    throw new Error("Error fetching cart or missing checkout URL");
  }

  // Ensure the checkout URL is using HTTPS and includes the correct domain
  const checkoutUrl = new URL(cart.checkoutUrl);
  if (checkoutUrl.hostname.includes("myshopify.com")) {
    // Force HTTPS
    checkoutUrl.protocol = "https:";
    // Ensure any password protection tokens are preserved
    redirect(checkoutUrl.toString());
  }

  redirect(cart.checkoutUrl);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  cookies().set("cartId", cart.id!);
}
