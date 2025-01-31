"use client";

import { useEffect, useState } from "react";

import { useFaceModelStore } from "../model/faceModelStore";
import ModelDownloadLoading from "./components/ModelDownloadLoading";
import ModelDownloadFail from "./components/ModelDownloadFail";
import ModelDownloadSuccess from "./components/ModelDownloadSuccess";
import { cn } from "@/shared";

const ModelDownloader = ({ className }: { className?: string }) => {
  const { progress, faceRecognitionModel: model, isError, isLoading, loadModelWithProgress } = useFaceModelStore();
  const [isVisible, setVisible] = useState(!model);

  useEffect(() => {
    loadModelWithProgress();
  }, [loadModelWithProgress]);

  useEffect(() => {
    if (model) {
      let id = setTimeout(() => {
        setVisible(false);
      }, 1500);

      return () => {
        clearTimeout(id);
      };
    }
  }, [model]);

  return (
    <>
      <div
        className={cn(
          `shadow-02 max-w-[29rem] flex-shrink-0 min-w-[320px] 
      flex flex-row py-2 w-[calc(100%-3rem)] 
      min-h-[68px] gap-3 justify-start items-center rounded-xl
        ${isVisible ? "" : "invisible"}`,
          className
        )}
      >
        {isLoading && <ModelDownloadLoading />}
        {isError && <ModelDownloadFail />}
        {!isLoading && !isError && model && <ModelDownloadSuccess />}
      </div>
    </>
  );
};

export default ModelDownloader;
