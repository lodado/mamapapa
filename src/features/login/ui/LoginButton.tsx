"use client";

import React from "react";

import { LOGIN_DIALOG_OPEN_ACTION } from "@/features/login";
import { useDispatch } from "@/shared/hooks";
import { useTranslations } from "next-intl";

const LoginButton: React.FC = () => {
  const dispatch = useDispatch();
  const t = useTranslations("loginButton");

  const handleClickLogin = () => {
    dispatch(LOGIN_DIALOG_OPEN_ACTION());
  };

  return (
    <button onClick={handleClickLogin} type="button">
      {t("login")}
    </button>
  );
};

export default LoginButton;
