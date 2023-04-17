import { UserButton } from "@clerk/nextjs";
import { type GetStaticProps, type NextPage } from "next";
import Image from "next/image";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";

const ProfileGamePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  // make it so you redirect to a 404 page
  if (!data) return <div>404</div>;

  return (
    <PageLayout>
      <div className="flex items-end">
        <Image
          src={data.profileImageUrl}
          alt={`${username}'s profile picture`}
          className="h-24 w-24 rounded-md"
          width={56}
          height={56}
        />
        <h1 className="px-4 text-2xl font-semibold">{username}</h1>
      </div>
      <nav className="my-4 flex h-8 w-full rounded-md bg-zinc-500 px-2 align-middle text-zinc-300">
        <ul className="flex py-1 font-medium">
          <li className="px-4 decoration-2 underline-offset-8 hover:text-zinc-100 hover:underline">
            <Link href={`/users/${username}`}>profile</Link>
          </li>
          <li className="px-4 text-zinc-100 underline decoration-2 underline-offset-8">
            <Link href={`/users/${username}/games`}>games</Link>
          </li>
          <li className="px-4 decoration-2 underline-offset-8 hover:text-zinc-100 hover:underline">
            <Link href={`/users/${username}/reviews`}>reviews</Link>
          </li>
        </ul>
      </nav>

      <div className="flex flex-col items-center md:px-4">
        <h2 className="pb-4 text-4xl font-medium ">games played</h2>
        <div className="grid max-w-fit grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          <div className="max-w-fit">
            <Link href={"/link-to-game"}>
              <Image
                src={
                  "https://images.igdb.com/igdb/image/upload/t_1080p/co67qb.jpg"
                }
                alt="game"
                width={120}
                height={0}
                className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
                priority
              />
            </Link>
            <div className="flex items-center justify-center">
              <Rating
                SVGclassName="inline -mx-0.5"
                allowFraction
                readonly
                size={20}
                transition={false}
                emptyColor="#a1a1aa"
                fillColor="#22d3ee"
              />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  // make it so you return to a different page instead
  if (typeof slug !== "string") throw new Error("No slug.");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfileGamePage;
