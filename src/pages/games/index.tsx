import { type NextPage } from "next";
import Image from "next/image";
import { PageLayout } from "~/components/layout";
import Link from "next/link";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import LoadingSpinner from "~/components/loading";


function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  function handleScroll() {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const windowScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const scrolled = (windowScroll / height) * 100;

    setScrollPosition(scrolled);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollPosition;
}

const GamesPage: NextPage = () => {
  const scrollPosition = useScrollPosition();

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
    if (scrollPosition > 90 && hasNextPage) {
      void fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, fetchNextPage]);

  return (
    <PageLayout>
      <h2 className="pb-4 text-4xl font-medium">all games</h2>
      <h3 className="-mt-2 pb-4 text-lg text-zinc-400">229675 games</h3>
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
        <div className="flex justify-center pt-4 py-6">
          <LoadingSpinner size={55} />
        </div>
      )}
    </PageLayout>
  );
};

export default GamesPage;
