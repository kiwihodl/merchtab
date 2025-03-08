import clsx from "clsx";
import LogoIcon from "./icons/logo";

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  return (
    <div
      className={clsx("flex flex-none items-center justify-center", {
        "h-[60px] w-[60px]": !size,
        "h-[40px] w-[40px]": size === "sm",
      })}
    >
      <LogoIcon
        className={clsx("object-contain", {
          "h-[60px] w-[60px]": !size,
          "h-[40px] w-[40px]": size === "sm",
        })}
      />
    </div>
  );
}
