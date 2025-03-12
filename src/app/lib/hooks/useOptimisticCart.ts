import { useState, useCallback } from "react";

interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
  total: number;
  version: number;
}

interface CartOperation {
  type: "ADD" | "REMOVE" | "UPDATE";
  item: CartItem;
  timestamp: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
}

interface ServerActions {
  addToCart: (item: CartItem) => Promise<{ success: boolean }>;
  removeFromCart: (itemId: string) => Promise<{ success: boolean }>;
  updateQuantity: (
    itemId: string,
    quantity: number
  ) => Promise<{ success: boolean }>;
}

interface CartError {
  message: string;
  operation: CartOperation;
  timestamp: number;
}

export function useOptimisticCart(
  initialCart: Cart,
  serverActions: ServerActions
) {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [pendingOperations, setPendingOperations] = useState<CartOperation[]>(
    []
  );
  const [errors, setErrors] = useState<CartError[]>([]);
  const [loadingCounter, setLoadingCounter] = useState(0);
  const isLoading = loadingCounter > 0;

  // Helper to calculate cart total
  const calculateTotal = useCallback((items: CartItem[]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, []);

  // Helper to update cart state
  const updateCartState = useCallback(
    (items: CartItem[]) => {
      setCart((prev) => ({
        ...prev,
        items,
        total: calculateTotal(items),
        version: prev.version + 1,
      }));
    },
    [calculateTotal]
  );

  // Add item to cart
  const addItem = useCallback(
    async (item: CartItem, options = { retry: false }) => {
      const operation: CartOperation = {
        type: "ADD",
        item,
        timestamp: Date.now(),
        status: "PENDING",
      };

      setPendingOperations((prev) => [...prev, operation]);
      setLoadingCounter((c) => c + 1);

      const initialVersion = cart.version;

      try {
        // Optimistically update the cart
        setCart((prevCart) => {
          const updatedItems = [...prevCart.items, item];
          return {
            ...prevCart,
            items: updatedItems,
            total: calculateTotal(updatedItems),
            version: prevCart.version + 1,
          };
        });

        // Attempt server update
        const maxRetries = options.retry ? 3 : 1;
        let attempt = 0;

        while (attempt < maxRetries) {
          try {
            const result = await serverActions.addToCart(item);
            if (!result?.success) {
              throw new Error("Server update failed");
            }
            break;
          } catch (e) {
            attempt++;
            if (attempt === maxRetries) throw e;
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          }
        }

        // Update operation status
        setPendingOperations((prev) =>
          prev.map((op) =>
            op.timestamp === operation.timestamp
              ? { ...op, status: "SUCCESS" }
              : op
          )
        );

        return { success: true };
      } catch (error) {
        // Rollback optimistic update
        setCart({
          items: cart.items.filter((i) => i.id !== item.id),
          total: calculateTotal(cart.items.filter((i) => i.id !== item.id)),
          version: initialVersion,
        });

        // Record error
        setErrors((prev) => [
          ...prev,
          {
            message: error instanceof Error ? error.message : "Unknown error",
            operation,
            timestamp: Date.now(),
          },
        ]);

        setPendingOperations((prev) =>
          prev.map((op) =>
            op.timestamp === operation.timestamp
              ? { ...op, status: "FAILED" }
              : op
          )
        );

        throw error;
      } finally {
        setLoadingCounter((c) => c - 1);
      }
    },
    [cart, calculateTotal, serverActions]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    async (itemId: string, newQuantity: number) => {
      const item = cart.items.find((i) => i.id === itemId);
      if (!item) return;

      const operation: CartOperation = {
        type: "UPDATE",
        item: { ...item, quantity: newQuantity },
        timestamp: Date.now(),
        status: "PENDING",
      };

      setPendingOperations((prev) => [...prev, operation]);
      setLoadingCounter((c) => c + 1);

      const initialVersion = cart.version;
      const initialItems = [...cart.items];

      try {
        // Optimistically update the cart
        setCart((prevCart) => {
          const updatedItems = prevCart.items.map((i) =>
            i.id === itemId ? { ...i, quantity: newQuantity } : i
          );
          return {
            ...prevCart,
            items: updatedItems,
            total: calculateTotal(updatedItems),
            version: prevCart.version + 1,
          };
        });

        // Server update
        const result = await serverActions.updateQuantity(itemId, newQuantity);
        if (!result?.success) {
          throw new Error("Server update failed");
        }

        setPendingOperations((prev) =>
          prev.map((op) =>
            op.timestamp === operation.timestamp
              ? { ...op, status: "SUCCESS" }
              : op
          )
        );

        return { success: true };
      } catch (error) {
        // Rollback
        setCart({
          items: initialItems,
          total: calculateTotal(initialItems),
          version: initialVersion,
        });

        setErrors((prev) => [
          ...prev,
          {
            message: error instanceof Error ? error.message : "Unknown error",
            operation,
            timestamp: Date.now(),
          },
        ]);

        setPendingOperations((prev) =>
          prev.map((op) =>
            op.timestamp === operation.timestamp
              ? { ...op, status: "FAILED" }
              : op
          )
        );

        throw error;
      } finally {
        setLoadingCounter((c) => c - 1);
      }
    },
    [cart, calculateTotal, serverActions]
  );

  // Remove item from cart
  const removeItem = useCallback(
    async (itemId: string) => {
      const item = cart.items.find((i) => i.id === itemId);
      if (!item) return;

      const operation: CartOperation = {
        type: "REMOVE",
        item,
        timestamp: Date.now(),
        status: "PENDING",
      };

      setPendingOperations((prev) => [...prev, operation]);
      setLoadingCounter((c) => c + 1);

      const initialVersion = cart.version;
      const initialItems = [...cart.items];

      try {
        // Optimistically update the cart
        setCart((prevCart) => {
          const filteredItems = prevCart.items.filter((i) => i.id !== itemId);
          return {
            ...prevCart,
            items: filteredItems,
            total: calculateTotal(filteredItems),
            version: prevCart.version + 1,
          };
        });

        // Server update
        const result = await serverActions.removeFromCart(itemId);
        if (!result?.success) {
          throw new Error("Server update failed");
        }

        setPendingOperations((prev) =>
          prev.map((op) =>
            op.timestamp === operation.timestamp
              ? { ...op, status: "SUCCESS" }
              : op
          )
        );

        return { success: true };
      } catch (error) {
        // Rollback
        setCart({
          items: initialItems,
          total: calculateTotal(initialItems),
          version: initialVersion,
        });

        setErrors((prev) => [
          ...prev,
          {
            message: error instanceof Error ? error.message : "Unknown error",
            operation,
            timestamp: Date.now(),
          },
        ]);

        setPendingOperations((prev) =>
          prev.map((op) =>
            op.timestamp === operation.timestamp
              ? { ...op, status: "FAILED" }
              : op
          )
        );

        throw error;
      } finally {
        setLoadingCounter((c) => c - 1);
      }
    },
    [cart, calculateTotal, serverActions]
  );

  return {
    cart,
    pendingOperations,
    errors,
    isLoading,
    addItem,
    updateQuantity,
    removeItem,
  };
}
