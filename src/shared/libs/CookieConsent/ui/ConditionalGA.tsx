"use client";

import Script from "next/script";
import React from "react";

import { GA_KEY } from "../../GA/constant";
import { useCookieConsentStore } from "../store";

interface ConditionalGAProps {
  nonce: string;
}

export function ConditionalGA({ nonce }: ConditionalGAProps) {
  const { hasConsented, preferences } = useCookieConsentStore();

  // 쿠키 동의가 없거나 분석 쿠키가 비활성화된 경우 GA를 로드하지 않음
  if (!hasConsented || !preferences.analytics) {
    return null;
  }

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_KEY}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
      <Script id="ga-script" nonce={nonce} strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_KEY}');
        `}
      </Script>
    </>
  );
}
