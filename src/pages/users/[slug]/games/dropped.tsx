import { type GetStaticProps, type NextPage } from "next";
import Image from "next/image";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import NotFound from "~/components/404";
import { useInView } from "react-intersection-observer";
import LoadingSpinner from "~/components/icons/loading";
import { GameNav } from "~/components/gameNav";

const ProfileGamePage: NextPage<{ username: string }> = ({ username }) => {
  const { ref, inView } = useInView();

  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  const {
    data: statusData,
    isFetching,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = api.status.getDroppedStatusByUsername.useInfiniteQuery(
    { username },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const statuses = statusData?.pages.flatMap((page) => page.status) ?? [];
  const ratingCount =
    statusData?.pages.flatMap((page) => page.statusCount)[0] ?? "";

  const ratings = statuses?.flatMap((rating) => rating.game.ratings);
  const scores = ratings.map((rating) =>
    rating.score ? rating.score / 2 : undefined
  );

  if (!data) return <NotFound />;

  if (inView && hasNextPage && !isFetching) {
    void fetchNextPage();
  }

  return (
    <PageLayout>
      <GameNav username={username} />
      <div className="flex flex-col md:px-4">
        <h2 className="pb-4 text-3xl font-medium">games played</h2>
        <h3 className="-mt-3  text-lg text-zinc-400">
          {ratingCount} {ratingCount === 1 ? "game" : "games"}
        </h3>
        <div className="gap-2 pb-4 pt-2 xxs:flex">
          <Link
            href={`/users/${username}/games/playing`}
            className="mr-2 rounded-md border border-zinc-500 p-1 px-2 text-lg transition duration-75 hover:bg-zinc-500 xxs:mr-0"
          >
            playing
          </Link>
          <Link
            href={`/users/${username}/games/played`}
            className="mb-2 mr-2 rounded-md border border-zinc-500 p-1 px-2 text-lg transition duration-75 hover:bg-zinc-500 xxs:mb-0 xxs:mr-0"
          >
            played
          </Link>
          <Link
            href={`/users/${username}/games/backlog`}
            className="mr-2 rounded-md border border-zinc-500 p-1 px-2 text-lg transition duration-75 hover:bg-zinc-500 xxs:mr-0"
          >
            backlog
          </Link>
          <Link
            href={`/users/${username}/games/dropped`}
            className="mr-2 rounded-md border border-zinc-500 bg-zinc-500 p-1 px-2 text-lg transition duration-75 hover:bg-zinc-500 xxs:mr-0"
          >
            dropped
          </Link>
        </div>
        <div className="grid grid-cols-3 place-items-center gap-4 xxs:grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8">
          {statuses.map((status, index) => (
            <div className="max-w-fit" key={status.id}>
              <Link href={`/games/${status.game.slug}`}>
                <Image
                  src={status.game.cover ? status.game.cover : "/game.webp"}
                  alt={status.game.name ? status.game.name : "game"}
                  width={120}
                  height={0}
                  className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
                  priority
                />
              </Link>
              <div className="flex items-center justify-center">
                {scores[index] === undefined && (
                  <Rating
                    SVGclassName="inline -mx-0.5 invisible"
                    allowFraction
                    readonly
                    size={19}
                    emptyColor="#a1a1aa"
                    fillColor="#22d3ee"
                    transition
                  />
                )}
                {scores[index] !== undefined && (
                  <Rating
                    SVGclassName="inline -mx-0.5"
                    allowFraction
                    readonly
                    size={19}
                    emptyColor="#a1a1aa"
                    fillColor="#22d3ee"
                    initialValue={scores[index]}
                    transition
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        {statuses.length === 0 && (
          <div className="-mt-2 text-lg text-zinc-300">{`${username} hasn't dropped a game.`}</div>
        )}
      </div>
      <span ref={ref} className={hasNextPage ? "invisible" : "hidden"}>
        intersection observer marker
      </span>
      {isLoading && (
        <div className="flex justify-center pt-4">
          <LoadingSpinner size={40} />
        </div>
      )}
    </PageLayout>
  );
};

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

  await ssg.profile.getUserByUsername.prefetch({ username });
  await ssg.status.getDroppedStatusByUsername.prefetchInfinite({
    username,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
    revalidate: 1,
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfileGamePage;
