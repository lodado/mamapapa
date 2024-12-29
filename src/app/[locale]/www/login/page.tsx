import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";

import { GetUserInfoUseCase } from "@/entities/Auth/core";

import { LoginPage } from "@/homepages/login";
import { getLinkHref } from "@/shared/api";

import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import React from "react";

const page = async () => {
  const isLogin = await new GetUserInfoUseCase(new EDGE_DI_REPOSITORY.Auth()).isUserLogin();

  if (isLogin) {
    redirect(await getLinkHref({ href: "/" }));
  }

  return <LoginPage />;
};

export default page;
