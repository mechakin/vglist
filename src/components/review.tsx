import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";
import { type RouterOutputs, api } from "~/utils/api";
import LoadingSpinner from "./loading";
import { useInView } from "react-intersection-observer";

type ReviewWithUser =
  RouterOutputs["review"]["getReviewsByGameId"]["reviews"][number];

export default function Review(props: ReviewWithUser) {
  const { review, author } = props;
  const { data: gameData } = api.game.getGameById.useQuery({
    id: review.gameId,
  });

  if (!gameData) return <div />;

  return (
    <div className="border-b border-b-zinc-600 py-4 md:flex">
      <Link href={`/games/${gameData.name}`}>
        <Image
          src={gameData.cover ? gameData.cover : "/game.png"}
          alt={gameData.name}
          width={120}
          height={0}
          className="mb-2 h-fit max-w-min rounded-md border border-zinc-600 transition hover:brightness-50 "
        />
      </Link>

      <div className="flex flex-col md:px-8">
        <h3 className="max-w-fit text-2xl font-medium transition duration-75 hover:text-zinc-400">
          <Link href={`/games/${gameData.slug}`}>{gameData.name}</Link>
        </h3>
        <div className="flex items-center pb-1">
          <p className="pr-4 pt-1 font-semibold text-zinc-400 transition duration-75 hover:text-zinc-100">
            <Link href={`/users/${author.username}`}>{author.username}</Link>
          </p>
          {review.score && (
            <Rating
              SVGclassName="inline -mx-0.5"
              allowFraction
              readonly
              size={22}
              transition={false}
              emptyColor="#a1a1aa"
              fillColor="#22d3ee"
              tooltipArray={[]}
              initialValue={review.score / 2}
            />
          )}
        </div>
        <p className="text-zinc-300">{review.description}</p>
      </div>
    </div>
  );
}

export const ReviewFeed = (props: { authorId?: string }) => {
  const { ref, inView } = useInView();

  if (props.authorId) {
    const { data, hasNextPage, fetchNextPage, isFetching } =
      api.review.getReviewsByAuthorId.useInfiniteQuery(
        {
          authorId: props.authorId,
          limit: 12,
        },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      );

    const reviews = data?.pages.flatMap((page) => page.reviews) ?? [];

    if (inView && hasNextPage && !isFetching) {
      void fetchNextPage();
    }

    return (
      <>
        {reviews.map((fullReview) => (
          <Review {...fullReview} key={fullReview.review.id} />
        ))}
        {isFetching && <LoadingSpinner size={55} />}
        <span ref={ref} className={hasNextPage ? "invisible" : "hidden"}>
          intersection observer marker
        </span>
      </>
    );
  }

  const { data, isLoading } = api.review.getRecentReviews.useQuery();

  if (isLoading) return <LoadingSpinner size={55} />;

  if (!data || data.reviews.length === 0) return <div />;

  return (
    <>
      {data.reviews.map((fullReview) => (
        <Review {...fullReview} key={fullReview.review.id} />
      ))}
    </>
  );
};
