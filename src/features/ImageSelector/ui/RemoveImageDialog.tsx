import { AlertDialog } from "@/shared/ui/Dialog";
import React from "react";

import { ImageMetadata, useImageSelectorStore } from "@/features/ImageSelector/models";
import { useToastStore } from "@/shared/ui/Toast/stores";

const RemoveImageDialog = ({
  isVisible,
  onChangeVisible,
  selectedImage,
}: {
  isVisible: boolean;
  onChangeVisible: (newVisibleStatus: boolean) => void;

  selectedImage: ImageMetadata;
}) => {
  const { removeImage } = useImageSelectorStore();
  const { addToast } = useToastStore();

  return (
    <AlertDialog
      swipePercent={0.2}
      className="h-[calc(37*var(--vh))]"
      isVisible={isVisible}
      onChangeVisible={onChangeVisible}
    >
      <AlertDialog.Header className="flex flex-col gap-[1.1rem]">
        <h1>이미지 삭제</h1>
        <div className="w-screen h-[1.9px] bg-border-borderOpaque"></div>
      </AlertDialog.Header>
      <AlertDialog.Body className="flex flex-col flex-start">
        비교할 사진을 정말로 삭제하시겠습니까? 삭제를 완료후 되돌리기 어렵습니다.
      </AlertDialog.Body>
      <AlertDialog.SubmitForm
        submitText="확인"
        cancelText="취소"
        cancelButtonProps={{
          variant: "errorLine",
        }}
        submitButtonProps={{
          variant: "errorSolid",
        }}
        onSubmit={async () => {
          removeImage(selectedImage);
          addToast({
            title: "삭제 성공",
            type: "error",
            description: "사진 삭제에 성공했습니다.",
          });
        }}
      />
    </AlertDialog>
  );
};

export default RemoveImageDialog;
