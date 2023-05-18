import Link from "next/link";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/router";
import { Logo } from "./icons/logo";
import { DropdownIcon } from "./icons/dropdown";
import { SearchIcon } from "./icons/search";
import { HamburgerIcon } from "./icons/hamburger";

const schema = z.object({
  input: z.string().min(1),
});

type typeSchema = z.infer<typeof schema>;

const Navbar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { register, handleSubmit } = useForm<typeSchema>();
  const { register: registerMobile, handleSubmit: handleMobileSubmit } =
    useForm<typeSchema>();
  const router = useRouter();

  function handleMenu() {
    setOpen((prevState) => !prevState);
  }

  function handleProfile() {
    setProfileOpen((prevState) => !prevState);
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
              <div className="group relative z-10 inline-block text-2xl">
                <div className="p-3 text-2xl">{user?.username}</div>
                <Link
                  href={userUrl}
                  className="absolute hidden w-28 rounded-t-md p-3 transition duration-75 hover:!bg-zinc-500 group-hover:block group-hover:bg-zinc-600"
                >
                  profile
                </Link>
                <Link
                  href={"/settings"}
                  className="absolute my-[3.25rem]  hidden w-28  p-3 transition duration-75 hover:!bg-zinc-500 group-hover:block group-hover:bg-zinc-600"
                >
                  settings
                </Link>
                <button
                  onClick={() => void signOut()}
                  className="absolute my-[6.5rem]  hidden w-28 rounded-b-md p-3 text-left transition duration-75 hover:!bg-zinc-500 group-hover:block group-hover:bg-zinc-600"
                >
                  logout
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
          <button
            className="flex w-full items-center justify-between"
            onClick={handleProfile}
          >
            <div className="block w-full px-6 py-4 text-left text-2xl">
              {user?.username}
            </div>
            <div
              className={
                !profileOpen ? "px-4 transition" : "rotate-180 px-4 transition"
              }
            >
              <DropdownIcon />
            </div>
          </button>
          <div className={!profileOpen ? "hidden" : "block"}>
            <div className="flex">
              <div className="my-2 ml-6 w-1 bg-zinc-500" />
              <Link href={userUrl} className="block w-full px-6 py-4 text-2xl">
                profile
              </Link>
            </div>
            <div className="flex">
              <div className="my-2 ml-6 w-1 bg-zinc-500" />
              <Link
                href={"/settings"}
                className="block w-full px-6 py-4 text-2xl "
              >
                settings
              </Link>
            </div>
            <div className="flex">
              <div className="my-2 ml-6 w-1 bg-zinc-500" />
              <button
                onClick={() => void signOut()}
                className="block w-full px-6 py-4 text-left text-2xl"
              >
                logout
              </button>
            </div>
          </div>
          <Link
            href={"/games"}
            className="block w-full px-6 py-4 text-2xl "
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
