"use client";
import React from "react";
import { useImageSelectorStore } from "../models";
import { Dropdown } from "@/shared/ui";
import { drawImageOnCanvas } from "@/shared/utils";

import Delete from "/public/Delete.svg";
import { useToastStore } from "@/features/Toast/stores";

const ImageLists = () => {
  const { images, removeImage } = useImageSelectorStore();
  const { addToast } = useToastStore();

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-2 sm:gap-x-5 gap-y-4">
      {images.map((image) => {
        const face = image.faceCoordinates;
        const isFaceDetected = face.width > 0 && face.height > 0;

        return (
          <div
            key={image.id}
            className="rounded-lg relative flex items-center justify-center cursor-pointer w-full h-[172px]"
          >
            {isFaceDetected ? (
              <>
                <Dropdown>
                  <Dropdown.Trigger className="absolute top-1 left-1 w-[50%]">
                    <span className="truncate w-[80%]">testtesttesttesttesttesttest</span>
                  </Dropdown.Trigger>
                  <Dropdown.Content className="w-full">
                    <Dropdown.Item>크롭 다시하기</Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        removeImage(image);
                        addToast({
                          title: "이미지 삭제",
                          type: "success",
                          description: "사진 삭제에 성공했습니다.",
                        });
                      }}
                    >
                      <Delete /> 삭제하기
                    </Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown>

                <canvas
                  ref={(canvas) => {
                    if (canvas) drawImageOnCanvas(image.url, face, canvas);
                  }}
                  className={`rounded-lg max-w-full max-h-full w-[${face.width}px] h-[172px]`}
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
