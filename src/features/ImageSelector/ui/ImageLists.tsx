"use client";
import React, { useEffect, useRef } from "react";
import { useImageSelectorStore } from "../models";
import { Dropdown } from "@/shared/ui";

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

const ImageLists = () => {
  const { images, removeImage } = useImageSelectorStore();
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-2 sm:gap-x-5 gap-y-4">
      {images.map((image) => {
        const face = image.faceCoordinates;
        const isFaceDetected = face.width > 0 && face.height > 0;

        return (
          <div
            key={image.id}
            className="relative flex items-center justify-center cursor-pointer border border-solid min-h-[150px]"
          >
            {isFaceDetected ? (
              <>
                <Dropdown>
                  <Dropdown.Trigger className="absolute top-0 w-full">123</Dropdown.Trigger>
                  <Dropdown.Content className="w-full">
                    <Dropdown.Item>크롭 다시하기</Dropdown.Item>
                    <Dropdown.Item onClick={() => removeImage(image)}>삭제하기</Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown>

                <canvas
                  ref={(canvas) => {
                    if (canvas) drawFaceOnCanvas(image.url, face, canvas);
                  }}
                  className={`w-full max-h-full`}
                />
              </>
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
