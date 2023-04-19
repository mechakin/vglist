import { type NextPage } from "next";
import { SignUp } from "@clerk/nextjs";
import { PageLayout } from "~/components/layout";
import Head from "next/head";

const Register: NextPage = () => {

  return (
    <PageLayout>
      <Head><title>register</title></Head>
      <div className="flex justify-center md:py-10">
        <SignUp path="/register" routing="path" signInUrl="/login"/>
      </div>
    </PageLayout>
  );
};

export default Register;
