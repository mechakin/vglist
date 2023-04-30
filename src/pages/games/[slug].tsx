import { type GetStaticProps, type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useState } from "react";
import { createPortal } from "react-dom";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import NotFound from "~/components/404";
import dayjs from "dayjs";
import Head from "next/head";
import { type FieldErrors, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "~/components/loading";
import { useInView } from "react-intersection-observer";
import { Modal } from "~/components/modal";
import { ExitButton } from "~/components/exit-button";

const schema = z.object({
  score: z.number().min(0).max(5).optional(),
  description: z
    .string()
    .min(1, "review must contain at least one character")
    .max(10000, "review must contain a max of 10000 characters"),
});

type typeSchema = z.infer<typeof schema>;

const IndividualGamePage: NextPage<{ slug: string }> = ({ slug }) => {
  const [showModal, setShowModal] = useState(false);
  const { ref, inView } = useInView();

  const ctx = api.useContext();

  const { register, handleSubmit, control } = useForm<typeSchema>({
    resolver: zodResolver(schema),
  });

  const { mutate, isLoading } = api.review.createReview.useMutation({
    onSuccess: () => {
      setShowModal(false);
      void ctx.review.getReviewsByGameId.invalidate();
    },
    onError: () => {
      toast.error(
        "edit or delete an existing review before creating a new one"
      );
    },
  });

  const { data: gameData } = api.game.getGameBySlug.useQuery({ slug });

  if (!gameData) return <NotFound />;

  const {
    data: reviewsData,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = api.review.getReviewsByGameId.useInfiniteQuery(
    {
      gameId: gameData.id,
      limit: 12,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const reviews = reviewsData?.pages.flatMap((page) => page.reviews) ?? [];

  if (inView && hasNextPage && !isFetching) {
    void fetchNextPage();
  }

  function onSubmit(reviewData: typeSchema) {
    if (gameData && reviewData.score) {
      mutate({
        score: reviewData.score * 2,
        description: reviewData.description,
        gameId: gameData?.id,
      });
    } else if (gameData) {
      mutate({
        description: reviewData.description,
        gameId: gameData?.id,
      });
    }
  }

  function onError(error: FieldErrors<typeSchema>) {
    const descriptionErrorMessage = error.description?.message;
    const scoreErrorMessage = error.score?.message;

    if (descriptionErrorMessage) toast.error(descriptionErrorMessage);
    if (scoreErrorMessage) toast.error(scoreErrorMessage);
  }

  function handleModal() {
    setShowModal(() => !showModal);
  }

  let weightedScore = (gameData.igdbRating / 10).toFixed(1);

  if (gameData.igdbRatingCount && gameData.igdbRating) {
    const totalReviews = gameData.igdbRatingCount + gameData.overallRatingCount;

    if (gameData.overallRatingCount > 0) {
      const igdbRatingsRatio = gameData.igdbRatingCount / totalReviews;
      const vglistRatingsRatio = gameData.overallRatingCount / totalReviews;

      weightedScore = (
        gameData.overallRating * vglistRatingsRatio +
        gameData.igdbRating * igdbRatingsRatio
      ).toFixed(1);
    }
  }

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
      {showModal &&
        createPortal(
          <Modal isOpen={showModal} handleClose={handleModal}>
            <form
              onSubmit={(event) => void handleSubmit(onSubmit, onError)(event)}
            >
              <div className="flex justify-between">
                <div className="flex items-end">
                  <h2 className="text-2xl font-medium">{gameData.name}</h2>
                  <span className="pl-2 text-base text-zinc-400">
                    {releaseDate ? `(${releaseDate})` : ""}
                  </span>
                </div>
                <button onClick={handleModal} className="text-2xl">
                  <ExitButton />
                </button>
              </div>
              <div className="sm:flex">
                <Image
                  src={gameData.cover ? gameData.cover : "/game.png"}
                  alt={gameData.name}
                  width={120}
                  height={0}
                  className="mt-4 hidden h-fit w-fit rounded-md border border-zinc-600 border-b-transparent sm:block"
                />
                <div className="flex flex-col pt-4 text-xl sm:pl-4">
                  <p>rating</p>
                  <Controller
                    name="score"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Rating
                        SVGclassName="inline -mx-0.5"
                        allowFraction
                        size={30}
                        transition={false}
                        emptyColor="#a1a1aa"
                        fillColor="#22d3ee"
                        initialValue={value}
                        onClick={onChange}
                        tooltipArray={[]}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col pt-4 sm:pl-4">
                  <p className="pb-2 text-xl">review</p>
                  <textarea
                    cols={100}
                    rows={5}
                    className="w-full overflow-auto rounded-md bg-zinc-400 p-2 text-zinc-800 outline-none"
                    {...register("description")}
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  className="mr-2 rounded-md bg-zinc-500 px-2 text-xl transition duration-75 hover:bg-zinc-400"
                  onClick={handleModal}
                >
                  cancel
                </button>
                <button className="rounded-md bg-cyan-700 px-2 text-xl transition duration-75 hover:bg-cyan-600">
                  review
                </button>
                {isLoading && (
                  <span className="pl-2 pt-2">
                    <LoadingSpinner />
                  </span>
                )}
              </div>
            </form>
          </Modal>,
          document.getElementById("portal") as HTMLDivElement
        )}
      <PageLayout>
        <div className="py-4 md:flex">
          <div className="flex min-w-max flex-col pb-4">
            <Image
              src={gameData.cover ? gameData.cover : "/game.png"}
              alt={gameData.name}
              width={140}
              height={0}
              className="h-fit w-56 rounded-md border border-zinc-600 border-b-transparent"
              priority
            />
            <div className="w-56 md:w-auto">
              <SignedOut>
                <Link href={"/login"}>
                  <button className="mt-2 w-full rounded-md bg-zinc-600 p-1 text-center text-xl transition duration-75 hover:bg-zinc-500">
                    login to review
                  </button>
                </Link>
              </SignedOut>
              <SignedIn>
                <div className="mt-2 h-fit rounded-md bg-zinc-600 p-1 px-12">
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
                <button
                  className="mt-2 w-full rounded-md bg-zinc-600 p-1 text-center text-xl transition duration-75 hover:bg-zinc-500"
                  onClick={() => setShowModal(true)}
                >
                  write a review
                </button>
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
            {reviews.map((review) => (
              <div
                className="border-b border-b-zinc-600 py-4 md:flex"
                key={review.review.id}
              >
                <Link href={`users/${review.author.username}`}>
                  <Image
                    src={review.author.profileImageUrl}
                    alt={review.author.username}
                    width={56}
                    height={56}
                    className="mt-2 h-fit max-w-min rounded-md border border-zinc-600 transition hover:brightness-75"
                    priority
                  />
                </Link>
                <div className="flex flex-col gap-1 md:pl-4">
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
                        transition={false}
                        emptyColor="#a1a1aa"
                        fillColor="#22d3ee"
                        initialValue={review.review.score / 2}
                        tooltipArray={[]}
                      />
                    )}
                  </div>
                  <p className="text-zinc-300">{review.review.description}</p>
                </div>
              </div>
            ))}
            {isFetching && <LoadingSpinner size={55} />}
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
