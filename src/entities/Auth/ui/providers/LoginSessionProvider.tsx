"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import React, { ReactNode, useEffect, useState } from "react";
import { NextAuthSessionResponse } from "../../server/type";
import { LogoutUseCase } from "../../core";
import { AUTH_LOGOUT_ACTION, AuthClientRepository } from "../../client";
import { useDispatch, useSelector } from "@/shared/hooks";

const LoginSessionProvider = ({ children, session }: { children: ReactNode; session?: NextAuthSessionResponse }) => {
  const [sessionRefetchInterval, setSessionRefetchInterval] = useState(10000);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLogin) {
      if (session == undefined || session?.error) {
        new LogoutUseCase(new AuthClientRepository()).execute();
        dispatch(AUTH_LOGOUT_ACTION());

        return;
      }

      if (session) {
        const nowTime = Math.round(Date.now() / 1000);
        const timeRemaining = (session.expiresAt as number) - 5 * 60 - nowTime;

        setSessionRefetchInterval(timeRemaining > 0 ? timeRemaining : 0);
      }
    }
  }, [session, setSessionRefetchInterval]);

  return (
    <NextAuthSessionProvider refetchInterval={sessionRefetchInterval} session={session}>
      {children}
    </NextAuthSessionProvider>
  );
};

export default LoginSessionProvider;
