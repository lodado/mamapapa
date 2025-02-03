import { setRequestLocale } from "next-intl/server";
import React from "react";

import { ModelDownloader } from "@/features";
import { ImageContainer } from "@/features/ImageSelector";
import { getLocalesListsForStateParams } from "@/shared/index.server";
import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";
import { ToastViewPort } from "@/shared/ui/Toast";

import AddPictureButton from "./components/AddPictureButton";
import CompareButtonLink from "./components/CompareButtonLink";
import FacePageHeader from "./components/FacePageHeader";
import FacePageTutorialConnector from "./components/FacePageTutorialConnector";

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

        <div className="flex flex-row justify-between items-center text-center mt-[5rem] w-full px-4">
          <h2 className="subhead-3 flex flex-col items-center text-center text-text-01">비교할 사진을 선택해주세요</h2>

          <AddPictureButton />
        </div>
        <main className="flex flex-col items-center w-full justify-center flex-grow ">
          <div className="flex-grow flex flex-col items-center w-full p-4">
            <ImageContainer key="imageContainer" />
          </div>

          <ModelDownloader />

          <div role="none presentation" className="h-[200px]"></div>
        </main>
        <nav
          className={`z-nav flex bg-background-op-01 flex-col justify-center items-center w-full md:w-[768px] gap-3 px-6 pt-6 fixed bottom-0 
            pb-[calc(1.5rem+var(--safe-area-bottom))]
        `}
        >
          <CompareButtonLink />
        </nav>
      </ReactiveLayout>

      <ToastViewPort key="viewPort" className="bottom-[6.25rem]" />
      <FacePageTutorialConnector />
    </>
  );
};

export default Page;
 