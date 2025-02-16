"use client";

import { useTranslations } from "next-intl";
import React, { useMemo } from "react";

import { TutorialConnector, TutorialStep } from "@/entities/Tutorial";
import { ADDITIONAL_OPTION_DROPDOWN_ID, PLAYER_SELECTOR_ID } from "@/features";
import { useImageSelectorStore } from "@/features/ImageSelector/models";

import { ADD_PICTURE_BUTTON_ID, EXAMPLE_IMAGE_DATA_ID, START_COMPARE_LINK_ID } from "../configs/constant";

const FacePageTutorialConnector = () => {
  const t = useTranslations("FACES");
  const { addImages, removeImage } = useImageSelectorStore();

  const EXAMPLE_IMAGE = useMemo(() => {
    return {
      id: EXAMPLE_IMAGE_DATA_ID,
      url: "https://qmwtuvttspuxwuwrsuci.supabase.co/storage/v1/object/public/pokitokiStorage//iu.jpg",
      file: new File([""], "https://qmwtuvttspuxwuwrsuci.supabase.co/storage/v1/object/public/pokitokiStorage//iu.jpg"),
      faceCoordinates: {
        x: 100,
        y: 150,
        width: 600,
        height: 600,
      },
      selectedPlayer: undefined,
    };
  }, []);

  const steps: TutorialStep[] = useMemo(
    () => [
      {
        target: `#${ADD_PICTURE_BUTTON_ID}`,
        content: (
          <div>
            <p>{t("TUTORIAL-STEP-1")}</p>
          </div>
        ),
        disableBeacon: true,
        callbackBeforeStart: () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          addImages([EXAMPLE_IMAGE]);
        },
      },
      {
        target: `#${EXAMPLE_IMAGE_DATA_ID}`,
        content: (
          <div>
            <p>{t("TUTORIAL-STEP-2")}</p>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: `#${PLAYER_SELECTOR_ID}`,
        disableBeacon: true,
        spotlightClicks: true,
        content: (
          <div>
            <p>{t("TUTORIAL-STEP-3")}</p>
          </div>
        ),
      },
      {
        target: `#${ADDITIONAL_OPTION_DROPDOWN_ID}`,
        disableBeacon: true,
        spotlightClicks: true,
        content: (
          <div>
            <p>{t("TUTORIAL-STEP-4")}</p>
          </div>
        ),
      },
      {
        target: `#${START_COMPARE_LINK_ID}`,
        content: (
          <div>
            <p>{t("TUTORIAL-STEP-5")}</p>
          </div>
        ),
        disableBeacon: true,
        callbackAfterStart: () => {
          removeImage(EXAMPLE_IMAGE);
        },
      },
    ],
    [t, addImages, removeImage, EXAMPLE_IMAGE]
  );

  return <TutorialConnector steps={steps} />;
};

export default FacePageTutorialConnector;
