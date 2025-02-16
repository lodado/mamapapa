import { getTranslations, setRequestLocale } from "next-intl/server";
import React from "react";

import { ButtonLink } from "@/entities/Router";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { ModelDownloader } from "@/features";
import { getLocalesListsForStateParams } from "@/shared/libs/i18n/server/getLocalesListsForStateParams";
import { ScrollLock } from "@/shared/ui";
import { Motion } from "@/shared/ui/animation/animation";
import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";

import BodySvg from "./BODY.svg";
import HistoryLink from "./components/HistoryLink";
import HeadSvg from "./HEAD.svg";

export async function generateStaticParams() {
  return getLocalesListsForStateParams();
}

const Page = async ({ params }: { params: { locale: string } }) => {
  setRequestLocale(params.locale);
  const t = await getTranslations("MAINPAGE");

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
                  stiffness: 300,
                  damping: 15,
                  duration: 0.35,
                  repeat: Infinity,
                  repeatType: "mirror",
                  repeatDelay: 0,
                }}
              >
                <HeadSvg />
              </Motion>
              <BodySvg />
            </div>

            <h1 className="display-1 flex flex-row justify-center mb-2 w-full text-text-01 items-center">
              {t("TITLE")}
            </h1>

            <div className="flex flex-col items-center text-center mb-4 w-full">
              <p className="body-2 flex flex-col items-center text-center text-text-03">{t("DESCRIPTION-1")}</p>
              <p className="body-2 flex flex-col items-center text-center text-text-03">{t("DESCRIPTION-2")}</p>
            </div>

            <ModelDownloader />

            <div role="none presentation" className="h-[200px]"></div>
          </main>

          <nav className="flex bg-background-op-01 flex-col w-full max-w-[29rem] md:w-[768px] gap-3 p-6 fixed bottom-0 mb-[var(--safe-area-bottom)]">
            <ButtonLink variant="primarySolid" href={PAGE_ROUTE.FACES}>
              {t("BUTTON-START-COMPARISON")}
            </ButtonLink>
            <HistoryLink />
          </nav>
        </ReactiveLayout>
      </ScrollLock>
    </>
  );
};

export default Page;
