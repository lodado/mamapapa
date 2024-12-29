"use client";

import React from "react";
 
import Oauth2LoginButton from "./Oauth2LoginButton";
import { authenticateAction } from "../../api";
import { useTranslations } from "next-intl";
import { ICON_GITHUB, ICON_GOOGLE, ICON_KAKAO } from "@/shared/ui";
import { useServerAction } from "@/shared/hooks";

const LoginForm = () => {
  const t = useTranslations("LoginForm");
  const { isPending, onSubmit } = useServerAction(authenticateAction);

  return (
    <div className="flex flex-col items-start gap-3 relative self-stretch w-full h-[220px] flex-[0_0_auto]">
      <form action={onSubmit} className="flex flex-col w-full gap-1 space-y-3">
        <input className="hidden" hidden name="href" value={window?.location.href ?? ""} />
        <Oauth2LoginButton value="kakao">
          <ICON_KAKAO /> {t("KakaoButton")}
        </Oauth2LoginButton>

        <Oauth2LoginButton value="google">
          <ICON_GOOGLE /> {t("GoogleButton")}
        </Oauth2LoginButton>

        <Oauth2LoginButton value="github">
          <ICON_GITHUB /> {t("GithubButton")}
        </Oauth2LoginButton>
      </form>
    </div>
  );
};
export default LoginForm;
