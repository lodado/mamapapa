import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import React from "react";

import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";
import { GetUserInfoUseCase } from "@/entities/Auth/core";
import { ButtonLink } from "@/entities/Router";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { JsonLdScript } from "@/shared/ui";
import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";
import { ToastViewPort } from "@/shared/ui/Toast";
import { getMetadata } from "@/shared/utils/index.server";

import FacePageHeader from "./components/FacePageHeader";
import HistoryListLayout from "./components/HistoryListLayout.server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations("HISTORY");

  return getMetadata({
    title: t("title"),
    description: t("description"),
    path: PAGE_ROUTE.HISTORY_LIST,
    keywords: t("keywords"),
    locale,
    others: {
      robots: "noindex, nofollow",
    },
  });
}

const Page = async ({ params }: { params: { locale: string } }) => {
  setRequestLocale(params.locale);
  const t = await getTranslations("HISTORY");
  const historyPageMessages = await getTranslations("HISTORYPAGE");
  const auth = await new GetUserInfoUseCase(new EDGE_DI_REPOSITORY.Auth()).execute();

  if (!auth) {
    return <>{historyPageMessages("ERROR-PAGE-NOT-FOUND")}</>;
  }

  return (
    <>
      <JsonLdScript
        customMeta={{
          title: t("title"),
          url: PAGE_ROUTE.HISTORY_LIST,
          description: t("description"),
          datePublished: new Date().toISOString(),
          isAccessibleForFree: false,
          keywords: t("keywords"),
          locale: params.locale,
        }}
      />

      <ReactiveLayout>
        <div role="none presentation" className="w-full flex-shrink-0 h-[2rem]" />
        <FacePageHeader />

        <main className="flex flex-col items-center w-full justify-center flex-grow">
          <div className="flex-grow flex flex-col items-center w-full p-4 h-full"></div>

          <HistoryListLayout userId={auth.id} />

          <div role="none presentation" className="h-[200px]"></div>
        </main>
        <nav
          className={`z-nav flex bg-background-op-01 flex-col justify-center items-center w-full md:w-[768px] gap-3 px-6 pt-6 fixed bottom-0 
            pb-[calc(1.5rem+var(--safe-area-bottom))]
        `}
        >
          <ButtonLink wrapperClassName="w-full max-w-[29rem]" variant="primarySolid" href={PAGE_ROUTE.MAIN}>
            {historyPageMessages("GO-TO-HOMEPAGE")}
          </ButtonLink>
        </nav>
      </ReactiveLayout>

      <ToastViewPort key="viewPort" className="bottom-[6.25rem]" />
    </>
  );
};

export default Page;
