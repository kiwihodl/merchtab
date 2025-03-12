"use client";

import { useState, useCallback } from "react";
import { useToast } from "./useToast";

interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
  version: number;
}

interface ServerActions {
  addToCart: (item: CartItem) => Promise<{ success: boolean }>;
  updateQuantity: (
    id: string,
    quantity: number
  ) => Promise<{ success: boolean }>;
  removeItem: (id: string) => Promise<{ success: boolean }>;
}

export function useOptimisticCart(
  initialCart: Cart,
  serverActions: ServerActions
) {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [loadingCounter, setLoadingCounter] = useState(0);
  const { addToast } = useToast();

  const isLoading = loadingCounter > 0;

  const incrementLoading = useCallback(() => {
    setLoadingCounter((count) => count + 1);
  }, []);

  const decrementLoading = useCallback(() => {
    setLoadingCounter((count) => Math.max(0, count - 1));
  }, []);

  const addItem = useCallback(
    async (item: CartItem) => {
      incrementLoading();

      // Optimistic update
      setCart((currentCart) => ({
        items: [...currentCart.items, item],
        version: currentCart.version + 1,
      }));

      try {
        const result = await serverActions.addToCart(item);

        if (result.success) {
          addToast({
            type: "success",
            message: "Item added to cart",
            duration: 3000,
          });
        } else {
          throw new Error("Failed to add item");
        }
      } catch (error) {
        // Rollback on failure
        setCart((currentCart) => ({
          items: currentCart.items.filter((i) => i.id !== item.id),
          version: currentCart.version + 1,
        }));

        addToast({
          type: "error",
          message: "Failed to add item to cart",
          action: {
            label: "Retry",
            onClick: () => addItem(item),
          },
        });
      } finally {
        decrementLoading();
      }
    },
    [serverActions, addToast, incrementLoading, decrementLoading]
  );

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      incrementLoading();

      const previousItems = cart.items;

      // Optimistic update
      setCart((currentCart) => ({
        items: currentCart.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
        version: currentCart.version + 1,
      }));

      try {
        const result = await serverActions.updateQuantity(id, quantity);

        if (result.success) {
          addToast({
            type: "success",
            message: "Cart updated",
            duration: 3000,
          });
        } else {
          throw new Error("Failed to update quantity");
        }
      } catch (error) {
        // Rollback on failure
        setCart((currentCart) => ({
          items: previousItems,
          version: currentCart.version + 1,
        }));

        addToast({
          type: "error",
          message: "Failed to update cart",
          action: {
            label: "Retry",
            onClick: () => updateQuantity(id, quantity),
          },
        });
      } finally {
        decrementLoading();
      }
    },
    [cart.items, serverActions, addToast, incrementLoading, decrementLoading]
  );

  const removeItem = useCallback(
    async (id: string) => {
      incrementLoading();

      const previousItems = cart.items;
      const removedItem = cart.items.find((item) => item.id === id);

      // Optimistic update
      setCart((currentCart) => ({
        items: currentCart.items.filter((item) => item.id !== id),
        version: currentCart.version + 1,
      }));

      try {
        const result = await serverActions.removeItem(id);

        if (result.success) {
          addToast({
            type: "success",
            message: "Item removed from cart",
            duration: 3000,
          });
        } else {
          throw new Error("Failed to remove item");
        }
      } catch (error) {
        // Rollback on failure
        setCart((currentCart) => ({
          items: previousItems,
          version: currentCart.version + 1,
        }));

        addToast({
          type: "error",
          message: "Failed to remove item",
          action: {
            label: "Retry",
            onClick: () => removedItem && removeItem(id),
          },
        });
      } finally {
        decrementLoading();
      }
    },
    [cart.items, serverActions, addToast, incrementLoading, decrementLoading]
  );

  return {
    cart,
    isLoading,
    addItem,
    updateQuantity,
    removeItem,
  };
}
