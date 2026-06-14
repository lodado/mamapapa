import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import React from "react";

import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { EmotionAnalyzer } from "@/features/EmotionModel";
import { JsonLdScript } from "@/shared/ui";
import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";
import { getMetadata } from "@/shared/utils/index.server";

import EmotionPageHeader from "./components/EmotionPageHeader";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "EMOTIONPAGE" });

  return getMetadata({
    title: t("title"),
    description: t("description"),
    path: PAGE_ROUTE.EMOTION,
    keywords: t("keywords"),
    locale,
  });
}

const Page = async ({ params }: { params: { locale: string } }) => {
  setRequestLocale(params.locale);
  const t = await getTranslations("EMOTIONPAGE");

  return (
    <>
      <JsonLdScript
        customMeta={{
          title: t("title"),
          url: PAGE_ROUTE.EMOTION,
          description: t("description"),
          datePublished: new Date().toISOString(),
          keywords: t("keywords"),
          locale: params.locale,
          isAccessibleForFree: true,
        }}
      />

      <ReactiveLayout>
        <EmotionPageHeader />

        <main className="flex flex-col items-center w-full justify-start flex-grow">
          <div className="mt-[5rem] w-full px-4 text-center">
            <h1 className="display-1 text-text-01">{t("title")}</h1>
            <p className="body-2 mt-2 text-text-03">{t("description")}</p>
          </div>

          <EmotionAnalyzer />
        </main>
      </ReactiveLayout>
    </>
  );
};

export default Page;

