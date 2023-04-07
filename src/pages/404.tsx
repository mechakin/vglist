import { type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Head from "next/head";
import Link from "next/link";

const NotFound: NextPage = () => {
  return (
    <PageLayout>
      <Head>
        <title>404 not found</title>
      </Head>
      <div className="flex flex-col items-center justify-center md:py-10">
        <h1 className="py-4 text-6xl">Page not found :/</h1>
        <p className="text-3xl">
          Click{" "}
          <span className="text-cyan-600">
            <Link href={"/"}>here</Link>
          </span>{" "}
          to go back to vglist.
        </p>
      </div>
    </PageLayout>
  );
};

export default NotFound;