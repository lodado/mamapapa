"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { cache, useState } from "react";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PropsWithChildren } from "react";

import { queryClientOption } from "./queryClientOption";

export function makeQueryClient() {
  return new QueryClient(queryClientOption as any);
}

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
};

export const ReactQueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children} <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
