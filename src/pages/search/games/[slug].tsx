import { type GetStaticProps, type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Link from "next/link";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { SignedIn, SignedOut } from "@clerk/nextjs";
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
      { name, limit: 16 },
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
        {!isFetching && (
          <p className="pt-1 text-lg text-zinc-400">
            {gameCount} {gameCount === 1 ? "game" : "games"}
          </p>
        )}
        {games.map((game) => (
          <div className="flex border-b border-b-zinc-600 py-4" key={game.id}>
            <Link href={`/games/${game.slug}`}>
              <Image
                src={game.cover ? game.cover : "/game.png"}
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
              <SignedIn>
                <div className="md:py-6">
                  <div className="flex justify-start md:justify-end">
                    <Rating
                      SVGclassName="inline -mx-0.5"
                      allowFraction
                      size={30}
                      transition={false}
                      emptyColor="#a1a1aa"
                      fillColor="#22d3ee"
                      tooltipArray={[]}
                    />
                  </div>
                </div>
              </SignedIn>
              <SignedOut>
                <div>
                  <div className="md:py-6">
                    <div className="flex justify-start md:justify-end">
                      <Link
                        href={"/login"}
                        className="rounded-md bg-zinc-600 p-1 text-xl"
                      >
                        log in to review
                      </Link>
                    </div>
                  </div>
                </div>
              </SignedOut>
            </div>
          </div>
        ))}
      </div>
      {isFetching && (
        <div className="flex justify-center pt-4">
          <LoadingSpinner size={55} />
        </div>
      )}
      <span ref={ref} className={hasNextPage ? "invisible" : "hidden"}>
        intersection observer marker
      </span>
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
      name,
    },
  };
};

// should see if this is right
export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
