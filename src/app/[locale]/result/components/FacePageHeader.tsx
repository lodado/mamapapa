"use client";

import { ChevronLeft } from "lucide-react";
import React from "react";

import { LocaleLink } from "@/entities/Router";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { Header } from "@/features";
import { useScrollTrigger } from "@/shared/hooks";

const FacePageHeader = () => {
  const { triggered: hideSecondLine } = useScrollTrigger({ threshold: 150 });

  return (
    <>
      <div className="z-header fixed w-full md:w-[768px] top-0 bg-background-op-01 border-b border-b-solid border-b-border-02">
        <>
          <Header className="z-header w-full md:w-[768px] h-[2.75rem] fixed top-0 flex flex-row justify-between items-center">
            <LocaleLink
              className="py-[11px] px-2 text-text-primary flex flex-row items-center gap-1"
              href={PAGE_ROUTE.FACES}
            >
              <ChevronLeft width={20} height={24} strokeWidth={3} />
              뒤로 가기
            </LocaleLink>
          </Header>
          <div className="w-full h-[4rem] flex-shrink-0" role="none presentation" />
        </>

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
      <div className="w-full h-[3rem] flex-shrink-0" role="none presentation" />
    </>
  );
};

export default FacePageHeader;
