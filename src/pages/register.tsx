import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "~/components/navbar";
import { SignUp } from "@clerk/nextjs";
// import Link from "next/link";

// import { api } from "~/utils/api";

const Register: NextPage = () => {
  // const { isLoaded: userLoaded, isSignedIn } = useUser();

  // if (!userLoaded) return <div />;

  return (
    <>
      <Navbar isSignedIn={false} />
      <h1 className="text-4xl">this is a register page</h1>
      <div className="flex justify-center">
        <SignUp/>
      </div>
    </>
  );
};

export default Register;
