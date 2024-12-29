import React, { PropsWithChildren } from "react";
import ClientProvider from "./ClientProvider";
import { AuthProvider, GetUserSessionInfoUseCase } from "@/entities/index.server";

import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";

const RootProvider = async ({ children }: PropsWithChildren) => {
  const session = await new GetUserSessionInfoUseCase(new EDGE_DI_REPOSITORY.Auth()).execute();

  return (
    <ClientProvider session={session}>
      <AuthProvider session={session}>{children}</AuthProvider>
    </ClientProvider>
  );
};

export default RootProvider;
