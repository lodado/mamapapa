"use client";

import React from "react";

import { useTranslations } from "next-intl";
import { ICON_GITHUB, ICON_GOOGLE, ICON_KAKAO } from "@/shared/ui";
import { useIsClient, useServerAction } from "@/shared/hooks";
import { authenticateAction } from "../../api/loginApi";
import Oauth2LoginButton from "./Oauth2LoginButton";

const LoginForm = ({ afterCallback }: { afterCallback?: () => void }) => {
  const t = useTranslations("LoginForm");
  const { isPending, onSubmit } = useServerAction(authenticateAction, afterCallback);
  const isClient = useIsClient();

  return (
    <div className="w-full flex flex-col items-start gap-2.5 relative self-stretch h-[220px] flex-[0_0_auto]">
      <div className="w-full flex flex-col justify-center items-center text-center body-2 text-black">
        <span>닮은꼴 비교하기를 서로 공유하고</span>
        <span>피드백을 받아볼 수 있습니다.</span>
      </div>

      <p className="w-full flex justify-center items-center text-center head-2 text-black">SNS 간편 로그인</p>

      <form action={onSubmit} className="flex justify-center items-center flex-row w-full gap-2">
        <input className="hidden" hidden name="href" value={(isClient ? window?.location.href : "") ?? ""} />
        <Oauth2LoginButton value="kakao">
          <ICON_KAKAO />
        </Oauth2LoginButton>

        <Oauth2LoginButton value="google">
          <ICON_GOOGLE />
        </Oauth2LoginButton>

        <Oauth2LoginButton value="github">
          <ICON_GITHUB />
        </Oauth2LoginButton>
      </form>
    </div>
  );
};
export default LoginForm;
