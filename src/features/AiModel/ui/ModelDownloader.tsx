"use client";

import React, { useEffect } from "react";

import { useFaceModelStore } from "../model/faceModelStore";
import ModelDownloadLoading from "./components/ModelDownloadLoading";
import ModelDownloadFail from "./components/ModelDownloadFail";
import ModelDownloadSuccess from "./components/ModelDownloadSuccess";

const ModelDownloader = () => {
  const { progress, faceRecognitionModel: model, isError, isLoading, loadModelWithProgress } = useFaceModelStore();

  useEffect(() => {
    loadModelWithProgress();
  }, [loadModelWithProgress]);

  return (
    <div className="shadow-02 max-w-[29rem] flex-shrink-0 min-w-[320px] flex flex-row py-2 w-full min-h-[68px] gap-3 justify-start items-center rounded-xl">
      {isLoading && <ModelDownloadLoading />}
      {isError && <ModelDownloadFail />}
      {!isLoading && !isError && model && <ModelDownloadSuccess />}
    </div>
  );
};

export default ModelDownloader;
