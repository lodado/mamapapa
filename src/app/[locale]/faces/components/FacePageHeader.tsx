"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { useScrollTrigger } from "@/shared/hooks";

import FallBackHeader from "./FallBackHeader";

const FacePageHeader = () => {
  const t = useTranslations();
  const { triggered: hideSecondLine } = useScrollTrigger({ threshold: 150 });

  return (
    <div className="z-nav fixed w-full md:w-[768px] top-0 bg-background-op-01 border-b border-b-solid border-b-border-02">
      <FallBackHeader fallbackUrl={PAGE_ROUTE.MAIN} />

      <div
        className={`
        transition-all 
        duration-300
        ${hideSecondLine ? "max-h-0 overflow-hidden opacity-0" : "max-h-[5rem] opacity-100"}
      `}
      >
        <h1 className="md:w-[768px] top-[4rem] h-[3rem] display-2 pb-2 flex flex-row justify-start mb-2 w-full text-text-01 px-[1rem] items-center ">
          <span className="h-[2.25rem]">{t("FACES.PAGE-HEADER")}</span>
        </h1>
      </div>
    </div>
  );
};

export default FacePageHeader;
