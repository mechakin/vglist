import { type NextPage } from "next";
import { UserProfile } from "@clerk/nextjs";
import { PageLayout } from "~/components/layout";
import Head from "next/head";

const Settings: NextPage = () => {
  return (
    <PageLayout>
      <Head>
        <title>settings</title>
        <meta name="description" content="Adjust your user settings here." />
        <meta name="og:description" content="Adjust your user settings here." />
        <meta
          property="twitter:description"
          content="Adjust your user settings here."
        />
        <meta property="og:title" content="settings" />
        <meta property="twitter:title" content="settings" />
        <meta property="og:url" content="https://vglist.org/settings" />
      </Head>
      <div className="flex items-center justify-center md:py-10">
        <UserProfile />
      </div>
    </PageLayout>
  );
};

export default Settings;
