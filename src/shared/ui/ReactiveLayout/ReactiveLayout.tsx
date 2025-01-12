import React, { PropsWithChildren } from "react";

const ReactiveLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full h-full items-center justify-center bg-background-03 ">
      <div className="w-full bg-background-01 h-full md:w-[768px] mx-auto flex flex-col items-center">{children}</div>
    </div>
  );
};

export default ReactiveLayout;
