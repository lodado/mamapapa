"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { useScrollTrigger } from "@/shared/hooks";

import FallBackHeader from "../../components/FallBackHeader";

const CelebrityPageHeader = () => {
  const t = useTranslations("CELEBRITYFACES");
  const { triggered: hideSecondLine } = useScrollTrigger({ threshold: 150 });

  return (
    <div className="z-nav fixed w-full md:w-[768px] top-0 bg-background-op-01 border-b border-b-solid border-b-border-02">
      <FallBackHeader fallbackUrl={PAGE_ROUTE.MAIN} />

      <div
        className={`
        transition-all
        duration-300
        ${hideSecondLine ? "max-h-0 overflow-hidden opacity-0" : "max-h-[6rem] opacity-100"}
      `}
      >
        <h1 className="md:w-[768px] top-[4rem] h-[3rem] display-2 pb-2 flex flex-col justify-start mb-1 w-full text-text-01 px-[1rem] items-start">
          <span className="h-[2.25rem]">{t("HEADER_TITLE")}</span>
        </h1>
        <p className="md:w-[768px] px-[1rem] pb-3 text-text-03 body-2">
          {t("CELEBRITY_SECTION_DESCRIPTION")}
        </p>
      </div>
    </div>
  );
};

export default CelebrityPageHeader;
