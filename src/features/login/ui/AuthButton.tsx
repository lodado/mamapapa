"use client";

 
 
import { useSelector } from "@/shared/hooks";
import React from "react";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

const AuthButton: React.FC = () => {
  const isLogin = useSelector((state) => state.auth.isLogin);

  return isLogin ? <LogoutButton /> : <LoginButton />;
};

export default AuthButton;
