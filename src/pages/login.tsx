import { type NextPage } from "next";
import { SignIn } from "@clerk/nextjs";
import { PageLayout } from "~/components/layout";
import Head from "next/head";

const Login: NextPage = () => {
  return (
    <PageLayout>
      <Head>
        <title>login</title>
        <meta name="description" content="Login to vglist!" />
        <meta name="og:description" content="Login to vglist!" />
        <meta property="twitter:description" content="Login to vglist!" />
        <meta property="og:title" content="login" />
        <meta property="twitter:title" content="login" />
        <meta property="og:url" content="https://vglist.org/login" />
      </Head>
      <div className="flex items-center justify-center md:py-10">
        <SignIn path="/login" signUpUrl="/register" />
      </div>
    </PageLayout>
  );
};

export default Login;
