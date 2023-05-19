import { type GetStaticProps, type NextPage } from "next";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Link from "next/link";
import NotFound from "~/components/404";
import Profile from "~/components/profile";
import { ReviewFeed } from "~/components/review";

const ProfileReviewPage: NextPage<{ username: string }> = ({ username }) => {
  const { data: userData } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!userData) return <NotFound />;

  const { data: reviewCountData } =
    api.review.getReviewCountByUsername.useQuery({ username });

  return (
    <PageLayout>
      <Profile username={username} />
      <nav className="my-4 flex h-8 w-full rounded-md bg-zinc-500 px-2 align-middle text-zinc-300">
        <ul className="flex py-1 font-medium">
          <li className="px-4 decoration-2 underline-offset-8 hover:text-zinc-100 hover:underline">
            <Link href={`/users/${username}`} className="py-2">profile</Link>
          </li>
          <li className="px-4 decoration-2 underline-offset-8 hover:text-zinc-100 hover:underline">
            <Link href={`/users/${username}/games`} className="py-2">games</Link>
          </li>
          <li className="px-4 text-zinc-100 underline decoration-2 underline-offset-8">
            <Link href={`/users/${username}/reviews`} className="py-2">reviews</Link>
          </li>
        </ul>
      </nav>
      <div className="md:flex">
        <div className="w-full md:px-4">
          <h2 className="text-3xl font-medium ">all reviews</h2>
          <h3 className="pt-1 text-lg text-zinc-400">
            {reviewCountData} {reviewCountData === 1 ? "game" : "games"}
          </h3>
          <ReviewFeed username={username} />
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
  await ssg.review.getReviewCountByUsername.prefetch({ username });
  await ssg.review.getReviewsByUsername.prefetchInfinite({ username });

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

export default ProfileReviewPage;
