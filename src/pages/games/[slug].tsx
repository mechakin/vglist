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

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  children: React.ReactNode;
};

function Modal(props: Props) {
  if (!props.isOpen) return null;

  return (
    <>
      <div
        className="fixed left-0 top-0 z-40 h-screen w-screen bg-zinc-800 opacity-75"
        onClick={props.handleClose}
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-11/12 -translate-x-1/2 -translate-y-1/2 justify-center  rounded-md bg-zinc-600 p-4 md:top-1/3 md:w-10/12 lg:w-9/12 xl:w-7/12 2xl:w-6/12 3xl:w-5/12">
        {props.children}
      </div>
    </>
  );
}

const IndividualGamePage: NextPage<{ slug: string }> = ({ slug }) => {
  const [showModal, setShowModal] = useState(false);
  const { data } = api.game.getGameBySlug.useQuery({ slug });

  if (!data) return <NotFound />;

  function handleModal() {
    setShowModal(() => !showModal);
  }

  let weightedScore = (data.igdbRating / 10).toFixed(1);

  if (data.igdbRatingCount && data.igdbRating) {
    const totalReviews = data.igdbRatingCount + data.ratingCount;

    if (data.ratingCount > 0) {
      const igdbRatingsRatio = data.igdbRatingCount / totalReviews;
      const vglistRatingsRatio = data.ratingCount / totalReviews;

      weightedScore = (
        data.rating * vglistRatingsRatio +
        data.igdbRating * igdbRatingsRatio
      ).toFixed(1);
    }
  }

  // 0 is falsy and will not show up if there's no release date
  let releaseDate = 0;

  if (data.releaseDate) {
    releaseDate = dayjs.unix(data.releaseDate).year();
  }

  return (
    <>
      <Head>
        <title>{data.name.toLowerCase()}</title>
      </Head>
      {showModal &&
        createPortal(
          <Modal isOpen={showModal} handleClose={handleModal}>
            <div className="flex justify-between">
              <div className="flex items-end">
                <h2 className="text-2xl font-medium">{data.name}</h2>
                <span className="text-md pl-2 text-zinc-400">
                  {releaseDate ? `(${releaseDate})` : "n/a"}
                </span>
              </div>
              <button onClick={handleModal} className="text-2xl">
                <svg
                  height="20px"
                  width="20px"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 460.775 460.775"
                  xmlSpace="preserve"
                  className="fill-zinc-400 transition duration-75 hover:fill-zinc-100"
                >
                  <path
                    d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
	c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
	c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
	c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
	l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
	c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                  />
                </svg>
              </button>
            </div>
            <div className="sm:flex">
              <Image
                src={data.cover ? data.cover : "/test.png"}
                alt="game"
                width={120}
                height={0}
                className="mt-4 hidden h-fit w-fit rounded-md border border-zinc-600 border-b-transparent sm:block"
                priority
              />
              <div className="flex flex-col pt-4 text-xl sm:pl-4">
                <p>rating</p>
                <Rating
                  SVGclassName="inline -mx-0.5"
                  allowFraction
                  size={30}
                  transition={false}
                  emptyColor="#a1a1aa"
                  fillColor="#22d3ee"
                />
              </div>
              <div className="flex flex-col pt-4 sm:pl-4">
                <p className="pb-2 text-xl">review</p>
                <textarea
                  cols={100}
                  rows={5}
                  className="w-full overflow-auto rounded-md bg-zinc-400 p-2 text-zinc-800 outline-none"
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
            </div>
          </Modal>,
          document.getElementById("portal") as HTMLDivElement
        )}
      <PageLayout>
        <div className="py-4 md:flex">
          <div className="flex flex-col pb-4">
            <Image
              src={data.cover ? data.cover : "/test.png"}
              alt={data.name}
              width={140}
              height={0}
              className="h-fit w-56 rounded-md border border-zinc-600 border-b-transparent"
              priority
            />
            <div className="w-56 md:w-auto">
              <SignedOut>
                <Link href={"/login"}>
                  <button className="mt-2 w-full rounded-md bg-zinc-600 p-1 text-center text-xl">
                    login to review
                  </button>
                </Link>
              </SignedOut>
              <SignedIn>
                <div className="mt-2 h-fit rounded-md bg-zinc-600 p-1 px-12 md:px-6">
                  <Rating
                    SVGclassName="inline -mx-0.5"
                    allowFraction
                    size={30}
                    transition={false}
                    emptyColor="#a1a1aa"
                    fillColor="#22d3ee"
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
              {data.name}{" "}
              <span className="text-lg font-normal text-zinc-400">
                {releaseDate ? `(${releaseDate})` : ""}
              </span>
            </h1>
            <p className="py-4 text-lg text-zinc-300">{data.summary}</p>
            <h2 className="text-3xl font-medium">reviews</h2>
            <div className="border-b border-b-zinc-600 py-4 md:flex">
              <Link href={"/users/mechazol"}>
                <Image
                  src={`/test3.png`}
                  alt="profile"
                  width={56}
                  height={56}
                  className="mt-2 h-fit max-w-min rounded-md border border-zinc-600 transition hover:brightness-75"
                  priority
                />
              </Link>

              <div className="flex flex-col gap-1 md:pl-4">
                <div className="flex items-center">
                  <p className="pr-4 pt-1 text-lg font-semibold text-zinc-400 transition duration-75 hover:text-zinc-100">
                    <Link href={"/users/mechazol"}>mechazol</Link>
                  </p>
                  <Rating
                    SVGclassName="inline -mx-0.5"
                    allowFraction
                    readonly
                    size={22}
                    transition={false}
                    emptyColor="#a1a1aa"
                    fillColor="#22d3ee"
                  />
                </div>
                <p className="text-zinc-300">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Dolorem non veniam, laudantium vitae earum sed quam rerum sunt
                  eius molestias. Quos accusamus deserunt earum. Voluptatum
                  suscipit quisquam expedita possimus eaque?
                </p>
              </div>
            </div>
          </div>
        </div>
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
