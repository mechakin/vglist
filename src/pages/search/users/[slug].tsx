import { type GetStaticProps, type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import Head from "next/head";

const UsersSearchPage: NextPage<{ slug: string }> = ({ slug }) => {
  const { user } = useUser();
  return (
    <PageLayout>
      <Head>
        <title>{slug}</title>
      </Head>
      <div className="py-4">
        <h1 className="text-center text-4xl">
          results for <span className="font-semibold">{`${slug}`}</span>
        </h1>
        <nav className="text-2xl">
          <ul className="flex justify-center gap-4 py-2">
            <li className="text-zinc-100">search for:</li>
            <li className="flex items-center text-zinc-400 underline transition duration-75 hover:text-cyan-400">
              <Link href={`/search/games/${slug}`}>games</Link>
            </li>
            <li className="flex items-center text-cyan-400 underline">
              <Link href={`/search/users/${slug}`}>users</Link>
            </li>
          </ul>
        </nav>
        <div className="flex border-b border-b-zinc-600 py-4">
          <Link href={user && user.username ? `/users/${user.username}` : `/`}>
            <Image
              src={user ? `${user.profileImageUrl}` : `/test3.png`}
              alt="profile"
              width={48}
              height={48}
              className="h-fit w-fit rounded-md border border-zinc-600"
              priority
            />
          </Link>
          <div className="px-4">
            <Link
              href={user && user.username ? `/users/${user.username}` : `/`}
              className="flex h-full items-center text-xl font-semibold transition duration-75 hover:text-zinc-400 md:text-3xl"
            >
              mechazol
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default UsersSearchPage;

export const getStaticProps: GetStaticProps = (context) => {
  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  return {
    props: {
      slug,
    },
  };
};

// should see if this is right
export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
