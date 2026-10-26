"use client";

import "./style.scss";

import { ComponentProps, useEffect, useMemo } from "react";
import { preload } from "react-dom";
import { EventData, Joyride, STATUS } from "react-joyride";

import { useIsClient } from "@/shared/hooks";

import { TutorialStep, useTutorialStore } from "../stores";

/** 튜토리얼 종료 상태 */
export type TutorialEndStatus = "finished" | "skipped";

interface ReactTutorialProps extends Omit<ComponentProps<typeof Joyride>, "run"> {
  steps: TutorialStep[];
  /** 튜토리얼 종료 시 호출되는 콜백 */
  onTutorialEnd?: (status: TutorialEndStatus) => void;
}

const defaultOptions = {
  arrowBase: 50,
  arrowSize: 50,
  backgroundColor: "transparent",
  beaconSize: 36,
  overlayColor: "rgba(0, 0, 0, 0.5)",
  primaryColor: "var(--Primary-01)",
  skipScroll: true,
  textColor: "var(--Text-00)",
};

const Tutorial = ({ steps, onTutorialEnd, ...rest }: ReactTutorialProps) => {
  const isClient = useIsClient();
  const { run, setRuns } = useTutorialStore();

  const handleJoyrideCallback = (data: EventData) => {
    const { status, index, type } = data;
    const step = steps[index];

    if (type === "step:before") {
      step.callbackBeforeStart?.(index);
      /* 
          Using querySelector in React might feel nasty,
          but since react-joyride uses element Id as targets, 
          it's effective in this case.
        */
      const element = document.querySelector(step.target);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    if (type === "step:after") {
      step.callbackAfterStart?.(index);
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      const endStatus: TutorialEndStatus = status === STATUS.FINISHED ? "finished" : "skipped";
      onTutorialEnd?.(endStatus);
      setRuns(false);
    }
  };

  const preprocessedSteps = useMemo(() => {
    return steps.map(({ callbackBeforeStart, callbackAfterStart, disableBeacon, spotlightClicks, ...step }) => {
      return {
        ...step,
        skipBeacon: disableBeacon,
        blockTargetInteraction: !spotlightClicks,
      };
    });
  }, [steps]);

  useEffect(() => {
    /** cursor image preload */
    preload("https://qmwtuvttspuxwuwrsuci.supabase.co/storage/v1/object/public/pokitokiStorage//finger.webp", {
      as: "image",
      fetchPriority: "low",
    });
  }, []);

  return (
    <>
      {isClient && (
        <Joyride
          steps={preprocessedSteps}
          continuous={false} // Next 버튼 제거
          run={run}
          scrollToFirstStep={false}
          options={{ ...defaultOptions, buttons: [] }}
          floatingOptions={{}}
          styles={{
            tooltip: { width: "max-content" },
            buttonPrimary: {
              display: "none", // Next 버튼 숨기기
            },
            buttonBack: {
              display: "none", // Back 버튼 숨기기
            },
            buttonClose: {
              display: "none", // 닫기 버튼 숨기기
            },
          }}
          {...rest}
          onEvent={handleJoyrideCallback}
        />
      )}
    </>
  );
};

export default Tutorial;
