"use client";

import { PropsWithChildren } from "react";

import { ReactQueryProvider, RtlProvider, ThemeProvider } from "@/shared";

import { store } from "../models/store";
import ReduxInitStoreProvider from "./ReduxInitStoreProvider";
import { NextAuthSessionResponse } from "@/entities/Auth/server/type";
import { Domain, domainInitialState } from "@/features/blog/domain/models";

const ClientProvider = ({
  children,
  session,
  userDomain = domainInitialState,
}: PropsWithChildren & {
  session: NextAuthSessionResponse | undefined;
  userDomain: Domain;
}) => {
  return (
    <ReactQueryProvider>
      <ReduxInitStoreProvider userDomain={userDomain} session={session} initStore={store}>
        {children}
      </ReduxInitStoreProvider>

      <RtlProvider />
    </ReactQueryProvider>
  );
};

export default ClientProvider;
