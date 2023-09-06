import toast from "react-hot-toast";
import { api, type RouterOutputs } from "~/utils/api";
import { BacklogIcon } from "./icons/backlog";
import { DroppedIcon } from "./icons/dropped";
import { PlayedIcon } from "./icons/played";
import { PlayingIcon } from "./icons/playing";

type Game = RouterOutputs["game"]["getGameBySlug"];

type Status = RouterOutputs["status"]["getStatusByAuthorAndGameId"];

export function Status(props: { game: Game; status?: Status }) {
  const ctx = api.useContext();

  const { mutate: mutateCreate } = api.status.createStatus.useMutation({
    onSuccess: () => {
      void ctx.status.invalidate();
    },
    onError: () => {
      toast.error("can't create this status, please try again");
    },
  });

  const { mutate: mutateUpdate } = api.status.updateStatus.useMutation({
    onSuccess: () => {
      void ctx.status.invalidate();
    },
    onError: () => {
      toast.error("can't update this status, please try again");
    },
  });

  function handlePlaying() {
    if (props.status) {
      mutateUpdate({
        id: props.status.id,
        isPlaying: !props.status.isPlaying,
        hasPlayed: false,
        hasBacklogged: false,
        hasDropped: false,
      });
    } else {
      mutateCreate({
        gameId: props.game.id,
        isPlaying: true,
        hasPlayed: false,
        hasBacklogged: false,
        hasDropped: false,
      });
    }
  }

  function handlePlayed() {
    if (props.status) {
      mutateUpdate({
        id: props.status.id,
        isPlaying: false,
        hasPlayed: !props.status.hasPlayed,
        hasBacklogged: false,
        hasDropped: false,
      });
    } else {
      mutateCreate({
        gameId: props.game.id,
        isPlaying: false,
        hasPlayed: true,
        hasBacklogged: false,
        hasDropped: false,
      });
    }
  }

  function handleBacklog() {
    if (props.status) {
      mutateUpdate({
        id: props.status.id,
        isPlaying: false,
        hasPlayed: false,
        hasBacklogged: !props.status.hasBacklogged,
        hasDropped: false,
      });
    } else {
      mutateCreate({
        gameId: props.game.id,
        isPlaying: false,
        hasPlayed: false,
        hasBacklogged: true,
        hasDropped: false,
      });
    }
  }

  function handleDropped() {
    if (props.status) {
      mutateUpdate({
        id: props.status.id,
        isPlaying: false,
        hasPlayed: false,
        hasBacklogged: false,
        hasDropped: !props.status.hasDropped,
      });
    } else {
      mutateCreate({
        gameId: props.game.id,
        isPlaying: false,
        hasPlayed: false,
        hasBacklogged: false,
        hasDropped: true,
      });
    }
  }

  return (
    <div className="relative mt-2 flex flex-col rounded-md bg-zinc-600 p-2">
      <div className="flex h-fit items-center justify-center gap-2">
        <div
          className="group flex flex-col items-center text-xs"
          onClick={handlePlaying}
        >
          <PlayingIcon
            className={
              props.status?.isPlaying ? "fill-cyan-400 group-hover:fill-cyan-400/60" : "fill-zinc-400 group-hover:fill-zinc-400/50"
            }
          />
          <span className="group-hover:text-zinc-300">playing</span>
        </div>
        <div
          className="group flex flex-col items-center text-xs"
          onClick={handlePlayed}
        >
          <PlayedIcon
            className={
              props.status?.hasPlayed ? "fill-cyan-400 group-hover:fill-cyan-400/60" : "fill-zinc-400 group-hover:fill-zinc-400/50"
            }
          />
          <span className="group-hover:text-zinc-300">played</span>
        </div>
        <div
          className="group flex flex-col items-center text-xs"
          onClick={handleBacklog}
        >
          <BacklogIcon
            className={
              props.status?.hasBacklogged ? "fill-cyan-400 group-hover:fill-cyan-400/60" : "fill-zinc-400 group-hover:fill-zinc-400/50"
            }
          />
          <span className="group-hover:text-zinc-300">backlog</span>
        </div>
        <div
          className="group flex flex-col items-center text-xs"
          onClick={handleDropped}
        >
          <DroppedIcon
            className={
              props.status?.hasDropped
                ? "fill-cyan-400 group-hover:fill-cyan-400/60"
                : "fill-zinc-400 group-hover:fill-zinc-400/50"
            }
            onClick={handleDropped}
          />
          <span className="group-hover:text-zinc-300">dropped</span>
        </div>
      </div>
    </div>
  );
}
