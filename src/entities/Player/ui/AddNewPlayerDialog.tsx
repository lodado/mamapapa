import { Input } from "@/shared/ui";
import { AlertDialog } from "@/shared/ui/Dialog";
import React, { useEffect, useState } from "react";
import { usePlayerStore } from "../models";

const AddNewPlayerDialog = ({
  isVisible,
  onChangeVisible,
}: {
  isVisible: boolean;
  onChangeVisible: (newVisibleStatus: boolean) => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const { addPlayer } = usePlayerStore();

  useEffect(() => {
    setInputValue("");
  }, [isVisible]);

  return (
    <AlertDialog
      swipePercent={0.2}
      className="h-[calc(35*var(--vh))]"
      isVisible={isVisible}
      onChangeVisible={onChangeVisible}
    >
      <AlertDialog.Header className="flex flex-col gap-[1.1rem]">
        <h1>분류 항목 추가하기</h1>
        <div className="w-screen h-[1.9px] bg-border-borderOpaque"></div>
      </AlertDialog.Header>
      <AlertDialog.Body className="flex flex-col flex-start">
        <Input value={inputValue} setValue={setInputValue} placeholder="입력해주세요" />
      </AlertDialog.Body>
      <AlertDialog.SubmitForm
        submitButtonProps={{
          disabled: inputValue.length <= 0,
        }}
        submitText="확인"
        cancelText="취소"
        onSubmit={async () => {
          addPlayer(inputValue, { id: inputValue, name: inputValue });
        }}
      />
    </AlertDialog>
  );
};

export default AddNewPlayerDialog;
