import React from "react";

import Spinner from "./Spinner.svg";
import { Check } from "lucide-react";

const ModelDownloadSuccess = () => {
  return (
    <>
      <div className="ml-2 rounded-full h-full flex items-center justify-center pl-2 text-text-success">
        <Check />
      </div>

      <div className="mr-[1.75rem]">
        <p className="text-text-success subhead-2">비교를 위한 AI 모델을 다운로드 완료</p>
        <p className="body-1 text-text-03">다운로드가 완료되었습니다.(100%)</p>
      </div>
    </>
  );
};

export default ModelDownloadSuccess;
