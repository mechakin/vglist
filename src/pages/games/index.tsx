import { type NextPage } from "next";
import Image from "next/image";
import { PageLayout } from "~/components/layout";
import Link from "next/link";
import { api } from "~/utils/api";
import { useEffect } from "react";
import LoadingSpinner from "~/components/loading";
import { useInView } from "react-intersection-observer";

const GamesPage: NextPage = () => {
  const { ref, inView } = useInView();

  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.game.getAllGames.useInfiniteQuery(
      {
        limit: 64,
      },
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
      <h2 className="pb-4 text-4xl font-medium">all games</h2>
      <h3 className="-mt-2 pb-4 text-lg text-zinc-400">230287 games</h3>
      <div className="grid grid-cols-3 place-items-center gap-4 xxs:grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8">
        {games.map((game) => (
          <Link href={`/games/${game.slug}`} key={game.id}>
            <Image
              src={game.cover ? game.cover : "/test.png"}
              alt={game.name}
              width={120}
              height={0}
              className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
              priority
            />
          </Link>
        ))}
      </div>
      {isFetching && (
        <div className="flex justify-center py-6 pt-4">
          <LoadingSpinner size={55} />
        </div>
      )}
      <span ref={ref} className="invisible">
        intersection observer marker
      </span>
    </PageLayout>
  );
};

export default GamesPage;
