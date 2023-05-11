import { type GetStaticProps, type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { api } from "~/utils/api";
import { useInView } from "react-intersection-observer";
import dayjs from "dayjs";
import LoadingSpinner from "~/components/loading";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

const GamesSearchPage: NextPage<{ name: string }> = ({ name }) => {
  const { ref, inView } = useInView();
  const { data, hasNextPage, fetchNextPage, isFetching } =
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
    <PageLayout>
      <Head>
        <title>{name}</title>
      </Head>
      <div className="pt-4">
        <h1 className="text-center text-4xl">results for {`${name}`}</h1>
        <nav className="text-2xl">
          <ul className="flex justify-center gap-3 py-2 text-cyan-400">
            <li className="text-zinc-100">search for</li>
            <li className="flex items-center">
              <Link href={`/search/games/${name}`}>games</Link>
            </li>
            <li className="text-zinc-100">or</li>
            <li className="flex items-center text-zinc-400 transition duration-75 hover:text-cyan-400">
              <Link href={`/search/users/${name}`}>users</Link>
            </li>
          </ul>
        </nav>
        <p className="pt-1 text-lg text-zinc-400">
          {gameCount} {gameCount === 1 ? "game" : "games"}
        </p>
        {games.map((game) => (
          <div className="flex border-b border-b-zinc-600 py-4" key={game.id}>
            <Link href={`/games/${game.slug}`}>
              <Image
                src={game.cover ? game.cover : "/game.webp"}
                alt={game.name ? game.name : "game"}
                width={120}
                height={0}
                className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
                priority
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
      </div>
      <span ref={ref} className={hasNextPage ? "invisible" : "hidden"}>
        intersection observer marker
      </span>
      {isFetching && (
        <div className="flex justify-center">
          <LoadingSpinner size={40} />
        </div>
      )}
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

  return {
    props: {
      trpcState: ssg.dehydrate(),
      name,
    },
  };
};

// should see if this is right
export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
