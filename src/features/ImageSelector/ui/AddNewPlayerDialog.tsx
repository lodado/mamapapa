"use client";

import React, { useEffect, useState } from "react";

import { usePlayerStore } from "@/entities/Player";
import { ImageMetadata, useImageSelectorStore } from "@/features/ImageSelector/models";
import { AddTemplateDialog } from "@/shared/ui/Dialog";
import { useToastStore } from "@/shared/ui/Toast/stores";

interface AddNewPlayerDialogContainerProps {
  isVisible: boolean;
  onChangeVisible: (newVisibleStatus: boolean) => void;
  selectedImageForPlayer: ImageMetadata;
  /**
   * 다이얼로그 제목 (기본값: "분류 항목 추가하기")
   */
  title?: string;
  /**
   * placeholder (기본값: "입력해주세요")
   */
  placeholder?: string;
  /**
   * 최대 입력 길이 (기본값: 50)
   */
  maxNameLength?: number;
  /**
   * 성공 토스트 타이틀 (기본값: "저장에 성공했습니다")
   */
  successToastTitle?: string;
  /**
   * 성공 토스트 설명 (기본값: "분류 항목 추가가 성공했습니다.")
   */
  successToastDescription?: string;
}

const successToastTitle = "저장에 성공했습니다";
const successToastDescription = "분류 항목 추가가 성공했습니다.";
const title = "분류 항목 추가하기";
const placeholder = "입력해주세요";
const maxNameLength = 50;

function AddNewPlayerDialog({ isVisible, onChangeVisible, selectedImageForPlayer }: AddNewPlayerDialogContainerProps) {
  const [inputValue, setInputValue] = useState("");

  const { players, addPlayer } = usePlayerStore();
  const { handleUpdatePlayer } = useImageSelectorStore();
  const { addToast } = useToastStore();

  // 다이얼로그가 열릴 때마다 입력값 초기화
  useEffect(() => {
    if (isVisible) {
      setInputValue("");
    }
  }, [isVisible]);

  // Validation 로직
  const isSamePlayerName = (Array.from(players?.keys()) ?? []).includes(inputValue);
  const isTooLongName = inputValue.length >= maxNameLength;
  const isInvalid = isSamePlayerName || isTooLongName;

  // 에러 메시지 노드 (Container 내부에서 직접 구성)
  const errorNode = (
    <>
      {isSamePlayerName && "이미 존재하는 이름입니다."}
      {isTooLongName && `${maxNameLength}자 이하로 입력해주세요.`}
    </>
  );

  // onSubmit 로직
  const handleSubmit = async () => {
    addPlayer(inputValue, { id: inputValue, name: inputValue });
    handleUpdatePlayer(selectedImageForPlayer, inputValue);
    addToast({
      title: successToastTitle,
      type: "success",
      description: successToastDescription,
    });
    setInputValue("");
  };

  // Presenter에 필요한 값/함수들을 props로 전달
  return (
    <AddTemplateDialog
      isVisible={isVisible}
      onChangeVisible={onChangeVisible}
      title={title}
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

export default AddNewPlayerDialog;
