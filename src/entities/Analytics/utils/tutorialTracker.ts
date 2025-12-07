/**
 * 튜토리얼 경험 추적 유틸리티
 *
 * 세션 동안 사용자가 튜토리얼을 경험했는지 추적합니다.
 */

import type { PageName } from "../types";

const TUTORIAL_COMPLETED_PREFIX = "tutorial_completed_";

/**
 * 특정 페이지에서 튜토리얼을 완료했음을 기록합니다.
 */
export function markTutorialCompleted(page: PageName): void {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(`${TUTORIAL_COMPLETED_PREFIX}${page}`, "true");
}

/**
 * 특정 페이지에서 튜토리얼을 경험했는지 확인합니다.
 */
export function hasTutorialCompleted(page: PageName): boolean {
  if (typeof window === "undefined") return false;

  return sessionStorage.getItem(`${TUTORIAL_COMPLETED_PREFIX}${page}`) === "true";
}

/**
 * 특정 페이지의 튜토리얼 경험 기록을 초기화합니다.
 */
export function resetTutorialCompleted(page: PageName): void {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(`${TUTORIAL_COMPLETED_PREFIX}${page}`);
}

/**
 * 모든 페이지의 튜토리얼 경험 기록을 초기화합니다.
 */
export function resetAllTutorialCompleted(): void {
  if (typeof window === "undefined") return;

  const pages: PageName[] = ["faces", "celebrity", "result"];
  pages.forEach((page) => {
    sessionStorage.removeItem(`${TUTORIAL_COMPLETED_PREFIX}${page}`);
  });
}
