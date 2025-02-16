import { useTranslations } from "next-intl";
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
  const t = useTranslations("IMAGES");

  const { removeImage } = useImageSelectorStore();
  const { addToast } = useToastStore();

  return (
    <RemoveTemplateDialog
      isVisible={isVisible}
      title={t("RemoveImageDialog-title")}
      description={t("RemoveImageDialog-description")}
      onChangeVisible={onChangeVisible}
      onSubmit={async () => {
        removeImage(selectedImage);
        addToast({
          title: t("RemoveImageDialog-success_title"),
          type: "success",
          description: t("RemoveImageDialog-success_description"),
        });
        onChangeVisible(false);
      }}
    />
  );
};

export default RemoveImageDialog;
