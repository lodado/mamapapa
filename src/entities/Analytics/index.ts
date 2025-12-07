/**
 * Analytics Entity
 *
 * Google Analytics 기반의 이벤트 추적 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * // 훅 사용
 * import { useTutorialTracking, useNavigationTracking } from '@/entities/Analytics';
 *
 * // 컴포넌트 사용
 * import { ClickEventLogger, TypedClickEventLogger } from '@/entities/Analytics';
 *
 * // 유틸 직접 사용
 * import { trackEvent, hasTutorialCompleted } from '@/entities/Analytics';
 * ```
 */

// UI Components
export { ClickEventLogger, TypedClickEventLogger } from "./ui";

// Hooks
export { useNavigationTracking, useTutorialTracking } from "./hooks";

// Utils
export {
  getSessionId,
  hasTutorialCompleted,
  markTutorialCompleted,
  resetAllTutorialCompleted,
  resetSessionId,
  resetTutorialCompleted,
  trackEvent,
} from "./utils";

// Types
export type {
  AnalyticsEventMap,
  AnalyticsEventName,
  BaseEventProperties,
  NextPhaseClickedEvent,
  PageName,
  TutorialEndedEvent,
  TutorialEndStatus,
  TutorialStartedEvent,
} from "./types";
