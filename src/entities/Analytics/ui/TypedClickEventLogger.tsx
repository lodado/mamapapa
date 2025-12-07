"use client";

import React, { useCallback } from "react";

import type { AnalyticsEventMap, AnalyticsEventName } from "../types";
import { trackEvent } from "../utils";

interface TypedClickEventLoggerProps<T extends AnalyticsEventName> {
  children: React.ReactElement;
  /** 이벤트 이름 */
  eventName: T;
  /** 이벤트 속성 */
  properties: AnalyticsEventMap[T];
  /** 세션 ID 포함 여부 (기본값: true) */
  includeSessionId?: boolean;
}

/**
 * 타입 안전한 클릭 이벤트 로깅 컴포넌트
 *
 * 정의된 이벤트 타입만 사용할 수 있어 타입 안전성을 보장합니다.
 *
 * @example
 * ```tsx
 * <TypedClickEventLogger
 *   eventName="next_phase_clicked"
 *   properties={{ from: 'faces', had_tutorial: true }}
 * >
 *   <Button>다음 단계</Button>
 * </TypedClickEventLogger>
 * ```
 */
function TypedClickEventLogger<T extends AnalyticsEventName>({
  children,
  eventName,
  properties,
  includeSessionId = true,
}: TypedClickEventLoggerProps<T>) {
  const child = React.Children.only(children);

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      trackEvent(eventName, properties, { includeSessionId });

      // 기존 onClick 핸들러 실행
      if (child.props.onClick) {
        child.props.onClick(event);
      }
    },
    [eventName, properties, includeSessionId, child.props]
  );

  return React.cloneElement(child, {
    onClick: handleClick,
  });
}

export default TypedClickEventLogger;
