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
import { ToastViewPort } from "@/shared/ui/Toast";
import { ImagePrediction } from "@/widgets/ImagePrediction";

import { getCachedCompareHistory } from "./api/compareHistory";
import HistoryPageHeader from "./components/HistoryPageHeader";

export const revalidate = 7200000; // 2 hours
export const dynamicParams = true;

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const { data, error } = await getCachedCompareHistory(id)();

  const user = await new GetUserInfoUseCase(new EDGE_DI_REPOSITORY.Auth()).execute();
  const isLogin = user?.id;

  if (error) {
    return <>page not found!</>;
  }

  const comparisonList = JSON.parse(data?.imageList || []) as ComparisonMetaData[];
  const playerImage = comparisonList.find((image) => image.selectedPlayer === USER_PLAYER_NAME)!;

  const title = data.title;
  const createdAt = data.createdAt;
  const updatedAt = data.updatedAt;

  return (
    <>
      <ReactiveLayout>
        <div role="none presentation" className="w-full flex-shrink-0 h-[4rem]" />
        <HistoryPageHeader userId={user?.id} title={title} updatedAt={updatedAt} />

        <main className="flex flex-col items-center w-full justify-center flex-grow ">
          <div className="flex-grow flex flex-col items-center w-full px-4">
            <ImagePrediction
              comparisons={comparisonList.filter((image) => image !== playerImage)}
              playerImage={playerImage}
            />

            <ReactionLayout userId={user?.id ?? "-1"} boardId={id} />

            <CommentLayout userId={user?.id ?? "-1"} boardId={id} />
          </div>

          <div role="none presentation" className={"h-[200px]"}></div>
        </main>
        <nav
          className={`z-nav flex bg-background-op-01 flex-col justify-center items-center w-full md:w-[768px] gap-3 px-6 pt-6 fixed bottom-0 
            pb-[calc(1.5rem+var(--safe-area-bottom))]
        `}
        >
          {isLogin && <CommentInput userId={user?.id ?? "-1"} boardId={id} />}

          <ButtonLink wrapperClassName="w-full max-w-[29rem]" variant="primarySolid" href={PAGE_ROUTE.MAIN}>
            처음 화면으로 돌아가기
          </ButtonLink>

          {!isLogin && <LoginButton />}
        </nav>
      </ReactiveLayout>

      <ToastViewPort key="viewPort" className="bottom-[6.25rem]" />
    </>
  );
};

export default Page;
