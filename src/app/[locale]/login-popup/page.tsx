"use client";

import LoginForm from "@/entities/Auth/ui/LoginForm/LoginForm";
import React from "react";

export default function LoginPopupPage() {
  const handleLogin = () => {
    // window.opener?.postMessage("LOGIN_SUCCESS", "*");
  };

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      <LoginForm afterCallback={handleLogin} />
    </div>
  );
}
