"use client";

import { revalidatePath, revalidateTag } from "next/cache";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useServerAction } from "@/shared/hooks";
import { AddTemplateDialog } from "@/shared/ui/Dialog";
import { useToastStore } from "@/shared/ui/Toast/stores";

import { updateCompareHistory } from "../[id]/api/compareHistory";

interface AddNewPlayerDialogContainerProps {
  isVisible: boolean;
  previousTitle: string;
  onChangeVisible: (newVisibleStatus: boolean) => void;
}
const DialogTitleText = "타이틀 수정";
const successToastTitle = "변경에 성공했습니다";
const successToastDescription = "이름 변경에 성공했습니다";
const placeholder = "입력해주세요";
const maxNameLength = 50;

function UpdateHistoryTitleDialog({ previousTitle, isVisible, onChangeVisible }: AddNewPlayerDialogContainerProps) {
  const [inputValue, setInputValue] = useState(previousTitle);

  const { addToast } = useToastStore();
  const router = useRouter();
  const { id } = useParams();

  // 다이얼로그가 열릴 때마다 입력값 초기화
  useEffect(() => {
    if (isVisible) {
      setInputValue(previousTitle);
    }
  }, [isVisible]);

  const isTooLongName = inputValue.length >= maxNameLength;
  const isInvalid = isTooLongName;

  // 에러 메시지 노드 (Container 내부에서 직접 구성)
  const errorNode = <>{isTooLongName && `${maxNameLength}자 이하로 입력해주세요.`}</>;

  // onSubmit 로직
  const handleSubmit = async () => {
    await updateCompareHistory(id as string, inputValue);

    addToast({
      title: successToastTitle,
      type: "success",
      description: successToastDescription,
    });
    setInputValue("");

    router.refresh();
  };

  // Presenter에 필요한 값/함수들을 props로 전달
  return (
    <AddTemplateDialog
      isVisible={isVisible}
      onChangeVisible={onChangeVisible}
      title={DialogTitleText}
      inputValue={inputValue}
      onChangeInputValue={setInputValue}
      placeholder={placeholder}
      isInvalid={isInvalid}
      onSubmit={handleSubmit}
      // errorComponent를 prop으로 받지 않고, 내부에서 만든 노드를 직접 주입
      errorComponent={errorNode}
    />
  );
}

export default UpdateHistoryTitleDialog;
