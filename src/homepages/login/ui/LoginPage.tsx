import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";
import { SERVER_DI_REPOSITORY } from "@/DI/index.server";
import { GetUserInfoUseCase } from "@/entities/Auth/core";

import LoginForm from "@/features/login/ui/components/LoginForm";
import { getLinkHref } from "@/shared/api";

import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import React from "react";

const LoginPage = async () => {
  const t = await getTranslations("LoginDialogContainer");

  const isLogin = await new GetUserInfoUseCase(new EDGE_DI_REPOSITORY.Auth()).isUserLogin();

  if (isLogin) {
    redirect(await getLinkHref({ href: "/" }));
  }

  return (
    <div className="w-full page-content flex justify-center">
      <div className="flex flex-col justify-center gap-10 items-center  md:w-[768px] h-[calc(100*var(--vh)-4rem)]  min-h-[calc(100*var(--vh)-4rem)] mx-auto p-6 bg-background text-color-text-default shadow-md rounded-lg">
        <header className="w-full flex flex-col items-start justify-start">
          <div className="p-2 px-6 h-[3rem]">
            <h1 className="heading-02">{t("DialogTitle")}</h1>
          </div>

          <div className="px-6 body-01 mb-4">{t("DialogDescription")}</div>
        </header>

        <main className="w-full flex flex-col ">
          <LoginForm />
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
