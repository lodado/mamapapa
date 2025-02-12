import React from "react";

import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";
import Skeleton from "@/shared/ui/Skeleton/Skeleton";

const DefaultLoadingPage = async () => {
  return (
    <>
      <ReactiveLayout>
        <main className="flex flex-col items-center w-full justify-center flex-grow ">
          <div className="flex-grow flex flex-col items-center w-full px-16 mt-20 gap-2">
            <Skeleton className="w-full h-[100px]" />
            <Skeleton className="w-full h-[100px]" />
            <Skeleton className="w-full h-[100px]" />
          </div>
          <div role="none presentation" className={"h-[200px]"}></div>
        </main>
        <nav
          className={`z-nav flex bg-background-op-01 flex-col justify-center items-center w-full md:w-[768px] gap-3 px-6 pt-6 fixed bottom-0 
            pb-[calc(1.5rem+var(--safe-area-bottom))]
        `}
        ></nav>
      </ReactiveLayout>
    </>
  );
};

export default DefaultLoadingPage;
