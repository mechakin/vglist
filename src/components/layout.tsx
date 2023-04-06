import { type PropsWithChildren } from "react";

export function PageLayout(props: PropsWithChildren) {
  return (
    <main className="flex justify-center">
      <div className="w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
        {props.children}
      </div>
    </main>
  );
}
