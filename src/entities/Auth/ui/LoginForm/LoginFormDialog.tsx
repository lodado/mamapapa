"use client";

import { AlertDialog } from "@/shared/ui/Dialog";
import React from "react";
import LoginForm from "./LoginForm";
import { useAuthStore } from "../../client/models/store/AuthStore";

const LoginFormDialog = ({}) => {
  const { isLoginFormDialogVisible, setLoginFormDialogVisible } = useAuthStore();

  return (
    <AlertDialog
      swipePercent={0.4}
      className="h-[calc(55*var(--vh))]"
      isVisible={isLoginFormDialogVisible}
      onChangeVisible={setLoginFormDialogVisible}
    >
      <AlertDialog.Header className="flex flex-col gap-[1.1rem]">
        <h1>분류 항목 추가하기</h1>
        <div className="w-screen h-[1.9px] bg-border-borderOpaque"></div>
      </AlertDialog.Header>
      <AlertDialog.Body className="flex flex-col flex-start">
        <LoginForm />
      </AlertDialog.Body>
      <AlertDialog.SubmitForm
        submitButtonProps={{
          disabled: false,
        }}
        submitText="확인"
        cancelText="취소"
        onSubmit={async () => {}}
      />
    </AlertDialog>
  );
};

export default LoginFormDialog;
