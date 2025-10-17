"use client";

import { useState } from "react";

import useIsClient from "../../../hooks/useIsClient";
import { useCookieConsentStore } from "../store";
import { CookieConsentBanner, CookiePreferencesModal } from "./CookieConsentBanner";

interface CookieConsentProviderProps {
  children: React.ReactNode;
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  const { hasConsented, isBannerVisible, acceptAll, rejectAll, acceptSelected, hideBanner } = useCookieConsentStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isClient = useIsClient();

  const handleAcceptAll = () => {
    acceptAll();
    hideBanner();
  };

  const handleRejectAll = () => {
    rejectAll();
    hideBanner();
  };

  const handleCustomize = () => {
    setIsModalOpen(true);
  };

  const handleSavePreferences = (newPreferences: any) => {
    acceptSelected(newPreferences);
    setIsModalOpen(false);
  };

  // 서버 사이드에서는 배너를 보여주지 않음
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      {!hasConsented && isBannerVisible && (
        <CookieConsentBanner
          onAcceptAll={handleAcceptAll}
          onRejectAll={handleRejectAll}
          onCustomize={handleCustomize}
        />
      )}

      <CookiePreferencesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePreferences}
      />
    </>
  );
}
