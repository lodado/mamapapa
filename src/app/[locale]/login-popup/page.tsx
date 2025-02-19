"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { useAuthStore } from "@/entities/Auth/client/models/store/AuthStore";
import LoginForm from "@/entities/Auth/ui/LoginForm/LoginForm";

export default function LoginPopupPage() {
  const t = useTranslations("LoginPopupPage");
  const { isLogin } = useAuthStore();

  const handleLoginSuccess = () => {
    window.opener?.postMessage("LOGIN_SUCCESS", "*");
  };

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      {isLogin ? <div>{t("login_completed")}</div> : <LoginForm afterCallback={handleLoginSuccess} />}
    </div>
  );
}
