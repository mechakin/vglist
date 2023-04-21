import { type NextPage } from "next";
import Image from "next/image";
import { PageLayout } from "~/components/layout";
import Link from "next/link";

const GamesPage: NextPage = () => {
  return (
    <PageLayout>
      <h2 className="pb-4 text-4xl font-medium">all games</h2>
      <h3 className="-mt-2 pb-4 text-lg text-zinc-400">23048 games</h3>
      <div className="grid grid-cols-3 place-items-center gap-4 xxs:grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8">
        <div className="max-w-fit">
          <Link href={"/games/name-of-game"}>
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
        </div>
        <div className="max-w-fit">
          <Link href={"/games/name-of-game"}>
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
        </div>
        <div className="max-w-fit">
          <Link href={"/games/name-of-game"}>
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
        </div>
        <div className="max-w-fit">
          <Link href={"/games/name-of-game"}>
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
        </div>
        <div className="max-w-fit">
          <Link href={"/games/name-of-game"}>
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
        </div>
        <div className="max-w-fit">
          <Link href={"/games/name-of-game"}>
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
        </div>
        <div className="max-w-fit">
          <Link href={"/games/name-of-game"}>
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
        </div>
        <div className="max-w-fit">
          <Link href={"/games/name-of-game"}>
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
        </div>
        <div className="max-w-fit">
          <Link href={"/games/name-of-game"}>
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
        </div>
        <div className="">
          <Link href={"/games/name-of-game"}>
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
        </div>
        <div className="max-w-fit">
          <Link href={"/games/name-of-game"}>
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
        </div>
      </div>
    </PageLayout>
  );
};

export default GamesPage;
