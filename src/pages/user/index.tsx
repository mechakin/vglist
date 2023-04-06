import { type NextPage } from "next";
import { SignIn } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";

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
