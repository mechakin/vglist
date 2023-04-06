import { type NextPage } from "next";
import { SignIn } from "@clerk/nextjs";

const Login: NextPage = () => {

  return (
    <>
      <h1 className="text-4xl">this is a login</h1>
      <div className="flex justify-center items-center">
        <SignIn path="/login" routing="path" signUpUrl="/register"/>
      </div>
    </>
  );
};

export default Login;
