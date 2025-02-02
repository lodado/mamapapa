import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";
import React from "react";

import { ButtonLink } from "@/entities/Router";

import FacePageHeader from "./components/FacePageHeader";

import { ToastViewPort } from "@/shared/ui/Toast";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import ResultPageImagePrediction from "./components/ResultPageImagePrediction";
import ShareButton from "./components/ShareButton";
import { ModelDownloader } from "@/features";
import { getLocalesListsForStateParams } from "@/shared/index.server";
import { setRequestLocale } from "next-intl/server";

export async function generateStaticParams() {
  return getLocalesListsForStateParams();
}

const Page = ({ params }: { params: { locale: string } }) => {
  setRequestLocale(params.locale);
  return (
    <>
      <ReactiveLayout>
        <div role="none presentation" className="w-full flex-shrink-0 h-[4rem]" />
        <FacePageHeader />

        <main className="flex flex-col items-center w-full justify-center flex-grow ">
          <div className="flex-grow flex flex-col items-center w-full p-4">
            <ResultPageImagePrediction />
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

          <ShareButton />
        </nav>
      </ReactiveLayout>

      <ToastViewPort key="viewPort" className="bottom-[6.25rem]" />
      <ModelDownloader className="hidden" />
    </>
  );
};

export default Page;
