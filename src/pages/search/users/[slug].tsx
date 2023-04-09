import { type GetStaticProps, type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Link from "next/link";

const UsersSearchPage: NextPage<{ slug: string }> = ({ slug }) => {
  return (
    <PageLayout>
      <div className="py-4 text-center text-2xl">
        <h1 className="text-4xl">
          30 results for <span className="font-semibold">{`${slug}`}</span>
        </h1>
        <nav className="text-2xl">
          <ul className="flex justify-center gap-4 py-2">
            <li className="text-zinc-100">search for:</li>
            <li className="flex items-center text-zinc-400 underline transition duration-75 hover:text-cyan-300">
              <Link href={`/search/games/${slug}`}>games</Link>
            </li>
            <li className="flex items-center text-cyan-400 underline">
              <Link href={`/search/users/${slug}`}>users</Link>
            </li>
          </ul>
        </nav>
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
