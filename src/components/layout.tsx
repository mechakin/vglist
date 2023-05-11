import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/router";

const SearchIcon = () => {
  return (
    <span
      className="input-group-text flex items-center whitespace-nowrap rounded py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
      id="search-icon"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
        name="search icon"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
};

const HamburgerIcon = () => {
  return (
    <svg
      className="h-6 w-6"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      name="menu"
    >
      <path
        fillRule="evenodd"
        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

const Logo = () => {
  return (
    <svg
      fill="#FFFFFF"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width="50px"
      height="50px"
      name="logo"
    >
      <path d="M 25 4 C 21.145849 4 18 7.1458524 18 11 C 18 13.780216 19.641042 16.184382 22 17.3125 L 22 18.085938 C 21.630145 18.190812 21.263678 18.309245 20.904297 18.453125 L 2.8359375 25.703125 C 1.6618102 26.174086 0.99237568 27.287364 0.95507812 28.384766 C 0.94811693 28.589584 0.97141302 28.795322 1.0078125 29 L 1 29 L 1 35.255859 C 1 36.023039 1.4435867 36.729267 2.1367188 37.060547 L 17.066406 44.199219 C 22.083517 46.598339 27.916483 46.598339 32.933594 44.199219 L 47.861328 37.060547 C 48.555243 36.729541 49 36.023543 49 35.255859 L 49 29 L 48.992188 29 C 49.028351 28.796049 49.051862 28.590895 49.044922 28.386719 C 49.007622 27.289385 48.337782 26.17465 47.164062 25.703125 L 29.095703 18.453125 L 29.09375 18.453125 C 28.735339 18.309761 28.369483 18.191228 28 18.085938 L 28 17.3125 C 30.358958 16.184382 32 13.780216 32 11 C 32 7.1458524 28.854151 4 25 4 z M 25 6 C 27.773271 6 30 8.2267307 30 11 C 30 13.773269 27.773271 16 25 16 C 22.226729 16 20 13.773269 20 11 C 20 8.2267307 22.226729 6 25 6 z M 24 17.919922 C 24.327598 17.967299 24.659679 18 25 18 C 25.340321 18 25.672402 17.967299 26 17.919922 L 26 28.914062 C 26 29.479094 25.56503 29.914062 25 29.914062 C 24.43497 29.914062 24 29.479094 24 28.914062 L 24 17.919922 z M 22 20.185547 L 22 28.914062 C 22 30.559033 23.35503 31.914064 25 31.914062 C 26.64497 31.914062 28 30.559033 28 28.914062 L 28 20.197266 C 28.116415 20.238452 28.236024 20.262378 28.351562 20.308594 L 46.417969 27.558594 C 46.857251 27.735069 47.031973 28.072208 47.044922 28.453125 C 47.057872 28.834042 46.906873 29.183094 46.480469 29.388672 L 31.080078 36.814453 C 27.237899 38.667399 22.762101 38.667399 18.919922 36.814453 L 3.5175781 29.388672 C 3.0913297 29.183169 2.9401726 28.834223 2.953125 28.453125 C 2.9660774 28.072027 3.1412055 27.734633 3.5800781 27.558594 L 21.648438 20.308594 C 21.764582 20.262094 21.8827 20.227011 22 20.185547 z M 11.5 27 A 3.5 2 0 0 0 11.5 31 A 3.5 2 0 0 0 11.5 27 z M 3 31.357422 L 18.050781 38.615234 C 22.440602 40.732288 27.559398 40.732288 31.949219 38.615234 L 47 31.357422 L 47 35.255859 L 32.072266 42.396484 C 27.599376 44.535364 22.400624 44.535364 17.927734 42.396484 L 3 35.255859 L 3 31.357422 z" />
    </svg>
  );
};

const schema = z.object({
  input: z.string().min(1),
});

type typeSchema = z.infer<typeof schema>;

const Navbar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm<typeSchema>();
  const { register: registerMobile, handleSubmit: handleMobileSubmit } =
    useForm<typeSchema>();
  const router = useRouter();

  function handleMenu() {
    setOpen((prevState) => !prevState);
  }

  function onSubmit(data: typeSchema) {
    void router.push(`/search/games/${data.input}`);
  }

  let userUrl = "/users";

  if (user && user.username) {
    userUrl = `/users/${user.username}`;
  }

  return (
    <nav className="bg-zinc-800">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <Link
              href="/"
              className="flex items-center px-2 py-5"
              aria-label="home page"
            >
              <Logo />
            </Link>
          </div>

          <div className="hidden items-center md:flex">
            <SignedOut>
              <Link
                href="/login"
                className="px-3 text-2xl transition duration-75 hover:text-zinc-400"
              >
                login
              </Link>
              <Link
                href="/register"
                className="px-3 text-2xl transition duration-75 hover:text-zinc-400"
              >
                register
              </Link>
              <Link
                href={"/games"}
                className="px-3 text-2xl transition duration-75 hover:text-zinc-400"
              >
                games
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="group relative inline-block text-xl z-10">
                <Link
                  href={userUrl}
                  className="rounded-t-md p-3 text-2xl transition duration-75 hover:!bg-zinc-500 group-hover:bg-zinc-600"
                >
                  {user?.username}
                </Link>
                <Link
                  href={userUrl}
                  className="absolute my-3 hidden min-w-full p-3 transition duration-75 hover:!bg-zinc-500 group-hover:block group-hover:bg-zinc-600"
                >
                  profile
                </Link>
                <Link
                  href={"/settings"}
                  className="absolute my-16 hidden min-w-full p-3 transition duration-75 hover:!bg-zinc-500 group-hover:block group-hover:bg-zinc-600"
                >
                  settings
                </Link>
                <button
                  onClick={() => void signOut()}
                  className="absolute my-[7.25rem] hidden min-w-full rounded-b-md p-3 text-left transition duration-75 hover:!bg-zinc-500 group-hover:block group-hover:bg-zinc-600"
                >
                  log out
                </button>
              </div>
              <Link
                href={"/games"}
                className="px-3 text-2xl transition duration-75 hover:text-zinc-400"
              >
                games
              </Link>
            </SignedIn>

            <form
              className="mb-3 pt-4 xl:w-96"
              onSubmit={(event) => void handleSubmit(onSubmit)(event)}
            >
              <div className="relative flex w-full flex-wrap items-stretch">
                <input
                  {...register("input")}
                  type="text"
                  className="relative ml-5 block w-[1%] min-w-0 flex-auto rounded-l border border-r-0 border-solid border-zinc-600 bg-transparent bg-clip-padding px-3 py-1.5 text-2xl text-zinc-100 outline-none transition duration-300 ease-in-out placeholder:text-zinc-400 focus:outline-none"
                  placeholder="search"
                  aria-label="search"
                  aria-describedby="button-addon"
                  id="search"
                />

                <button
                  className="mr-4 flex items-center whitespace-nowrap rounded-r border border-l-0 border-y-zinc-600 border-r-zinc-600 px-3 py-1.5 text-center"
                  id="search-button"
                  type="submit"
                  aria-label="search-button"
                >
                  <SearchIcon />
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center md:hidden">
            <button name="menu" onClick={handleMenu}>
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </div>

      <div className={!open ? "hidden md:hidden" : "pb-4 md:hidden"}>
        <div className="mb-2 xl:w-96">
          <form
            onSubmit={(event) => void handleMobileSubmit(onSubmit)(event)}
            className="relative flex w-full flex-wrap items-stretch"
          >
            <input
              type="text"
              className="relative ml-5 block w-[1%] min-w-0 flex-auto rounded-l border border-r-0 border-solid border-zinc-600 bg-transparent bg-clip-padding px-3 py-1.5 text-2xl text-zinc-100 outline-none placeholder:text-zinc-400 focus:outline-none"
              placeholder="search"
              aria-label="search"
              aria-describedby="button-addon"
              {...registerMobile("input")}
            />

            <button
              className="mr-4 flex items-center whitespace-nowrap rounded-r border border-l-0 border-y-zinc-600 border-r-zinc-600 px-3 py-1.5 text-center"
              id="submit-button"
              type="submit"
            >
              <SearchIcon />
            </button>
          </form>
        </div>

        <SignedOut>
          <Link
            href="/login"
            className="block w-full px-6 py-4 text-2xl transition duration-75 hover:bg-zinc-500"
            onClick={handleMenu}
          >
            login
          </Link>
          <Link
            href="/register"
            className="block w-full px-6 py-4 text-2xl transition duration-75 hover:bg-zinc-500"
            onClick={handleMenu}
          >
            register
          </Link>
          <Link
            href={"/games"}
            className="block w-full px-6 py-4 text-2xl transition duration-75 hover:bg-zinc-500"
            onClick={handleMenu}
          >
            games
          </Link>
        </SignedOut>

        <SignedIn>
          <Link
            href={userUrl}
            className="block w-full px-6 py-4 text-2xl transition duration-75 hover:bg-zinc-500"
            onClick={handleMenu}
          >
            {user?.username}
          </Link>
          <Link
            href={"/games"}
            className="block w-full px-6 py-4 text-2xl transition duration-75 hover:bg-zinc-500"
            onClick={handleMenu}
          >
            games
          </Link>
        </SignedIn>
      </div>
    </nav>
  );
};

export function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex justify-center">
        <div className="w-full px-6 lg:max-w-6xl">{props.children}</div>
      </div>
      <div className="pb-4" />
    </>
  );
}
