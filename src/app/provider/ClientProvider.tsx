"use client";

import { PropsWithChildren } from "react";

import { NextAuthSessionResponse } from "@/entities/Auth/server/type";
import { ReactDndProvider, ReactQueryProvider, RtlProvider, ThemeProvider } from "@/shared";
import { CookieConsentProvider } from "@/shared/libs/CookieConsent";
import ToastProvider from "@/shared/ui/Toast/ui/ToastProvider";

const ClientProvider = ({
  children,
  session,
}: PropsWithChildren & {
  session: NextAuthSessionResponse | undefined;
}) => {
  return (
    <ReactDndProvider>
      <ReactQueryProvider>
        <CookieConsentProvider>
          <ToastProvider>{children}</ToastProvider>
          <RtlProvider />
        </CookieConsentProvider>
      </ReactQueryProvider>
    </ReactDndProvider>
  );
};

export default ClientProvider;
