/**
 * Analytics 이벤트 타입 정의
 */

/** 페이지 식별자 */
export type PageName = "faces" | "celebrity" | "result";

/** 튜토리얼 종료 상태 */
export type TutorialEndStatus = "finished" | "skipped";

/** 기본 이벤트 속성 */
export interface BaseEventProperties {
  page: PageName;
  session_id?: string;
}

/** 튜토리얼 시작 이벤트 */
export interface TutorialStartedEvent extends BaseEventProperties {}

/** 튜토리얼 종료 이벤트 */
export interface TutorialEndedEvent extends BaseEventProperties {
  status: TutorialEndStatus;
}

/** 다음 페이즈 클릭 이벤트 */
export interface NextPhaseClickedEvent {
  from: PageName;
  had_tutorial: boolean;
  session_id?: string;
}

/** 모든 이벤트 타입 맵 */
export interface AnalyticsEventMap {
  tutorial_started: TutorialStartedEvent;
  tutorial_ended: TutorialEndedEvent;
  next_phase_clicked: NextPhaseClickedEvent;
}

/** 이벤트 이름 타입 */
export type AnalyticsEventName = keyof AnalyticsEventMap;
