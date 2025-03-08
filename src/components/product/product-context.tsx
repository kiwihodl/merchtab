/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, {
  createContext,
  useContext,
  useMemo,
  useOptimistic,
} from "react";

type ProductState = {
  [key: string]: string;
} & {
  image?: string;
};

type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => ProductState;
  updateImage: (index: string) => ProductState;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getInitialState = () => {
    const params: ProductState = {};
    const entries = searchParams?.entries() || [];
    for (const [key, value] of entries) {
      params[key] = value;
    }
    return params;
  };

  const [state, setOptimisticState] = useOptimistic(
    getInitialState(),
    (prevState: ProductState, update: ProductState) => ({
      ...prevState,
      ...update,
    })
  );

  const updateOption = (name: string, value: string) => {
    const newState = { ...state, [name]: value };
    setOptimisticState(newState);
    const params = new URLSearchParams(searchParams?.toString());
    params.set(name, value);
    router.push(`?${params.toString()}`, { scroll: false });
    return newState;
  };

  const updateImage = (index: string) => {
    const newState = { ...state, image: index };
    setOptimisticState(newState);
    const params = new URLSearchParams(searchParams?.toString());
    params.set("image", index);
    router.push(`?${params.toString()}`, { scroll: false });
    return newState;
  };

  const value = useMemo(
    () => ({
      state,
      updateOption,
      updateImage,
    }),
    [state, searchParams]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
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

  return (state: ProductState) => {
    const newParams = new URLSearchParams(window.location.search);
    Object.entries(state).forEach(([key, value]) => {
      newParams.set(key, value);
    });
    router.push(`?${newParams.toString()}`, { scroll: false });
  };
}
