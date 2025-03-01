import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import React from "react";

import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { getLocalesListsForStateParams } from "@/shared/index.server";
import { JsonLdScript } from "@/shared/ui";
import { getMetadata } from "@/shared/utils/index.server";

import LoginPopup from "./LoginPopup";

export async function generateStaticParams() {
  return getLocalesListsForStateParams();
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations("LOGIN");

  return getMetadata({
    title: t("title"),
    description: t("description"),
    path: PAGE_ROUTE.LOGIN,
    keywords: t("keywords"),
    locale,
  });
}

export default async function LoginPopupPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("LOGIN");

  return (
    <>
      <JsonLdScript
        customMeta={{
          title: t("title"),
          url: PAGE_ROUTE.LOGIN,
          description: t("description"),
          date: new Date().toISOString(),
        }}
      />
      <LoginPopup />
    </>
  );
}
