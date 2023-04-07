import { type NextPage } from "next";
import { SignIn } from "@clerk/nextjs";
import { PageLayout } from "~/components/layout";

const Login: NextPage = () => {

  return (
    <PageLayout>
      <div className="flex justify-center items-center md:py-10">
        <SignIn path="/login" routing="path" signUpUrl="/register"/>
      </div>
    </PageLayout>
  );
};

export default Login;
