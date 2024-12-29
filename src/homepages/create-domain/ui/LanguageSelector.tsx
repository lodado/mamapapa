"use client";

import { Form, IconButton, Input, ScreenReaderOnly, Select, Tooltip } from "@/shared/ui";
import { ChevronDown, Info } from "lucide-react";
import React, { useMemo, useState } from "react";
import { validateInput } from "../utils";
import { useLocale, useTranslations } from "next-intl";

const LanguageSelector = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [value, setValue] = useState(locale);

  const languages = useMemo(
    () => [
      { value: "ko", label: t("LANG.ko"), emoji: "🇰🇷" },
      { value: "en", label: t("LANG.en"), emoji: "🇬🇧" },
      { value: "ja", label: t("LANG.ja"), emoji: "🇯🇵" },
      { value: "zh", label: t("LANG.zh"), emoji: "🇨🇳" },
      { value: "hi", label: t("LANG.hi"), emoji: "🇮🇳" },
      { value: "fr", label: t("LANG.fr"), emoji: "🇫🇷" },
      { value: "es", label: t("LANG.es"), emoji: "🇪🇸" },
      { value: "ar", label: t("LANG.ar"), emoji: "🇸🇦" },
      { value: "bn", label: t("LANG.bn"), emoji: "🇧🇩" },
      { value: "pt", label: t("LANG.pt"), emoji: "🇵🇹" },
      { value: "id", label: t("LANG.id"), emoji: "🇮🇩" },
      { value: "it", label: t("LANG.it"), emoji: "🇮🇹" },
      { value: "vi", label: t("LANG.vi"), emoji: "🇻🇳" },
      { value: "th", label: t("LANG.th"), emoji: "🇹🇭" },
      { value: "ms", label: t("LANG.ms"), emoji: "🇲🇾" },
      { value: "ru", label: t("LANG.ru"), emoji: "🇷🇺" },
      { value: "de", label: t("LANG.de"), emoji: "🇩🇪" },
      { value: "tr", label: t("LANG.tr"), emoji: "🇹🇷" },
    ],
    [t]
  );

  return (
    <>
      <Form.Field name="keywords" className="space-y-3">
        <Form.Label htmlFor="keywords" className="flex flex-row items-center">
          {t("LanguageSelector.mainLanguage")}
          <Form.Required />
          <Tooltip>
            <Tooltip.Trigger>
              <IconButton
                size="small"
                className="disabled:text-color-text-default disabled:opacity-80 ml-1"
                variant="text"
                disabled
              >
                <Info />
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Content align="center" side="top" variant="editor" className="-mt-[2.5rem]">
              {t("LanguageSelector.tooltipContent")}
            </Tooltip.Content>
          </Tooltip>
        </Form.Label>
        <ScreenReaderOnly>
          <Form.Control asChild>
            <Input id="mainLanguage" name="mainLanguage" value={value ?? ""} placeholder="" />
          </Form.Control>
        </ScreenReaderOnly>

        <div className="flex flex-row w-full">
          <Select defaultValue={locale} value={value} onValueChange={setValue}>
            <Select.Trigger className="w-[13rem] flex items-center justify-center relative">
              <Select.Value placeholder="" />
              <Select.Icon className="SelectIcon absolute right-4">
                <ChevronDown />
              </Select.Icon>
            </Select.Trigger>
            <Select.Content align="center" className="flex flex-col min-w-[2rem] max-h-[50vh] w-max">
              <Select.Group>
                <Select.Label>언어</Select.Label>
                {languages.map((language) => {
                  return (
                    <Select.Item className="flex gap-5" value={language.value} key={language.value}>
                      <span className="mr-2">{language.label}</span>
                      <span>{language.emoji}</span>
                    </Select.Item>
                  );
                })}
              </Select.Group>
            </Select.Content>
          </Select>
        </div>
      </Form.Field>
    </>
  );
};

export default LanguageSelector;
