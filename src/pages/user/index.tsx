import { type NextPage } from "next";
import { SignIn, useUser } from "@clerk/nextjs";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";
// import Link from "next/link";

// import { api } from "~/utils/api";

const UserPage: NextPage = () => {
  // const { isLoaded: userLoaded, isSignedIn } = useUser();

  // if (!userLoaded) return <div />;

  // implement a loading page here

  return (
    <>
      <SignIn />
      <LoadingPage />
    </>
  );
};

export default UserPage;
