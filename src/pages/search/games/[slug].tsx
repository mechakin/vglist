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
import { useEffect } from "react";
import LoadingSpinner from "~/components/loading";

function handleStarValue(value: number) {
  console.log(value);
}

const GamesSearchPage: NextPage<{ search: string }> = ({ search }) => {
  const { ref, inView } = useInView();

  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.game.getGamesByName.useInfiniteQuery(
      { name: search, limit: 16 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const games = data?.pages.flatMap((page) => page.games) ?? [];

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <PageLayout>
      <Head>
        <title>{search}</title>
      </Head>
      <div className="py-4">
        <h1 className="text-center text-4xl">30 results for {`${search}`}</h1>
        <nav className="text-2xl">
          <ul className="flex justify-center gap-4 py-2 text-cyan-400">
            <li className="text-zinc-100">search for</li>
            <li className="flex items-center underline">
              <Link href={`/search/games/${search}`}>games</Link>
            </li>
            <li className="flex items-center text-zinc-400 underline transition duration-75 hover:text-cyan-400">
              <Link href={`/search/users/${search}`}>users</Link>
            </li>
          </ul>
        </nav>
        {games.map((game) => (
          <div className="flex border-b border-b-zinc-600 py-4" key={game.id}>
            <Link href={`/games/${game.slug}`}>
              <Image
                src={game.cover ? game.cover : "/test.png"}
                alt={game.name}
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
                <span className="md:text-md text-sm font-normal text-zinc-400">
                  {game?.releaseDate
                    ? `(${dayjs.unix(game.releaseDate).year()})`
                    : "n/a"}
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
                      onClick={handleStarValue}
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
      <span ref={ref} className="invisible">
        intersection observer marker
      </span>
    </PageLayout>
  );
};

export default GamesSearchPage;

export const getStaticProps: GetStaticProps = (context) => {
  const search = context.params?.slug;

  if (typeof search !== "string") {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  return {
    props: {
      search,
    },
  };
};

// should see if this is right
export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
