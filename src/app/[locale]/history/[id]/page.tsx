import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";
import React, { PropsWithChildren } from "react";
 
import { ButtonLink } from "@/entities/Router";

import FacePageHeader from "./components/FacePageHeader";

import { ToastViewPort } from "@/shared/ui/Toast";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import ImagePrediction from "./components/ImagePrediction";

const Page = () => {
  return (
    <>
      <ReactiveLayout>
        <div role="none presentation" className="w-full flex-shrink-0 h-[4rem]" />
        <FacePageHeader />

        <main className="flex flex-col items-center w-full justify-center flex-grow ">
          <div className="flex-grow flex flex-col items-center w-full p-4">
            <ImagePrediction />
          </div>

          <div role="none presentation" className="h-[200px]"></div>
        </main>
        <nav
          className={`z-nav flex bg-background-op-01 flex-col justify-center items-center w-full md:w-[768px] gap-3 px-6 pt-6 fixed bottom-0 
            pb-[calc(1.5rem+var(--safe-area-bottom))]
        `}
        >
          <ButtonLink wrapperClassName="w-full max-w-[29rem]" variant="primarySolid" href={PAGE_ROUTE.MAIN}>
            처음 화면으로 돌아가기
          </ButtonLink>

          <ButtonLink wrapperClassName="w-full max-w-[29rem]" variant="primaryLine" href={PAGE_ROUTE.MAIN}>
            공유하기
          </ButtonLink>
        </nav>
      </ReactiveLayout>

      <ToastViewPort key="viewPort" className="bottom-[6.25rem]" />
    </>
  );
};

export default Page;
