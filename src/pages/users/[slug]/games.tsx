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
import { useState } from "react";
import Profile from "~/components/profile";
import { Portal, PortalDiv } from "~/components/portal";

const TABS = ["All", "Played", "Playing", "Dropped", "Backlog"] as const;

function AllStatusFeed(props: { username: string }) {
  const { username } = props;
  const { ref, inView } = useInView();

  const {
    data: statusData,
    isFetching,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = api.status.getAllStatusByUsername.useInfiniteQuery(
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

  if (inView && hasNextPage && !isFetching) {
    void fetchNextPage();
  }

  return (
    <>
      <Portal>
        <h3 className="-mt-3  text-lg text-zinc-400">
          {ratingCount} {ratingCount === 1 && !isLoading ? "game" : "games"}
        </h3>
      </Portal>
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
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {statuses.length === 0 && !isLoading && (
        <div className="-mt-2 text-lg text-zinc-300">{`${username} hasn't played a game :(`}</div>
      )}
      <span ref={ref} className={hasNextPage ? "invisible" : "hidden"}>
        intersection observer marker
      </span>
      {isLoading && (
        <div className="flex justify-center pt-4">
          <LoadingSpinner size={40} />
        </div>
      )}
    </>
  );
}

function PlayingStatusFeed(props: { username: string }) {
  const { username } = props;
  const { ref, inView } = useInView();

  const {
    data: statusData,
    isFetching,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = api.status.getPlayingStatusByUsername.useInfiniteQuery(
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

  if (inView && hasNextPage && !isFetching) {
    void fetchNextPage();
  }

  return (
    <>
      <Portal>
        <h3 className="-mt-3  text-lg text-zinc-400">
          {ratingCount} {ratingCount === 1 && !isLoading ? "game" : "games"}
        </h3>
      </Portal>
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
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {statuses.length === 0 && !isLoading && (
        <div className="-mt-2 text-lg text-zinc-300">{`${username} hasn't played a game :(`}</div>
      )}
      <span ref={ref} className={hasNextPage ? "invisible" : "hidden"}>
        intersection observer marker
      </span>
      {isLoading && (
        <div className="flex justify-center pt-4">
          <LoadingSpinner size={40} />
        </div>
      )}
    </>
  );
}

function PlayedStatusFeed(props: { username: string }) {
  const { username } = props;
  const { ref, inView } = useInView();

  const {
    data: statusData,
    isFetching,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = api.status.getPlayedStatusByUsername.useInfiniteQuery(
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

  if (inView && hasNextPage && !isFetching) {
    void fetchNextPage();
  }

  return (
    <>
      <Portal>
        <h3 className="-mt-3  text-lg text-zinc-400">
          {ratingCount} {ratingCount === 1 && !isLoading ? "game" : "games"}
        </h3>
      </Portal>
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
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {statuses.length === 0 && !isLoading && (
        <div className="-mt-2 text-lg text-zinc-300">{`${username} hasn't played a game :(`}</div>
      )}
      <span ref={ref} className={hasNextPage ? "invisible" : "hidden"}>
        intersection observer marker
      </span>
      {isLoading && (
        <div className="flex justify-center pt-4">
          <LoadingSpinner size={40} />
        </div>
      )}
    </>
  );
}

function BacklogStatusFeed(props: { username: string }) {
  const { username } = props;
  const { ref, inView } = useInView();

  const {
    data: statusData,
    isFetching,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = api.status.getBackloggedStatusByUsername.useInfiniteQuery(
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

  if (inView && hasNextPage && !isFetching) {
    void fetchNextPage();
  }

  return (
    <>
      <Portal>
        <h3 className="-mt-3  text-lg text-zinc-400">
          {ratingCount} {ratingCount === 1 && !isLoading ? "game" : "games"}
        </h3>
      </Portal>
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
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {statuses.length === 0 && !isLoading && (
        <div className="-mt-2 text-lg text-zinc-300">{`${username} hasn't played a game :(`}</div>
      )}
      <span ref={ref} className={hasNextPage ? "invisible" : "hidden"}>
        intersection observer marker
      </span>
      {isLoading && (
        <div className="flex justify-center pt-4">
          <LoadingSpinner size={40} />
        </div>
      )}
    </>
  );
}

function DroppedStatusFeed(props: { username: string }) {
  const { username } = props;
  const { ref, inView } = useInView();

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

  if (inView && hasNextPage && !isFetching) {
    void fetchNextPage();
  }

  return (
    <>
      <Portal>
        <h3 className="-mt-3  text-lg text-zinc-400">
          {ratingCount} {ratingCount === 1 && !isLoading ? "game" : "games"}
        </h3>
      </Portal>
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
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {statuses.length === 0 && !isLoading && (
        <div className="-mt-2 text-lg text-zinc-300">{`${username} hasn't played a game :(`}</div>
      )}
      <span ref={ref} className={hasNextPage ? "invisible" : "hidden"}>
        intersection observer marker
      </span>
      {isLoading && (
        <div className="flex justify-center pt-4">
          <LoadingSpinner size={40} />
        </div>
      )}
    </>
  );
}

const ProfileGamePage: NextPage<{ username: string }> = ({ username }) => {
  const [selectedTab, setSelectedTab] = useState<(typeof TABS)[number]>("All");

  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <NotFound />;

  return (
    <PageLayout>
      <Profile username={username} />
      <nav className="my-4 flex h-8 w-full rounded-md bg-zinc-500 px-2 align-middle text-zinc-300">
        <ul className="flex py-1 font-medium">
          <li className="px-4 decoration-2 underline-offset-8 hover:text-zinc-100 hover:underline">
            <Link
              href={`/users/${username}`}
              className="py-2"
              onClick={() => setSelectedTab("All")}
            >
              profile
            </Link>
          </li>
          <li className="px-4 text-zinc-100 underline decoration-2 underline-offset-8">
            <Link
              href={`/users/${username}/games`}
              className="py-2"
              onClick={() => setSelectedTab("All")}
            >
              games
            </Link>
          </li>
          <li className="px-4 decoration-2 underline-offset-8 hover:text-zinc-100 hover:underline">
            <Link
              href={`/users/${username}/reviews`}
              className="py-2"
              onClick={() => setSelectedTab("All")}
            >
              reviews
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex flex-col md:px-4">
        <h2 className="pb-4 text-3xl font-medium">games played</h2>
        <PortalDiv />
        <div className="gap-2 pb-4 pt-2 xxs:flex">
          <button
            className={`mr-2 rounded-md border border-zinc-500 p-1 px-2 text-lg transition duration-75 hover:bg-zinc-500 xxs:mr-0 ${
              selectedTab === "Playing" ? "bg-zinc-500" : ""
            }`}
            onClick={() => setSelectedTab("Playing")}
          >
            playing
          </button>
          <button
            className={`mr-2 rounded-md border border-zinc-500 p-1 px-2 text-lg transition duration-75 hover:bg-zinc-500 xxs:mb-0 xxs:mr-0 ${
              selectedTab === "Played" ? "bg-zinc-500" : ""
            }`}
            onClick={() => setSelectedTab("Played")}
          >
            played
          </button>
          <button
            className={`mr-2 rounded-md border border-zinc-500 p-1 px-2 text-lg transition duration-75 hover:bg-zinc-500 xxs:mr-0 ${
              selectedTab === "Backlog" ? "bg-zinc-500" : ""
            }`}
            onClick={() => setSelectedTab("Backlog")}
          >
            backlog
          </button>
          <button
            className={`mr-2 rounded-md border border-zinc-500 p-1 px-2 text-lg transition duration-75 hover:bg-zinc-500 xxs:mr-0 ${
              selectedTab === "Dropped" ? "bg-zinc-500" : ""
            }`}
            onClick={() => setSelectedTab("Dropped")}
          >
            dropped
          </button>
        </div>
        {selectedTab === "All" && <AllStatusFeed username={username} />}
        {selectedTab === "Playing" && <PlayingStatusFeed username={username} />}
        {selectedTab === "Played" && <PlayedStatusFeed username={username} />}
        {selectedTab === "Backlog" && <BacklogStatusFeed username={username} />}
        {selectedTab === "Dropped" && <DroppedStatusFeed username={username} />}
      </div>
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
  await ssg.status.getAllStatusByUsername.prefetchInfinite({
    username,
  });
  await ssg.status.getPlayedStatusByUsername.prefetchInfinite({
    username,
  });
  await ssg.status.getPlayingStatusByUsername.prefetchInfinite({ username });
  await ssg.status.getDroppedStatusByUsername.prefetchInfinite({
    username,
  });
  await ssg.status.getBackloggedStatusByUsername.prefetchInfinite({ username });

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
