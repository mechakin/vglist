import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "~/components/navbar";
// import Link from "next/link";

// import { api } from "~/utils/api";

const Home: NextPage = () => {
  // const { isLoaded: userLoaded, isSignedIn } = useUser();

  // if (!userLoaded) return <div />;

  return (
    <>
      <Navbar isSignedIn={false} />
      <main>
        <h1 className="text-4xl">this is a website</h1>
      </main>
    </>
  );
};

export default Home;

