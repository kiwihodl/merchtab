"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createUrl } from "@/app/lib/utils";

export default function ClientCollections({
  collections,
}: {
  collections: any[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="space-y-2">
      {collections.map((collection) => {
        const active = pathname === collection.path;
        const href = createUrl(
          collection.path,
          new URLSearchParams({
            ...(searchParams?.get("q") && { q: searchParams.get("q")! }),
          })
        );
        const DynamicTag = active ? "p" : Link;

        return (
          <DynamicTag
            key={collection.handle}
            href={href}
            className={`block text-lg ${
              active ? "text-accent" : "text-neutral-300 hover:text-white"
            }`}
          >
            {collection.title}
          </DynamicTag>
        );
      })}
    </div>
  );
}
