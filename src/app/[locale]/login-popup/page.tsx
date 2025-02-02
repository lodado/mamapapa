"use client";

import { useAuthStore } from "@/entities/Auth/client/models/store/AuthStore";
import LoginForm from "@/entities/Auth/ui/LoginForm/LoginForm";
import React from "react";

export default function LoginPopupPage() {
  const { isLogin } = useAuthStore();

  const handleLoginSuccess = () => {
    window.opener?.postMessage("LOGIN_SUCCESS", "*");
  };

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      {isLogin ? (
        <div>로그인이 완료되었습니다. 해당 창을 닫아주고 다시 시도해보세요.</div>
      ) : (
        <LoginForm afterCallback={handleLoginSuccess} />
      )}
    </div>
  );
}
