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
      <AlertDialog.Header className="flex flex-col gap-[1.125rem]">
        <h1>크롭 다시하기</h1>
        <div className="w-screen h-[1.9px] bg-border-borderOpaque"></div>
      </AlertDialog.Header>
      <AlertDialog.Body className="flex flex-col flex-start">
        <div className="flex flex-col gap-2 justify-between w-full px-4">
          <h2 className="subhead-3 flex flex-col text-text-01 h-[40px]">크롭할 영역을 선택해주세요</h2>

          <div className="text-text-03 body-2">
            <p>원본사진에서 크롭 영역을 다시 지정해주세요.</p>
            <p> 파란색 영역의 크기를 조절하면 영역이 지정됩니다.</p>
          </div>
        </div>
      </AlertDialog.Body>
      <AlertDialog.SubmitForm submitText="확인" cancelText="취소" onSubmit={async (e) => {}} />
    </AlertDialog>
  );
};

export default CropSettingDialog;
