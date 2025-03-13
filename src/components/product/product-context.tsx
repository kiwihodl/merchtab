/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useCallback,
  useTransition,
} from "react";

type ProductState = {
  [key: string]: string;
} & {
  image?: string;
};

type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => void;
  updateImage: (imageUrl: string) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<ProductState>(() => {
    const params: ProductState = {};
    if (searchParams) {
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }
    }
    return params;
  });

  const updateOption = (name: string, value: string) => {
    const newState = { ...state, [name]: value };
    setState(newState);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set(name, value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const updateImage = (imageUrl: string) => {
    const newState = { ...state, image: imageUrl };
    setState(newState);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("image", imageUrl);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <ProductContext.Provider value={{ state, updateOption, updateImage }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}

export function useUpdateURL() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (state: ProductState) => {
    startTransition(() => {
      const newParams = new URLSearchParams(window.location.search);
      Object.entries(state).forEach(([key, value]) => {
        newParams.set(key, value);
      });
      router.push(`?${newParams.toString()}`, { scroll: false });
    });
  };
}
