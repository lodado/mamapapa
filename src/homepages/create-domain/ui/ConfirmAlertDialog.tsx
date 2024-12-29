"use client";

import React, { useTransition } from "react";

import { ALERT_DIALOG_SET_VISIBLE, ALERT_SUBMIT_FORM_SET_VISIBLE, useAlertDispatch, useAlertSelector } from "../models";
import { AlertDialog } from "@/shared/ui/Dialog";
import { createBlogAction } from "../api/action";

const ConfirmAlertDialog = ({ getFormData }: { getFormData: () => FormData }) => {
  const isVisible = useAlertSelector((state) => state.alertDialog.isVisible);
  const dispatch = useAlertDispatch();
  const [pending, startTransition] = useTransition();

  return (
    <AlertDialog
      isVisible={isVisible}
      onChangeVisible={() => {
        dispatch(ALERT_DIALOG_SET_VISIBLE(false));
      }}
    >
      <AlertDialog.Header>제출</AlertDialog.Header>
      <AlertDialog.Body>정말로 제출하시겠어요?</AlertDialog.Body>
      <AlertDialog.SubmitForm
        submitText="확인"
        cancelText="취소"
        onSubmit={async (e) => {
          e.preventDefault();
          dispatch(ALERT_SUBMIT_FORM_SET_VISIBLE(true));

          startTransition(async () => {
            const formData = getFormData();

            await createBlogAction(formData);
          });
        }}
      />
    </AlertDialog>
  );
};

export default ConfirmAlertDialog;
