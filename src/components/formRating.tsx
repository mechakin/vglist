import toast from "react-hot-toast";
import { Rating } from "react-simple-star-rating";
import { type RouterOutputs, api } from "~/utils/api";
import { ExitButton } from "./icons/exitButton";
import { useEffect, useState } from "react";

type Game = RouterOutputs["game"]["getGameBySlug"];

type RatingWithUser = RouterOutputs["rating"]["getRatingByAuthorAndGameId"];

export function FormRating(props: { game: Game; rating?: RatingWithUser }) {
  const ctx = api.useContext();
  const [ratingScore, setRatingScore] = useState(0);

  const userRating = props.rating?.rating?.rating.score;

  useEffect(() => {
    if (userRating) {
      setRatingScore(userRating / 2);
    } else {
      setRatingScore(0);
    }
  }, [userRating]);

  const { mutate: mutateCreate } = api.rating.createRating.useMutation({
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
    } else if (ratingScore > 0 && props.rating?.rating?.rating.id) {
      mutateUpdate({
        score: rating * 2,
        gameId: props.game.id,
        id: props.rating.rating.rating.id,
      });
    }
    setRatingScore(rating);
  }

  function handleUserRating() {
    if (props.rating?.rating?.rating.id) {
      mutateDelete({ id: props.rating.rating.rating.id });
    }
  }

  return (
    <div className="flex items-center">
      {props.rating?.rating?.rating.id && (
        <button
          className={ratingScore === 0 ? "hidden" : "absolute left-3 top-1"}
          onClick={handleUserRating}
        >
          <ExitButton size={15} />
        </button>
      )}

      <Rating
        SVGclassName="inline -mx-0.5"
        allowFraction
        size={30}
        emptyColor="#a1a1aa"
        fillColor="#22d3ee"
        onClick={handleRating}
        initialValue={ratingScore}
      />
    </div>
  );
}
