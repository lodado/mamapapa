import { useParams, useRouter } from "next/navigation";
import React from "react";

import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { RemoveTemplateDialog } from "@/shared/ui/Dialog";
import { useToastStore } from "@/shared/ui/Toast/stores";

import { removeCompareHistory } from "../api/compareHistory";

const RemoveHistoryDialog = ({
  isVisible,
  onChangeVisible,
}: {
  isVisible: boolean;
  onChangeVisible: (newVisibleStatus: boolean) => void;
}) => {
  const { addToast } = useToastStore();
  const router = useRouter();
  const { id } = useParams();

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
        router.push(PAGE_ROUTE.MAIN);
      }}
    />
  );
};

export default RemoveHistoryDialog;
