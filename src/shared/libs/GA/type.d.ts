/// <reference types="gtag.js" />

declare module "gtag.js";

// Window 인터페이스에 gtag 함수 추가
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "consent" | "config" | "event" | "js" | "set",
      targetId: string | Date | Record<string, unknown>,
      config?: Record<string, unknown>
    ) => void;
  }
}
