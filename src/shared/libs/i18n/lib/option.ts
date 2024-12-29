export const LANGUAGE_LIST = [
  "ko",
  "en",
  "ja",
  "zh",
  "hi",
  "fr",
  "es",
  "ar",
  "bn",
  "pt",
  "id",
  "it",
  "vi",
  "th",
  "ms",
  "ru",
  "de",
  "tr",
] as const;

export const i18nOption = {
  locales: LANGUAGE_LIST,
  defaultLocale: "en",
  localePrefix: "always",
};

export const GenerateStaticParamsI18n = () => {
  return i18nOption.locales.map((locale) => ({ locale }));
};

export default i18nOption;
