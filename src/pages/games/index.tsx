import { type GetStaticProps, type NextPage } from "next";
import Image from "next/image";
import { PageLayout } from "~/components/layout";
import Link from "next/link";
import { api } from "~/utils/api";
import NotFound from "~/components/404";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Head from "next/head";
import { useInView } from "react-intersection-observer";
import LoadingSpinner from "~/components/loading";

const GamesPage: NextPage = () => {
  const { ref, inView } = useInView();
  const {
    data: gameData,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = api.game.getAllGames.useInfiniteQuery(
    { limit: 64 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

const games = gameData?.pages.flatMap((page) => page.games) ?? [];
const count = gameData?.pages.flatMap((page) => page.gamesCount) ?? 0;

  if (!gameData) return <NotFound />;

  if (inView && hasNextPage && !isFetching) {
    void fetchNextPage();
  }

  return (
    <PageLayout>
      <Head>
        <title>games</title>
      </Head>
      <h2 className="pb-4 text-3xl font-semibold">all games</h2>
      <h3 className="-mt-2 pb-4 text-lg text-zinc-400">{count} games</h3>
      <div className="grid grid-cols-3 place-items-center gap-4 xxs:grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8">
        {games.map((game) => (
          <Link href={`/games/${game.slug}`} key={game.id}>
            <Image
              src={game.cover ? game.cover : "/game.png"}
              alt={game.name ? game.name : "game"}
              width={120}
              height={0}
              className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
              priority
            />
          </Link>
        ))}
      </div>
      <span ref={ref} className={hasNextPage ? "invisible" : "hidden"}>
        intersection observer marker
      </span>
      {isFetching && (
        <div className="flex justify-center">
          <LoadingSpinner size={55} />
        </div>
      )}
    </PageLayout>
  );
};

export default GamesPage;

export const getStaticProps: GetStaticProps = async () => {
  const ssg = generateSSGHelper();

  await ssg.game.getAllGames.prefetchInfinite({ limit: 64 });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
