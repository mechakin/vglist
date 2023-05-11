import Link from "next/link";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/router";
import { Logo } from "./logo";

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
              <div className="group relative z-10 inline-block text-xl">
                <div className="rounded-t-md p-3 text-2xl transition duration-75 group-hover:bg-zinc-600">
                  {user?.username}
                </div>
                <Link
                  href={userUrl}
                  className="absolute hidden min-w-full p-3 transition duration-75 hover:!bg-zinc-500 group-hover:block group-hover:bg-zinc-600"
                >
                  profile
                </Link>
                <Link
                  href={"/settings"}
                  className="absolute my-[3.25rem] hidden min-w-full p-3 transition duration-75 hover:!bg-zinc-500 group-hover:block group-hover:bg-zinc-600"
                >
                  settings
                </Link>
                <button
                  onClick={() => void signOut()}
                  className="absolute my-[6.5rem] hidden min-w-full rounded-b-md p-3 text-left transition duration-75 hover:!bg-zinc-500 group-hover:block group-hover:bg-zinc-600"
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
