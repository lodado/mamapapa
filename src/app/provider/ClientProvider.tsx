"use client";

import { PropsWithChildren } from "react";

import { ReactQueryProvider, RtlProvider, ThemeProvider } from "@/shared";

import { NextAuthSessionResponse } from "@/entities/Auth/server/type";
import ToastProvider from "@/features/Toast/ui/ToastProvider";

const ClientProvider = ({
  children,
  session,
}: PropsWithChildren & {
  session: NextAuthSessionResponse | undefined;
}) => {
  return (
    <ReactQueryProvider>
      <ToastProvider>{children}</ToastProvider>

      <RtlProvider />
    </ReactQueryProvider>
  );
};

export default ClientProvider;
