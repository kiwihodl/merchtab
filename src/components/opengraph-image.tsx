import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

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

  // Read the image file from the public directory
  const imageData = readFileSync(join(process.cwd(), "public", "SULogo.png"));
  const imageBase64 = Buffer.from(imageData).toString("base64");

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-black">
        <div tw="flex flex-none items-center justify-center border border-neutral-700 h-[160px] w-[160px] rounded-3xl">
          <img
            src={`data:image/png;base64,${imageBase64}`}
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
