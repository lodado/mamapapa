"use client";

import { useTranslations } from "next-intl";
import React, { useMemo } from "react";

import { TutorialConnector, TutorialStep } from "@/entities/Tutorial";

import { CELEBRITY_TUTORIAL_IDS } from "../configs/tutorialConstants";

const CelebrityTutorialConnector = () => {
  const t = useTranslations("CELEBRITYFACES");

  const steps: TutorialStep[] = useMemo(
    () => [
      {
        target: `#${CELEBRITY_TUTORIAL_IDS.SEARCH_INPUT}`,
        content: (
          <div>
            <p>{t("TUTORIAL-STEP-1")}</p>
          </div>
        ),
        disableBeacon: true,
        callbackBeforeStart: () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
      {
        target: `#${CELEBRITY_TUTORIAL_IDS.CELEBRITY_CARD}`,
        content: (
          <div>
            <p>{t("TUTORIAL-STEP-2")}</p>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: `#${CELEBRITY_TUTORIAL_IDS.ADD_BUTTON}`,
        disableBeacon: true,
        spotlightClicks: true,
        content: (
          <div>
            <p>{t("TUTORIAL-STEP-3")}</p>
          </div>
        ),
      },
    ],
    [t]
  );

  return <TutorialConnector steps={steps} />;
};

export default CelebrityTutorialConnector;
