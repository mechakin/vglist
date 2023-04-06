import { UserButton } from "@clerk/nextjs";
import { type NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <h1 className="text-4xl">this is a user page</h1>
      <UserButton />
    </>
  );
};

export default Home;
