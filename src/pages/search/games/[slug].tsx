import { type GetStaticProps, type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Link from "next/link";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { FaGamepad, FaPlay } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { GiDropWeapon } from "react-icons/gi";
import { useUser } from "@clerk/nextjs";

function handleStarValue(value: number) {
  console.log(value);
}

const GamesSearchPage: NextPage<{ slug: string }> = ({ slug }) => {
  const { isSignedIn } = useUser();

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
            <li className="flex items-center text-zinc-400 underline transition duration-75 hover:text-cyan-300">
              <Link href={`/search/users/${slug}`}>users</Link>
            </li>
          </ul>
        </nav>

        <div className="flex border border-x-transparent border-b-zinc-600 border-t-transparent py-4">
          <Link href={"/games/name-of-game"}>
            <Image
              src={"/test.png"}
              alt="game"
              width={120}
              height={0}
              className="h-fit w-fit rounded-md"
            />
          </Link>
          <div className="w-full px-4">
            <p className="font-semibold transition duration-75 hover:text-zinc-400">
              <Link
                href={"/games/name-of-game"}
                className="text-xl md:text-3xl"
              >
                metroid prime remastered
              </Link>{" "}
              <span className="md:text-md text-sm font-normal text-zinc-400">
                (2023)
              </span>
            </p>
            {isSignedIn && (
              <div className="md:py-2">
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

                <div className="flex h-full justify-start gap-2.5 py-1 text-2xl md:justify-end">
                  <FaGamepad />
                  <FaPlay />
                  <ImBooks />
                  <GiDropWeapon />
                </div>
              </div>
            )}
            {!isSignedIn && (
              <div>
                <div className="md:py-2">
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
            )}
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
