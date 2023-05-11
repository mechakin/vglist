import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";
import { dark } from "@clerk/themes";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import bigIntSupport from "dayjs/plugin/bigIntSupport";
import NextNProgress from "nextjs-progressbar";

dayjs.extend(relativeTime);
dayjs.extend(bigIntSupport);

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider
      appearance={{ baseTheme: dark, variables: { colorPrimary: "#0891b2" } }}
      {...pageProps}
    >
      <Head>
        <title>vglist</title>
        <meta
          name="description"
          content="Welcome to vglist, the best place to track and share your video game collection! Discover the most popular games out right now, or jump right back into the classics. Sign up now!"
        />
        <meta
          property="og:description"
          content="Welcome to vglist, the best place to track and share your video game collection! Discover the most popular games out right now, or jump right back into the classics. Sign up now!"
        />
        <meta name="og:site_name" content="vglist"></meta>
        <meta property="og:url" content="https://vglist.org"></meta>
        <meta property="og:title" content="vglist - discover, collect, and share your favorite games"></meta>
        <meta property="og:image" content="https://www.vglist.org/logo.webp" className="w-full" ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <NextNProgress color="#a1a1aa" />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
