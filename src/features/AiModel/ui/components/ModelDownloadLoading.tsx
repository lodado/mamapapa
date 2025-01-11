import React from "react";

import Spinner from "./Spinner.svg";

const ModelDownloadLoading = () => {
  return (
    <>
      <div className="ml-2 rounded-full h-full flex items-center justify-center pl-2">
        <Spinner className="animate-spin" />
      </div>

      <div className="mr-[1.75rem]">
        <p className="text-text-primary subhead-2">비교를 위한 AI 모델을 다운로드중입니다</p>
        <p className="body-1 text-text-03">잠시만 기다려주세요...</p>
      </div>
    </>
  );
};

export default ModelDownloadLoading;
