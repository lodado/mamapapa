import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";
import { setRequestLocale } from "next-intl/server";
import React from "react";

import BodySvg from "./BODY.svg";
import HeadSvg from "./HEAD.svg";
import { Motion } from "@/shared/ui/animation/animation";
import { ModelDownloader } from "@/features";

import { ButtonLink } from "@/entities/Router";
import { ScrollLock } from "@/shared/ui";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { getLocalesListsForStateParams } from "@/shared/libs/i18n/server/getLocalesListsForStateParams";
import HistoryLink from "./components/HistoryLink";

export async function generateStaticParams() {
  return getLocalesListsForStateParams();
}

const page = ({ params }: { params: { locale: string } }) => {
  setRequestLocale(params.locale);

  return (
    <>
      <ScrollLock>
        <ReactiveLayout>
          <main className="flex flex-col justify-center items-center w-full h-screen pt-[3rem] px-[2rem]">
            <div className="relative flex flex-col items-center mb-6">
              <Motion
                className="absolute will-change-transform"
                componentType="div"
                initial={{ y: -32 }}
                animate={{ y: [-32, -38] }}
                transition={{
                  type: "tween",
                  stiffness: 300, // 스프링 강도를 증가시켜 더 빠르게 이동
                  damping: 15, // 감쇠 계수를 낮춰 통통 튀는 효과
                  duration: 0.35, // 키프레임 전환 시간을 짧게 설정
                  repeat: Infinity,
                  repeatType: "mirror",
                  repeatDelay: 0, // 반복 간의 지연 시간을 제거
                }}
              >
                <HeadSvg />
              </Motion>
              <BodySvg />
            </div>

            <h1 className="display-1 flex flex-row justify-center mb-2 w-full text-text-01 items-center">
              닮은꼴 비교를 시작해보세요
            </h1>

            <div className="flex flex-col items-center text-center mb-4 w-full">
              <p className="body-2 flex flex-col items-center text-center text-text-03">
                닮은꼴 비교를 위한 사진을 업데이트를 하고 닮은꼴 비교를 진행해보세요.
              </p>
              <p className="body-2 flex flex-col items-center text-center text-text-03">
                누구를 더 닮았는지 확인해볼 수 있습니다.
              </p>
            </div>

            <ModelDownloader />

            <div role="none presentation" className="h-[200px]"></div>
          </main>

          <nav className="flex bg-background-op-01 flex-col w-full max-w-[29rem] md:w-[768px] gap-3 p-6 fixed bottom-0 mb-[var(--safe-area-bottom)] ">
            <ButtonLink variant="primarySolid" href={PAGE_ROUTE.FACES}>
              닮은꼴 비교 시작하기
            </ButtonLink>
            <HistoryLink />
          </nav>
        </ReactiveLayout>
      </ScrollLock>
    </>
  );
};

export default page;
