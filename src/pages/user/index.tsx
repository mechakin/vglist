import { type NextPage } from "next";
import { SignIn } from "@clerk/nextjs";
import { LoadingPage } from "~/components/loading";
import { PageLayout } from "~/components/layout";

const UserPage: NextPage = () => {
  // const { isLoaded: userLoaded, isSignedIn } = useUser();

  // if (!userLoaded) return <div />;

  // implement a loading page here

  return (
    <PageLayout>
      <SignIn />
      <LoadingPage />
    </PageLayout>
  );
};

export default UserPage;
