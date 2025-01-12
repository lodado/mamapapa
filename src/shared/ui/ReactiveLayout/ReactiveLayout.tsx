import React, { PropsWithChildren } from "react";

const ReactiveLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full h-max items-center justify-center bg-background-03 ">
      <div className="w-full bg-background-01 min-h-[630px] md:w-[768px] mx-auto flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};

export default ReactiveLayout;
