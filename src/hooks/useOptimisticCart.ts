import {
  Cart,
  CartItem,
  Product,
  ProductVariant,
} from "@/app/lib/shopify/types";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  addItem,
  removeItem,
  updateItemQuantity,
} from "@/components/cart/actions";
import { useOptimistic } from "react";

export interface CartOperation {
  type: "ADD" | "UPDATE" | "REMOVE";
  timestamp: number;
  payload: any;
  status: "PENDING" | "SUCCESS" | "FAILED";
  retryCount: number;
}

export interface OptimisticCartState {
  pendingOperations: CartOperation[];
  shadowState: Cart;
  version: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
      totalTaxAmount: { amount: "0", currencyCode: "USD" },
    },
  };
}

type Operation = {
  type: "ADD" | "UPDATE" | "REMOVE";
  payload: {
    merchandiseId?: string;
    variant?: ProductVariant;
    product?: Product;
    quantity?: number;
  };
};

export function useOptimisticCart(initialCart: Cart | undefined) {
  const [cart, addOptimisticOperation] = useOptimistic(
    initialCart || createEmptyCart(),
    (state: Cart, operation: Operation): Cart => {
      switch (operation.type) {
        case "ADD":
          if (!operation.payload.variant || !operation.payload.product) {
            return state;
          }
          return addItemToCart(
            state,
            operation.payload.variant,
            operation.payload.product
          );
        case "UPDATE":
          if (!operation.payload.merchandiseId || !operation.payload.quantity) {
            return state;
          }
          return updateItemInCart(
            state,
            operation.payload.merchandiseId,
            operation.payload.quantity
          );
        case "REMOVE":
          if (!operation.payload.merchandiseId) {
            return state;
          }
          return removeItemFromCart(state, operation.payload.merchandiseId);
        default:
          return state;
      }
    }
  );

  const [pendingOperations, setPendingOperations] = useState<Operation[]>([]);

  const isOperationPending = useCallback(
    (merchandiseId?: string) => {
      if (!merchandiseId) return pendingOperations.length > 0;
      return pendingOperations.some(
        (op) => op.payload.merchandiseId === merchandiseId
      );
    },
    [pendingOperations]
  );

  const addToCart = useCallback((variant: ProductVariant, product: Product) => {
    const operation: Operation = {
      type: "ADD",
      payload: { variant, product },
    };
    addOptimisticOperation(operation);
    setPendingOperations((prev) => [...prev, operation]);

    addItem(variant.id)
      .then(() => {
        setPendingOperations((prev) => prev.filter((op) => op !== operation));
      })
      .catch(() => {
        setPendingOperations((prev) => prev.filter((op) => op !== operation));
      });
  }, []);

  const updateQuantity = useCallback(
    (merchandiseId: string, quantity: number) => {
      const operation: Operation = {
        type: "UPDATE",
        payload: { merchandiseId, quantity },
      };
      addOptimisticOperation(operation);
      setPendingOperations((prev) => [...prev, operation]);

      updateItemQuantity(merchandiseId, quantity)
        .then(() => {
          setPendingOperations((prev) => prev.filter((op) => op !== operation));
        })
        .catch(() => {
          setPendingOperations((prev) => prev.filter((op) => op !== operation));
        });
    },
    []
  );

  const removeFromCart = useCallback((merchandiseId: string) => {
    const operation: Operation = {
      type: "REMOVE",
      payload: { merchandiseId },
    };
    addOptimisticOperation(operation);
    setPendingOperations((prev) => [...prev, operation]);

    removeItem(null, merchandiseId)
      .then(() => {
        setPendingOperations((prev) => prev.filter((op) => op !== operation));
      })
      .catch(() => {
        setPendingOperations((prev) => prev.filter((op) => op !== operation));
      });
  }, []);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    pendingOperations,
    isOperationPending,
  };
}

function addItemToCart(
  cart: Cart,
  variant: ProductVariant,
  product: Product
): Cart {
  const existingItem = cart.lines.find(
    (line) => line.merchandise.id === variant.id
  );

  const newLines = existingItem
    ? cart.lines.map((line) =>
        line.merchandise.id === variant.id
          ? {
              ...line,
              quantity: line.quantity + 1,
              cost: {
                totalAmount: {
                  amount: (
                    Number(line.cost.totalAmount.amount) +
                    Number(variant.price.amount)
                  ).toString(),
                  currencyCode: variant.price.currencyCode,
                },
              },
            }
          : line
      )
    : [
        ...cart.lines,
        {
          id: undefined,
          quantity: 1,
          cost: {
            totalAmount: {
              amount: variant.price.amount,
              currencyCode: variant.price.currencyCode,
            },
          },
          merchandise: {
            id: variant.id,
            title: variant.title,
            selectedOptions: variant.selectedOptions,
            product: {
              id: product.id,
              handle: product.handle,
              title: product.title,
              featuredImage: product.featuredImage,
            },
          },
        },
      ];

  const totalQuantity = newLines.reduce((sum, line) => sum + line.quantity, 0);
  const totalAmount = newLines.reduce(
    (sum, line) => sum + Number(line.cost.totalAmount.amount),
    0
  );

  return {
    ...cart,
    totalQuantity,
    lines: newLines,
    cost: {
      ...cart.cost,
      subtotalAmount: {
        amount: totalAmount.toString(),
        currencyCode: variant.price.currencyCode,
      },
      totalAmount: {
        amount: totalAmount.toString(),
        currencyCode: variant.price.currencyCode,
      },
    },
  };
}

function updateItemInCart(
  cart: Cart,
  merchandiseId: string,
  quantity: number
): Cart {
  if (quantity === 0) {
    return removeItemFromCart(cart, merchandiseId);
  }

  const newLines = cart.lines.map((line) =>
    line.merchandise.id === merchandiseId
      ? {
          ...line,
          quantity,
          cost: {
            totalAmount: {
              amount: (
                (Number(line.cost.totalAmount.amount) / line.quantity) *
                quantity
              ).toString(),
              currencyCode: line.cost.totalAmount.currencyCode,
            },
          },
        }
      : line
  );

  const totalQuantity = newLines.reduce((sum, line) => sum + line.quantity, 0);
  const totalAmount = newLines.reduce(
    (sum, line) => sum + Number(line.cost.totalAmount.amount),
    0
  );

  return {
    ...cart,
    totalQuantity,
    lines: newLines,
    cost: {
      ...cart.cost,
      subtotalAmount: {
        amount: totalAmount.toString(),
        currencyCode: cart.cost.subtotalAmount.currencyCode,
      },
      totalAmount: {
        amount: totalAmount.toString(),
        currencyCode: cart.cost.totalAmount.currencyCode,
      },
    },
  };
}

function removeItemFromCart(cart: Cart, merchandiseId: string): Cart {
  const newLines = cart.lines.filter(
    (line) => line.merchandise.id !== merchandiseId
  );

  const totalQuantity = newLines.reduce((sum, line) => sum + line.quantity, 0);
  const totalAmount = newLines.reduce(
    (sum, line) => sum + Number(line.cost.totalAmount.amount),
    0
  );

  return {
    ...cart,
    totalQuantity,
    lines: newLines,
    cost: {
      ...cart.cost,
      subtotalAmount: {
        amount: totalAmount.toString(),
        currencyCode: cart.cost.subtotalAmount.currencyCode,
      },
      totalAmount: {
        amount: totalAmount.toString(),
        currencyCode: cart.cost.totalAmount.currencyCode,
      },
    },
  };
}
