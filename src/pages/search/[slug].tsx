/* eslint-disable @next/next/no-img-element */
import dayjs from "dayjs";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import LoadingSpinner from "~/components/icons/loading";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const TABS = ["Games", "Users"] as const;

function GameFeed(props: { name: string }) {
  const { name } = props;
  const { ref, inView } = useInView();
  const { data, hasNextPage, fetchNextPage, isFetching, isFetchingNextPage } =
    api.game.getGamesByName.useInfiniteQuery(
      { name },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const games = data?.pages.flatMap((page) => page.games) ?? [];
  const gameCount = data?.pages.flatMap((page) => page.gameCount)[0] ?? "";

  if (inView && hasNextPage && !isFetching) {
    void fetchNextPage();
  }

  return (
    <>
      <p className="pt-1 text-lg text-zinc-400">
        {gameCount} {gameCount === 1 ? "game" : "games"}
      </p>
      {games.map((game) => (
        <div className="flex border-b border-b-zinc-600 py-4" key={game.id}>
          <Link href={`/games/${game.slug}`}>
            <img
              src={game.cover ? game.cover : "/game.webp"}
              alt={game.name ? game.name : "game"}
              width={170}
              height={0}
              className="rounded-md border border-zinc-600 transition hover:brightness-50"
            />
          </Link>
          <div className="w-full px-4">
            <p className="w-fit font-semibold transition duration-75">
              <Link
                href={`/games/${game.slug}`}
                className="text-xl hover:text-zinc-400 md:text-3xl"
              >
                {game.name}
              </Link>{" "}
              <span className="text-sm font-normal text-zinc-400 md:text-base">
                {game?.releaseDate
                  ? `(${dayjs.unix(game.releaseDate).year()})`
                  : ""}
              </span>
            </p>
          </div>
        </div>
      ))}
      <span ref={ref} className={hasNextPage ? "invisible" : "hidden"}>
        intersection observer marker
      </span>
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <LoadingSpinner size={40} />
        </div>
      )}
    </>
  );
}

function UserFeed(props: { username: string }) {
  const { username } = props;

  const { data } = api.profile.getUsersByUsername.useQuery({
    username: username,
  });

  const userCount = data?.length;

  return (
    <>
      <p className="pt-1 text-lg text-zinc-400">
        {userCount} {userCount === 1 ? "user" : "users"}
      </p>
      {data &&
        data.map((user) => (
          <div className="flex border-b border-b-zinc-600 py-4" key={user.id}>
            <Link href={user.username ? `/users/${user.username}` : `/`}>
              <img
                src={user.profileImageUrl}
                alt={user.username ? user.username : "profile"}
                width={48}
                height={48}
                className="h-fit w-24 rounded-md border border-zinc-600 hover:brightness-50"
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
    </>
  );
}

const GamesSearchPage: NextPage<{ name: string }> = ({ name }) => {
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Games");

  return (
    <PageLayout>
      <Head>
        <title>{name}</title>
        <meta
          name="description"
          content="Search over hundreds of thousands of games on vglist and find the exact game you are looking for. Discover new games you might not have even heard of before!"
        />
        <meta
          property="og:description"
          content="Search over hundreds of thousands of games on vglist and find the exact game you are looking for. Discover new games you might not have even heard of before!"
        />
        <meta
          property="twitter:description"
          content="Search over hundreds of thousands of games on vglist and find the exact game you are looking for. Discover new games you might not have even heard of before!"
        />
        <meta property="og:url" content={`https://vglist.org/search/${name}`} />
        <meta property="og:title" content={`search for ${name}`} />
        <meta property="twitter:title" content={`search for ${name}`} />
      </Head>
      <div className="pt-4">
        <h1 className="text-center text-4xl">results for {`${name}`}</h1>
        <nav className="text-2xl">
          <ul className="flex justify-center gap-3 py-2 text-cyan-400">
            <li className="text-zinc-100">search for</li>
            {selectedTab === "Games" ? (
              <>
                <li className="flex items-center text-cyan-400">
                  <button onClick={() => setSelectedTab("Games")}>games</button>
                </li>
                <li className="text-zinc-100">or</li>
                <li className="flex items-center text-zinc-400 transition duration-75 hover:text-cyan-400">
                  <button onClick={() => setSelectedTab("Users")}>users</button>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center text-zinc-400 transition duration-75 hover:text-cyan-400">
                  <button onClick={() => setSelectedTab("Games")}>games</button>
                </li>
                <li className="text-zinc-100">or</li>
                <li className="flex items-center text-cyan-400">
                  <button onClick={() => setSelectedTab("Users")}>users</button>
                </li>
              </>
            )}
          </ul>
        </nav>
        {selectedTab === "Games" ? (
          <GameFeed name={name} />
        ) : (
          <UserFeed username={name} />
        )}
      </div>
    </PageLayout>
  );
};

export default GamesSearchPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const name = context.params?.slug;
  const ssg = generateSSGHelper();

  if (typeof name !== "string") {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  await ssg.game.getGamesByName.prefetchInfinite({ name });
  await ssg.profile.getUsersByUsername.prefetch({ username: name });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      name,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
