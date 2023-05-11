import { ImageResponse } from "@vercel/og";
import Image from "next/image";
import { type NextRequest } from "next/server";
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
          display: "flex",
          fontSize: 60,
          color: "black",
          background: "#f6f6f6",
          width: "100%",
          height: "100%",
          paddingTop: 50,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          width="256"
          height="256"
          src={username}
          alt='profile'
          style={{
            borderRadius: 128,
          }}
        />
        <Logo />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
