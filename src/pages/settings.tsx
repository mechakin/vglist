import { type NextPage } from "next";
import { UserProfile } from "@clerk/nextjs";
import { PageLayout } from "~/components/layout";
import Head from "next/head";

const Settings: NextPage = () => {
  return (
    <PageLayout>
      <Head>
        <title>settings</title>
      </Head>
      <div className="flex items-center justify-center md:py-10">
        <UserProfile />
      </div>
    </PageLayout>
  );
};

export default Settings;
