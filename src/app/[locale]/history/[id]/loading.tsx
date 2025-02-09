import React from "react";

import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";
import { LoginButton, USER_PLAYER_NAME } from "@/entities";
import { GetUserInfoUseCase } from "@/entities/Auth/core";
import { ButtonLink } from "@/entities/Router";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { CommentLayout } from "@/features/Comments/index.server";
import CommentInput from "@/features/Comments/ui/CommentInput";
import { ComparisonMetaData } from "@/features/ImageSelector/models";
import { ReactionLayout } from "@/features/Reaction/index.server";
import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";
import Skeleton from "@/shared/ui/Skeleton/Skeleton";
import { ToastViewPort } from "@/shared/ui/Toast";
import { ImagePrediction } from "@/widgets/ImagePrediction";

import { getCachedCompareHistory } from "./api/compareHistory";
import HistoryPageHeader from "./components/HistoryPageHeader";

const Loading = async ({ params }: { params: { id: string } }) => {
  return (
    <>
      <ReactiveLayout>
        <main className="flex flex-col items-center w-full justify-center flex-grow ">
          <div className="flex-grow flex flex-col items-center w-full px-4 gap-2">
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

export default Loading;
