import React from "react";

import Spinner from "./Spinner.svg";

const ModelDownloader = () => {
  return (
    <div className="shadow-02 flex flex-row py-2 w-max min-h-[68px] gap-3 justify-start items-center rounded-xl">
      <div className="ml-2 rounded-full h-full flex items-center justify-center pl-2">
        <Spinner className="animate-spin" />
      </div>

      <div className="mr-[1.75rem]">
        <p className="text-text-primary subhead-2">비교를 위한 AI 모델을 다운로드중입니다</p>
        <p className="body-1 text-text-03">잠시만 기다려주세요...</p>
      </div>
    </div>
  );
};

export default ModelDownloader;
