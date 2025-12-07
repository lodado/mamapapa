"use client";

/**
 * 튜토리얼 이벤트 추적 훅
 *
 * 튜토리얼 시작/종료 이벤트를 추적하고,
 * 튜토리얼 경험 여부를 세션에 저장합니다.
 */

import { useCallback } from "react";

import type { PageName, TutorialEndStatus } from "../types";
import { markTutorialCompleted, trackEvent } from "../utils";

interface UseTutorialTrackingOptions {
  page: PageName;
}

interface UseTutorialTrackingReturn {
  /** 튜토리얼 시작 이벤트 추적 */
  trackTutorialStart: () => void;
  /** 튜토리얼 종료 이벤트 추적 */
  trackTutorialEnd: (status: TutorialEndStatus) => void;
}

/**
 * 튜토리얼 이벤트를 추적하는 훅
 *
 * @param options.page - 현재 페이지 식별자
 *
 * @example
 * ```tsx
 * const { trackTutorialStart, trackTutorialEnd } = useTutorialTracking({ page: 'faces' });
 *
 * // 튜토리얼 시작 시
 * trackTutorialStart();
 *
 * // 튜토리얼 종료 시
 * trackTutorialEnd('finished'); // or 'skipped'
 * ```
 */
export function useTutorialTracking({ page }: UseTutorialTrackingOptions): UseTutorialTrackingReturn {
  const trackTutorialStart = useCallback(() => {
    trackEvent("tutorial_started", { page });
  }, [page]);

  const trackTutorialEnd = useCallback(
    (status: TutorialEndStatus) => {
      trackEvent("tutorial_ended", { page, status });
      markTutorialCompleted(page);
    },
    [page]
  );

  return {
    trackTutorialStart,
    trackTutorialEnd,
  };
}
