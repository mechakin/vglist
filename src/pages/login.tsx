import { type NextPage } from "next";
import { SignIn, useUser } from "@clerk/nextjs";
import { PageLayout } from "~/components/layout";
// import Link from "next/link";

// import { api } from "~/utils/api";

const Login: NextPage = () => {
//  const { isLoaded: userLoaded, isSignedIn } = useUser();

//  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <h1 className="text-4xl">this is a login</h1>
      <div className="flex justify-center items-center">
        <SignIn path="/login" routing="path" signUpUrl="/register"/>
      </div>
    </PageLayout>
  );
};

export default Login;
