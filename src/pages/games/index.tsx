import { type GetStaticProps, type NextPage } from "next";
import Image from "next/image";
import { PageLayout } from "~/components/layout";
import Link from "next/link";
import { api } from "~/utils/api";
import NotFound from "~/components/404";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Head from "next/head";

const GamesPage: NextPage = () => {
  const { data: gameData } = api.game.getTopGames.useQuery();

  if (!gameData) return <NotFound />;

  return (
    <PageLayout>
      <Head>
        <title>games</title>
      </Head>
      <h2 className="pb-4 text-3xl font-semibold">top 100 games</h2>
      <div className="grid grid-cols-3 place-items-center gap-4 pb-4 xxs:grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8">
        {gameData.map((game) => (
          <Link href={`/games/${game.slug}`} key={game.id}>
            <Image
              src={game.cover ? game.cover : "/game.png"}
              alt={game.name}
              width={120}
              height={0}
              className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
              priority
            />
          </Link>
        ))}
      </div>
      <div className="-mb-8"/>
    </PageLayout>
  );
};

export default GamesPage;

export const getStaticProps: GetStaticProps = async () => {
  const ssg = generateSSGHelper();

  await ssg.game.getTopGames.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
