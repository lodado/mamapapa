export interface CookiePreferences {
  necessary: boolean; // 필수 쿠키 (항상 true)
  analytics: boolean; // 분석 쿠키 (GA 등)
}

export interface CookieConsentState {
  hasConsented: boolean;
  preferences: CookiePreferences;
  isBannerVisible: boolean;
  lastUpdated: string | null;
}

export interface CookieConsentActions {
  acceptAll: () => void;
  acceptSelected: (preferences: Partial<CookiePreferences>) => void;
  rejectAll: () => void;
  showBanner: () => void;
  hideBanner: () => void;
  updatePreferences: (preferences: Partial<CookiePreferences>) => void;
}
