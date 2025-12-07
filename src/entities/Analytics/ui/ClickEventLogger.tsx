"use client";

import React, { useCallback } from "react";

import { getSessionId } from "../utils/sessionManager";

type GtagFunction = (
  command: "event" | "config" | "consent" | "js" | "set",
  targetId: string | Date | Record<string, unknown>,
  config?: Record<string, unknown>
) => void;

interface ClickEventLoggerProps {
  children: React.ReactElement;
  /** 이벤트 경로 배열 (예: ['faces', 'main', 'button', 'compare']) */
  path: string[];
  /** 이벤트 속성 */
  properties?: Record<string, string | number | boolean>;
  /** 세션 ID 포함 여부 (기본값: true) */
  includeSessionId?: boolean;
}

/**
 * 클릭 이벤트 로깅을 위한 래퍼 컴포넌트
 *
 * children의 onClick을 래핑하여 GA 이벤트를 전송합니다.
 * 기존 onClick 핸들러도 유지됩니다.
 *
 * @example
 * ```tsx
 * <ClickEventLogger
 *   path={['faces', 'main', 'button', 'compare']}
 *   properties={{ player_count: 3 }}
 * >
 *   <Button>비교하기</Button>
 * </ClickEventLogger>
 * ```
 */
const ClickEventLogger = ({ children, path, properties = {}, includeSessionId = true }: ClickEventLoggerProps) => {
  const child = React.Children.only(children);

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (typeof window !== "undefined") {
        const gtag = (window as unknown as { gtag?: GtagFunction }).gtag;

        if (gtag) {
          // 이벤트 이름: path 배열을 __로 연결 + _click
          // 예: faces__main__button__compare_click
          const eventName = `${path.join("__")}_click`;

          // 이벤트 경로: path 배열을 > 로 연결
          // 예: faces > main > button > compare
          const eventPath = path.join(" > ");

          const eventProperties: Record<string, unknown> = {
            ...properties,
            event_path: eventPath,
          };

          if (includeSessionId) {
            eventProperties.session_id = getSessionId();
          }

          gtag("event", eventName, eventProperties);
        }
      }

      // 기존 onClick 핸들러 실행
      if (child.props.onClick) {
        child.props.onClick(event);
      }
    },
    [path, properties, includeSessionId, child.props]
  );

  return React.cloneElement(child, {
    onClick: handleClick,
  });
};

export default ClickEventLogger;
