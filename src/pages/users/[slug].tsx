import { UserButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {
  const { data, isLoading: postsLoading } = api.profile.getUserByUsername.useQuery()
  return (
    <PageLayout>
      <h1 className="text-2xl">this is a user page</h1>
    </PageLayout>
  );
};

export default ProfilePage;
