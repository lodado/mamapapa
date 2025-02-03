"use client";

import React from "react";

import { USER_PLAYER_NAME } from "@/entities";
import { ButtonLink } from "@/entities/Router";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { useFaceModelStore } from "@/features/AiModel/model";
import { useImageSelectorStore } from "@/features/ImageSelector/models";
import { useToastStore } from "@/shared/ui/Toast/stores";

import { START_COMPARE_LINK_ID } from "../configs/constant";

const CompareButtonLink = () => {
  const { addToast } = useToastStore();
  const { images } = useImageSelectorStore();
  const { faceRecognitionModel } = useFaceModelStore();

  const modelNotFound = !faceRecognitionModel;

  const isUserPlayerNotSelected = images.every((image) => image.selectedPlayer !== USER_PLAYER_NAME);

  const isLessThanTwoPlayersSelected =
    new Set(images.filter((image) => !!image.selectedPlayer).map((image) => image.selectedPlayer)).size <= 1;

  const isAnyFaceNotRecognized = images
    .filter((image) => !!image.selectedPlayer)
    .some((image) => image.faceCoordinates.height <= 0 && image.faceCoordinates.width <= 0);

  const disabled = modelNotFound || isUserPlayerNotSelected || isLessThanTwoPlayersSelected || isAnyFaceNotRecognized;

  const handleValidationSubmit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (modelNotFound) {
      addToast({
        title: "에러",
        description: "얼굴 인식 모델을 다운로드 중입니다.",
        type: "error",
      });
      e.preventDefault();
      return;
    }

    if (isUserPlayerNotSelected) {
      addToast({
        title: "에러",
        description: "비교 대상(나)를 지정해주세요.",
        type: "error",
      });
      e.preventDefault();
      return;
    }

    if (isLessThanTwoPlayersSelected) {
      addToast({
        title: "에러",
        description: "최소 두명 이상의 비교 대상을 지정해주세요.",
        type: "error",
      });
      e.preventDefault();
      return;
    }

    /**  */
    if (isAnyFaceNotRecognized) {
      addToast({
        title: "에러",
        description: "얼굴이 인식되지 않은 사진이 있습니다.",
        type: "error",
      });
      e.preventDefault();
      return;
    }
  };

  return (
    <ButtonLink
      id={START_COMPARE_LINK_ID}
      aria-disabled={disabled}
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
