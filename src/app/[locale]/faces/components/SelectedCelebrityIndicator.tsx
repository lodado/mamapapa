"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { useImageSelectorStore } from "@/features/ImageSelector/models";

const SelectedCelebrityIndicator = () => {
  const t = useTranslations();
  const { images } = useImageSelectorStore();

  // 연예인 이미지 찾기 (Myself가 아닌 플레이어)
  const celebrityImage = images.find((image) => image.selectedPlayer && image.selectedPlayer !== t("PLAYERS.Myself"));

  if (!celebrityImage) {
    return null;
  }

  return (
    <div className="w-full px-4 mb-4">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-background-02 border border-border-02">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-background-01">
            <img src={celebrityImage.url} alt={celebrityImage.selectedPlayer} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex-grow">
          <p className="body-2 text-text-02 mb-1">{t("FACES.SELECTED-CELEBRITY")}</p>
          <p className="subhead-3 text-text-01">{celebrityImage.selectedPlayer}</p>
        </div>
      </div>
    </div>
  );
};

export default SelectedCelebrityIndicator;
