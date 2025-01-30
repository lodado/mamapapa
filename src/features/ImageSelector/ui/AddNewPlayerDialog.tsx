import { Input } from "@/shared/ui";
import { AlertDialog } from "@/shared/ui/Dialog";
import React, { useEffect, useState } from "react";

import { ImageMetadata, useImageSelectorStore } from "@/features/ImageSelector/models";
import { useToastStore } from "@/shared/ui/Toast/stores";
import { usePlayerStore } from "@/entities/Player";

const AddNewPlayerDialog = ({
  isVisible,
  onChangeVisible,
  selectedImageForPlayer,
}: {
  isVisible: boolean;
  onChangeVisible: (newVisibleStatus: boolean) => void;

  selectedImageForPlayer: ImageMetadata;
}) => {
  const [inputValue, setInputValue] = useState("");
  const { players, addPlayer } = usePlayerStore();
  const { handleUpdatePlayer } = useImageSelectorStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    setInputValue("");
  }, [isVisible]);

  const isSamePlayerName = (Array.from(players?.keys()) ?? []).some((player) => {
    return player === inputValue;
  });
  const isTooLongName = inputValue.length >= 50;

  const inValid = isSamePlayerName || isTooLongName;

  return (
    <AlertDialog
      swipePercent={0.2}
      className="h-[calc(37*var(--vh))] min-h-[15rem]"
      isVisible={isVisible}
      onChangeVisible={onChangeVisible}
    >
      <AlertDialog.Header className="flex flex-col gap-[1.1rem]">
        <h1>분류 항목 추가하기</h1>
        <div className="w-screen h-[1.9px] bg-border-borderOpaque"></div>
      </AlertDialog.Header>
      <AlertDialog.Body className="flex flex-col flex-start">
        <Input data-invalid={inValid} value={inputValue} setValue={setInputValue} placeholder="입력해주세요" />

        <div className="mt-1 w-full h-4 text-text-error subhead">
          {isSamePlayerName && "이미 존재하는 이름입니다."}
          {isTooLongName && "50자 이하로 입력해주세요."}
        </div>
      </AlertDialog.Body>
      <AlertDialog.SubmitForm
        submitButtonProps={{
          disabled: inValid || inputValue.length <= 0,
        }}
        submitText="확인"
        cancelText="취소"
        onSubmit={async () => {
          addPlayer(inputValue, { id: inputValue, name: inputValue });
          handleUpdatePlayer(selectedImageForPlayer!, inputValue);
          addToast({
            title: "저장에 성공했습니다",
            type: "success",
            description: "분류 항목 추가가 성공했습니다.",
          });
        }}
      />
    </AlertDialog>
  );
};

export default AddNewPlayerDialog;
