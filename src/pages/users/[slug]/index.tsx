import { type GetStaticProps, type NextPage } from "next";
import Image from "next/image";
import { type RouterOutputs, api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Link from "next/link";
import NotFound from "~/components/404";
import Profile from "~/components/profile";
import { ReviewFeed } from "~/components/review";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { type FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPortal } from "react-dom";
import { Modal } from "~/components/modal";
import LoadingSpinner from "~/components/icons/loading";
import { ExitButton } from "~/components/icons/exitButton";
import dayjs from "dayjs";

type Bio = RouterOutputs["profile"]["getBioByUsername"];

const schema = z.object({
  bio: z.string().max(1000, "review must contain a max of 1000 characters"),
});

type typeSchema = z.infer<typeof schema>;

function onError(error: FieldErrors<typeSchema>) {
  const bioErrorMessage = error.bio?.message;

  if (bioErrorMessage) toast.error(bioErrorMessage);
}

export function BioModal(props: {
  bio: Bio | null | undefined;
  isOpen: boolean;
  handleClose: () => void;
}) {
  const {
    register: registerBio,
    handleSubmit: handleBioSubmit,
    watch: watchBio,
  } = useForm<typeSchema>({
    resolver: zodResolver(schema),
  });

  const ctx = api.useContext();

  const { mutate: mutateCreate, isLoading: isCreateLoading } =
    api.profile.createBio.useMutation({
      onSuccess: () => {
        void ctx.profile.getBioByUsername.invalidate();
        props.handleClose();
      },
      onError: () => {
        toast.error("can't edit this bio, please try again");
      },
    });

  const { mutate: mutateUpdate, isLoading: isUpdateLoading } =
    api.profile.updateBio.useMutation({
      onSuccess: () => {
        void ctx.profile.getBioByUsername.invalidate();
        props.handleClose();
      },
      onError: () => {
        toast.error("can't update this bio, please try again");
      },
    });

  function onSubmit(reviewData: typeSchema) {
    if (props.bio) {
      mutateUpdate({
        bio: reviewData.bio,
      });
    } else {
      mutateCreate({
        bio: reviewData.bio,
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
                void handleBioSubmit(onSubmit, onError)(event)
              }
            >
              <div className="flex justify-between">
                <div className="flex items-end">
                  <h2 className="text-2xl font-medium">edit bio</h2>
                </div>
                <button onClick={props.handleClose} className="text-2xl">
                  <ExitButton />
                </button>
              </div>
              <div className="sm:flex">
                <div className="flex flex-col pt-4">
                  <textarea
                    cols={150}
                    rows={8}
                    className="w-full overflow-auto rounded-md bg-zinc-300 p-2 text-zinc-900 outline-none"
                    {...registerBio("bio")}
                    defaultValue={props.bio?.bio}
                  ></textarea>
                  <p className="flex w-full justify-end pt-1">
                    {watchBio("bio")
                      ? `${watchBio("bio").length} / 1000`
                      : "0 / 1000"}
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
                  edit
                </button>
                {(isCreateLoading || isUpdateLoading) && (
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

const Bio = (props: { username: string }) => {
  const { data } = api.profile.getBioByUsername.useQuery({
    username: props.username,
  });
  const { user } = useUser();

  const [openModal, setOpenModal] = useState(false);

  function handleModal() {
    setOpenModal(() => !openModal);
  }

  return (
    <>
      {(data?.bio || user?.username === props.username) && (
        <p className="text-xl">bio</p>
      )}
      <section className=" overflow-hidden text-ellipsis text-zinc-300">
        {data?.bio}
      </section>
      {user?.username === props.username && (
        <>
          <button className="pt-1 text-zinc-400" onClick={handleModal}>
            edit bio
          </button>
          <BioModal isOpen={openModal} handleClose={handleModal} bio={data} />
        </>
      )}
    </>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  const { data: scoreData } = api.rating.getAverageScoreByUsername.useQuery({
    username,
  });

  const { data: countData } = api.status.getGamesPlayedCountByUsername.useQuery(
    { username }
  );

  const { data: recentGameData } =
    api.status.getRecentlyPlayedByUsername.useQuery({
      username,
    });

  if (!data) return <NotFound />;

  return (
    <PageLayout>
      <Profile username={username} />
      <nav className="my-4 flex h-8 w-full rounded-md bg-zinc-500 px-2 align-middle text-zinc-300">
        <ul className="flex py-1 font-medium">
          <li className="px-4 text-zinc-100 underline decoration-2 underline-offset-8">
            <Link href={`/users/${username}`} className="py-2">
              profile
            </Link>
          </li>
          <li className="px-4 decoration-2 underline-offset-8 hover:text-zinc-100 hover:underline">
            <Link href={`/users/${username}/games`} className="py-2">
              games
            </Link>
          </li>
          <li className="px-4 decoration-2 underline-offset-8 hover:text-zinc-100 hover:underline">
            <Link href={`/users/${username}/reviews`} className="py-2">
              reviews
            </Link>
          </li>
        </ul>
      </nav>
      <div className="md:flex">
        <div className="rounded-md pt-2 md:w-64">
          <div className="text-xl ">games played</div>
          <section className="pb-4 text-4xl font-medium text-zinc-300">
            {countData}
          </section>
          <div className="text-xl">average score</div>
          <section className="text-4xl font-medium text-zinc-300">
            {scoreData?._avg.score?.toFixed(1)
              ? scoreData?._avg.score?.toFixed(1)
              : "n/a"}
          </section>
          <div className="py-4">
            <Bio username={username} />
          </div>
        </div>
        <div className="w-full md:px-4">
          <div className="flex flex-col">
            <h2 className="pb-4 text-3xl font-medium">recently played</h2>
            {recentGameData?.length === 0 && (
              <p className="text-lg text-zinc-300">
                {username} hasn{"'"}t played a game :{"("}
              </p>
            )}
            <div className="grid max-w-fit grid-cols-2 gap-4 pb-8 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {recentGameData?.map((recentGame) => (
                <div key={recentGame.gameId}>
                  <Link href={`/games/${recentGame.game.slug}`}>
                    <Image
                      src={
                        recentGame.game.cover
                          ? recentGame.game.cover
                          : "/game.webp"
                      }
                      alt={recentGame.game.name ? recentGame.game.name : "game"}
                      width={120}
                      height={0}
                      className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
                      priority
                    />
                  </Link>
                  <div className="flex items-center justify-center">
                    <span className="pt-1 text-zinc-300">
                      {dayjs(recentGame.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <h2 className="pb-2 text-3xl font-medium">recently reviewed</h2>
          <ReviewFeed username={username} cap={true} />
        </div>
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
  await ssg.review.getLatestReviewsByUsername.prefetch({ username });
  await ssg.rating.getAverageScoreByUsername.prefetch({ username });
  await ssg.profile.getBioByUsername.prefetch({ username });
  await ssg.status.getGamesPlayedCountByUsername.prefetch({ username });
  await ssg.status.getRecentlyPlayedByUsername.prefetch({ username });

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

export default ProfilePage;
