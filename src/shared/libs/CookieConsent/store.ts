"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CookieConsentActions, CookieConsentState, CookiePreferences } from "./types";

const COOKIE_CONSENT_KEY = "cookie-consent";

const defaultPreferences: CookiePreferences = {
  necessary: true, // 필수 쿠키는 항상 true
  analytics: false,
};

const defaultState: CookieConsentState = {
  hasConsented: false,
  preferences: defaultPreferences,
  isBannerVisible: true,
  lastUpdated: null,
};

export const useCookieConsentStore = create<CookieConsentState & CookieConsentActions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      acceptAll: () => {
        const preferences: CookiePreferences = {
          necessary: true,
          analytics: true,
        };

        set({
          hasConsented: true,
          preferences,
          isBannerVisible: false,
          lastUpdated: new Date().toISOString(),
        });
      },

      acceptSelected: (newPreferences: Partial<CookiePreferences>) => {
        const currentPreferences = get().preferences;
        const preferences: CookiePreferences = {
          ...currentPreferences,
          ...newPreferences,
          necessary: true, // 필수 쿠키는 항상 true
        };

        set({
          hasConsented: true,
          preferences,
          isBannerVisible: false,
          lastUpdated: new Date().toISOString(),
        });
      },

      rejectAll: () => {
        set({
          hasConsented: true,
          preferences: defaultPreferences,
          isBannerVisible: false,
          lastUpdated: new Date().toISOString(),
        });
      },

      showBanner: () => {
        set({ isBannerVisible: true });
      },

      hideBanner: () => {
        set({ isBannerVisible: false });
      },

      updatePreferences: (newPreferences: Partial<CookiePreferences>) => {
        const currentPreferences = get().preferences;
        const preferences: CookiePreferences = {
          ...currentPreferences,
          ...newPreferences,
          necessary: true, // 필수 쿠키는 항상 true
        };

        set({
          preferences,
          lastUpdated: new Date().toISOString(),
        });
      },
    }),
    {
      name: COOKIE_CONSENT_KEY,
      partialize: (state) => ({
        hasConsented: state.hasConsented,
        preferences: state.preferences,
        isBannerVisible: state.isBannerVisible,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
