import React from "react";

import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";
import { GetUserInfoUseCase } from "@/entities/Auth/core";
import { ButtonLink } from "@/entities/Router";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";
import { ToastViewPort } from "@/shared/ui/Toast";

import { getUserHistoryList } from "./api/userHistoryList";
import FacePageHeader from "./components/FacePageHeader";
import HistoryListLayout from "./components/HistoryListLayout.server";

const Page = async () => {
  const auth = await new GetUserInfoUseCase(new EDGE_DI_REPOSITORY.Auth()).execute();

  if (!auth) {
    return <>page not found!</>;
  }

  return (
    <>
      <ReactiveLayout>
        <div role="none presentation" className="w-full flex-shrink-0 h-[2rem]" />
        <FacePageHeader />

        <main className="flex flex-col items-center w-full justify-center flex-grow ">
          <div className="flex-grow flex flex-col items-center w-full p-4"></div>

          <HistoryListLayout userId={auth.id} />

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
        </nav>
      </ReactiveLayout>

      <ToastViewPort key="viewPort" className="bottom-[6.25rem]" />
    </>
  );
};

export default Page;
