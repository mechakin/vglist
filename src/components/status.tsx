import toast from "react-hot-toast";
import { type RouterOutputs, api } from "~/utils/api";
import { useEffect, useState } from "react";
import { PlayingIcon } from "./icons/playing";
import { PlayedIcon } from "./icons/played";
import { BacklogIcon } from "./icons/backlog";
import { DroppedIcon } from "./icons/dropped";

type Game = RouterOutputs["game"]["getGameBySlug"];

type RatingWithUser = RouterOutputs["rating"]["getRatingByAuthorAndGameId"];

export function Status(props: { game: Game; rating?: RatingWithUser }) {
  const ctx = api.useContext();
  const [ratingScore, setRatingScore] = useState(0);

  const userRatingScore = props.rating?.rating?.score;
  const userRatingId = props.rating?.rating?.id;

  useEffect(() => {
    if (userRatingScore) {
      setRatingScore(userRatingScore / 2);
    } else {
      setRatingScore(0);
    }
  }, [userRatingScore]);

  const { mutate: mutateCreate } = api.rating.createRatingAndStatus.useMutation({
    onSuccess: () => {
      void ctx.rating.invalidate();
    },
    onError: () => {
      toast.error("can't review this game, please try again");
    },
  });

  const { mutate: mutateUpdate } = api.rating.updateRating.useMutation({
    onSuccess: () => {
      void ctx.rating.invalidate();
    },
    onError: () => {
      toast.error("can't update this review, please try again");
    },
  });

  const { mutate: mutateDelete } = api.rating.deleteRating.useMutation({
    onSuccess: () => {
      void ctx.rating.invalidate();
    },
    onError: () => {
      toast.error("can't delete this review, please try again");
    },
  });

  function handleRating(rating: number) {
    if (ratingScore === 0) {
      mutateCreate({ score: rating * 2, gameId: props.game.id });
    } else if (ratingScore > 0 && userRatingId) {
      mutateUpdate({
        score: rating * 2,
        gameId: props.game.id,
        id: userRatingId,
      });
    }
    setRatingScore(rating);
  }

  function handleUserRating() {
    if (userRatingId) {
      mutateDelete({ id: userRatingId });
    }
  }

  return (
    <div className="relative mt-2 flex flex-col rounded-md bg-zinc-600 p-2">
      <div className="flex h-fit items-center justify-center gap-2">
        <div className="group flex flex-col items-center text-xs">
          <PlayingIcon className="fill-zinc-400 group-hover:fill-cyan-400" />
          <span>playing</span>
        </div>
        <div className="group flex flex-col items-center text-xs">
          <PlayedIcon className="fill-zinc-400 group-hover:fill-cyan-400" />
          <span>played</span>
        </div>
        <div className="group flex flex-col items-center text-xs">
          <BacklogIcon className="fill-zinc-400 group-hover:fill-cyan-400" />
          <span>backlog</span>
        </div>
        <div className="group flex flex-col items-center text-xs">
          <DroppedIcon className="fill-zinc-400 group-hover:fill-cyan-400" />
          <span>dropped</span>
        </div>
      </div>
    </div>
  );
}
