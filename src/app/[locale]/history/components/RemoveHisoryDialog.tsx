import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import { RemoveTemplateDialog } from "@/shared/ui/Dialog";
import { useToastStore } from "@/shared/ui/Toast/stores";

import { removeCompareHistory } from "../[id]/api/compareHistory";

const RemoveCommentDialog = ({
  isVisible,
  onChangeVisible,
  onAfterSubmit,
  id,
}: {
  id: string;
  isVisible: boolean;
  onChangeVisible: (newVisibleStatus: boolean) => void;
  onAfterSubmit?: () => void;
}) => {
  const t = useTranslations("RemoveCommentDialog");
  const { addToast } = useToastStore();
  const router = useRouter();

  return (
    <RemoveTemplateDialog
      isVisible={isVisible}
      title={t("dialog_title")}
      description={t("dialog_description")}
      onChangeVisible={onChangeVisible}
      onSubmit={async () => {
        await removeCompareHistory(id as string);

        addToast({
          title: t("success_title"),
          type: "success",
          description: t("success_description"),
        });
        onChangeVisible(false);
        onAfterSubmit?.();
      }}
    />
  );
};

export default RemoveCommentDialog;
