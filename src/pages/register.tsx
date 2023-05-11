import { type NextPage } from "next";
import { SignUp } from "@clerk/nextjs";
import { PageLayout } from "~/components/layout";
import Head from "next/head";

const Register: NextPage = () => {
  return (
    <PageLayout>
      <Head>
        <title>register</title>
        <meta
          name="description"
          content="Signup to vglist and make an account today!"
        />
        <meta
          name="og:description"
          content="Signup to vglist and make an account today!"
        />
        <meta
          property="twitter:description"
          content="Signup to vglist and make an account today!"
        />
        <meta property="og:title" content="create an account" />
        <meta property="twitter:title" content="create an account" />
        <meta property="og:url" content="https://vglist.org/register" />
      </Head>
      <div className="flex justify-center md:py-10">
        <SignUp path="/register" signInUrl="/login" />
      </div>
    </PageLayout>
  );
};

export default Register;
