import { type GetStaticProps, type NextPage } from "next";
import Image from "next/image";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import NotFound from "~/components/404";
import Profile from "~/components/profile";
import { useInView } from "react-intersection-observer";
import LoadingSpinner from "~/components/icons/loading";

const ProfileGamePage: NextPage<{ username: string }> = ({ username }) => {
  const { ref, inView } = useInView();

  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  const {
    data: ratingData,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = api.rating.getRatingsByUsername.useInfiniteQuery(
    { username },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const ratings = ratingData?.pages.flatMap((page) => page.ratings) ?? [];
  const ratingCount =
    ratingData?.pages.flatMap((page) => page.ratingCount)[0] ?? "";

  if (!data) return <NotFound />;

  if (inView && hasNextPage && !isFetching) {
    void fetchNextPage();
  }

  return (
    <PageLayout>
      <Profile username={username} />
      <nav className="my-4 flex h-8 w-full rounded-md bg-zinc-500 px-2 align-middle text-zinc-300">
        <ul className="flex py-1 font-medium">
          <li className="px-4 decoration-2 underline-offset-8 hover:text-zinc-100 hover:underline">
            <Link href={`/users/${username}`}>profile</Link>
          </li>
          <li className="px-4 text-zinc-100 underline decoration-2 underline-offset-8">
            <Link href={`/users/${username}/games`}>games</Link>
          </li>
          <li className="px-4 decoration-2 underline-offset-8 hover:text-zinc-100 hover:underline">
            <Link href={`/users/${username}/reviews`}>reviews</Link>
          </li>
        </ul>
      </nav>

      <div className="flex flex-col md:px-4">
        <h2 className="pb-4 text-3xl font-medium">games played</h2>
        <h3 className="-mt-3  text-lg text-zinc-400">
          {ratingCount} {ratingCount === 1 ? "game" : "games"}
        </h3>
        <div className="gap-2 pb-4 pt-2 xxs:flex">
          <Link
            href={`/users/${username}/games/played`}
            className="mb-2 mr-2 rounded-md border border-zinc-500 p-1 px-2 text-lg transition duration-75 hover:bg-zinc-500 xxs:mb-0 xxs:mr-0"
          >
            played
          </Link>
          <Link
            href={`/users/${username}/games/playing`}
            className="mr-2 rounded-md border border-zinc-500 p-1 px-2 text-lg transition duration-75 hover:bg-zinc-500 xxs:mr-0"
          >
            playing
          </Link>
          <Link
            href={`/users/${username}/games/backlog`}
            className="mr-2 rounded-md border border-zinc-500 p-1 px-2 text-lg transition duration-75 hover:bg-zinc-500 xxs:mr-0 bg-zinc-500"
          >
            backlog
          </Link>
          <Link
            href={`/users/${username}/games/dropped`}
            className="mr-2 rounded-md border border-zinc-500 p-1 px-2 text-lg transition duration-75 hover:bg-zinc-500 xxs:mr-0"
          >
            dropped
          </Link>
        </div>
        <div className="grid grid-cols-3 place-items-center gap-4 xxs:grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8">
          {ratings.map((rating) => (
            <div className="max-w-fit" key={rating.rating.id}>
              <Link href={`/games/${rating.rating.game.slug}`}>
                <Image
                  src={
                    rating.rating.game.cover
                      ? rating.rating.game.cover
                      : "/game.webp"
                  }
                  alt={
                    rating.rating.game.name ? rating.rating.game.name : "game"
                  }
                  width={120}
                  height={0}
                  className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
                  priority
                />
              </Link>
              <div className="flex items-center justify-center">
                <Rating
                  SVGclassName="inline -mx-0.5"
                  allowFraction
                  readonly
                  size={19}
                  emptyColor="#a1a1aa"
                  fillColor="#22d3ee"
                  initialValue={rating.rating.score / 2}
                />
              </div>
            </div>
          ))}
        </div>
        {ratings.length === 0 && (
          <div className="-mt-2 text-lg text-zinc-300">{`${username} hasn't played a game :(`}</div>
        )}
      </div>
      <span ref={ref} className={hasNextPage ? "invisible" : "hidden"}>
        intersection observer marker
      </span>
      {isFetching && (
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
  await ssg.rating.getRatingsByUsername.prefetchInfinite({
    username,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
    revalidate: 10,
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfileGamePage;
