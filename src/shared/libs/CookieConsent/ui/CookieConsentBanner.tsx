"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "../../../ui/Button";
import { Dialog } from "../../../ui/Dialog";
import { useCookieConsentStore } from "../store";

interface CookieConsentBannerProps {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onCustomize: () => void;
}

export function CookieConsentBanner({ onAcceptAll, onRejectAll, onCustomize }: CookieConsentBannerProps) {
  const t = useTranslations("cookieConsent");

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[29rem] md:w-[768px] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 shadow-lg"
      role="banner"
      aria-label={t("banner.title")}
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">{t("banner.title")}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">{t("banner.description")}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center w-full">
          <Button
            variant="primaryLine"
            size="custom"
            onClick={onRejectAll}
            className="w-full sm:w-auto"
            aria-label={t("banner.rejectAll")}
          >
            {t("banner.rejectAll")}
          </Button>
          <Button
            variant="primaryLine"
            size="custom"
            onClick={onCustomize}
            className="w-full sm:w-auto"
            aria-label={t("banner.customize")}
          >
            {t("banner.customize")}
          </Button>
          <Button
            variant="primarySolid"
            size="custom"
            onClick={onAcceptAll}
            className="w-full sm:w-auto"
            aria-label={t("banner.acceptAll")}
          >
            {t("banner.acceptAll")}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: any) => void;
}

export function CookiePreferencesModal({ isOpen, onClose, onSave }: CookiePreferencesModalProps) {
  const t = useTranslations("cookieConsent");
  const { preferences, updatePreferences } = useCookieConsentStore();
  const [localPreferences, setLocalPreferences] = useState(preferences);

  const handleSave = () => {
    updatePreferences(localPreferences);
    onSave(localPreferences);
    onClose();
  };

  const handlePreferenceChange = (key: keyof typeof localPreferences, value: boolean) => {
    if (key === "necessary") return; // 필수 쿠키는 변경 불가

    setLocalPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Dialog isVisible={isOpen} onChangeVisible={onClose}>
      <Dialog.Root>
        <Dialog.Content className="">
          <div className="p-6">
            <h2 id="cookie-modal-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("modal.title")}
            </h2>

            <div className="space-y-6" role="region" aria-labelledby="cookie-modal-title">
              <p className="text-sm text-gray-600 dark:text-gray-300">{t("modal.description")}</p>

              {/* 필수 쿠키 */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {t("preferences.necessary.title")}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t("preferences.necessary.description")}</p>
                  </div>
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      checked={localPreferences.necessary}
                      disabled
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      aria-label={`${t("preferences.necessary.title")} - ${t("preferences.alwaysActive")}`}
                    />
                    <span className="ml-2 text-sm text-gray-500">{t("preferences.alwaysActive")}</span>
                  </div>
                </div>
              </div>

              {/* 분석 쿠키 */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {t("preferences.analytics.title")}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t("preferences.analytics.description")}</p>
                  </div>
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      checked={localPreferences.analytics}
                      onChange={(e) => handlePreferenceChange("analytics", e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      aria-label={`${t("preferences.analytics.title")} - ${
                        localPreferences.analytics ? t("preferences.alwaysActive") : "비활성화"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="primaryLine" size="custom" onClick={onClose} aria-label={t("modal.cancel")}>
                {t("modal.cancel")}
              </Button>
              <Button variant="primarySolid" size="custom" onClick={handleSave} aria-label={t("modal.save")}>
                {t("modal.save")}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </Dialog>
  );
}
