import { PageLayout } from "~/components/layout";
import Head from "next/head";
import Link from "next/link";

export default function NotFound() {
  return (
    <PageLayout>
      <Head>
        <title>404 not found</title>
        <meta
          name="description"
          content="Could not find the requested page :("
        />
        <meta
          name="og:description"
          content="Could not find the requested page :("
        />
        <meta
          property="twitter:description"
          content="Could not find the requested page :("
        />
        <meta property="og:title" content="404 not found" />
        <meta property="twitter:title" content="404 not found" />
      </Head>
      <div className="flex flex-col items-center justify-center md:py-10">
        <h1 className="py-4 text-5xl">page not found :/</h1>
        <p className="text-2xl">
          click{" "}
          <span className="text-zinc-400 transition duration-75 hover:text-cyan-400">
            <Link href={"/"}>here</Link>
          </span>{" "}
          to go back to vglist
        </p>
      </div>
    </PageLayout>
  );
}
