"use client";

import React from "react";

import { Input } from "@/shared/ui";
import { AlertDialog } from "@/shared/ui/Dialog";

interface AddNewPlayerDialogPresenterProps {
  /** 다이얼로그 표시 여부 */
  isVisible: boolean;
  /** 다이얼로그 표시 상태 변화 함수 */
  onChangeVisible: (newVisibleStatus: boolean) => void;
  /** 제목 */
  title?: string;
  /** 입력값 */
  inputValue: string;
  /** 입력값 세터 */
  onChangeInputValue: (val: string) => void;
  /** placeholder */
  placeholder?: string;
  /** 입력값이 무효한지 여부 (Submit 버튼 비활성화용) */
  isInvalid?: boolean;
  /** 제출 버튼 클릭시 실행할 함수 */
  onSubmit: () => Promise<void>;
  /** (옵셔널) 외부에서 에러 메시지 등 표현할 노드를 주입 */
  errorComponent?: React.ReactNode;
}

const AddTemplateDialog = ({
  isVisible,
  onChangeVisible,
  title = "분류 항목 추가하기",
  inputValue,
  onChangeInputValue,
  placeholder = "입력해주세요",
  isInvalid = false,
  onSubmit,
  errorComponent,
}: AddNewPlayerDialogPresenterProps) => {
  return (
    <AlertDialog swipePercent={0.2} className="min-h-[15rem]" isVisible={isVisible} onChangeVisible={onChangeVisible}>
      <AlertDialog.Header className="flex flex-col gap-[1.1rem]">
        <h1>{title}</h1>
        <div className="w-screen h-[1.9px] bg-border-borderOpaque"></div>
      </AlertDialog.Header>

      <AlertDialog.Body className="flex flex-col flex-start">
        <Input data-invalid={isInvalid} value={inputValue} setValue={onChangeInputValue} placeholder={placeholder} />
        <div className="mt-1 w-full h-4 text-text-error subhead">{isVisible && errorComponent}</div>
      </AlertDialog.Body>

      <AlertDialog.SubmitForm
        submitButtonProps={{
          disabled: isInvalid || inputValue.length === 0,
        }}
        submitText="확인"
        cancelText="취소"
        onSubmit={onSubmit}
      />
    </AlertDialog>
  );
};

export default AddTemplateDialog;
