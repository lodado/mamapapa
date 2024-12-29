"use client";

import React from "react";
import { LOGIN_DIALOG_CLOSE_ACTION, LOGIN_DIALOG_OPEN_ACTION } from "../../models";
 
import { AlertDialog } from "@/shared/ui/Dialog";
import LoginForm from "./LoginForm";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "@/shared/hooks";

const LoginDialogContainer = () => {
  const isOpened = useSelector((state) => state.loginDialog.isOpened);
  const t = useTranslations("LoginDialogContainer");
  const dispatch = useDispatch();

  return (
    <AlertDialog
      isVisible={isOpened}
      className="rounded-2xl w-[30rem] bg-background overflow-hidden"
      onChangeVisible={(newVisibleStatus: boolean) => {
        const action = newVisibleStatus ? LOGIN_DIALOG_OPEN_ACTION : LOGIN_DIALOG_CLOSE_ACTION;
        dispatch(action());
      }}
    >
      <div className="flex relative h-[12.5rem] bg-color-chart-teal-bold-default justify-center items-center mb-3">
        <AlertDialog.Close className="absolute w-[1.5rem] h-[1.5rem] flex justify-center items-center right-[10px] top-[10px] bg-background [&>svg]:scale-[70%] rounded-full" />
      </div>

      <AlertDialog.Header className="p-2 px-6 h-[3rem]">
        <span className="heading-02">{t("DialogTitle")}</span>
      </AlertDialog.Header>

      <AlertDialog.Description className="px-6 body-01 mb-4">{t("DialogDescription")}</AlertDialog.Description>

      <AlertDialog.Body className="w-full px-6 py-2 relative  ">
        <LoginForm />
      </AlertDialog.Body>
    </AlertDialog>
  );
};

export default LoginDialogContainer;
