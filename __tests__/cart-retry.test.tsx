import { renderHook, act } from "@testing-library/react";
import { useOptimisticCart } from "@/app/lib/hooks/useOptimisticCart";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ToastProvider } from "@/app/lib/components/toast/ToastProvider";
import React from "react";

interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
  version: number;
}

const mockInitialCart: Cart = {
  items: [],
  version: 0,
};

const mockServerActions = {
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  updateQuantity: vi.fn(),
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe("Cart Retry and Queue Mechanism", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retry failed operations", async () => {
    // First call fails, second succeeds
    mockServerActions.addToCart
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({ success: true });

    const { result } = renderHook(
      () => useOptimisticCart(mockInitialCart, mockServerActions),
      { wrapper: TestWrapper }
    );

    const newItem = { id: "1", quantity: 1, price: 10 };

    await act(async () => {
      await result.current.addItem(newItem);
    });

    expect(mockServerActions.addToCart).toHaveBeenCalledTimes(2);
    expect(result.current.cart.items).toHaveLength(1);
  });

  it("should queue operations and execute them in order", async () => {
    const operations: string[] = [];
    mockServerActions.addToCart.mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      operations.push("add");
      return { success: true };
    });

    mockServerActions.updateQuantity.mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 25));
      operations.push("update");
      return { success: true };
    });

    const { result } = renderHook(
      () => useOptimisticCart(mockInitialCart, mockServerActions),
      { wrapper: TestWrapper }
    );

    await act(async () => {
      const addPromise = result.current.addItem({
        id: "1",
        quantity: 1,
        price: 10,
      });
      const updatePromise = result.current.updateQuantity("1", 2);
      await Promise.all([addPromise, updatePromise]);
    });

    expect(operations).toEqual(["add", "update"]);
    expect(result.current.cart.items[0].quantity).toBe(2);
  });

  it("should handle multiple retries with exponential backoff", async () => {
    mockServerActions.addToCart
      .mockRejectedValueOnce(new Error("Network error"))
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({ success: true });

    const { result } = renderHook(
      () => useOptimisticCart(mockInitialCart, mockServerActions),
      { wrapper: TestWrapper }
    );

    await act(async () => {
      await result.current.addItem({ id: "1", quantity: 1, price: 10 });
    });

    expect(mockServerActions.addToCart).toHaveBeenCalledTimes(3);
    const delays = result.current._retryTimestamps;
    expect(delays[0]).toBe(200); // First retry delay
    expect(delays[1]).toBe(400); // Second retry delay
  });

  it("should maintain cart consistency during retries", async () => {
    mockServerActions.addToCart
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({ success: true });

    const { result } = renderHook(
      () => useOptimisticCart(mockInitialCart, mockServerActions),
      { wrapper: TestWrapper }
    );

    const item1 = { id: "1", quantity: 1, price: 10 };
    const item2 = { id: "2", quantity: 1, price: 20 };

    await act(async () => {
      await result.current.addItem(item1);
      await result.current.addItem(item2);
    });

    expect(result.current.cart.items).toHaveLength(2);
    expect(result.current.cart.items[0].id).toBe("1");
    expect(result.current.cart.items[1].id).toBe("2");
  });

  it("should handle concurrent operations with version control", async () => {
    let serverVersion = 0;
    mockServerActions.addToCart.mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 50));
      serverVersion++;
      return { success: true, version: serverVersion };
    });

    const { result } = renderHook(
      () => useOptimisticCart(mockInitialCart, mockServerActions),
      { wrapper: TestWrapper }
    );

    await act(async () => {
      const promises = [
        result.current.addItem({ id: "1", quantity: 1, price: 10 }),
        result.current.addItem({ id: "2", quantity: 1, price: 20 }),
        result.current.addItem({ id: "3", quantity: 1, price: 30 }),
      ];
      await Promise.all(promises);
    });

    expect(result.current.cart.version).toBe(3);
    expect(result.current.cart.items).toHaveLength(3);
  });
});
