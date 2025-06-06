"use client";
import { Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import CrossHair from "/public/CrossHair.svg";
import Delete from "/public/delete.svg";
import FaceOff from "/public/face_retouching_off.svg";
import { usePlayerStore } from "@/entities";
import { Dropdown } from "@/shared/ui";
import { drawImageOnCanvas } from "@/shared/utils";

import { ADDITIONAL_OPTION_DROPDOWN_ID, PLAYER_SELECTOR_ID } from "../configs/constant";
import { ImageMetadata, useImageSelectorStore } from "../models";
import AddNewPlayerDialog from "./AddNewPlayerDialog";
import CropSettingDialog from "./CropSettingDialog";
import RemoveImageDialog from "./RemoveImageDialog";

const ImageLists = () => {
  const t = useTranslations("IMAGES");

  const { images, handleUpdatePlayer } = useImageSelectorStore();
  const { players } = usePlayerStore();
  const [isCropSettingDialogVisible, setCropSettingDialogVisible] = useState(false);
  const [selectedImageForReCrop, setSelectedImageForReCrop] = useState<ImageMetadata>();

  const [isAddNewPlayerDialogVisible, setAddNewPlayerDialogVisible] = useState(false);
  const [isRemoveImageDialogVisible, setRemoveImageDialogVisible] = useState(false);

  const [selectedImageForPlayer, setSelectedImageForPlayer] = useState<ImageMetadata>();

  return (
    <>
      <div className="w-full grid grid-cols-2 very-small:grid-cols-3 gap-x-2 sm:gap-x-5 gap-y-4">
        {images.map((image) => {
          const face = image.faceCoordinates;
          const isFaceDetected = face.width > 0 && face.height > 0;

          return (
            <div
              id={image.id}
              key={image.id}
              className="rounded-lg relative flex items-center justify-center cursor-pointer min-w-[15vw] min-h-[15vw] w-full before:content-[''] before:block before:pb-[100%]"
            >
              <Dropdown>
                <Dropdown.Trigger
                  key={PLAYER_SELECTOR_ID}
                  id={PLAYER_SELECTOR_ID}
                  className="absolute top-1 left-1 w-[50%] z-10"
                >
                  <span
                    className={`truncate subhead-2 w-[80%] ${
                      image.selectedPlayer ? "text-text-00" : "text-text-placeholder"
                    }`}
                  >
                    {image.selectedPlayer ?? t("ImageLists-unselected")}
                  </span>
                </Dropdown.Trigger>
                <Dropdown.Content className="w-full">
                  {Array.from(players.values())?.map((values: string) => (
                    <Dropdown.Item key={values} onClick={() => handleUpdatePlayer(image, values)}>
                      {values}
                    </Dropdown.Item>
                  ))}

                  <Dropdown.Separator key={"sap"} />

                  {players.size < 15 && (
                    <Dropdown.Item
                      onClick={() => {
                        setAddNewPlayerDialogVisible(true);
                        setSelectedImageForPlayer(image);
                      }}
                      key={"addNewPlayerDialog"}
                    >
                      <CrossHair /> {t("ImageLists-add_new")}
                    </Dropdown.Item>
                  )}
                </Dropdown.Content>
              </Dropdown>

              <Dropdown>
                <Dropdown.Trigger
                  key={ADDITIONAL_OPTION_DROPDOWN_ID}
                  id={ADDITIONAL_OPTION_DROPDOWN_ID}
                  className="z-10 absolute flex justify-center items-center p-0 top-1 right-1 w-[28px] h-[28px]"
                  doesArrowNeed={false}
                >
                  <Ellipsis strokeWidth={2} size={12} />
                </Dropdown.Trigger>
                <Dropdown.Content className="w-full">
                  <Dropdown.Item
                    key={"recrop-item"}
                    onClick={() => {
                      setSelectedImageForReCrop(image);
                      setCropSettingDialogVisible(true);
                    }}
                  >
                    {t("ImageLists-recrop")}
                  </Dropdown.Item>
                  <Dropdown.Item
                    key={"ImageLists-remove-item"}
                    onClick={() => {
                      setSelectedImageForPlayer(image);
                      setRemoveImageDialogVisible(true);
                    }}
                  >
                    <Delete /> {t("ImageLists-delete")}
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown>

              {isFaceDetected ? (
                <canvas
                  ref={(canvas) => {
                    if (canvas) drawImageOnCanvas(image.url, face, canvas, face.width, face.height);
                  }}
                  className={`rounded-lg max-w-full max-h-full w-[${face.width}px] before:content-[''] before:block before:pb-[100%]`}
                />
              ) : (
                <div
                  className={`relative rounded-lg flex-col w-full h-full bg-tertiary-op-press flex items-center justify-center w-[${Math.min(
                    172
                  )}px] before:content-[''] before:block before:pb-[100%]`}
                >
                  <div className="subhead-2 text-text-placeholder gap-1 flex flex-col justify-center items-center absolute top-0 right-0 left-0 bottom-0">
                    <FaceOff />
                    {t("ImageLists-unrecognized")}
                  </div>
                </div>
              )}
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

      <RemoveImageDialog
        isVisible={isRemoveImageDialogVisible}
        onChangeVisible={setRemoveImageDialogVisible}
        selectedImage={selectedImageForPlayer!}
      />
    </>
  );
};

export default ImageLists;
