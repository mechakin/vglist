import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";
import { type RouterOutputs, api } from "~/utils/api";
import LoadingSpinner from "./loading";
import { useInView } from "react-intersection-observer";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type FieldErrors, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import { Modal } from "./modal";
import dayjs from "dayjs";
import { ExitButton } from "./exit-button";

type ReviewWithUser =
  RouterOutputs["review"]["getReviewsByUsername"]["reviews"][number];

const schema = z.object({
  score: z.number().min(0).max(5).optional(),
  description: z
    .string()
    .min(1, "review must contain at least one character")
    .max(10000, "review must contain a max of 10000 characters"),
});

type typeSchema = z.infer<typeof schema>;

export default function Review(props: ReviewWithUser) {
  const { user } = useUser();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { register, handleSubmit, control } = useForm<typeSchema>({
    resolver: zodResolver(schema),
  });
  const ctx = api.useContext();

  const { mutate: mutateUpdate, isLoading: isUpdateLoading } =
    api.review.updateReview.useMutation({
      onSuccess: () => {
        setShowUpdateModal(false);
        void ctx.review.invalidate();
      },
      onError: () => {
        toast.error(
          "there was an error in trying to update your review, please try again later"
        );
      },
    });

  const { mutate: mutateDelete, isLoading: isDeleteLoading } =
    api.review.deleteReview.useMutation({
      onSuccess: () => {
        setShowDeleteModal(false);
        void ctx.review.invalidate();
      },
      onError: () => {
        toast.error(
          "there was an error in trying to delete your review, please try again later"
        );
      },
    });

  function handleUpdateModal() {
    setShowUpdateModal(() => !showUpdateModal);
  }

  function handleDeleteModal() {
    setShowDeleteModal(() => !showDeleteModal);
  }

  const { review, author } = props;

  // 0 is falsy and will not show up if there's no release date
  let releaseDate = 0;

  if (props.review.game.releaseDate) {
    releaseDate = dayjs.unix(props.review.game.releaseDate).year();
  }

  function onSubmit(reviewData: typeSchema) {
    if (review.game && reviewData.score) {
      mutateUpdate({
        score: reviewData.score * 2,
        description: reviewData.description,
        id: review.id,
      });
    } else if (review.game) {
      mutateUpdate({
        description: reviewData.description,
        id: review.id,
      });
    }
  }

  function onError(error: FieldErrors<typeSchema>) {
    const descriptionErrorMessage = error.description?.message;
    const scoreErrorMessage = error.score?.message;

    if (descriptionErrorMessage) toast.error(descriptionErrorMessage);
    if (scoreErrorMessage) toast.error(scoreErrorMessage);
  }

  return (
    <>
      {showDeleteModal &&
        createPortal(
          <Modal isOpen={showDeleteModal} handleClose={handleDeleteModal}>
            <div className="flex justify-between">
              <div className="flex items-end">
                <h2 className="text-2xl font-medium">{review.game.name}</h2>
                <span className="pl-2 text-base text-zinc-400">
                  {releaseDate ? `(${releaseDate})` : ""}
                </span>
              </div>
              <button onClick={handleDeleteModal} className="text-2xl">
                <ExitButton />
              </button>
            </div>
            <div className="sm:flex">
              <Image
                src={review.game.cover ? review.game.cover : "/game.png"}
                alt={review.game.name ? review.game.name : "game"}
                width={120}
                height={0}
                className="mt-4 hidden h-fit w-fit rounded-md border border-zinc-600 border-b-transparent sm:block"
              />

              <div className="flex flex-col pt-4 text-2xl sm:pl-4">
                are you sure you want to delete your review?
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                className="mr-2 rounded-md bg-zinc-500 px-2 text-xl transition duration-75 hover:bg-zinc-400"
                onClick={handleDeleteModal}
              >
                cancel
              </button>
              <button
                className="rounded-md bg-red-700 px-2 text-xl transition duration-75 hover:bg-red-600"
                onClick={() => mutateDelete({ id: review.id })}
              >
                delete
              </button>
              {isDeleteLoading && (
                <span className="pl-2 pt-2">
                  <LoadingSpinner />
                </span>
              )}
            </div>
          </Modal>,
          document.getElementById("portal") as HTMLDivElement
        )}
      {showUpdateModal &&
        createPortal(
          <Modal isOpen={showUpdateModal} handleClose={handleUpdateModal}>
            <form
              onSubmit={(event) => void handleSubmit(onSubmit, onError)(event)}
            >
              <div className="flex justify-between">
                <div className="flex items-end">
                  <h2 className="text-2xl font-medium">{review.game.name}</h2>
                  <span className="pl-2 text-base text-zinc-400">
                    {releaseDate ? `(${releaseDate})` : ""}
                  </span>
                </div>
                <button onClick={handleUpdateModal} className="text-2xl">
                  <ExitButton />
                </button>
              </div>
              <div className="sm:flex">
                <Image
                  src={review.game.cover ? review.game.cover : "/game.png"}
                  alt={review.game.name ? review.game.name : "game"}
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
                  onClick={handleUpdateModal}
                >
                  cancel
                </button>
                <button className="rounded-md bg-cyan-700 px-2 text-xl transition duration-75 hover:bg-cyan-600">
                  update
                </button>
              </div>
            </form>
          </Modal>,
          document.getElementById("portal") as HTMLDivElement
        )}

      <div className="border-b border-b-zinc-600 py-4 md:flex">
        <div className="flex items-start justify-between">
          <Link href={`/games/${review.game.slug}`}>
            <Image
              src={review.game.cover ? review.game.cover : "/game.png"}
              alt={review.game.name ? review.game.name : "game"}
              width={120}
              height={0}
              className="mb-2 h-fit max-w-min rounded-md border border-zinc-600 transition hover:brightness-50 "
            />
          </Link>
          {user?.id === author.id && (
            <button onClick={handleDeleteModal} className="md:hidden">
              <ExitButton />
            </button>
          )}
        </div>

        <div className="-mt-1 flex w-full flex-col md:px-8">
          <div className="flex w-full justify-between pb-1">
            <h3 className="flex max-w-fit text-2xl font-medium transition duration-75 hover:text-zinc-400">
              <Link href={`/games/${review.game.slug}`}>
                {review.game.name}
              </Link>
            </h3>
            {user?.id === author.id && (
              <button onClick={handleDeleteModal} className="hidden md:block">
                <ExitButton />
              </button>
            )}
          </div>
          <div className="flex items-center pb-3">
            <Image
              src={author.profileImageUrl}
              alt={author.username}
              width={35}
              height={0}
              className="mr-4 mt-2 h-fit max-w-min rounded-md border border-zinc-600 transition hover:brightness-50"
            />
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
          <p>{review.description}</p>
          {user?.id === author.id && (
            <button
              className="mt-4 flex max-w-fit text-zinc-400 hover:text-zinc-100"
              onClick={handleUpdateModal}
            >
              edit review
            </button>
          )}
          {isUpdateLoading && (
            <span className="pl-2 pt-2">
              <LoadingSpinner />
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export const ReviewFeed = (props: { username?: string; cap?: boolean }) => {
  const { ref, inView } = useInView();

  if (props.username && props.cap) {
    const { data } = api.review.getLatestReviewsByUsername.useQuery({
      username: props.username,
    });

    if (data)
      return (
        <>
          {data.reviews.map((review) => (
            <Review key={review.review.id} {...review} />
          ))}
        </>
      );
  }

  if (props.username && !props.cap) {
    const { data, hasNextPage, fetchNextPage, isFetching } =
      api.review.getReviewsByUsername.useInfiniteQuery(
        {
          username: props.username,
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
        {reviews.map((review) => {
          return <Review key={review.review.id} {...review} />;
        })}
        {isFetching && (
          <div className="pt-4">
            <LoadingSpinner size={55} />
          </div>
        )}
        {reviews.length === 0 && !isFetching && reviews[0]?.author.username && (
          <div className="py-2 text-lg text-zinc-300">{`${reviews[0]?.author.username} hasn't reviewed a game :(`}</div>
        )}
        <span ref={ref} className={hasNextPage ? "invisible" : "hidden"}>
          intersection observer marker
        </span>
      </>
    );
  }

  const { data } = api.review.getRecentReviews.useQuery();

  if (!data || data.reviews.length === 0) return <div />;

  return (
    <>
      {data.reviews.map((fullReview) => (
        <Review {...fullReview} key={fullReview.review.id} />
      ))}
    </>
  );
};
