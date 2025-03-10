import { SortFilterItem } from "@/app/lib/constants";
import { FilterItem } from "./item";
import FilterItemDropDown from "./dropdown";

export type PathFilterItem = { title: string; path: string };
export type ListItem = SortFilterItem | PathFilterItem;

function FilterItemList({ list }: { list: ListItem[] }) {
  console.log("FilterItemList is being rendered with list:", list);
  return (
    <>
      {list.map((item: ListItem, i) => (
        <FilterItem key={i} item={item} />
      ))}
    </>
  );
}

export default function FilterList({
  list,
  title,
}: {
  list: ListItem[];
  title?: string;
}) {
  console.log(
    "FilterList is being rendered with title:",
    title,
    "and list:",
    list
  );
  return (
    <nav className="w-full">
      {title ? (
        <h3 className="text-lg font-medium text-accent mb-4">{title}</h3>
      ) : null}
      <ul className="w-full">
        <FilterItemList list={list} />
      </ul>
    </nav>
  );
}
