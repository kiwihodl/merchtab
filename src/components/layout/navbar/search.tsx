"use client";

import { createUrl } from "@/app/lib/utils";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams?.toString() || "");

    if (search.value) {
      newParams.set("q", search.value);
    } else {
      newParams.delete("q");
    }

    router.push(createUrl("/", newParams));
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-[200px] relative">
      <input
        key={searchParams?.get("q")}
        type="text"
        name="search"
        placeholder="Search..."
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="w-full rounded-2xl border border-accent bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-accent dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400 focus:border-accent focus:outline-none focus:ring-0"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-full max-w-[200px] relative">
      <input
        type="text"
        placeholder="Search..."
        className="w-full rounded-2xl border border-accent bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-accent dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400 focus:border-accent focus:outline-none focus:ring-0"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
