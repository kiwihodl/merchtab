import Footer from "@/components/layout/footer";
import Collections from "@/components/layout/search/collections";
import FilterList from "@/components/layout/search/filter";
import { sorting } from "@/app/lib/constants";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
        <div className="order-first w-full flex-none md:w-[200px]">
          <div className="bg-black p-4">
            <FilterList list={sorting} title="Sort by" />
            <div className="mt-8">
              <Collections />
            </div>
          </div>
        </div>
        <div className="order-last min-h-screen w-full md:order-none">
          {children}
        </div>
      </div>
    </>
  );
}
