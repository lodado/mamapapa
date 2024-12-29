"use client";

import React, { SyntheticEvent } from "react";
import { useTranslations } from "next-intl";

import { useEditorDispatch, useEditorSelector, useMarkCommand } from "@/features/Editor/hooks";
import { AlertDialog } from "@/shared/ui/Dialog";
import { EDITOR_LINK_DIALOG_CLOSE } from "./model";
import { ScreenReaderOnly } from "@/shared/ui";

const EditorLinkDialog = () => {
  const t = useTranslations("EDITORLINKDIALOG");
  const isOpen = useEditorSelector((state) => state.linkDialog.isOpen);
  const editorDispatch = useEditorDispatch();
  const { toggleMarkCommand } = useMarkCommand();

  const onSubmitLink = async (e: SyntheticEvent) => {
    e.preventDefault();
    toggleMarkCommand("Link", { href: "", title: "" })();
  };

  return (
    <>
      <AlertDialog
        isVisible={isOpen}
        onChangeVisible={() => {
          editorDispatch(EDITOR_LINK_DIALOG_CLOSE());
        }}
      >
        <AlertDialog.SubmitForm
          className="p-4"
          submitText={t("SUBMITTEXT")}
          cancelText={t("CANCELTEXT")}
          onSubmit={onSubmitLink}
        >
          <ScreenReaderOnly>
            <AlertDialog.Header className="p-2">{t("HEADER")}</AlertDialog.Header>
          </ScreenReaderOnly>

          <AlertDialog.Body className="p-2">
            <AlertDialog.Description>{t("DESCRIPTION")}</AlertDialog.Description>
          </AlertDialog.Body>
        </AlertDialog.SubmitForm>
      </AlertDialog>
    </>
  );
};

export default EditorLinkDialog;
