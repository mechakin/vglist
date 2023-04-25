import { type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const IndividualGamePage: NextPage = () => {
  return (
    <PageLayout>
      <div className="py-4 md:flex">
        <div className="flex flex-col pb-4">
          <Image
            src={
              "https://images.igdb.com/igdb/image/upload/t_cover_big/co67qb.jpg"
            }
            alt="game"
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
            </SignedIn>
            <div className="mt-2 h-fit rounded-md bg-zinc-600 p-1 text-center">
              <h3 className="text-xl">average rating</h3>
              <strong className="text-4xl font-semibold">4.5</strong>
            </div>
          </div>
        </div>
        <div className="md:px-8">
          <h1 className="text-4xl font-medium">
            destiny 2{" "}
            <span className="text-lg font-normal text-zinc-400">
              &#40;2021&#41;
            </span>
          </h1>
          <p className="py-4 text-lg text-zinc-300">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente
            hic ex eveniet dolorum, quas fuga aut odit tenetur recusandae. Eaque
            nobis nam voluptatum maxime molestias eius aspernatur dolorum
            nesciunt autem? Odio voluptas alias quo quod quidem distinctio
            placeat voluptate. Asperiores, culpa iure ipsam facere tenetur quam
            eum excepturi nesciunt aspernatur deleniti ab. Explicabo placeat
            nisi velit? Architecto iure totam consectetur!
          </p>
          <h2 className="text-3xl font-medium">reviews</h2>
          <div className="border-b border-b-zinc-600 py-4 md:flex">
            <Link href={"/users/mechazol"}>
              <Image
                src={`/test3.png`}
                alt="profile"
                width={72}
                height={72}
                className="mr-4 mt-2 h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-75"
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
          <div className="border-b border-b-zinc-600 py-4 md:flex">
            <Link href={"/"}>
              <Image
                src={`/test3.png`}
                alt="profile"
                width={72}
                height={72}
                className="mr-4 mt-2 h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-75"
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
  );
};

export default IndividualGamePage;
