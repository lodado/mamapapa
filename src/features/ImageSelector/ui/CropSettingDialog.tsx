"use client";

import "cropperjs/dist/cropper.css";

import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";

import { usePlayerStore } from "@/entities";
import { Button, Dropdown } from "@/shared/ui";
import { AlertDialog } from "@/shared/ui/Dialog";

import { FaceCoordinates, ImageMetadata, useImageSelectorStore } from "../models";
import { removeExifData } from "../utils/image";

interface CropSettingDialogProps {
  selectedImageForReCrop?: ImageMetadata;
  isVisible: boolean;
  onChangeVisible: (visible: boolean) => void;
}

const CropSettingDialog: React.FC<CropSettingDialogProps> = ({
  selectedImageForReCrop,
  isVisible,
  onChangeVisible,
}) => {
  const t = useTranslations("IMAGES");
  const cropperRef = useRef<HTMLImageElement>(null);
  const [cropper, setCropper] = useState<Cropper>();

  const { players } = usePlayerStore();
  const { handleUpdatePlayer } = useImageSelectorStore();

  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageMetadata, setImageMetaData] = useState(selectedImageForReCrop);

  const handleCrop = () => {
    if (!cropperRef.current) return;

    const cropper = (cropperRef.current as any).cropper;
    cropper.getCroppedCanvas().toBlob((blob: Blob | null) => {
      if (!blob) return;

      const data = cropper.getData(true);
      const updatedCoords: FaceCoordinates = {
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
      };

      handleUpdatePlayer(
        {
          ...imageMetadata!,
          faceCoordinates: updatedCoords,
        },
        imageMetadata?.selectedPlayer ?? ""
      );
    }, "image/jpeg");
  };

  useEffect(() => {
    if (selectedImageForReCrop) {
      setImageMetaData(selectedImageForReCrop);

      const image = selectedImageForReCrop.file;
      let urlObjectUrl = URL.createObjectURL(image);

      removeExifData(image).then((objectUrl) => {
        urlObjectUrl = URL.createObjectURL(image);
        setImageSrc(objectUrl);
      });

      return () => {
        if (urlObjectUrl) URL.revokeObjectURL(urlObjectUrl);
      };
    }
  }, [isVisible, selectedImageForReCrop]);

  return (
    <AlertDialog className="h-[calc(95*var(--vh))]" isVisible={isVisible} onChangeVisible={onChangeVisible}>
      <AlertDialog.Header className="flex flex-col gap-[1.1rem]">
        <h1>{t("CROP-DIALOG-TITLE")}</h1>
        <div className="w-screen h-[1.9px] bg-border-borderOpaque"></div>
      </AlertDialog.Header>
      <AlertDialog.Body className="flex flex-col flex-start overflow-x-hidden overflow-h-scroll">
        <div className="flex flex-col gap-2 justify-between w-full px-4">
          <h2 className="subhead-3 flex flex-col text-text-01 h-[40px]">{t("CROP-DIALOG-SELECT-AREA")}</h2>

          <div className="text-text-03 body-2">
            <p>{t("CROP-DIALOG-INSTRUCTIONS-1")}</p>
            <p>{t("CROP-DIALOG-INSTRUCTIONS-2")}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full px-4 my-4">
          <p className="w-full h-4 text-text-01 subhead-2">{t("CROP-DIALOG-SELECT-PLAYER")}</p>

          <Dropdown>
            <Dropdown.Trigger className="flex justify-between px-[0.625rem] items-center">
              {imageMetadata?.selectedPlayer ?? t("CROP-DIALOG-SELECT-PLAYER")}
            </Dropdown.Trigger>
            <Dropdown.Content className="w-screen md:w-[calc(768px-5rem)]">
              {Array.from(players.values())?.map((key: string) => {
                return (
                  <Dropdown.Item
                    key={key}
                    onClick={() => {
                      setImageMetaData({ ...imageMetadata!, selectedPlayer: key });
                    }}
                  >
                    {key}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Content>
          </Dropdown>
        </div>

        <div className="flex items-center justify-center px-4">
          <Cropper
            ref={cropperRef}
            className="w-screen h-[300px]"
            src={imageSrc}
            guides={true}
            center={true}
            responsive={true}
            autoCrop={true}
            autoCropArea={0.8}
            viewMode={1}
            checkOrientation={true}
            onInitialized={(instance) => {
              setCropper(instance);
              instance.setData({ scaleX: 1 });
            }}
          />
        </div>
      </AlertDialog.Body>

      <div className="w-full px-6 py-4 flex flex-col flex-shrink-0 gap-[0.75rem]">
        <Button
          className="w-full h-[3.5rem]"
          type="button"
          variant="primarySolid"
          onClick={() => {
            handleCrop();
            onChangeVisible(false);
          }}
        >
          {t("CROP-DIALOG-CONFIRM")}
        </Button>
        <Button className="w-full h-[3.5rem]" type="button" variant="line" onClick={() => onChangeVisible(false)}>
          {t("CROP-DIALOG-CANCEL")}
        </Button>
      </div>
    </AlertDialog>
  );
};

export default CropSettingDialog;
