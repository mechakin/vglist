import { type PropsWithChildren } from "react";
import { Navbar } from "./navbar";

export function PageLayout(props: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <div className="flex justify-center">
        <div className="w-full px-6 lg:max-w-6xl">{props.children}</div>
      </div>
    </>
  );
}
