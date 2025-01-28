"use client";

import { USER_PLAYER_NAME } from "@/entities";
import { ButtonLink } from "@/entities/Router";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { useImageSelectorStore } from "@/features/ImageSelector/models";
import { useToastStore } from "@/shared/ui/Toast/stores";

import { usePathname } from "next/navigation";
import React from "react";

const CompareButtonLink = () => {
  const { addToast } = useToastStore();
  const { images } = useImageSelectorStore();

  const handleValidationSubmit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (images.every((image) => image.selectedPlayer !== USER_PLAYER_NAME)) {
      addToast({
        title: "에러",
        description: "비교 대상(나)를 지정해주세요.",
        type: "error",
      });
      e.preventDefault();
      return;
    }

    if (new Set(images.filter((image) => !!image.selectedPlayer).map((image) => image.selectedPlayer)).size <= 1) {
      addToast({
        title: "에러",
        description: "최소 두명 이상의 비교 대상을 지정해주세요.",
        type: "error",
      });
      e.preventDefault();
      return;
    }
  };

  return (
    <ButtonLink
      onClickCapture={handleValidationSubmit}
      wrapperClassName="w-full max-w-[29rem]"
      variant="primarySolid"
      href={PAGE_ROUTE.RESULT}
    >
      비교하기
    </ButtonLink>
  );
};

export default CompareButtonLink;
