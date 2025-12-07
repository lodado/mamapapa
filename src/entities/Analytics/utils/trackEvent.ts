/**
 * Vercel Analytics 이벤트 추적 래퍼
 *
 * 타입 안전한 이벤트 추적과 세션 ID 자동 첨부를 제공합니다.
 */

import { track } from "@vercel/analytics";

import type { AnalyticsEventMap, AnalyticsEventName } from "../types";
import { getSessionId } from "./sessionManager";

/**
 * 타입 안전한 이벤트 추적 함수
 *
 * @param eventName - 추적할 이벤트 이름
 * @param properties - 이벤트 속성
 * @param options - 추가 옵션
 * @param options.includeSessionId - 세션 ID 자동 첨부 여부 (기본값: true)
 *
 * @example
 * ```ts
 * trackEvent('tutorial_started', { page: 'faces' });
 * trackEvent('tutorial_ended', { page: 'faces', status: 'finished' });
 * trackEvent('next_phase_clicked', { from: 'faces', had_tutorial: true });
 * ```
 */
export function trackEvent<T extends AnalyticsEventName>(
  eventName: T,
  properties: AnalyticsEventMap[T],
  options?: { includeSessionId?: boolean }
): void {
  const { includeSessionId = true } = options ?? {};

  const eventProperties = includeSessionId ? { ...properties, session_id: getSessionId() } : properties;

  track(eventName, eventProperties as unknown as Record<string, string | number | boolean | null>);
}
