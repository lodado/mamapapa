"use client";

import { LocaleLink } from "@/entities/Router";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { Header } from "@/features";
import { ChevronLeft } from "lucide-react";

import SimminIcon from "/public/SimminIcon.svg";
import React from "react";

const FacePageHeader = () => {
  return (
    <div className="z-header fixed w-full md:w-[768px] top-0 bg-background-op-01 border-b border-b-solid border-b-border-02">
      <>
        <Header className="z-header w-full md:w-[768px] h-[2.75rem] fixed top-0 flex flex-row justify-between items-center">
          <LocaleLink
            className="py-[11px] px-2 text-text-primary flex flex-row items-center gap-1"
            href={PAGE_ROUTE.FACES}
          >
            <ChevronLeft width={20} height={24} strokeWidth={3} />
            <SimminIcon width="32px" height="32px" />
          </LocaleLink>
        </Header>
        <div className="w-full h-[4rem] flex-shrink-0" role="none presentation" />
      </>
    </div>
  );
};

export default FacePageHeader;
