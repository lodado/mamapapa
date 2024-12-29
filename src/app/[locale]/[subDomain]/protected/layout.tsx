import React, { PropsWithChildren } from "react";
import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";
import { SERVER_DI_REPOSITORY } from "@/DI/index.server";

import { GetUserInfoUseCase } from "@/entities/Auth/core";
import { GetDomainByUserIdUseCase } from "@/features/blog/domain/models/core/usecase";

import { redirect } from "next/navigation";
import { getLinkHref } from "@/shared";

const Layout = async ({ children }: PropsWithChildren) => {
  const isUserLogin = await new GetUserInfoUseCase(new EDGE_DI_REPOSITORY.Auth()).isUserLogin();

  if (!isUserLogin) {
    redirect(await getLinkHref({ subDomain: `www`, href: "/" }));
  }

  return children;
};

export default Layout;
