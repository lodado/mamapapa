"use client";

import { useAuthStore } from "@/entities/Auth/client/models/store/AuthStore";
import { ButtonLink } from "@/entities/Router";
import React, { MouseEventHandler } from "react";

const HistoryLink = () => {
  const { isLogin, setLoginFormDialogVisible } = useAuthStore();

  const handleSubmitValidation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isLogin) {
      e.preventDefault();
      setLoginFormDialogVisible(true);

      return;
    }
  };

  return (
    <ButtonLink aria-disabled={!isLogin} onClickCapture={handleSubmitValidation} href={"/"} variant="primaryLine">
      공유 내역 확인하기
    </ButtonLink>
  );
};

export default HistoryLink;
