import React from "react";
import Header from "./Header";
import { LocaleLink, ServerLocaleLink } from "@/entities/Router/index.server";
import { ChevronLeft } from "lucide-react";

const FallBackHeader = ({ fallbackUrl }: { fallbackUrl: string }) => {
  return (
    <>
      <Header className="w-full bg-background-op-01 md:w-[768px] h-[2.75rem] fixed top-0 flex flex-row justify-between items-center">
        <LocaleLink className="py-[11px] px-2 text-text-primary flex flex-row gap-1" href={fallbackUrl}>
          <ChevronLeft width={20} height={24} strokeWidth={3} />
          뒤로 가기
        </LocaleLink>

        <LocaleLink className="py-[11px] px-4 text-text-primary flex flex-row gap-1" href="/help">
          도움말
        </LocaleLink>
      </Header>
      <div className="w-full h-[4rem] flex-shrink-0" role="none presentation" />
    </>
  );
};

export default FallBackHeader;
