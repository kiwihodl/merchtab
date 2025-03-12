import { renderHook, act, waitFor } from "@testing-library/react";
import { useOptimisticCart } from "../hooks/useOptimisticCart";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock cart types
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

// Mock initial state
const mockInitialCart: Cart = {
  items: [],
  total: 0,
  version: 0,
};

// Mock server actions
const mockServerActions = {
  addToCart: vi.fn().mockResolvedValue({ success: true }),
  removeFromCart: vi.fn().mockResolvedValue({ success: true }),
  updateQuantity: vi.fn().mockResolvedValue({ success: true }),
};

describe("useOptimisticCart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerActions.addToCart.mockResolvedValue({ success: true });
    mockServerActions.removeFromCart.mockResolvedValue({ success: true });
    mockServerActions.updateQuantity.mockResolvedValue({ success: true });
  });

  describe("State Management", () => {
    it("should initialize with empty cart", () => {
      const { result } = renderHook(() =>
        useOptimisticCart(mockInitialCart, mockServerActions)
      );
      expect(result.current.cart).toEqual(mockInitialCart);
      expect(result.current.pendingOperations).toHaveLength(0);
    });

    it("should track version numbers correctly", () => {
      const { result } = renderHook(() =>
        useOptimisticCart(mockInitialCart, mockServerActions)
      );
      expect(result.current.cart.version).toBe(0);
    });
  });

  describe("Optimistic Updates", () => {
    it("should update cart optimistically when adding item", async () => {
      const { result } = renderHook(() =>
        useOptimisticCart(mockInitialCart, mockServerActions)
      );
      const newItem = { id: "1", quantity: 1, price: 10 };

      await act(async () => {
        await result.current.addItem(newItem);
      });

      expect(result.current.cart.items).toContainEqual(newItem);
      expect(result.current.cart.total).toBe(10);
    });

    it("should handle concurrent operations correctly", async () => {
      const { result } = renderHook(() =>
        useOptimisticCart(mockInitialCart, mockServerActions)
      );
      const item1 = { id: "1", quantity: 1, price: 10 };
      const item2 = { id: "2", quantity: 1, price: 20 };

      await act(async () => {
        await result.current.addItem(item1);
        await result.current.addItem(item2);
      });

      expect(result.current.cart.items).toHaveLength(2);
      expect(result.current.cart.items).toContainEqual(item1);
      expect(result.current.cart.items).toContainEqual(item2);
      expect(result.current.cart.total).toBe(30);
    });
  });

  describe("Error Handling", () => {
    it("should rollback failed operations", async () => {
      mockServerActions.addToCart.mockRejectedValueOnce(
        new Error("Network error")
      );
      const { result } = renderHook(() =>
        useOptimisticCart(mockInitialCart, mockServerActions)
      );
      const newItem = { id: "1", quantity: 1, price: 10 };

      await act(async () => {
        try {
          await result.current.addItem(newItem);
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.cart).toEqual(mockInitialCart);
      expect(result.current.errors).toHaveLength(1);
    });

    it("should retry failed operations", async () => {
      mockServerActions.addToCart
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({ success: true });

      const { result } = renderHook(() =>
        useOptimisticCart(mockInitialCart, mockServerActions)
      );
      const newItem = { id: "1", quantity: 1, price: 10 };

      await act(async () => {
        await result.current.addItem(newItem, { retry: true });
      });

      expect(mockServerActions.addToCart).toHaveBeenCalledTimes(2);
      expect(result.current.cart.items).toContainEqual(newItem);
    });
  });

  describe("Loading States", () => {
    it("should track loading state for operations", async () => {
      const { result } = renderHook(() =>
        useOptimisticCart(mockInitialCart, mockServerActions)
      );
      const newItem = { id: "1", quantity: 1, price: 10 };

      let resolveServerAction: () => void;
      mockServerActions.addToCart.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveServerAction = () => resolve({ success: true });
          })
      );

      let promise: Promise<any>;
      await act(async () => {
        promise = result.current.addItem(newItem);
      });

      expect(result.current.isLoading).toBe(true);
      resolveServerAction();
      await promise;

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("Cart Calculations", () => {
    it("should calculate totals correctly with multiple items", async () => {
      const { result } = renderHook(() =>
        useOptimisticCart(mockInitialCart, mockServerActions)
      );
      const items = [
        { id: "1", quantity: 2, price: 10 },
        { id: "2", quantity: 1, price: 20 },
      ];

      await act(async () => {
        await Promise.all(items.map((item) => result.current.addItem(item)));
      });

      expect(result.current.cart.total).toBe(40); // (2 * 10) + (1 * 20)
    });

    it("should handle quantity updates optimistically", async () => {
      const { result } = renderHook(() =>
        useOptimisticCart(mockInitialCart, mockServerActions)
      );
      const item = { id: "1", quantity: 1, price: 10 };

      await act(async () => {
        await result.current.addItem(item);
        await result.current.updateQuantity(item.id, 3);
      });

      expect(result.current.cart.items[0].quantity).toBe(3);
      expect(result.current.cart.total).toBe(30);
    });
  });
});
