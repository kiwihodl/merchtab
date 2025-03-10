"use client";

import { ListItem } from "./index";
import { FilterItem } from "./item";

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <>
      {list.map((item: ListItem, i) => (
        <FilterItem key={i} item={item} />
      ))}
    </>
  );
}

export default function ClientFilterList({
  list,
  title,
}: {
  list: ListItem[];
  title?: string;
}) {
  return (
    <nav className="flex flex-col">
      {title ? (
        <h3 className="mb-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {title}
        </h3>
      ) : null}
      <ul className="flex flex-col gap-2">
        <FilterItemList list={list} />
      </ul>
    </nav>
  );
}
