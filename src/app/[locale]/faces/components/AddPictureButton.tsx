"use client";

import { useTranslations } from "next-intl";
import React, { useRef } from "react";

import CrossHair from "/public/CrossHair.svg";
import { useFaceModelStore } from "@/features/AiModel/model";
import { FaceCoordinates, ImageMetadata, useImageSelectorStore } from "@/features/ImageSelector/models";
import { Button } from "@/shared/ui";
import { useLoadingStore } from "@/shared/ui/LoadingSpinner";
import { useToastStore } from "@/shared/ui/Toast/stores";

import { ADD_PICTURE_BUTTON_ID } from "../configs/constant";

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
  const t = useTranslations("ADD");

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
        title: t("PICTURE-SUCCESS"),
        description: t("PICTURE-SUCCESS-DESC"),
        type: "success",
      });
    } catch (e) {
      addToast({
        title: t("PICTURE-FAIL"),
        description: t("PICTURE-FAIL-DESC"),
        type: "error",
      });
    }
  };

  return { processFiles };
};

const AddPictureButton = () => {
  const t = useTranslations("ADD");
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
      <Button
        id={ADD_PICTURE_BUTTON_ID}
        variant="line"
        onClick={handleClick}
        className="rounded"
        disabled={!faceCropModel}
      >
        <CrossHair />
        {t("PICTURE-BUTTON")}
      </Button>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
    </>
  );
};

export default AddPictureButton;
