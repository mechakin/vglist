import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export const SearchIcon = () => {
  return (
    <span
      className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
      id="basic-addon2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
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

export const HamburgerIcon = () => {
  return (
    <svg
      className="h-6 w-6"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export const Navbar = () => {
  const { isSignedIn, user } = useUser();
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen((prevState) => !prevState);
  }

  // check if  isLoaded: userLoaded, cache the username and navbar on the page

  let userUrl = "/user";

  if (user && user.username) {
    userUrl = `/user/${user.username}`;
  }

  return (
    <nav className="bg-zinc-800 sticky">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <div>
              <Link href="/" className="flex items-center px-2 py-5 text-2xl">
                vglist
              </Link>
            </div>
          </div>

          <div className="hidden items-center md:flex">
            {!isSignedIn && (
              <>
                <Link href="/login" className="px-3 text-2xl">
                  login
                </Link>
                <Link href="/register" className="px-3 text-2xl">
                  register
                </Link>
              </>
            )}
            {isSignedIn && (
              <Link href={userUrl} className="px-3 text-2xl">
                {user.username}
              </Link>
            )}
            <Link href="/games" className="px-3 text-2xl">
              games
            </Link>
            <div className="mb-3 pt-4 xl:w-96">
              <div className="relative flex w-full flex-wrap items-stretch ">
                <input
                  type="text"
                  className="relative ml-5 block w-[1%] min-w-0 flex-auto rounded-l border border-r-0 border-solid border-zinc-600 bg-transparent bg-clip-padding px-3 py-1.5 text-2xl text-zinc-100 outline-none transition duration-300 ease-in-out placeholder:text-zinc-400 focus:outline-none"
                  placeholder="search"
                  aria-label="search"
                  aria-describedby="button-addon"
                />

                <button
                  className="mr-4 flex items-center whitespace-nowrap rounded-r border border-l-0 border-y-zinc-600 border-r-zinc-600 px-3 py-1.5 text-center"
                  id="basic-addon"
                >
                  <SearchIcon />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={handleOpen}>
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </div>

      <div className={open ? "hidden md:hidden" : "md:hidden"}>
        <div className="mb-3 xl:w-96">
          <div className="relative flex w-full flex-wrap items-stretch">
            <input
              type="text"
              className="relative ml-5 block w-[1%] min-w-0 flex-auto rounded-l border border-r-0 border-solid border-zinc-600 bg-transparent bg-clip-padding px-3 py-1.5 text-2xl text-zinc-100 outline-none transition duration-300 ease-in-out placeholder:text-zinc-400 focus:outline-none"
              placeholder="search"
              aria-label="search"
              aria-describedby="button-addon"
            />

            <button
              className="mr-4 flex items-center whitespace-nowrap rounded-r border border-l-0 border-y-zinc-600 border-r-zinc-600 px-3 py-1.5 text-center"
              id="basic-addon"
            >
              <SearchIcon />
            </button>
          </div>
        </div>
        {!isSignedIn && (
          <>
            <Link href="/login" className="block w-min px-6 py-2 text-2xl">
              login
            </Link>
            <Link href="/register" className="block w-min px-6 py-2 text-2xl">
              register
            </Link>
          </>
        )}
        {isSignedIn && (
          <Link href={userUrl} className="block w-min px-6 py-2 text-2xl">
            {user.username}
          </Link>
        )}
        <Link href={"/games"} className="block w-min px-6 py-2 pb-4 text-2xl">
          games
        </Link>
      </div>
    </nav>
  );
};
