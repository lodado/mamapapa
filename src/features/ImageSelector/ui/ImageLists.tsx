"use client";
import React, { useEffect, useRef } from "react";
import { useImageSelectorStore } from "../models";

const ImageLists = () => {
  const { images } = useImageSelectorStore();

  const drawFaceOnCanvas = (imageUrl: string, face: any, canvas: HTMLCanvasElement) => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const scale = 1;
      const { x, y, width, height } = face;

      // 캔버스 크기 설정
      canvas.width = width * scale;
      canvas.height = height * scale;

      // 얼굴 크롭 및 확대 그리기
      ctx.drawImage(
        img,
        x,
        y,
        width,
        height, // 원본 이미지에서 얼굴 영역 크롭
        0,
        0,
        width * scale,
        height * scale // 캔버스에 확대하여 그리기
      );
    };
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-2 sm:gap-x-5 gap-y-4">
      {images.map((image) => {
        const face = image.faceCoordinates;

        return (
          <div key={image.id} className="relative cursor-pointer border border-solid w-full h-full">
            {face.width > 0 && face.height > 0 ? (
              <canvas
                ref={(canvas) => {
                  if (canvas) drawFaceOnCanvas(image.url, face, canvas);
                }}
                className="w-full h-full"
              />
            ) : (
              // 얼굴 좌표가 없을 경우 원본 이미지 렌더링
              <div>얼굴 사진 못찾음</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ImageLists;
