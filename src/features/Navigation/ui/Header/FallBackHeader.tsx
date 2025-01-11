import React from "react";
import Header from "./Header";
import { ServerLocaleLink } from "@/entities/Router/index.server";
import { ChevronLeft } from "lucide-react";

const FallBackHeader = ({ fallbackUrl }: { fallbackUrl: string }) => {
  return (
    <>
      <Header className="w-full md:w-[768px] h-[2.75rem] flex flex-row justify-between items-center">
        <ServerLocaleLink className="py-[11px] px-2 text-text-primary flex flex-row gap-1" href={fallbackUrl}>
          <ChevronLeft width={20} height={24} strokeWidth={3} />
          뒤로 가기
        </ServerLocaleLink>

        <ServerLocaleLink className="py-[11px] px-4 text-text-primary flex flex-row gap-1" href="/help">
          도움말
        </ServerLocaleLink>
      </Header>
      <div className="w-full h-[4rem]" role="none presentation" />
    </>
  );
};

export default FallBackHeader;
