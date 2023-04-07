import { type PropsWithChildren } from "react";

export function PageLayout(props: PropsWithChildren) {
  return (
    <div className="flex justify-center">
      <div className="w-full px-6 lg:max-w-6xl">
        {props.children}
      </div>
    </div>
  );
}
