// store/tutorialStore.ts
import { ReactNode } from "react";
import { create } from "zustand";

export interface TutorialStep {
  target: string;
  content: ReactNode;
  locale?: {
    skip: ReactNode;
  };
  disableBeacon: boolean;
}

export interface TutorialStoreState {
  steps: TutorialStep[];
  setSteps: (steps: TutorialStep[]) => void;

  run: boolean;
  setRuns: (newRunState: boolean) => void;
}

export const useTutorialStore = create<TutorialStoreState>((set) => ({
  // 초기 상태
  steps: [],

  // steps 설정 함수
  setSteps: (newSteps) => set({ steps: newSteps }),

  run: false,
  setRuns: (newRunState: boolean) => set({ run: newRunState }),
}));
