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
        <meta name="og:site_name" content="vglist" />
        {/* <meta property="og:image" content="https://www.vglist.org/logo.webp" />
        <meta
          property="twitter:image"
          content="https://www.vglist.org/logo.webp"
        /> */}
        <meta property="twitter:card" content="summary_large_image" />
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
