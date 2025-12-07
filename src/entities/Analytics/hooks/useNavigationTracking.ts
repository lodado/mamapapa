"use client";

/**
 * 네비게이션 이벤트 추적 훅
 *
 * 페이지 간 이동 이벤트를 추적합니다.
 */

import { useCallback } from "react";

import type { PageName } from "../types";
import { hasTutorialCompleted, trackEvent } from "../utils";

interface UseNavigationTrackingOptions {
  from: PageName;
}

interface UseNavigationTrackingReturn {
  /** 다음 페이즈 클릭 이벤트 추적 */
  trackNextPhaseClick: () => void;
}

/**
 * 네비게이션 이벤트를 추적하는 훅
 *
 * @param options.from - 출발 페이지 식별자
 *
 * @example
 * ```tsx
 * const { trackNextPhaseClick } = useNavigationTracking({ from: 'faces' });
 *
 * <Link onClick={trackNextPhaseClick} href="/celebrity">
 *   다음 단계
 * </Link>
 * ```
 */
export function useNavigationTracking({ from }: UseNavigationTrackingOptions): UseNavigationTrackingReturn {
  const trackNextPhaseClick = useCallback(() => {
    const hadTutorial = hasTutorialCompleted(from);
    trackEvent("next_phase_clicked", {
      from,
      had_tutorial: hadTutorial,
    });
  }, [from]);

  return {
    trackNextPhaseClick,
  };
}
