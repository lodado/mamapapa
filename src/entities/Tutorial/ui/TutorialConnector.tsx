"use client";

import { useLayoutEffect } from "react";

import { TutorialStep, useTutorialStore } from "../stores/tutorialStore";
import Tutorial, { TutorialEndStatus } from "./Tutorial";

interface TutorialConnectorProps {
  steps: TutorialStep[];
  /** 튜토리얼 종료 시 호출되는 콜백 */
  onTutorialEnd?: (status: TutorialEndStatus) => void;
}

const TutorialConnector = ({ steps: initSteps, onTutorialEnd }: TutorialConnectorProps) => {
  const { steps: steps, setSteps } = useTutorialStore();

  useLayoutEffect(() => {
    setSteps(initSteps);
  }, [initSteps, setSteps]);

  return <Tutorial steps={steps} onTutorialEnd={onTutorialEnd} />;
};

export default TutorialConnector;
