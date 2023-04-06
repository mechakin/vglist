import { UserButton } from "@clerk/nextjs";
import { type NextPage } from "next";
// import Link from "next/link";

// import { api } from "~/utils/api";

const Home: NextPage = () => {

  return (
    <>
      <main>
        <h1 className="text-4xl">this is a user page</h1>
        <UserButton />
      </main>
    </>
  );
};

export default Home;

