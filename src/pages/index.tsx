import { type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Link from "next/link";
import Image from "next/image";
import { ClerkLoaded, useUser } from "@clerk/nextjs";
import { ReviewFeed } from "~/components/review";

const Home: NextPage = () => {
  const { isSignedIn } = useUser();

  return (
    <PageLayout>
      <div className="flex justify-center pt-4">
        <div className="flex flex-col items-center justify-center">
          {isSignedIn && <h1 className="py-8 text-4xl">welcome back :{")"}</h1>}
          {!isSignedIn && (
            <ClerkLoaded>
              <h1 className="pb-8 text-6xl font-semibold">vglist</h1>
              <h2 className="pb-8 text-3xl text-zinc-300">
                discover, collect, and share your favorite games
              </h2>
              <button className="max-w-fit rounded-md bg-zinc-600 p-2 text-3xl transition hover:bg-zinc-500">
                <Link href={"/register"}>start now</Link>
              </button>
            </ClerkLoaded>
          )}
        </div>
      </div>
      {!isSignedIn && (
        <ClerkLoaded>
          <div className="grid place-items-center gap-4 py-8 xs:grid-cols-2 md:grid-cols-3">
            <p className="flex items-center gap-4 text-xl text-zinc-300">
              <svg
                fill="#71717a"
                width="80"
                height="80"
                viewBox="0 0 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.108 10.044c-3.313 0-6 2.687-6 6s2.687 6 6 6 6-2.686 6-6-2.686-6-6-6zM16.108 20.044c-2.206 0-4.046-1.838-4.046-4.044s1.794-4 4-4c2.206 0 4 1.794 4 4s-1.748 4.044-3.954 4.044zM31.99 15.768c-0.012-0.050-0.006-0.104-0.021-0.153-0.006-0.021-0.020-0.033-0.027-0.051-0.011-0.028-0.008-0.062-0.023-0.089-2.909-6.66-9.177-10.492-15.857-10.492s-13.074 3.826-15.984 10.486c-0.012 0.028-0.010 0.057-0.021 0.089-0.007 0.020-0.021 0.030-0.028 0.049-0.015 0.050-0.009 0.103-0.019 0.154-0.018 0.090-0.035 0.178-0.035 0.269s0.017 0.177 0.035 0.268c0.010 0.050 0.003 0.105 0.019 0.152 0.006 0.023 0.021 0.032 0.028 0.052 0.010 0.027 0.008 0.061 0.021 0.089 2.91 6.658 9.242 10.428 15.922 10.428s13.011-3.762 15.92-10.422c0.015-0.029 0.012-0.058 0.023-0.090 0.007-0.017 0.020-0.030 0.026-0.050 0.015-0.049 0.011-0.102 0.021-0.154 0.018-0.090 0.034-0.177 0.034-0.27 0-0.088-0.017-0.175-0.035-0.266zM16 25.019c-5.665 0-11.242-2.986-13.982-8.99 2.714-5.983 8.365-9.047 14.044-9.047 5.678 0 11.203 3.067 13.918 9.053-2.713 5.982-8.301 8.984-13.981 8.984z"></path>
              </svg>
              you can keep track of every game you{"'"}ve ever played
            </p>
            <p className="flex items-center gap-4 text-xl text-zinc-300">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Interface / Star">
                  <path
                    id="Vector"
                    d="M2.33496 10.3368C2.02171 10.0471 2.19187 9.52339 2.61557 9.47316L8.61914 8.76107C8.79182 8.74059 8.94181 8.63215 9.01465 8.47425L11.5469 2.98446C11.7256 2.59703 12.2764 2.59695 12.4551 2.98439L14.9873 8.47413C15.0601 8.63204 15.2092 8.74077 15.3818 8.76124L21.3857 9.47316C21.8094 9.52339 21.9791 10.0472 21.6659 10.3369L17.2278 14.4419C17.1001 14.56 17.0433 14.7357 17.0771 14.9063L18.255 20.8359C18.3382 21.2544 17.8928 21.5787 17.5205 21.3703L12.2451 18.4166C12.0934 18.3317 11.9091 18.3321 11.7573 18.417L6.48144 21.3695C6.10913 21.5779 5.66294 21.2544 5.74609 20.8359L6.92414 14.9066C6.95803 14.7361 6.90134 14.5599 6.77367 14.4419L2.33496 10.3368Z"
                    stroke="#71717a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              rate each game on a five star scale to record your reaction
            </p>
            <p className="flex items-center gap-4 text-xl text-zinc-300">
              <svg
                fill="#71717a"
                width="80"
                height="80"
                viewBox="0 0 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M30.133 1.552c-1.090-1.044-2.291-1.573-3.574-1.573-2.006 0-3.47 1.296-3.87 1.693-0.564 0.558-19.786 19.788-19.786 19.788-0.126 0.126-0.217 0.284-0.264 0.456-0.433 1.602-2.605 8.71-2.627 8.782-0.112 0.364-0.012 0.761 0.256 1.029 0.193 0.192 0.45 0.295 0.713 0.295 0.104 0 0.208-0.016 0.31-0.049 0.073-0.024 7.41-2.395 8.618-2.756 0.159-0.048 0.305-0.134 0.423-0.251 0.763-0.754 18.691-18.483 19.881-19.712 1.231-1.268 1.843-2.59 1.819-3.925-0.025-1.319-0.664-2.589-1.901-3.776zM22.37 4.87c0.509 0.123 1.711 0.527 2.938 1.765 1.24 1.251 1.575 2.681 1.638 3.007-3.932 3.912-12.983 12.867-16.551 16.396-0.329-0.767-0.862-1.692-1.719-2.555-1.046-1.054-2.111-1.649-2.932-1.984 3.531-3.532 12.753-12.757 16.625-16.628zM4.387 23.186c0.55 0.146 1.691 0.57 2.854 1.742 0.896 0.904 1.319 1.9 1.509 2.508-1.39 0.447-4.434 1.497-6.367 2.121 0.573-1.886 1.541-4.822 2.004-6.371zM28.763 7.824c-0.041 0.042-0.109 0.11-0.19 0.192-0.316-0.814-0.87-1.86-1.831-2.828-0.981-0.989-1.976-1.572-2.773-1.917 0.068-0.067 0.12-0.12 0.141-0.14 0.114-0.113 1.153-1.106 2.447-1.106 0.745 0 1.477 0.34 2.175 1.010 0.828 0.795 1.256 1.579 1.27 2.331 0.014 0.768-0.404 1.595-1.24 2.458z"></path>
              </svg>
              write and share reviews with anyone viewing your page
            </p>
          </div>
        </ClerkLoaded>
      )}

      <p className="py-4 text-xl text-zinc-300">check out these games</p>
      <div className="grid grid-cols-2 place-items-center gap-4 xxs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        <Link href={"/games/the-legend-of-zelda-breath-of-the-wild"}>
          <Image
            src={
              "https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.png"
            }
            alt="breath of the wild"
            width={140}
            height={0}
            className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
            priority
          />
        </Link>
        <Link href={"/games/elden-ring"}>
          <Image
            src={
              "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg"
            }
            alt="elden ring"
            width={140}
            height={0}
            className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
            priority
          />
        </Link>
        <Link href={"/games/resident-evil-4--1"}>
          <Image
            src={
              "https://images.igdb.com/igdb/image/upload/t_cover_big/co6bo0.png"
            }
            alt="resident evil 4"
            width={140}
            height={0}
            className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
            priority
          />
        </Link>
        <Link href={"/games/hollow-knight"}>
          <Image
            src={
              "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.jpg"
            }
            alt="hollow knight"
            width={140}
            height={0}
            className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
            priority
          />
        </Link>
        <Link href={"/games/pizza-tower"}>
          <Image
            src={
              "https://images.igdb.com/igdb/image/upload/t_cover_big/co5uu1.jpg"
            }
            alt="pizza tower"
            width={140}
            height={0}
            className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
            priority
          />
        </Link>
        <Link href={"/games/league-of-legends"}>
          <Image
            src={
              "https://images.igdb.com/igdb/image/upload/t_cover_big/co49wj.png"
            }
            alt="league of legends"
            width={140}
            height={0}
            className="h-fit w-fit rounded-md border border-zinc-600 transition hover:brightness-50"
            priority
          />
        </Link>
      </div>
      <div className="md:flex">
        <div className="w-full">
          <h2 className="pt-12 text-xl text-zinc-300">some recent reviews</h2>
          <ReviewFeed />
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;

//
