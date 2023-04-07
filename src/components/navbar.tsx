import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export const SearchIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className="h-5 w-5 text-slate-950"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
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
    <nav className="bg-zinc-800">
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
            <div className="ml-3 flex rounded-lg bg-white">
              <input
                placeholder="search"
                className="rounded-lg px-2 text-2xl text-zinc-800 outline-none"
              />
              <button className="px-3">
                <SearchIcon />
              </button>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={handleOpen}>
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
            </button>
          </div>
        </div>
      </div>

      <div className={open ? "hidden md:hidden" : "md:hidden"}>
        <div className="ml-6 flex w-10 rounded-lg bg-zinc-200">
          <input
            placeholder="search"
            className="rounded-lg rounded-r-none px-3 text-2xl text-zinc-800 outline-none"
          />
          <button className="rounded-lg rounded-l-none bg-white px-3">
            <SearchIcon />
          </button>
        </div>
        {!isSignedIn && (
          <>
            <Link href="/login" className="block px-6 py-2 pt-4 text-2xl">
              login
            </Link>
            <Link href="/register" className="block px-6 py-2 text-2xl">
              register
            </Link>
          </>
        )}
        {isSignedIn && (
          <Link href={userUrl} className="block px-6 py-2 text-2xl">
            {user.username}
          </Link>
        )}
        <Link href={"/games"} className="block px-6 py-2 pb-4 text-2xl">
          games
        </Link>
      </div>
    </nav>
  );
};
