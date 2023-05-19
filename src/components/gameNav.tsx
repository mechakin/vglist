import Link from "next/link";
import Profile from "./profile";

export function GameNav(props: { username: string }) {
  return (
    <>
      <Profile username={props.username} />
      <nav className="my-4 flex h-8 w-full rounded-md bg-zinc-500 px-2 align-middle text-zinc-300">
        <ul className="flex py-1 font-medium">
          <li className="px-4 decoration-2 underline-offset-8 hover:text-zinc-100 hover:underline">
            <Link href={`/users/${props.username}`} className="py-2">
              profile
            </Link>
          </li>
          <li className="px-4 text-zinc-100 underline decoration-2 underline-offset-8">
            <Link href={`/users/${props.username}/games`} className="py-2">
              games
            </Link>
          </li>
          <li className="px-4 decoration-2 underline-offset-8 hover:text-zinc-100 hover:underline">
            <Link href={`/users/${props.username}/reviews`} className="py-2">
              reviews
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
