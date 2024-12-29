"use client";

import { cva } from "class-variance-authority";
import React, { FC, ReactNode, useEffect, useLayoutEffect, useState } from "react";

import { LOGIN_METHOD } from "../../api/action/variable";
import { LocalStorageStrategy, StorageController, useI18n } from "@/shared";
import { Button, Tooltip } from "@/shared/ui";
import { useIsClient } from "@/shared/hooks";

interface LoginButtonProps {
  value: "google" | "kakao" | "github";
  children: ReactNode;
}

const LoginButtonStyles = cva(
  "shadow-button flex gap-2 body-03 w-full justify-center align-middle p-4 h-14 rounded-md",
  {
    variants: {
      value: {
        kakao: "bg-[#FEE500] text-color-[#000]",
        google: `bg-[#fff] text-color-#000`,
        github: "bg-[#24292F] text-[#fff]",
      },
    },
    defaultVariants: {},
  }
);

const userInfo = new StorageController<Record<string, LoginButtonProps["value"]>>(
  new LocalStorageStrategy("/login/userinfo")
);

const Oauth2LoginButton = ({ value, children }: LoginButtonProps) => {
  const isClient = useIsClient();
  const [{ value: lastLoginInfo }] = useState(userInfo.read() ?? { value: undefined });
  const t = useI18n("LOGIN");

  const handleUpdateLoginUserInfo = () => {
    userInfo.update({ value });
  };

  /** radix ToolTip에 hydration bug가 있음 */
  if (!isClient)
    return (
      <Button
        type="submit"
        name={LOGIN_METHOD}
        variant="custom"
        size="large"
        value={value}
        className={LoginButtonStyles({ value })}
        onClick={handleUpdateLoginUserInfo}
      >
        {children}
      </Button>
    );

  return (
    <Tooltip defaultOpen={lastLoginInfo === value}>
      <Tooltip.Trigger>
        <Button
          type="submit"
          name={LOGIN_METHOD}
          variant="custom"
          size="large"
          value={value}
          className={LoginButtonStyles({ value })}
          onClick={handleUpdateLoginUserInfo}
        >
          {children}
        </Button>
      </Tooltip.Trigger>

      <Tooltip.Content side="bottom" align="center" className="z-100 text-color-text-default body-01">
        {lastLoginInfo === value ? t("TOOLTIP-LASTLOGINTEXT") : t("TOOLTIP-TEXT")}
      </Tooltip.Content>
    </Tooltip>
  );
};

export default Oauth2LoginButton;
