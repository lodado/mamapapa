"use client";

import { TutorialConnector, TutorialStep } from "@/entities/Tutorial";
import { useImageSelectorStore } from "@/features/ImageSelector/models";
import React, { useMemo } from "react";
import { ADD_PICTURE_BUTTON_ID, EXAMPLE_IMAGE_DATA_ID, START_COMPARE_LINK_ID } from "../configs/constant";
import { PLAYER_SELECTOR_ID } from "@/features";

const EXAMPLE_IMAGE = {
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

const FacePageTutorialConnector = () => {
  const { addImages, removeImage } = useImageSelectorStore();

  const steps: TutorialStep[] = useMemo(
    () => [
      {
        target: `#${ADD_PICTURE_BUTTON_ID}`,
        content: (
          <div>
            <p>비교하고 싶은 사진들을 </p>
            <p>넣어주세요.</p>
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
            <p>사진에서 얼굴만 추출해서 </p>
            <p>확인 가능해요!.</p>
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
            <p>나를 필수 선택하고 비교할 대상을</p>
            <p>최소 1명이상 분류해주세요</p>
          </div>
        ),

        callbackBeforeStart: () => {},
      },

      {
        target: `#${START_COMPARE_LINK_ID}`,
        content: (
          <div>
            <p>선택이 완료되면 </p>
            <p>버튼을 눌러주세요!</p>
          </div>
        ),
        disableBeacon: true,

        callbackAfterStart: () => {
          removeImage(EXAMPLE_IMAGE);
        },
      },
    ],
    []
  );

  return <TutorialConnector steps={steps} />;
};

export default FacePageTutorialConnector;
