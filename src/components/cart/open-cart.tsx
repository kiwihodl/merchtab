import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center text-white transition-colors">
      <ShoppingCartIcon
        className={clsx(
          "h-7 w-7 transition-all ease-in-out hover:scale-110",
          className
        )}
      />

      {quantity ? (
        <div className="absolute right-0 top-0 -mr-1 mt-0 h-4 w-4 rounded bg-accent text-[11px] font-medium text-black flex items-center justify-center">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
