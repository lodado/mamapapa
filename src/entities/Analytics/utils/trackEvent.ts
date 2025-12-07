/**
 * Google Analytics 이벤트 추적 래퍼
 *
 * 타입 안전한 이벤트 추적과 세션 ID 자동 첨부를 제공합니다.
 */

import type { AnalyticsEventMap, AnalyticsEventName } from "../types";
import { getSessionId } from "./sessionManager";

type GtagFunction = (
  command: "event" | "config" | "consent" | "js" | "set",
  targetId: string | Date | Record<string, unknown>,
  config?: Record<string, unknown>
) => void;

/**
 * 타입 안전한 이벤트 추적 함수 (Google Analytics)
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
  if (typeof window === "undefined") return;

  const gtag = (window as unknown as { gtag?: GtagFunction }).gtag;
  if (!gtag) return;

  const { includeSessionId = true } = options ?? {};

  const eventProperties = includeSessionId ? { ...properties, session_id: getSessionId() } : properties;

  gtag("event", eventName, eventProperties as unknown as Record<string, unknown>);
}
