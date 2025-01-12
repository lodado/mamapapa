import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";
import React, { PropsWithChildren } from "react";
import CrossHair from "/public/CrossHair.svg";

import { ModelDownloader } from "@/features";

import { ButtonLink } from "@/entities/Router";
import { Button, ScrollLock } from "@/shared/ui";
import FallBackHeader from "@/features/Navigation/ui/Header/FallBackHeader";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { ImageContainer } from "@/features/ImageSelector";
import { AnimatePresence } from "motion/react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ReactiveLayout>
        <FallBackHeader fallbackUrl={PAGE_ROUTE.MAIN} />
        <div role="none presentation" className="w-full flex-shrink-0 h-[4rem]" />

        <h1 className="bg-background-op-01 fixed md:w-[768px] top-[4rem] h-[4rem] display-2  pb-2 flex flex-row justify-start mb-2 w-full text-text-01 px-[1rem] items-center border-b border-b-solid border-b-border-02">
          <span className="h-[2.25rem]">닮은꼴 비교하기</span>
        </h1>

        <div className="flex flex-row justify-between items-center text-center  mt-[1.25rem]  w-full px-4">
          <h2 className="subhead-3 flex flex-col items-center text-center text-text-01">비교할 사진을 선택해주세요</h2>

          <Button variant="line">
            <CrossHair /> 사진 추가하기
          </Button>
        </div>

        <main className="flex flex-col items-center w-full h-full  ">
          <div className="flex-grow w-full p-4">
            <AnimatePresence>
              <ImageContainer />

              {children}
            </AnimatePresence>
          </div>

          <ModelDownloader />

          <div role="none presentation" className="h-[200px]"></div>
        </main>

        <nav className="flex bg-background-op-01 flex-col w-full max-w-[29rem] md:w-[768px] gap-3 p-6 fixed bottom-0 mb-[var(--safe-area-bottom)] ">
          <ButtonLink variant="primarySolid" href={"/"}>
            비교하기
          </ButtonLink>
        </nav>
      </ReactiveLayout>
    </>
  );
};

export default Layout;
