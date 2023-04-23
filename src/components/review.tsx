import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";

export default function Review() {
  return (
    <div className="border-b border-b-zinc-600 py-4 md:flex">
      <Image
        src={"https://images.igdb.com/igdb/image/upload/t_cover_big/co67qb.jpg"}
        alt="game"
        width={120}
        height={0}
        className="mb-2 h-fit w-fit rounded-md border border-zinc-600"
        priority
      />
      <div className="flex flex-col gap-1 md:px-8">
        <h3 className="max-w-fit text-2xl font-medium transition duration-75 hover:text-zinc-400">
          <Link href={"/games/link-to-game"}>destiny 2</Link>
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
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem non
          veniam, laudantium vitae earum sed quam rerum sunt eius molestias.
          Quos accusamus deserunt earum. Voluptatum suscipit quisquam expedita
          possimus eaque?
        </p>
      </div>
    </div>
  );
}
