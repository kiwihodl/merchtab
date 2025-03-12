"use client";

import { useState, useCallback, useRef } from "react";
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
  addToCart: (
    item: CartItem
  ) => Promise<{ success: boolean; version?: number }>;
  updateQuantity: (
    id: string,
    quantity: number
  ) => Promise<{ success: boolean; version?: number }>;
  removeItem: (id: string) => Promise<{ success: boolean; version?: number }>;
}

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 200;

export function useOptimisticCart(
  initialCart: Cart,
  serverActions: ServerActions
) {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [loadingCounter, setLoadingCounter] = useState(0);
  const { addToast } = useToast();

  const retryTimestamps = useRef<number[]>([]);
  const operationQueue = useRef<Promise<any>[]>([]);

  const isLoading = loadingCounter > 0;

  const incrementLoading = useCallback(() => {
    setLoadingCounter((count) => count + 1);
  }, []);

  const decrementLoading = useCallback(() => {
    setLoadingCounter((count) => Math.max(0, count - 1));
  }, []);

  const executeWithRetry = useCallback(
    async (
      operation: () => Promise<{ success: boolean; version?: number }>,
      rollback: () => void,
      retryCount = 0
    ): Promise<{ success: boolean; version?: number }> => {
      try {
        const result = await operation();
        if (!result.success) {
          throw new Error("Operation failed");
        }
        return result;
      } catch (error) {
        if (retryCount < MAX_RETRIES) {
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
          retryTimestamps.current.push(delay);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return executeWithRetry(operation, rollback, retryCount + 1);
        }
        rollback();
        throw error;
      }
    },
    []
  );

  const queueOperation = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      const execute = async () => {
        if (operationQueue.current.length > 0) {
          await operationQueue.current[operationQueue.current.length - 1];
        }
        return operation();
      };

      const promise = execute();
      operationQueue.current.push(promise);

      try {
        const result = await promise;
        return result;
      } finally {
        operationQueue.current = operationQueue.current.filter(
          (p) => p !== promise
        );
      }
    },
    []
  );

  const addItem = useCallback(
    async (item: CartItem) => {
      incrementLoading();
      const previousItems = cart.items;

      // Optimistic update
      setCart((currentCart) => ({
        items: [...currentCart.items, item],
        version: currentCart.version + 1,
      }));

      try {
        await queueOperation(async () => {
          const result = await executeWithRetry(
            () => serverActions.addToCart(item),
            () =>
              setCart((currentCart) => ({
                items: previousItems,
                version: currentCart.version + 1,
              }))
          );

          if (result.version) {
            setCart((currentCart) => ({
              ...currentCart,
              version: result.version || currentCart.version,
            }));
          }

          addToast({
            type: "success",
            message: "Item added to cart",
            duration: 3000,
          });
        });
      } catch (error) {
        addToast({
          type: "error",
          message: "Failed to add item to cart",
          duration: 5000,
        });
      } finally {
        decrementLoading();
      }
    },
    [
      cart.items,
      serverActions,
      addToast,
      incrementLoading,
      decrementLoading,
      executeWithRetry,
      queueOperation,
    ]
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
        await queueOperation(async () => {
          const result = await executeWithRetry(
            () => serverActions.updateQuantity(id, quantity),
            () =>
              setCart((currentCart) => ({
                items: previousItems,
                version: currentCart.version + 1,
              }))
          );

          if (result.version) {
            setCart((currentCart) => ({
              ...currentCart,
              version: result.version || currentCart.version,
            }));
          }

          addToast({
            type: "success",
            message: "Cart updated",
            duration: 3000,
          });
        });
      } catch (error) {
        addToast({
          type: "error",
          message: "Failed to update cart",
          duration: 5000,
        });
      } finally {
        decrementLoading();
      }
    },
    [
      cart.items,
      serverActions,
      addToast,
      incrementLoading,
      decrementLoading,
      executeWithRetry,
      queueOperation,
    ]
  );

  const removeItem = useCallback(
    async (id: string) => {
      incrementLoading();
      const previousItems = cart.items;

      // Optimistic update
      setCart((currentCart) => ({
        items: currentCart.items.filter((item) => item.id !== id),
        version: currentCart.version + 1,
      }));

      try {
        await queueOperation(async () => {
          const result = await executeWithRetry(
            () => serverActions.removeItem(id),
            () =>
              setCart((currentCart) => ({
                items: previousItems,
                version: currentCart.version + 1,
              }))
          );

          if (result.version) {
            setCart((currentCart) => ({
              ...currentCart,
              version: result.version || currentCart.version,
            }));
          }

          addToast({
            type: "success",
            message: "Item removed from cart",
            duration: 3000,
          });
        });
      } catch (error) {
        addToast({
          type: "error",
          message: "Failed to remove item",
          duration: 5000,
        });
      } finally {
        decrementLoading();
      }
    },
    [
      cart.items,
      serverActions,
      addToast,
      incrementLoading,
      decrementLoading,
      executeWithRetry,
      queueOperation,
    ]
  );

  return {
    cart,
    isLoading,
    addItem,
    updateQuantity,
    removeItem,
    _retryTimestamps: retryTimestamps.current, // Exposed for testing
  };
}
