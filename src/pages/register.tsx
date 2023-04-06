import { type NextPage } from "next";
import { SignUp } from "@clerk/nextjs";
import { PageLayout } from "~/components/layout";

const Register: NextPage = () => {

  return (
    <PageLayout>
      <div className="flex justify-center py-10">
        <SignUp path="/register" routing="path" signInUrl="/login"/>
      </div>
    </PageLayout>
  );
};

export default Register;
