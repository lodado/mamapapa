"use client";

import React, { useRef } from "react";
import { Button } from "@/shared/ui";
import CrossHair from "/public/CrossHair.svg";
import { FaceCoordinates, ImageMetadata, useImageSelectorStore } from "@/features/ImageSelector/models";
import { useFaceModelStore } from "@/features/AiModel/model";
import { useLoadingStore } from "@/shared/ui/LoadingSpinner";
import { useToastStore } from "@/features/Toast/stores";

// Hook for handling face detection logic
const useFaceDetection = () => {
  const { faceCropModel } = useFaceModelStore();

  const detectFaces = async (file: File): Promise<FaceCoordinates | undefined> => {
    const img = new Image();
    const imgURL = URL.createObjectURL(file);
    img.src = imgURL;

    return new Promise((resolve) => {
      img.onload = async () => {
        const predictions = await faceCropModel!.estimateFaces(img, false);

        if (predictions.length === 0) {
          resolve({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
          });
          return;
        }

        const face = predictions[0];
        const [x, y] = face.topLeft as [number, number];
        const [rx, ry] = face.bottomRight as [number, number];
        const width = rx - x;
        const height = ry - y;

        resolve({
          x,
          y,
          width,
          height,
        });
      };
    });
  };

  return { faceCropModel, detectFaces };
};

// Hook for handling image selection logic
const useImageSelection = () => {
  const { addImages } = useImageSelectorStore();

  const { addToast } = useToastStore();

  const processFiles = async (files: File[], detectFaces: (file: File) => Promise<FaceCoordinates | undefined>) => {
    const newImages: ImageMetadata[] = [];

    try {
      for (const file of files) {
        const faceCoordinates = await detectFaces(file);

        newImages.push({
          id: `${file.name}-${Date.now()}`,
          url: URL.createObjectURL(file),
          file,
          faceCoordinates: faceCoordinates ?? {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
          },
        });
      }

      addImages(newImages);

      addToast({
        title: "저장 성공",
        description: "새로 추가하기를 성공했습니다.",
        type: "success",
      });
    } catch (e) {
      addToast({
        title: "저장 실패",
        description: "새로 추가하기를 실패했습니다.",
        type: "error",
      });
    }
  };

  return { processFiles };
};

const AddPictureButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setLoading } = useLoadingStore();
  const { faceCropModel, detectFaces } = useFaceDetection();
  const { processFiles } = useImageSelection();

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);

    await processFiles(Array.from(files), detectFaces);

    setLoading(false);

    e.target.value = "";
  };

  return (
    <>
      <Button variant="line" onClick={handleClick} disabled={!faceCropModel}>
        <CrossHair />
        사진 추가하기
      </Button>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
    </>
  );
};

export default AddPictureButton;
