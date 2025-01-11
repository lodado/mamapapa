import React from "react";

import Error from "./Error.svg";
import { Button } from "@/shared/ui";
import { useFaceModelStore } from "../../model/faceModelStore";

const ModelDownloadFail = () => {
  const { loadModelWithProgress } = useFaceModelStore();

  return (
    <>
      <div className="ml-2 rounded-full h-full flex items-center justify-center pl-2">
        <Error />
      </div>

      <div className="">
        <p className="text-text-01 subhead-2">비교를 위한 AI 모델 다운로드 중단</p>
        <p className="body-1 text-text-03">다시 시도해주세요 (0%)</p>
      </div>

      <div>
        <Button className="mr-[1.75rem]" variant="line" onClick={loadModelWithProgress}>
          재개
        </Button>
      </div>
    </>
  );
};

export default ModelDownloadFail;
