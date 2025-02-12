import { useParams, useRouter } from "next/navigation";
import React from "react";

import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { RemoveTemplateDialog } from "@/shared/ui/Dialog";
import { useToastStore } from "@/shared/ui/Toast/stores";

import { removeCompareHistory } from "../[id]/api/compareHistory";

const RemoveHistoryDialog = ({
  isVisible,
  onChangeVisible,
  OnAfterSubmit,
  id,
}: {
  id: string;
  isVisible: boolean;
  onChangeVisible: (newVisibleStatus: boolean) => void;
  OnAfterSubmit?: () => void;
}) => {
  const { addToast } = useToastStore();
  const router = useRouter();

  return (
    <RemoveTemplateDialog
      isVisible={isVisible}
      title={"비교 결과 삭제"}
      description={"결과를 정말로 삭제하시겠습니까?"}
      onChangeVisible={onChangeVisible}
      onSubmit={async () => {
        await removeCompareHistory(id as string);

        addToast({
          title: "삭제 성공",
          type: "success",
          description: "삭제에 성공했습니다.",
        });
        onChangeVisible(false);
        OnAfterSubmit?.();
      }}
    />
  );
};

export default RemoveHistoryDialog;
