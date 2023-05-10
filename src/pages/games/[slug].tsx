import { type GetStaticProps, type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import NotFound from "~/components/404";
import dayjs from "dayjs";
import Head from "next/head";
import LoadingSpinner from "~/components/loading";
import { useInView } from "react-intersection-observer";
import {
  CreateReviewModal,
  DeleteReviewModal,
  UpdateReviewModal,
} from "~/components/review";
import { ExitButton } from "~/components/exitButton";
import { FormRating } from "~/components/formRating";

type ReviewWithUser =
  RouterOutputs["review"]["getReviewsByUsername"]["reviews"][number];

const DUMMY_REVIEW = {
  review: {
    game: {
      cover: null,
      id: 0,
      igdbRating: 0,
      igdbRatingCount: 0,
      igdbUpdatedAt: BigInt(0),
      name: "",
      overallRating: 0,
      overallRatingCount: 0,
      releaseDate: null,
      slug: "",
      summary: null,
    },
    authorId: "",
    createdAt: new Date(),
    description: "",
    score: null,
    gameId: 0,
    id: "",
  },
  author: { id: "", profileImageUrl: "", username: "" },
};

const IndividualGamePage: NextPage<{ slug: string }> = ({ slug }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] =
    useState<ReviewWithUser>(DUMMY_REVIEW);

  const { user } = useUser();

  const { ref, inView } = useInView();

  const { data: gameData } = api.game.getGameBySlug.useQuery({ slug });

  const { data: reviewData, isFetching: isReviewFetching } =
    api.review.getReviewByAuthorAndGameId.useQuery({
      authorId: user?.id,
      gameId: gameData?.id,
    });

  const userReviewData = reviewData?.review;

  const {
    data: reviewsData,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = api.review.getReviewsBySlug.useInfiniteQuery(
    {
      slug,
      limit: 12,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const reviews = reviewsData?.pages.flatMap((page) => page.reviews) ?? [];
  const reviewCount =
    reviewsData?.pages.flatMap((page) => page.reviewCount)[0] ?? "";

  const { data: userRatingData, isFetching: isRatingFetching } =
    api.rating.getRatingByAuthorAndGameId.useQuery({
      authorId: user?.id,
      gameId: gameData?.id,
    });

  if (inView && hasNextPage && !isFetching) {
    void fetchNextPage();
  }

  function handleCreateModal() {
    setShowCreateModal(() => !showCreateModal);
  }

  function handleUpdateModal() {
    setShowUpdateModal(() => !showUpdateModal);
  }

  function handleDeleteModal() {
    setShowDeleteModal(() => !showDeleteModal);
  }

  function handleReviewClick(review: ReviewWithUser) {
    setSelectedReview(review);
  }

  let weightedScore = "n/a";

  if (!gameData) return <NotFound />;

  if (gameData.igdbRating !== 0)
    weightedScore = (gameData.igdbRating / 10).toFixed(1);

  // to get the weighted rating

  // if (gameData.igdbRatingCount && gameData.igdbRating) {
  //   const totalReviews = gameData.igdbRatingCount + gameData.overallRatingCount;

  //   if (gameData.overallRatingCount > 0) {
  //     const igdbRatingsRatio = gameData.igdbRatingCount / totalReviews;
  //     const vglistRatingsRatio = gameData.overallRatingCount / totalReviews;

  //     weightedScore = (
  //       gameData.overallRating * vglistRatingsRatio +
  //       gameData.igdbRating * igdbRatingsRatio
  //     ).toFixed(1);
  //   }
  // }

  // 0 is falsy and will not show up if there's no release date
  let releaseDate = 0;

  if (gameData.releaseDate) {
    releaseDate = dayjs.unix(gameData.releaseDate).year();
  }

  return (
    <>
      <Head>
        <title>{gameData.name.toLowerCase()}</title>
      </Head>
      <CreateReviewModal
        game={gameData}
        isOpen={showCreateModal}
        handleClose={handleCreateModal}
      />
      <UpdateReviewModal
        review={selectedReview}
        isOpen={showUpdateModal}
        handleClose={handleUpdateModal}
      />
      <DeleteReviewModal
        review={selectedReview}
        isOpen={showDeleteModal}
        handleClose={handleDeleteModal}
      />
      <PageLayout>
        <div className="py-4 md:flex">
          <div className="flex min-w-fit flex-col pb-4">
            <Image
              src={gameData.cover ? gameData.cover : "/game.png"}
              alt={gameData.name ? gameData.name : "game"}
              width={140}
              height={0}
              className="h-fit w-56 rounded-md border border-zinc-600 border-b-transparent"
              priority
            />
            <div className="w-56">
              <SignedOut>
                <Link href={"/login"}>
                  <button className="mt-2 w-full rounded-md bg-zinc-600 p-1 text-center text-xl transition duration-75 hover:bg-zinc-500">
                    login to review
                  </button>
                </Link>
              </SignedOut>
              <SignedIn>
                {!userRatingData && !isRatingFetching && (
                  <div className="relative mt-2 flex h-fit justify-center rounded-md bg-zinc-600 p-1">
                    <FormRating game={gameData} />
                  </div>
                )}
                {userRatingData && (
                  <div className="relative mt-2 flex h-fit justify-center rounded-md bg-zinc-600 p-1">
                    <FormRating game={gameData} rating={userRatingData} />
                  </div>
                )}
                {!userReviewData && !isReviewFetching && (
                  <button
                    className="mt-2 w-full rounded-md bg-zinc-600 p-1 text-center text-xl transition duration-75 hover:bg-zinc-500"
                    onClick={() => setShowCreateModal(true)}
                  >
                    write a review
                  </button>
                )}
                {userReviewData && (
                  <div onClick={() => handleReviewClick(userReviewData)}>
                    <button
                      className="mt-2 w-full rounded-md bg-zinc-600 p-1 text-center text-xl transition duration-75 hover:bg-zinc-500"
                      onClick={() => setShowUpdateModal(true)}
                    >
                      edit a review
                    </button>
                  </div>
                )}
              </SignedIn>
              <div className="mt-2 h-fit rounded-md bg-zinc-600 p-1 text-center">
                <h3 className="text-xl">average rating</h3>
                <strong className="text-4xl font-semibold">
                  {weightedScore}
                </strong>
              </div>
            </div>
          </div>
          <div className="md:px-8">
            <h1 className="text-4xl font-medium">
              {gameData.name}{" "}
              <span className="text-lg font-normal text-zinc-400">
                {releaseDate ? `(${releaseDate})` : ""}
              </span>
            </h1>
            <p className="py-4 text-lg text-zinc-300">{gameData.summary}</p>
            <h2 className="text-3xl font-medium">Reviews</h2>
            <p className="pt-2 text-zinc-400">
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </p>
            {reviews.map((review) => (
              <div
                key={review.review.id}
                onClick={() => handleReviewClick(review)}
              >
                <div className="min-w-full border-b border-b-zinc-600 pb-4 pt-2 md:flex">
                  <div className="flex items-start justify-between">
                    <Link href={`/users/${review.author.username}`}>
                      <Image
                        src={review.author.profileImageUrl}
                        alt={review.author.username}
                        width={56}
                        height={56}
                        className="mt-2 h-fit max-w-min rounded-md border border-zinc-600 transition hover:brightness-75"
                        priority
                      />
                    </Link>
                    {user?.id === review.author.id && (
                      <button onClick={handleDeleteModal} className="md:hidden">
                        <ExitButton size={16} />
                      </button>
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-1 md:pl-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="pr-4 pt-1 text-lg font-semibold text-zinc-400 transition duration-75 hover:text-zinc-100">
                          <Link href={`/users/${review.author.username}`}>
                            {review.author.username}
                          </Link>
                        </p>
                        {review.review.score && (
                          <Rating
                            SVGclassName="inline -mx-0.5"
                            allowFraction
                            readonly
                            size={22}
                            emptyColor="#a1a1aa"
                            fillColor="#22d3ee"
                            initialValue={review.review.score / 2}
                          />
                        )}
                      </div>

                      {user?.id === review.author.id && (
                        <button
                          onClick={handleDeleteModal}
                          className="hidden md:block"
                        >
                          <ExitButton size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-zinc-300">{review.review.description}</p>
                    {user?.id === review.author.id && (
                      <p
                        className="max-w-fit pt-1 text-zinc-400 hover:text-zinc-100"
                        onClick={handleUpdateModal}
                      >
                        edit review
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isFetching && (
              <div className="flex justify-center pt-4">
                <LoadingSpinner size={40} />
              </div>
            )}
          </div>
        </div>
        <span ref={ref} className={hasNextPage ? "invisible" : "hidden"}>
          intersection observer marker
        </span>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  await ssg.game.getGameBySlug.prefetch({ slug });
  await ssg.review.getReviewsBySlug.prefetchInfinite({ slug, limit: 12 });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default IndividualGamePage;
