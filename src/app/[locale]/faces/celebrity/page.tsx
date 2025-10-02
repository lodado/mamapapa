import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import React from "react";

import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { ModelDownloader } from "@/features";
import { ImageContainer } from "@/features/ImageSelector";
import { getLocalesListsForStateParams } from "@/shared/index.server";
import { JsonLdScript } from "@/shared/ui";
import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";
import { ToastViewPort } from "@/shared/ui/Toast";
import { getMetadata } from "@/shared/utils/index.server";
import { serializeJsonWithGuard } from "@/shared/utils/safeJson";

import FacePageTutorialConnector from "../components/FacePageTutorialConnector";
import CelebritySearchSection from "./CelebritySearchSection";
import CelebrityPageHeader from "./components/CelebrityPageHeader";
import CelebrityTutorialConnector from "./components/CelebrityTutorialConnector";
import { CELEBRITY_PROFILES } from "./configs/sampleCelebrities";

const webUrl = process.env.NEXT_PUBLIC_CLIENT_URL!;

export async function generateStaticParams() {
  return getLocalesListsForStateParams();
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations("CELEBRITYFACES");

  return getMetadata({
    title: t("SEO_TITLE"),
    description: t("SEO_DESCRIPTION"),
    path: PAGE_ROUTE.FACES_CELEBRITY,
    keywords: t("SEO_KEYWORDS"),
    locale,
  });
}

const createCelebrityItemListJsonLd = (locale: string, description: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Celebrity look-alike presets",
    description,
    itemListElement: CELEBRITY_PROFILES.map((profile, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: profile.name,
      url: profile.imageUrl,
    })),
  };
};

const Page = async ({ params }: { params: { locale: string } }) => {
  setRequestLocale(params.locale);
  const t = await getTranslations("CELEBRITYFACES");
  const mainTranslate = await getTranslations("MAINPAGE");

  const itemListJsonLd = createCelebrityItemListJsonLd(params.locale, t("SEO_DESCRIPTION"));

  return (
    <>
      <JsonLdScript
        customMeta={{
          title: `${mainTranslate("title")} | ${t("HEADER_TITLE")}`,
          url: PAGE_ROUTE.FACES_CELEBRITY,
          description: t("SEO_DESCRIPTION"),
          date: new Date().toISOString(),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonWithGuard(itemListJsonLd, "celebrity-item-list-jsonld") }}
      />

      <ReactiveLayout>
        <div role="none presentation" className="w-full flex-shrink-0 h-[4rem]" />
        <CelebrityPageHeader />

        <main className="flex flex-col items-center w-full justify-start flex-grow">
          <CelebritySearchSection />

          <div role="none presentation" className="h-[200px]" />
        </main>
      </ReactiveLayout>

      <ToastViewPort key="viewPort" className="bottom-[6.25rem]" />
      <div className="hidden">
        <ModelDownloader />
      </div>
      <CelebrityTutorialConnector />
    </>
  );
};

export default Page;
