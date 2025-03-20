"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ListItem, type PathFilterItem } from ".";
import Link from "next/link";
import { createUrl } from "@/app/lib/utils";
import type { SortFilterItem } from "@/app/lib/constants";
import clsx from "clsx";

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active =
    searchParams?.get("collection") === item.slug ||
    (!searchParams?.get("collection") && item.slug === "all");
  const q = searchParams?.get("q");

  const href = createUrl(
    item.path,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && item.slug.length && { collection: item.slug }),
    })
  );

  return (
    <li className="mt-4 flex text-neutral-300" key={item.title}>
      <div className="w-full">
        <Link
          prefetch={!active ? false : undefined}
          href={href}
          className={clsx("text-xl font-medium hover:text-neutral-100", {
            "text-accent": active,
            "border-b-2 border-accent": active,
          })}
        >
          {item.title}
        </Link>
      </div>
    </li>
  );
}

function SortFilterItem({ item }: { item: SortFilterItem }) {
  const pathnameRaw = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams?.get("sort") === item.slug;
  const q = searchParams?.get("q");
  const pathname = pathnameRaw || "";

  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && item.slug.length && { sort: item.slug }),
    })
  );

  return (
    <li className="mt-4 flex text-neutral-300" key={item.title}>
      <div className="w-full">
        <Link
          prefetch={!active ? false : undefined}
          href={href}
          className={clsx("text-xl font-medium hover:text-neutral-100", {
            "text-accent": active,
            "border-b-2 border-accent": active,
          })}
        >
          {item.title}
        </Link>
      </div>
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return "path" in item ? (
    <PathFilterItem item={item} />
  ) : (
    <SortFilterItem item={item} />
  );
}
