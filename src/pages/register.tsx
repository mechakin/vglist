import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import { SignUp } from "@clerk/nextjs";
// import Link from "next/link";

// import { api } from "~/utils/api";

const Register: NextPage = () => {
  // const { isLoaded: userLoaded, isSignedIn } = useUser();

  // if (!userLoaded) return <div />;

  return (
    <>
      <h1 className="text-4xl">this is a register page</h1>
      <div className="flex justify-center">
        <SignUp path="/register" routing="path" signInUrl="/login"/>
      </div>
    </>
  );
};

export default Register;
