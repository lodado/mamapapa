import { useParams, useRouter } from "next/navigation";
import React from "react";

import { RemoveTemplateDialog } from "@/shared/ui/Dialog";
import { useToastStore } from "@/shared/ui/Toast/stores";

import { removeCommentById } from "../api/fetchComments";

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
  const { addToast } = useToastStore();

  return (
    <RemoveTemplateDialog
      isVisible={isVisible}
      title={"비교 결과 삭제"}
      description={"결과를 정말로 삭제하시겠습니까?"}
      onChangeVisible={onChangeVisible}
      onSubmit={async () => {
        await removeCommentById({ id });

        addToast({
          title: "삭제 성공",
          type: "success",
          description: "삭제에 성공했습니다.",
        });
        onChangeVisible(false);
        onAfterSubmit?.();
      }}
    />
  );
};

export default RemoveCommentDialog;
