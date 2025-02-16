"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { usePlayerStore } from "@/entities/Player";
import { ImageMetadata, useImageSelectorStore } from "@/features/ImageSelector/models";
import { AddTemplateDialog } from "@/shared/ui/Dialog";
import { useToastStore } from "@/shared/ui/Toast/stores";

interface AddNewPlayerDialogContainerProps {
  isVisible: boolean;
  onChangeVisible: (newVisibleStatus: boolean) => void;
  selectedImageForPlayer: ImageMetadata;
  title?: string;
  placeholder?: string;
  maxNameLength?: number;
  successToastTitle?: string;
  successToastDescription?: string;
}

const maxNameLength = 50;

function AddNewPlayerDialog({ isVisible, onChangeVisible, selectedImageForPlayer }: AddNewPlayerDialogContainerProps) {
  const t = useTranslations("IMAGES");
  const [inputValue, setInputValue] = useState("");

  const { players, addPlayer } = usePlayerStore();
  const { handleUpdatePlayer } = useImageSelectorStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    if (isVisible) {
      setInputValue("");
    }
  }, [isVisible]);

  const isSamePlayerName = (Array.from(players?.keys()) ?? []).includes(inputValue);
  const isTooLongName = inputValue.length >= maxNameLength;
  const isInvalid = isSamePlayerName || isTooLongName;

  const errorNode = (
    <>
      {isSamePlayerName && t("DIALOG-ERROR-NAME-EXISTS")}
      {isTooLongName && t("DIALOG-ERROR-NAME-TOO-LONG")}
    </>
  );

  const handleSubmit = async () => {
    addPlayer(inputValue, { id: inputValue, name: inputValue });
    handleUpdatePlayer(selectedImageForPlayer, inputValue);
    addToast({
      title: t("DIALOG-SUCCESS-TITLE"),
      type: "success",
      description: t("DIALOG-SUCCESS-DESCRIPTION"),
    });
    setInputValue("");
  };

  return (
    <AddTemplateDialog
      isVisible={isVisible}
      onChangeVisible={onChangeVisible}
      title={t("DIALOG-TITLE")}
      inputValue={inputValue}
      onChangeInputValue={setInputValue}
      placeholder={t("DIALOG-PLACEHOLDER")}
      isInvalid={isInvalid}
      onSubmit={handleSubmit}
      errorComponent={errorNode}
    />
  );
}

export default AddNewPlayerDialog;
