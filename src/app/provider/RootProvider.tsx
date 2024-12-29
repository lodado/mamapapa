import { SERVER_DI_REPOSITORY } from "@/DI/index.server";

import React, { PropsWithChildren } from "react";
import ClientProvider from "./ClientProvider";
import { AuthProvider, GetUserSessionInfoUseCase } from "@/entities/index.server";
import { GetDomainByUserIdUseCase } from "@/features/blog/domain/models";
import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";

const RootProvider = async ({ children }: PropsWithChildren) => {
  const session = await new GetUserSessionInfoUseCase(new EDGE_DI_REPOSITORY.Auth()).execute();

  const userDomain = session
    ? await new GetDomainByUserIdUseCase(
        new SERVER_DI_REPOSITORY.Domain(),
        new EDGE_DI_REPOSITORY.Auth()
      ).getDomainByUserId()
    : undefined;

  return (
    <ClientProvider
      session={session}
      userDomain={
        userDomain ?? {
          userId: "",
          domainId: -1, // null
          domainName: "",
          domainLocation: "",
          createdTime: 0,
          description: "",
          image: "",
          language: "en",
        }
      }
    >
      <AuthProvider session={session}>{children}</AuthProvider>
    </ClientProvider>
  );
};

export default RootProvider;
