"use client";

import { AlertDialog } from "@/shared/ui/Dialog";
import React, { useState } from "react";
import { ImageMetadata } from "../models";

interface CropSettingDialogProps {
  selectedImageForReCrop?: ImageMetadata;
  isVisible: boolean;
  onChangeVisible: (visible: boolean) => void;
}

const CropSettingDialog: React.FC<CropSettingDialogProps> = ({
  selectedImageForReCrop,
  isVisible,
  onChangeVisible,
}) => {
  return (
    <AlertDialog className="h-[95vh]" isVisible={isVisible} onChangeVisible={onChangeVisible}>
      <AlertDialog.Header>Test</AlertDialog.Header>
      <AlertDialog.Body className="">Test Body</AlertDialog.Body>
      <AlertDialog.SubmitForm submitText="확인" cancelText="취소" onSubmit={async (e) => {}} />
    </AlertDialog>
  );
};

export default CropSettingDialog;
