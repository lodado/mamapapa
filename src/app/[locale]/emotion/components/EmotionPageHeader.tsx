"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { LocaleLink } from "@/entities/Router";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";

const EmotionPageHeader = () => {
  const t = useTranslations("EMOTIONPAGE");

  return (
    <>
      <header className="z-header w-full md:w-[768px] h-[4rem] fixed top-0 flex flex-row justify-between items-center bg-background-01 px-2">
        <LocaleLink className="py-[11px] px-2 text-text-primary flex flex-row gap-1" href={PAGE_ROUTE.MAIN}>
          <ChevronLeft width={20} height={24} strokeWidth={3} />
          {t("back")}
        </LocaleLink>
        <span className="headline text-text-01">{t("title")}</span>
        <span className="w-[4rem]" aria-hidden="true" />
      </header>
      <div className="w-full h-[4rem] flex-shrink-0" role="none presentation" />
    </>
  );
};

export default EmotionPageHeader;

