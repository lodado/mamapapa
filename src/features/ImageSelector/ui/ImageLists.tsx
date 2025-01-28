"use client";
import React, { useState } from "react";
import { ImageMetadata, useImageSelectorStore } from "../models";
import { Dropdown } from "@/shared/ui";
import { drawImageOnCanvas } from "@/shared/utils";

import CrossHair from "/public/CrossHair.svg";
import Delete from "/public/delete.svg";

import { useToastStore } from "@/shared/ui/Toast/stores";
import { Ellipsis } from "lucide-react";
import { AddNewPlayerDialog, usePlayerStore } from "@/entities";
import CropSettingDialog from "./CropSettingDialog";

const ImageLists = () => {
  const { images, removeImage, handleUpdatePlayer } = useImageSelectorStore();
  const { addToast } = useToastStore();
  const { players } = usePlayerStore();
  const [isCropSettingDialogVisible, setCropSettingDialogVisible] = useState(false);
  const [selectedImageForReCrop, setSelectedImageForReCrop] = useState<ImageMetadata>();

  const [isAddNewPlayerDialogVisible, setAddNewPlayerDialogVisible] = useState(false);
  const [selectedImageForPlayer, setSelectedImageForPlayer] = useState<ImageMetadata>();

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-2 sm:gap-x-5 gap-y-4">
        {images.map((image) => {
          const face = image.faceCoordinates;
          const isFaceDetected = face.width > 0 && face.height > 0;

          return (
            <div
              key={image.id}
              className="rounded-lg relative flex items-center justify-center cursor-pointer w-full h-[172px]"
            >
              <>
                <Dropdown>
                  <Dropdown.Trigger className="absolute top-1 left-1 w-[50%]">
                    <span
                      className={`truncate subhead-2 w-[80%] ${
                        image.selectedPlayer ? "text-text-00" : "text-text-placeholder"
                      }`}
                    >
                      {image.selectedPlayer ?? "미선택"}
                    </span>
                  </Dropdown.Trigger>
                  <Dropdown.Content className="w-full">
                    {Array.from(players.keys()).map((key: string) => {
                      return (
                        <>
                          <Dropdown.Item key={key} onClick={() => handleUpdatePlayer(image, key)}>
                            {key}
                          </Dropdown.Item>
                        </>
                      );
                    })}

                    <Dropdown.Separator key={"sap"} />

                    <Dropdown.Item
                      onClick={() => {
                        setAddNewPlayerDialogVisible(true);
                        setSelectedImageForPlayer(image);
                      }}
                      key={"addNewPlayerDialog"}
                    >
                      <CrossHair /> 새로 추가하기
                    </Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown>
                <Dropdown>
                  <Dropdown.Trigger
                    className="absolute flex justify-center items-center p-0 top-1 right-1 w-[28px] h-[28px]"
                    doesArrowNeed={false}
                  >
                    <Ellipsis strokeWidth={2} size={12} />
                  </Dropdown.Trigger>
                  <Dropdown.Content className="w-full">
                    <Dropdown.Item
                      onClick={() => {
                        setSelectedImageForReCrop(image);
                        setCropSettingDialogVisible(true);
                      }}
                    >
                      크롭 다시하기
                    </Dropdown.Item>
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
                {isFaceDetected ? (
                  <canvas
                    ref={(canvas) => {
                      if (canvas) drawImageOnCanvas(image.url, face, canvas, face.width, face.height);
                    }}
                    className={`rounded-lg max-w-full max-h-full w-[${face.width}px] h-[172px]`}
                  />
                ) : (
                  <div className={`flex items-center justify-center w-[${Math.min(face.width, 172)}px] h-[172px]`}>
                    얼굴을 찾지 못함!
                  </div>
                )}
              </>
            </div>
          );
        })}
      </div>

      <CropSettingDialog
        selectedImageForReCrop={selectedImageForReCrop}
        isVisible={isCropSettingDialogVisible}
        onChangeVisible={setCropSettingDialogVisible}
      />

      <AddNewPlayerDialog
        selectedImageForPlayer={selectedImageForPlayer!}
        isVisible={isAddNewPlayerDialogVisible}
        onChangeVisible={setAddNewPlayerDialogVisible}
      />
    </>
  );
};

export default ImageLists;
