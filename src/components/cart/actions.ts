"use server";

import { TAGS } from "@/app/lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "@/app/lib/shopify";
import { revalidateTag, revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(prevState: any, selectedVariantId: string) {
  let cartId = cookies().get("cartId")?.value;

  if (!selectedVariantId) {
    console.error("Missing variant ID");
    return "Missing variant ID";
  }

  try {
    if (!cartId) {
      const cart = await createCart();
      cartId = cart.id;
      cookies().set("cartId", cartId!);
    }

    await addToCart(cartId!, [
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);
    revalidateTag(TAGS.cart);
    return null;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return "Error adding item to cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  merchandiseId: string,
  quantity: number
) {
  let cartId = cookies().get("cartId")?.value;
  if (!cartId) {
    const cart = await createCart();
    cartId = cart.id;
    cookies().set("cartId", cartId!);
  }

  try {
    const cart = await getCart(cartId!);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart(cartId!, [lineItem.id]);
      } else {
        await updateCart(cartId!, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      await addToCart(cartId!, [{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
    return null;
  } catch (error) {
    console.error(error);
    return "Error updating item quantity";
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  const cartId = cookies().get("cartId")?.value;

  if (!merchandiseId) {
    throw new Error("Missing merchandise ID");
  }

  if (!cartId) {
    return "Cart not found";
  }

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      return "Cart not found";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart(cartId, [lineItem.id]);
      revalidateTag(TAGS.cart);
      return null;
    }

    return "Item not found in cart";
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return "Error removing item from cart";
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

export async function revalidateProducts() {
  "use server";
  revalidateTag(TAGS.products);
  revalidateTag(TAGS.collections);
  return null;
}
