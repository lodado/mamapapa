"use client";

import React, { useRef } from "react";
import { Button } from "@/shared/ui";
import CrossHair from "/public/CrossHair.svg";
import { FaceCoordinates, ImageMetadata, useImageSelectorStore } from "@/features/ImageSelector/models";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import { useFaceModelStore } from "@/features/AiModel/model";

const AddPictureButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addImages } = useImageSelectorStore();
  const { faceCropModel } = useFaceModelStore();

  // 버튼 클릭 시 숨겨둔 input[type="file"] 클릭을 트리거
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const detectFaces = async (file: File): Promise<FaceCoordinates | undefined> => {
    // 파일을 이미지로 로드
    const img = new Image();
    const imgURL = URL.createObjectURL(file);
    img.src = imgURL;

    return new Promise((resolve) => {
      img.onload = async () => {
        const predictions = await faceCropModel!.estimateFaces(img, false); // 얼굴 예측

        /** 크롭에 실패할 경우 */
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
          width: width,
          height: height,
        });
      };
    });
  };

  // 파일 선택 시 실행될 핸들러
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: ImageMetadata[] = [];

    for (const file of Array.from(files)) {
      const faceCoordinates = await detectFaces(file); // 얼굴 좌표 추출

      newImages.push({
        id: `${file.name}-${Date.now()}`, // 고유 ID 생성
        url: URL.createObjectURL(file), // 미리보기 URL 생성
        file, // 원본 파일 저장
        faceCoordinates: faceCoordinates ?? {
          width: 0,
          height: 0,
          x: 0,
          y: 0,
        },
      });
    }
    addImages(newImages);

    e.target.value = "";
  };

  return (
    <>
      {/* 사진 추가하기 버튼 */}
      <Button variant="line" onClick={handleClick} disabled={!faceCropModel}>
        <CrossHair />
        사진 추가하기
      </Button>

      {/* 실제 파일 입력창은 숨겨둠 */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
    </>
  );
};

export default AddPictureButton;
