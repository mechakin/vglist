import { type GetStaticProps, type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

const UsersSearchPage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUsersByUsername.useQuery({
    username: username,
  });

  const userCount = data?.length;

  return (
    <PageLayout>
      <Head>
        <title>{username}</title>
        <meta
          name="description"
          content="Search for users, new and old, and connect with them on vglist!"
        />
        <meta
          property="og:description"
          content="Search for users, new and old, and connect with them on vglist!"
        />
        <meta
          property="twitter:description"
          content="Search for users, new and old, and connect with them on vglist!"
        />
        <meta
          property="og:url"
          content={`https://vglist.org/search/${username}`}
        />
        <meta property="og:title" content={`search for ${username}`} />
        <meta property="twitter:title" content={`search for ${username}`} />
      </Head>
      <div className="py-4">
        <h1 className="text-center text-4xl">results for {`${username}`}</h1>
        <nav className="text-2xl">
          <ul className="flex justify-center gap-3 py-2">
            <li className="text-zinc-100">search for</li>
            <li className="flex items-center text-zinc-400 transition duration-75 hover:text-cyan-400">
              <Link href={`/search/games/${username}`}>games</Link>
            </li>
            <li>or</li>
            <li className="flex items-center text-cyan-400">
              <Link href={`/search/users/${username}`}>users</Link>
            </li>
          </ul>
        </nav>
        <p className="pt-1 text-lg text-zinc-400">
          {userCount} {userCount === 1 ? "user" : "users"}
        </p>
        {data &&
          data.map((user) => (
            <div className="flex border-b border-b-zinc-600 py-4" key={user.id}>
              <Link href={user.username ? `/users/${user.username}` : `/`}>
                <Image
                  src={user.profileImageUrl}
                  alt={user.username ? user.username : "profile"}
                  width={48}
                  height={48}
                  className="h-fit w-fit rounded-md border border-zinc-600 hover:brightness-50"
                  priority
                />
              </Link>
              <div className="px-4">
                <Link
                  href={user.username ? `/users/${user.username}` : `/`}
                  className="flex h-full items-center text-xl font-semibold transition duration-75 hover:text-zinc-400 md:text-3xl"
                >
                  {user.username}
                </Link>
              </div>
            </div>
          ))}
      </div>
    </PageLayout>
  );
};

export default UsersSearchPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const username = context.params?.slug;

  if (typeof username !== "string") {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  await ssg.profile.getUsersByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

// should see if this is right
export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
