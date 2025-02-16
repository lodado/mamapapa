"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { USER_PLAYER_NAME } from "@/entities";
import { ButtonLink } from "@/entities/Router";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { useFaceModelStore } from "@/features/AiModel/model";
import { useImageSelectorStore } from "@/features/ImageSelector/models";
import { useToastStore } from "@/shared/ui/Toast/stores";

import { START_COMPARE_LINK_ID } from "../configs/constant";

const CompareButtonLink = () => {
  const t = useTranslations();
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
        title: t("COMPARE.ERROR-TITLE"),
        description: t("COMPARE.ERROR-MODEL-NOT-FOUND"),
        type: "error",
      });
      e.preventDefault();
      return;
    }

    if (isUserPlayerNotSelected) {
      addToast({
        title: t("COMPARE.ERROR-TITLE"),
        description: t("COMPARE.ERROR-USER-NOT-SELECTED"),
        type: "error",
      });
      e.preventDefault();
      return;
    }

    if (isLessThanTwoPlayersSelected) {
      addToast({
        title: t("COMPARE.ERROR-TITLE"),
        description: t("COMPARE.ERROR-MIN-TWO-PLAYERS"),
        type: "error",
      });
      e.preventDefault();
      return;
    }

    if (isAnyFaceNotRecognized) {
      addToast({
        title: t("COMPARE.ERROR-TITLE"),
        description: t("COMPARE.ERROR-FACE-NOT-RECOGNIZED"),
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
      {t("COMPARE.BUTTON")}
    </ButtonLink>
  );
};

export default CompareButtonLink;
