import { type GetStaticProps, type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Link from "next/link";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { SignedIn, SignedOut } from "@clerk/nextjs";

function handleStarValue(value: number) {
  console.log(value);
}

const GamesSearchPage: NextPage<{ slug: string }> = ({ slug }) => {
  return (
    <PageLayout>
      <div className="py-4">
        <h1 className="text-center text-4xl">
          30 results for <span className="font-semibold">{`${slug}`}</span>
        </h1>
        <nav className="text-2xl">
          <ul className="flex justify-center gap-4 py-2 text-cyan-400">
            <li className="text-zinc-100">search for:</li>
            <li className="flex items-center underline">
              <Link href={`/search/games/${slug}`}>games</Link>
            </li>
            <li className="flex items-center text-zinc-400 underline transition duration-75 hover:text-cyan-400">
              <Link href={`/search/users/${slug}`}>users</Link>
            </li>
          </ul>
        </nav>

        <div className="flex border-b border-b-zinc-600 py-4">
          <Link href={"/games/name-of-game"}>
            <Image
              src={
                "https://images.igdb.com/igdb/image/upload/t_cover_big/co67qb.jpg"
              }
              alt="game"
              width={120}
              height={0}
              className="h-fit w-fit rounded-md border border-zinc-600"
              priority
            />
          </Link>
          <div className="w-full px-4">
            <p className="w-fit font-semibold transition duration-75">
              <Link
                href={"/games/name-of-game"}
                className="text-xl hover:text-zinc-400 md:text-3xl"
              >
                metroid prime remastered
              </Link>{" "}
              <span className="md:text-md text-sm font-normal text-zinc-400">
                (2023)
              </span>
            </p>
            <SignedIn>
              <div className="md:py-6">
                <div className="flex justify-start md:justify-end">
                  <Rating
                    SVGclassName="inline -mx-0.5"
                    allowFraction
                    size={30}
                    transition={false}
                    emptyColor="#a1a1aa"
                    fillColor="#22d3ee"
                    onClick={handleStarValue}
                  />
                </div>
              </div>
            </SignedIn>
            <SignedOut>
              <div>
                <div className="md:py-6">
                  <div className="flex justify-start md:justify-end">
                    <Link
                      href={"/login"}
                      className="rounded-md bg-zinc-600 px-2 text-xl"
                    >
                      log in to review
                    </Link>
                  </div>
                </div>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default GamesSearchPage;

export const getStaticProps: GetStaticProps = (context) => {
  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  return {
    props: {
      slug,
    },
  };
};

// should see if this is right
export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
