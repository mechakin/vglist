import { UserButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import { PageLayout } from "~/components/layout";

const Home: NextPage = () => {
  return (
    <PageLayout>
      <h1 className="text-4xl">this is a user page</h1>
      <UserButton />
    </PageLayout>
  );
};

export default Home;
