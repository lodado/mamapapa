import React from "react";

import { ImageMetadata } from "@/features/ImageSelector/models";
import { Image } from "@/shared/ui";
import { AlertDialog } from "@/shared/ui/Dialog";

const PHONE_INFO_IMAGE_URL =
  "https://qmwtuvttspuxwuwrsuci.supabase.co/storage/v1/object/public/pokitokiStorage/phone_info_1.webp";

interface RemoveTemplateDialogProps {
  isVisible: boolean;

  title: string;
  description: string;

  onChangeVisible: (newVisibleStatus: boolean) => void;

  onSubmit: () => Promise<void>;
}

const RemoveTemplateDialog: React.FC<RemoveTemplateDialogProps> = ({
  isVisible,
  title,
  description,
  onChangeVisible,
  onSubmit,
}) => {
  return (
    <AlertDialog swipePercent={0.2} className="min-h-[21rem]" isVisible={isVisible} onChangeVisible={onChangeVisible}>
      <AlertDialog.Header className="flex flex-col gap-[1.1rem]">
        <h1>{title}</h1>
        <div className="w-screen h-[1.9px] bg-border-borderOpaque"></div>
      </AlertDialog.Header>

      <AlertDialog.Body className="flex flex-row gap-4 grow items-center justify-between py-6 px-6">
        <div className="w-[80%] h-full justify-center flex text-text-01 flex-col body-2">
          <p>{description}</p>
          <p>삭제를 완료후 되돌리기 어렵습니다.</p>
        </div>
        <div>
          <Image
            isPreload
            preloadOptions={{ as: "image", fetchPriority: "high" }}
            width={72}
            height={72}
            src={PHONE_INFO_IMAGE_URL}
            alt="warning message image"
            priority
          />
        </div>
      </AlertDialog.Body>

      {/**
       * We can use a Footer area of AlertDialog
       * to show both Cancel and Submit actions
       **/}
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
          onSubmit();
        }}
      />
    </AlertDialog>
  );
};

export default RemoveTemplateDialog;
