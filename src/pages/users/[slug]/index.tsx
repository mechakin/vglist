import { type GetStaticProps, type NextPage } from "next";
import Image from "next/image";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Link from "next/link";
import NotFound from "~/components/404";
import Profile from "~/components/profile";
import { ReviewFeed } from "~/components/review";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <NotFound />;

  return (
    <PageLayout>
      <Profile username={username} />
      <nav className="my-4 flex h-8 w-full rounded-md bg-zinc-500 px-2 align-middle text-zinc-300">
        <ul className="flex py-1 font-medium">
          <li className="px-4 text-zinc-100 underline decoration-2 underline-offset-8">
            <Link href={`/users/${username}`}>profile</Link>
          </li>
          <li className="px-4 decoration-2 underline-offset-8 hover:text-zinc-100 hover:underline">
            <Link href={`/users/${username}/games`}>games</Link>
          </li>
          <li className="px-4 decoration-2 underline-offset-8 hover:text-zinc-100 hover:underline">
            <Link href={`/users/${username}/reviews`}>reviews</Link>
          </li>
        </ul>
      </nav>
      <div className="md:flex">
        <div className="rounded-md pt-2 md:w-64">
          <div className="text-xl ">games played</div>
          <section className="pb-4 text-4xl font-medium text-zinc-300">
            324
          </section>
          <div className="text-xl  ">average score</div>
          <section className="text-4xl font-medium text-zinc-300">7.4</section>
          <div className="rounded-md py-4 md:w-64">
            <span className="text-xl  ">bio</span>
            <section className="font-normal text-zinc-300 no-underline">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
              voluptas doloremque beatae aspernatur recusandae. Iste provident
              quas recusandae consectetur, inventore et veniam saepe, est
              tenetur voluptatibus expedita, mollitia quam quis.
            </section>
          </div>
        </div>
        <div className="w-full md:px-4">
          <div className="flex flex-col">
            <h2 className="pb-4 text-3xl font-medium">recently played</h2>
            <div className="grid max-w-fit grid-cols-2 gap-4 pb-4 sm:grid-cols-3 lg:grid-cols-4">
              <div>
                <Link href={"/games/link-to-game"}>
                  <Image
                    src={"/game.webp"}
                    alt="game"
                    width={120}
                    height={0}
                    className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
                    priority
                  />
                </Link>
                <div className="flex items-center justify-center">
                  <span className="pt-1 text-zinc-300">Nov 23 </span>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-medium">recently reviewed</h2>
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
