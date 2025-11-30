"use client";

import Script from "next/script";
import { useEffect } from "react";

import useIsClient from "../../hooks/useIsClient";
import { useCookieConsentStore } from "../CookieConsent/store";
import { GA_KEY } from "./constant";

interface GAConsentModeProps {
  nonce: string;
}

/**
 * GA4 Consent Mode v2 구현
 *
 * 동의 여부와 관계없이 GA 스크립트를 로드하고,
 * 동의하지 않은 사용자에 대해서는 익명화된 ping을 전송하여
 * GA가 behavioral modeling으로 추정치를 제공합니다.
 *
 * - 동의한 유저: 실제 데이터 수집
 * - 동의하지 않은 유저: 추정 데이터 (모델링)
 */
export function GAConsentMode({ nonce }: GAConsentModeProps) {
  const { hasConsented, preferences } = useCookieConsentStore();
  const isClient = useIsClient();

  // 동의 상태 변경 시 consent 업데이트 (초기 마운트 및 상태 변경 시)
  useEffect(() => {
    if (!isClient || typeof window === "undefined") {
      return;
    }

    // ga-consent-mode 스크립트가 이미 실행되어 window.gtag가 정의되어 있음
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (!gtag) {
      return;
    }

    const analyticsConsent = hasConsented && preferences.analytics ? "granted" : "denied";

    gtag("consent", "update", {
      analytics_storage: analyticsConsent,
    });
  }, [isClient, hasConsented, preferences.analytics]);

  return (
    <>
      {/* GA 스크립트 로드 - 동의 여부와 관계없이 항상 로드 */}
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_KEY}`}
        strategy="afterInteractive"
        nonce={nonce}
      />

      {/* Consent Mode v2 초기화 및 GA 설정 */}
      <Script id="ga-consent-mode" nonce={nonce} strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500,
          });

          // GA4 설정
          gtag('config', '${GA_KEY}', {
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
          });
        `}
      </Script>
    </>
  );
}
