import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";
import { type RouterOutputs, api } from "~/utils/api";
import LoadingSpinner from "./icons/loading";
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
import { ExitButton } from "./icons/exitButton";

type ReviewWithUser =
  RouterOutputs["review"]["getReviewsByUsername"]["reviews"][number];

type Game = RouterOutputs["game"]["getGameBySlug"];

const schema = z.object({
  score: z.number().min(0).max(5).optional(),
  description: z
    .string()
    .min(1, "review must contain at least one character")
    .max(10000, "review must contain a max of 10000 characters"),
});

type typeSchema = z.infer<typeof schema>;

function onError(error: FieldErrors<typeSchema>) {
  const descriptionErrorMessage = error.description?.message;
  const scoreErrorMessage = error.score?.message;

  if (descriptionErrorMessage) toast.error(descriptionErrorMessage);
  if (scoreErrorMessage) toast.error(scoreErrorMessage);
}

export function CreateReviewModal(props: {
  game: Game;
  isOpen: boolean;
  handleClose: () => void;
}) {
  const {
    register: registerCreateReview,
    handleSubmit: handleCreateReviewSubmit,
    control: createReviewControl,
    watch: watchCreate,
  } = useForm<typeSchema>({
    resolver: zodResolver(schema),
  });

  const ctx = api.useContext();

  const { mutate, isLoading } = api.review.createReview.useMutation({
    onSuccess: () => {
      props.handleClose();
      void ctx.review.invalidate();
    },
    onError: () => {
      toast.error("a review for this game already exists");
    },
  });

  // 0 is falsy and will not show up if there's no release date
  let releaseDate = 0;

  if (props.game.releaseDate) {
    releaseDate = dayjs.unix(props.game.releaseDate).year();
  }

  function onSubmit(reviewData: typeSchema) {
    if (props.game.id && reviewData.score) {
      mutate({
        score: reviewData.score * 2,
        description: reviewData.description,
        gameId: props.game.id,
      });
    } else if (props.game.id) {
      mutate({
        description: reviewData.description,
        gameId: props.game.id,
      });
    }
  }

  return (
    <>
      {props.isOpen &&
        createPortal(
          <Modal isOpen={props.isOpen} handleClose={props.handleClose}>
            <form
              onSubmit={(event) =>
                void handleCreateReviewSubmit(onSubmit, onError)(event)
              }
            >
              <div className="flex justify-between">
                <div className="flex items-end">
                  <h2 className="text-2xl font-medium">{props.game.name}</h2>
                  <span className="pl-2 text-base text-zinc-400">
                    {releaseDate ? `(${releaseDate})` : ""}
                  </span>
                </div>
                <button onClick={props.handleClose} className="text-2xl">
                  <ExitButton />
                </button>
              </div>
              <div className="sm:flex">
                <Image
                  src={props.game.cover ? props.game.cover : "/game.webp"}
                  alt={props.game.name ? props.game.name : "game"}
                  width={120}
                  height={0}
                  className="mt-4 hidden h-fit w-fit rounded-md border border-zinc-600 border-b-transparent sm:block"
                />
                <div className="flex flex-col pt-4 text-xl sm:pl-4">
                  <p>rating</p>
                  <Controller
                    name="score"
                    control={createReviewControl}
                    render={({ field: { onChange, value } }) => (
                      <Rating
                        SVGclassName="inline -mx-0.5"
                        allowFraction
                        size={30}
                        emptyColor="#a1a1aa"
                        fillColor="#22d3ee"
                        initialValue={value}
                        onClick={onChange}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col pt-4 sm:pl-4">
                  <p className="pb-2 text-xl">review</p>
                  <textarea
                    cols={100}
                    rows={5}
                    className="w-full overflow-auto rounded-md bg-zinc-300 p-2 text-zinc-900 outline-none"
                    {...registerCreateReview("description")}
                  ></textarea>
                  <p className="flex w-full justify-end pt-1">
                    {watchCreate("description")
                      ? `${watchCreate("description").length} / 10000`
                      : "0/10000"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  className="mr-2 rounded-md bg-zinc-500 px-2 text-xl transition duration-75 hover:bg-zinc-400"
                  onClick={props.handleClose}
                >
                  cancel
                </button>
                <button className="rounded-md bg-cyan-700 px-2 text-xl transition duration-75 hover:bg-cyan-600">
                  create
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
    </>
  );
}

export function UpdateReviewModal(props: {
  review: ReviewWithUser;
  isOpen: boolean;
  handleClose: () => void;
}) {
  const ctx = api.useContext();

  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    control: updateControl,
    watch: watchUpdate,
  } = useForm<typeSchema>({
    resolver: zodResolver(schema),
  });

  const { mutate, isLoading } = api.review.updateReview.useMutation({
    onSuccess: () => {
      props.handleClose();
      void ctx.review.invalidate();
    },
    onError: () => {
      toast.error(
        "there was an error in trying to update your review, please try again later"
      );
    },
  });

  const { review } = props;

  function onSubmit(reviewData: typeSchema) {
    if (review.review.game.id && reviewData.score) {
      mutate({
        score: reviewData.score * 2,
        description: reviewData.description,
        id: review.review.id,
      });
    } else if (review.review.game.id) {
      mutate({
        description: reviewData.description,
        id: review.review.id,
      });
    }
  }

  // 0 is falsy and will not show up if there's no release date
  let releaseDate = 0;

  if (review.review.game.releaseDate) {
    releaseDate = dayjs.unix(review.review.game.releaseDate).year();
  }

  return (
    <>
      {props.isOpen &&
        createPortal(
          <Modal isOpen={props.isOpen} handleClose={props.handleClose}>
            <form
              onSubmit={(event) =>
                void handleUpdateSubmit(onSubmit, onError)(event)
              }
            >
              <div className="flex justify-between">
                <div className="flex items-end">
                  <h2 className="text-2xl font-medium">
                    {review.review.game.name}
                  </h2>
                  <span className="pl-2 text-base text-zinc-400">
                    {releaseDate ? `(${releaseDate})` : ""}
                  </span>
                </div>
                <button onClick={props.handleClose} className="text-2xl">
                  <ExitButton />
                </button>
              </div>
              <div className="sm:flex">
                <Image
                  src={
                    review.review.game.cover
                      ? review.review.game.cover
                      : "/game.webp"
                  }
                  alt={
                    review.review.game.name ? review.review.game.name : "game"
                  }
                  width={120}
                  height={0}
                  className="mt-4 hidden h-fit w-fit rounded-md border border-zinc-600 border-b-transparent sm:block"
                />
                <div className="flex flex-col pt-4 text-xl sm:pl-4">
                  <p>rating</p>
                  <Controller
                    name="score"
                    control={updateControl}
                    render={({ field: { onChange, value } }) => (
                      <Rating
                        SVGclassName="inline -mx-0.5"
                        allowFraction
                        size={30}
                        emptyColor="#a1a1aa"
                        fillColor="#22d3ee"
                        initialValue={
                          review.review.score ? review.review.score / 2 : value
                        }
                        onClick={onChange}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col pt-4 sm:pl-4">
                  <p className="pb-2 text-xl">review</p>
                  <textarea
                    cols={100}
                    rows={5}
                    className="w-full overflow-auto rounded-md bg-zinc-300 p-2 text-zinc-900 placeholder-zinc-500 outline-none"
                    {...registerUpdate("description")}
                    placeholder={review.review.description}
                  ></textarea>
                  <p className="flex w-full justify-end pt-1">
                    {watchUpdate("description")
                      ? `${watchUpdate("description").length} / 10000`
                      : "0/10000"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  className="mr-2 rounded-md bg-zinc-500 px-2 text-xl transition duration-75 hover:bg-zinc-400"
                  onClick={props.handleClose}
                >
                  cancel
                </button>
                <button className="rounded-md bg-cyan-700 px-2 text-xl transition duration-75 hover:bg-cyan-600">
                  update
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
    </>
  );
}

export const DeleteReviewModal = (props: {
  review: ReviewWithUser;
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const ctx = api.useContext();

  const { mutate: mutateDelete, isLoading: isDeleteLoading } =
    api.review.deleteReview.useMutation({
      onSuccess: () => {
        props.handleClose();
        void ctx.review.invalidate();
      },
      onError: () => {
        toast.error(
          "there was an error in trying to delete your review, please try again later"
        );
      },
    });

  const { review } = props;

  // 0 is falsy and will not show up if there's no release date
  let releaseDate = 0;

  if (review.review.game.releaseDate) {
    releaseDate = dayjs.unix(review.review.game.releaseDate).year();
  }

  return (
    <>
      {props.isOpen &&
        createPortal(
          <Modal isOpen={props.isOpen} handleClose={props.handleClose}>
            <div className="flex justify-between">
              <div className="flex items-end">
                <h2 className="text-2xl font-medium">
                  {review.review.game.name}
                </h2>
                <span className="pl-2 text-base text-zinc-400">
                  {releaseDate ? `(${releaseDate})` : ""}
                </span>
              </div>
              <button onClick={props.handleClose} className="text-2xl">
                <ExitButton />
              </button>
            </div>
            <div className="sm:flex">
              <Image
                src={
                  review.review.game.cover
                    ? review.review.game.cover
                    : "/game.webp"
                }
                alt={review.review.game.name ? review.review.game.name : "game"}
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
                onClick={props.handleClose}
              >
                cancel
              </button>
              <button
                className="rounded-md bg-red-700 px-2 text-xl transition duration-75 hover:bg-red-600"
                onClick={() => mutateDelete({ id: review.review.id })}
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
    </>
  );
};

export default function Review(props: ReviewWithUser) {
  const { user } = useUser();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function handleUpdateModal() {
    setShowUpdateModal(() => !showUpdateModal);
  }

  function handleDeleteModal() {
    setShowDeleteModal(() => !showDeleteModal);
  }

  const { review, author } = props;

  return (
    <>
      <DeleteReviewModal
        review={props}
        isOpen={showDeleteModal}
        handleClose={handleDeleteModal}
      />
      <UpdateReviewModal
        review={props}
        isOpen={showUpdateModal}
        handleClose={handleUpdateModal}
      />
      <div className="border-b border-b-zinc-600 py-4 md:flex">
        <div className="flex items-start justify-between">
          <Link href={`/games/${review.game.slug}`}>
            <Image
              src={review.game.cover ? review.game.cover : "/game.webp"}
              alt={review.game.name ? review.game.name : "game"}
              width={120}
              height={0}
              className="mb-4 h-fit max-w-min rounded-md border border-zinc-600 transition hover:brightness-50 md:mb-2 "
              priority
            />
          </Link>
          {user?.id === author.id && (
            <button onClick={handleDeleteModal} className="md:hidden">
              <ExitButton size={16} />
            </button>
          )}
        </div>

        <div className="-mt-1 flex w-full flex-col md:pl-8">
          <div className="flex w-full justify-between pb-1">
            <h3 className="flex max-w-fit text-2xl font-medium transition duration-75 hover:text-zinc-400">
              <Link href={`/games/${review.game.slug}`}>
                {review.game.name}
              </Link>
            </h3>
            {user?.id === author.id && (
              <button
                onClick={handleDeleteModal}
                className="ml-4 hidden md:block"
              >
                <ExitButton size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center pb-3">
            <Link href={`/users/${author.username}`}>
              <Image
                src={author.profileImageUrl}
                alt={author.username}
                width={35}
                height={0}
                className="mr-4 mt-2 h-fit max-w-min rounded-md border border-zinc-600 transition hover:brightness-50"
                priority
              />
            </Link>

            <p className="pr-4 pt-1 font-semibold text-zinc-400 transition duration-75 hover:text-zinc-100">
              <Link href={`/users/${author.username}`}>{author.username}</Link>
            </p>
            {review.score && (
              <Rating
                SVGclassName="inline -mx-0.5"
                allowFraction
                readonly
                size={22}
                emptyColor="#a1a1aa"
                fillColor="#22d3ee"
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
          {data.reviews.length === 0 && props.username && (
            <div className="py-2 text-lg text-zinc-300">{`${props.username} hasn't reviewed a game :(`}</div>
          )}
        </>
      );
  }

  if (props.username && !props.cap) {
    const { data, hasNextPage, fetchNextPage, isFetching, isLoading } =
      api.review.getReviewsByUsername.useInfiniteQuery(
        { username: props.username },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      );

    const reviews = data?.pages.flatMap((page) => page.reviews) ?? [];

    if (inView && hasNextPage && !isFetching) {
      void fetchNextPage();
    }

    return (
      <>
        {reviews.map((review) => (
          <Review key={review.review.id} {...review} />
        ))}
        {reviews.length === 0 && props.username && (
          <div className="py-2 text-lg text-zinc-300">{`${props.username} hasn't reviewed a game :(`}</div>
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
