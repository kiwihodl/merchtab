import { ImageResponse } from "next/og";

export type Props = {
  title?: string;
};

export default async function OpengraphImage(
  props?: Props
): Promise<ImageResponse> {
  const { title } = {
    ...{
      title: process.env.NEXT_PUBLIC_SITE_NAME,
    },
    ...props,
  };

  // Load the logo image directly
  const logoImageData = await fetch(
    new URL("../../public/SULogo.png", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-black">
        <div tw="flex flex-none items-center justify-center border border-neutral-700 h-[160px] w-[160px] rounded-3xl">
          <img
            src={logoImageData as any}
            alt="Sovereign University Logo"
            width="64"
            height="58"
            style={{
              objectFit: "contain",
            }}
          />
        </div>
        <p tw="mt-12 text-6xl font-bold text-white">{title}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
