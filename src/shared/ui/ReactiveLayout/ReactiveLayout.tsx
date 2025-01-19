import React, { PropsWithChildren } from "react";

const ReactiveLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full h-max min-h-screen items-center justify-center bg-background-03 ">
      <div className="w-full h-full bg-background-01 md:w-[768px] mx-auto flex flex-col items-center">{children}</div>
    </div>
  );
};

export default ReactiveLayout;
