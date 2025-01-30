"use client";

import { useIsClient } from "@/shared/hooks";
import { ComponentProps, useMemo } from "react";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import { useTutorialStore } from "../stores";

interface ReactTutorialProps extends Omit<ComponentProps<typeof Joyride>, "run"> {}

interface JoyrideCallbackData extends CallBackProps {}

const Tutorial = ({ steps, ...rest }: ReactTutorialProps) => {
  const isClient = useIsClient();
  const { run, setRuns: onChangeRun } = useTutorialStore();

  const handleJoyrideCallback = (data: JoyrideCallbackData) => {
    const { status, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    // @ts-ignore
    if (finishedStatuses.includes(status)) {
      onChangeRun(false);
    }
  };

  const preprocessedSteps = useMemo(() => {
    return steps.map((step) => {
      return {
        disableBeacon: true,
        ...step,
      };
    });
  }, [steps]);

  return (
    <>
      {isClient && (
        <Joyride
          steps={preprocessedSteps}
          continuous
          run={run}
          scrollToFirstStep
          showProgress
          showSkipButton
          styles={{
            options: {
              zIndex: 50,
            },
          }}
          {...rest}
          callback={handleJoyrideCallback}
        />
      )}
    </>
  );
};

export default Tutorial;
