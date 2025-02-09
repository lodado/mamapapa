"use client";

import React from "react";
import ShardLink from "/public/ShareLink.svg";
import { useToastStore } from "@/shared/ui/Toast/stores";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CopyLinkButton = () => {
  const { addToast } = useToastStore();

  const handleCopyButtonClick = () => {
    addToast({
      type: "success",
      title: `복사 성공`,
      description: `URL이 복사되었습니다.`,
    });
  };

  return (
    <CopyToClipboard
      text={typeof window !== "undefined" ? window.location.href : ""}
      onCopy={() => handleCopyButtonClick()}
    >
      <button type="button">
        <ShardLink />
      </button>
    </CopyToClipboard>
  );
};

export default CopyLinkButton;
