/**
 * 세션 ID 관리 유틸리티
 *
 * 브라우저 세션 동안 유지되는 고유 ID를 생성/관리하여
 * 같은 세션의 이벤트들을 연결할 수 있게 합니다.
 */

const SESSION_ID_KEY = "analytics_session_id";

/**
 * 현재 세션의 고유 ID를 반환합니다.
 * 세션 ID가 없으면 새로 생성합니다.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

/**
 * 세션 ID를 초기화합니다.
 * (새 세션 시작 시 사용)
 */
export function resetSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const newSessionId = crypto.randomUUID();
  sessionStorage.setItem(SESSION_ID_KEY, newSessionId);
  return newSessionId;
}
