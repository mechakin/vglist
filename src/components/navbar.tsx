import Link from "next/link";
import { useUser } from "@clerk/nextjs";

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

  // check if  isLoaded: userLoaded, cache the username and navbar on the page

  let userUrl = "/user";

  if (user && user.username) {
    userUrl = `/user/${user.username}`;
  }

  return (
    <>
      <nav className="flex w-full justify-end bg-zinc-800">
        <h1 className="flex w-full items-center px-5 py-3"><Link href={"/"}>vglist</Link></h1>
        <ul className="flex gap-5 p-3">
          {!isSignedIn && (
            <>
              <li>
                <Link href={"/login"}>Login</Link>
              </li>
              <li>
                <Link href={"/register"}>Register</Link>
              </li>
            </>
          )}
          {isSignedIn && (
            <li>
              <Link href={userUrl}>{user.username}</Link>
            </li>
          )}
          <li>
            <Link href={"/games"}>Games</Link>
          </li>
          <div className="flex rounded-lg bg-slate-100">
            <input
              placeholder="Search"
              className="rounded-lg px-3 text-zinc-800 outline-none"
            />
            <button className="px-2">
              <SearchIcon />
            </button>
          </div>
        </ul>
      </nav>
    </>
  );
};
