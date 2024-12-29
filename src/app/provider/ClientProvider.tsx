"use client";

import { PropsWithChildren } from "react";

import { ReactQueryProvider, RtlProvider, ThemeProvider } from "@/shared";

import { NextAuthSessionResponse } from "@/entities/Auth/server/type";

const ClientProvider = ({
  children,
  session,
}: PropsWithChildren & {
  session: NextAuthSessionResponse | undefined;
}) => {
  return (
    <ReactQueryProvider>
      {children}

      <RtlProvider />
    </ReactQueryProvider>
  );
};

export default ClientProvider;
