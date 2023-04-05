import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";
import { dark } from "@clerk/themes";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }} {...pageProps}>
      <Head>
        <title>vglist</title>
        <meta
          name="description"
          content="Welcome to vglist, the best place to track and share your video game collection! Discover the most popular games out right now, or jump right back into the classics. Sign up now!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
