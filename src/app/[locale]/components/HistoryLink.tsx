"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { useAuthStore } from "@/entities/Auth/client/models/store/AuthStore";
import { ButtonLink } from "@/entities/Router";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";

const HistoryLink = () => {
  const t = useTranslations();
  const { isLogin, setLoginFormDialogVisible } = useAuthStore();

  const handleSubmitValidation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isLogin) {
      e.preventDefault();
      setLoginFormDialogVisible(true);
      return;
    }
  };

  return (
    <ButtonLink
      aria-disabled={!isLogin}
      onClickCapture={handleSubmitValidation}
      href={PAGE_ROUTE.HISTORY_LIST}
      variant="primaryLine"
    >
      {t("BUTTON.CHECK-HISTORY")}
    </ButtonLink>
  );
};

export default HistoryLink;
