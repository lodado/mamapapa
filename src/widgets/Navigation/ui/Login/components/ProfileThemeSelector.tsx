"use client";

import { useSwitchTheme } from "@/shared";
import React from "react";
import { useTranslations } from "next-intl";

import { Check, SunMoon } from "lucide-react";
import { ChevronRight } from "lucide-react";

import { Dropdown } from "@/shared/ui";

const ProfileThemeDropdown = () => {
  const { isMounted, theme, updateTheme, toggleTheme } = useSwitchTheme();
  const t = useTranslations("PROFILETHEMESELECTOR");

  return (
    <Dropdown>
      <Dropdown.Trigger
        variant="custom"
        className="h-[2rem] body-02 outline-0 flex flex-col px-0 py-2 gap-y-2 mb-2 w-full border-0 text-inherit"
      >
        <Dropdown.Item className="h-[2rem] flex items-center justify-between w-full px-2 py-2 gap-2">
          <span className="body-02 flex flex-row items-center 10 gap-2">
            <SunMoon size={22} />
            {t("LABEL-THEME")}
          </span>

          <span className="body-03 flex flex-row items-center gap-1">
            {t(`ITEM-${theme.toUpperCase()}`)} <ChevronRight className="mt-[0.1rem]" strokeWidth={1.8} size={19} />
          </span>
        </Dropdown.Item>
      </Dropdown.Trigger>
      <Dropdown.Content side="left" align="end" className="mt-[9.6rem] min-w-[10rem] mr-[0.5rem]">
        <>
          <Dropdown.Item
            className="flex gap-2"
            onClick={() => {
              updateTheme("system");
            }}
          >
            {theme === "system" && (
              <Check
                className="absolute left-[0.1rem] text-color-chart-green-bold-default "
                strokeWidth={3}
                size={16}
              />
            )}
            {t("ITEM-SYSTEM")}
          </Dropdown.Item>
          <Dropdown.Item
            className="flex gap-2"
            onClick={() => {
              updateTheme("dark");
            }}
          >
            {theme === "dark" && (
              <Check
                className="absolute left-[0.1rem] text-color-chart-green-bold-default "
                strokeWidth={3}
                size={16}
              />
            )}
            {t("ITEM-DARK")}
          </Dropdown.Item>
          <Dropdown.Item
            className="relative flex gap-2"
            onClick={() => {
              updateTheme("light");
            }}
          >
            {theme === "light" && (
              <Check
                className="absolute left-[0.1rem] text-color-chart-green-bold-default "
                strokeWidth={3}
                size={16}
              />
            )}

            {t("ITEM-LIGHT")}
          </Dropdown.Item>
        </>
      </Dropdown.Content>
    </Dropdown>
  );
};

export default ProfileThemeDropdown;
