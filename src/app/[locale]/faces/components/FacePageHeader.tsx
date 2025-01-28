"use client";

import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import FallBackHeader from "@/features/Navigation/ui/Header/FallBackHeader";
import { useScrollDirection, useScrollTrigger } from "@/shared/hooks";
import React from "react";

const FacePageHeader = () => {
  const { triggered: hideSecondLine } = useScrollTrigger({ threshold: 150 });

  return (
    <div className="z-header fixed w-full md:w-[768px] top-0 bg-background-op-01 border-b border-b-solid border-b-border-02">
      <FallBackHeader fallbackUrl={PAGE_ROUTE.MAIN} />

      <div
        className={`
        transition-all 
        duration-300
        ${hideSecondLine ? "max-h-0 overflow-hidden opacity-0" : "max-h-[5rem] opacity-100"}
      `}
      >
        <h1 className="md:w-[768px] top-[4rem] h-[3rem] display-2 pb-2 flex flex-row justify-start mb-2 w-full text-text-01 px-[1rem] items-center ">
          <span className="h-[2.25rem]">닮은꼴 비교하기</span>
        </h1>
      </div>
    </div>
  );
};

export default FacePageHeader;
