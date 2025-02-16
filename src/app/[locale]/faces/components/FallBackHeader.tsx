"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { LocaleLink } from "@/entities/Router/index.server";
import { useTutorialStore } from "@/entities/Tutorial";
import { Header } from "@/features";
import { Button } from "@/shared/ui";

const FallBackHeader = ({ fallbackUrl }: { fallbackUrl: string }) => {
  const t = useTranslations("FACES");
  const { setRuns } = useTutorialStore();

  return (
    <>
      <Header className="z-header w-full md:w-[768px] h-[2.75rem] fixed top-0 flex flex-row justify-between items-center">
        <LocaleLink className="py-[11px] px-2 text-text-primary flex flex-row gap-1" href={fallbackUrl}>
          <ChevronLeft width={20} height={24} strokeWidth={3} />
          {t("BUTTON-BACK")}
        </LocaleLink>

        <Button
          onClick={() => {
            setRuns(true);
          }}
          variant="link"
          className="py-[11px] px-4 text-text-primary flex flex-row gap-1"
        >
          {t("BUTTON-HELP")}
        </Button>
      </Header>
      <div className="w-full h-[4rem] flex-shrink-0" role="none presentation" />
    </>
  );
};

export default FallBackHeader;
