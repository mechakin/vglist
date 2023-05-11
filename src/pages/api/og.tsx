import { ImageResponse } from "@vercel/og";
import Image from "next/image";
import { type NextRequest } from "next/server";
import { CrossIcon } from "~/components/exitButton";
import { Logo } from "~/components/logo";

export const config = {
  runtime: "edge",
};

export default function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const username = searchParams.get("username");
  if (!username) {
    return new ImageResponse(<>Visit with &quot;?username=vercel&quot;</>, {
      width: 1200,
      height: 630,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#27272a",
        }}
      >
        <Logo size={200} />
        <CrossIcon />
        <Image
          width="200"
          height="200"
          src={username}
          alt="profile"
          style={{
            borderRadius: 6,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
