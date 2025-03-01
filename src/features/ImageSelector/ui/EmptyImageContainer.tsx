"use client";

import { useTranslations } from "next-intl";
import React from "react";

import ImageContainerSvg from "./ImageContainer.svg";

const EmptyImageContainer = () => {
  const t = useTranslations("IMAGES");

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <ImageContainerSvg />

      <span className="text-text-01 headline m-2">{t("EMPTY-IMAGE-TITLE")}</span>

      <div className="flex flex-col w-full justify-center items-center">
        <span className="text-text-03 body-2 flex w-full justify-center items-center">
          {t("EMPTY-IMAGE-DESCRIPTION-1")}
        </span>
        <span className="text-text-03 body-2 flex w-full justify-center items-center">
          {t("EMPTY-IMAGE-DESCRIPTION-2")}
        </span>

        <span className="text-text-03 mt-6 body-3 flex w-full justify-center items-center">
          {t("ImageUpload-info")}
        </span>
      </div>
    </div>
  );
};

export default EmptyImageContainer;
