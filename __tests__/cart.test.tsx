/** @jest-environment jsdom */
import { renderHook, act } from "@testing-library/react";
import { useOptimisticCart } from "@/app/lib/hooks/useOptimisticCart";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ToastProvider } from "@/app/lib/components/toast/ToastProvider";
import React from "react";

// Mock cart types
interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
  version: number;
}

// Mock initial state
const mockInitialCart: Cart = {
  items: [],
  version: 0,
};

// Mock server actions
const mockServerActions = {
  addToCart: vi.fn().mockResolvedValue({ success: true }),
  removeFromCart: vi.fn().mockResolvedValue({ success: true }),
  updateQuantity: vi.fn().mockResolvedValue({ success: true }),
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe("useOptimisticCart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with empty cart", () => {
    const { result } = renderHook(
      () => useOptimisticCart(mockInitialCart, mockServerActions),
      {
        wrapper: TestWrapper,
      }
    );
    expect(result.current.cart).toEqual(mockInitialCart);
  });

  it("should track version numbers", () => {
    const { result } = renderHook(
      () => useOptimisticCart(mockInitialCart, mockServerActions),
      {
        wrapper: TestWrapper,
      }
    );
    expect(result.current.cart.version).toBe(0);
  });

  it("should handle failed operations", async () => {
    mockServerActions.addToCart.mockRejectedValueOnce(
      new Error("Network error")
    );
    const { result } = renderHook(
      () => useOptimisticCart(mockInitialCart, mockServerActions),
      {
        wrapper: TestWrapper,
      }
    );
    const newItem = { id: "1", quantity: 1, price: 10 };

    await act(async () => {
      try {
        await result.current.addItem(newItem);
      } catch (e) {
        // Expected error
      }
    });

    expect(result.current.cart.items).toEqual([]);
  });

  it("should track loading state", async () => {
    const { result } = renderHook(
      () => useOptimisticCart(mockInitialCart, mockServerActions),
      {
        wrapper: TestWrapper,
      }
    );
    const newItem = { id: "1", quantity: 1, price: 10 };

    let resolveServerAction: () => void;
    mockServerActions.addToCart.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveServerAction = () => {
            act(() => {
              resolve({ success: true });
            });
          };
        })
    );

    let promise: Promise<any>;
    await act(async () => {
      promise = result.current.addItem(newItem);
    });

    expect(result.current.isLoading).toBe(true);
    resolveServerAction();
    await act(async () => {
      await promise;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("should calculate totals correctly", async () => {
    mockServerActions.addToCart.mockImplementation(() =>
      Promise.resolve({ success: true })
    );
    const { result } = renderHook(
      () => useOptimisticCart(mockInitialCart, mockServerActions),
      {
        wrapper: TestWrapper,
      }
    );
    const items = [
      { id: "1", quantity: 2, price: 10 },
      { id: "2", quantity: 1, price: 20 },
    ];

    await act(async () => {
      await result.current.addItem(items[0]);
      await result.current.addItem(items[1]);
    });

    const total = result.current.cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    expect(total).toBe(40);
  });

  it("should handle quantity updates", async () => {
    mockServerActions.addToCart.mockImplementation(() =>
      Promise.resolve({ success: true })
    );
    mockServerActions.updateQuantity.mockImplementation(() =>
      Promise.resolve({ success: true })
    );
    const { result } = renderHook(
      () => useOptimisticCart(mockInitialCart, mockServerActions),
      {
        wrapper: TestWrapper,
      }
    );
    const item = { id: "1", quantity: 1, price: 10 };

    await act(async () => {
      await result.current.addItem(item);
      await result.current.updateQuantity(item.id, 3);
    });

    expect(result.current.cart.items[0].quantity).toBe(3);
    const total = result.current.cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    expect(total).toBe(30);
  });
});
