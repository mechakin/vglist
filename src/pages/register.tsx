import { type NextPage } from "next";
import { SignUp } from "@clerk/nextjs";

const Register: NextPage = () => {

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
