import { getMenu } from "@/app/lib/shopify";
import { Menu } from "@/app/lib/shopify/types";
import Link from "next/link";
import Search from "./search";
import LogoSquare from "@/components/logo-square";
import CartModal from "@/components/cart/modal";

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-menu");
  return (
    <nav className="flex items-center justify-between p-4 lg:px-6 sticky top-0 backdrop-blur-sm z-[999]">
      <div className="flex w-full items-center justify-between relative">
        <div className="flex z-10">
          <Link href="/" prefetch={true} className="flex items-center">
            <LogoSquare />
          </Link>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:left-auto lg:top-auto lg:transform-none">
          <Search />
        </div>
        <div className="flex items-center z-10">
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
