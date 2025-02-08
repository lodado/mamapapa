import React from "react";

import { ImageMetadata, useImageSelectorStore } from "@/features/ImageSelector/models";
import { RemoveTemplateDialog } from "@/shared/ui/Dialog";
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
    <RemoveTemplateDialog
      isVisible={isVisible}
      title={"사진 삭제"}
      description={"비교할 사진을 정말로 삭제하시겠습니까?"}
      onChangeVisible={onChangeVisible}
      onSubmit={() => {
        removeImage(selectedImage);
        addToast({
          title: "삭제 성공",
          type: "success",
          description: "사진 삭제에 성공했습니다.",
        });
        onChangeVisible(false);
      }}
    />
  );
};

export default RemoveImageDialog;
