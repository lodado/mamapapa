import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";
import React from "react";

import { ButtonLink } from "@/entities/Router";

import HistoryPageHeader from "./components/HistoryPageHeader";

import { ToastViewPort } from "@/shared/ui/Toast";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";

import { supabaseInstance } from "@/shared/index.server";
import { USER_PLAYER_NAME } from "@/entities";
import { ComparisonMetaData } from "@/features/ImageSelector/models";
import { ImagePrediction } from "@/widgets/ImagePrediction";
import { unstable_cache } from "next/cache";

import { GetUserInfoUseCase } from "@/entities/Auth/core";
import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";
import { CommentLayout } from "@/features/Comments/index.server";

export const revalidate = 7200000; // 2 hours
export const dynamicParams = true;

const getCachedPosts = (id: string) =>
  unstable_cache(
    async () => {
      const result = await supabaseInstance
        .from("simminyResults")
        .select(
          `
      *
    `
        )
        .eq("id", id)
        .single();

      return result;
    },
    ["history", id],
    { revalidate: 20, tags: ["history", id] }
  );

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
 
  const { data, error } = await getCachedPosts(id)();

  const user = await new GetUserInfoUseCase(new EDGE_DI_REPOSITORY.Auth()).execute();

  
  if (error) {
    return <>page not found!</>;
  }

  const comparisonList = JSON.parse(data?.imageList || []) as ComparisonMetaData[];
  const playerImage = comparisonList.find((image) => image.selectedPlayer === USER_PLAYER_NAME)!;

  return (
    <>
      <ReactiveLayout>
        <div role="none presentation" className="w-full flex-shrink-0 h-[4rem]" />
        <HistoryPageHeader />

        <main className="flex flex-col items-center w-full justify-center flex-grow ">
          <div className="flex-grow flex flex-col items-center w-full p-4">
            <ImagePrediction
              comparisons={comparisonList.filter((image) => image !== playerImage)}
              playerImage={playerImage}
            />

            <CommentLayout userId={user?.id ?? "-1"} boardId={id} />
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
