import { type GetStaticProps, type NextPage } from "next";
import Image from "next/image";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import NotFound from "~/components/404";
import Profile from "~/components/profile";

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
          <div className="text-xl font-medium">games played</div>
          <section className="pb-2 text-4xl font-medium text-zinc-300">
            324
          </section>
          <div className="text-xl font-medium ">average score</div>
          <section className="text-4xl font-medium text-zinc-300">7.4</section>
          <div className="rounded-md py-2 md:w-64">
            <span className="text-xl font-medium ">bio</span>
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
            <h2 className="pb-4 text-4xl font-medium">recently played</h2>
            <div className="grid max-w-fit grid-cols-2 gap-4 pb-4 sm:grid-cols-3 lg:grid-cols-4">
              <div className="">
                <Link href={"/link-to-game"}>
                  <Image
                    src={
                      "https://images.igdb.com/igdb/image/upload/t_cover_big/co67qb.jpg"
                    }
                    alt="game"
                    width={120}
                    height={0}
                    className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
                    priority
                  />
                </Link>
                <div className="flex items-center justify-between">
                  <span className="pt-2 text-zinc-300 ">Nov 23 </span>
                  <Rating
                    SVGclassName="inline -mx-0.5"
                    allowFraction
                    readonly
                    size={19}
                    transition={false}
                    emptyColor="#a1a1aa"
                    fillColor="#22d3ee"
                  />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-medium">recently reviewed</h2>
          <div className="border-b border-b-zinc-600 py-4 md:flex">
            <Image
              src={
                "https://images.igdb.com/igdb/image/upload/t_cover_big/co67qb.jpg"
              }
              alt="game"
              width={120}
              height={0}
              className="mb-2 h-fit w-fit rounded-md border border-zinc-600"
              priority
            />
            <div className="flex flex-col gap-1 md:px-8">
              <h3 className="max-w-fit text-2xl font-medium transition duration-75 hover:text-zinc-400">
                <Link href={"/link-to-game"}>destiny 2</Link>
              </h3>

              <div className="flex items-center">
                <p className="pr-4 pt-1 font-semibold text-zinc-400 transition duration-75 hover:text-zinc-100">
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

export default ProfilePage;