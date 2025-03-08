import Image from "next/image";

type LogoIconProps = Omit<React.ComponentProps<typeof Image>, "src" | "alt">;

export default function LogoIcon(props: LogoIconProps) {
  return (
    <Image
      src="/SULogo.png"
      alt="Sovereign University Logo"
      width={60}
      height={60}
      {...props}
    />
  );
}
