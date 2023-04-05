import Link from "next/link";

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


export const Navbar = (props: { isSignedIn: boolean | undefined }) => {
  return (
    <>
      <nav className="flex w-full justify-end bg-zinc-800">
        <h1 className="flex w-full items-center px-5 py-3">vglist</h1>
        <ul className="flex gap-5 p-3">
          {!props.isSignedIn && (
            <>
              <li><Link href={'/login'}>Login</Link></li> 
              <li><Link href={'/register'}>Register</Link></li>
            </>
          )}
          {props.isSignedIn && <li>Logout</li>}
          <li>Games</li>
          <div className="flex bg-slate-100 rounded-lg">
            <input placeholder="Search" className="px-3 text-black outline-none rounded-lg" />
            <button className="px-2">
              <SearchIcon />
            </button>
          </div>
        </ul>
      </nav>
    </>
  );
};