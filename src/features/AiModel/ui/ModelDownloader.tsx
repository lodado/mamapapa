"use client";

import React, { useEffect } from "react";

import { useFaceModelStore } from "../model/faceModelStore";
import ModelDownloadLoading from "./components/ModelDownloadLoading";
import ModelDownloadFail from "./components/ModelDownloadFail";
import ModelDownloadSuccess from "./components/ModelDownloadSuccess";

const ModelDownloader = () => {
  const { progress, model, isError, isLoading, loadModelWithProgress } = useFaceModelStore();

  useEffect(() => {
    loadModelWithProgress();
  }, [loadModelWithProgress]);

  console.log(progress, model, isError, isLoading, "wtf?");

  return (
    <div className="shadow-02 min-w-[320px] flex flex-row py-2 w-max min-h-[68px] gap-3 justify-start items-center rounded-xl">
      {isLoading && <ModelDownloadLoading />}
      {isError && <ModelDownloadFail />}
      {!isLoading && !isError && model && <ModelDownloadSuccess />}
    </div>
  );
};

export default ModelDownloader;
