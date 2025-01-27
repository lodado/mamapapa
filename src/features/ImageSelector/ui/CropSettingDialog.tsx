"use client";

import { AlertDialog } from "@/shared/ui/Dialog";
import React, { useEffect, useRef, useState } from "react";
import { FaceCoordinates, ImageMetadata, useImageSelectorStore } from "../models";
import { Cropper, ReactCropperElement } from "react-cropper";

import "cropperjs/dist/cropper.css";
import { Button, Dropdown } from "@/shared/ui";
import { usePlayerStore } from "@/entities";

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
  const cropperRef = useRef<HTMLImageElement>(null);
  const [cropper, setCropper] = useState<Cropper>();

  const { players } = usePlayerStore();
  const { updateImage, handleUpdatePlayer } = useImageSelectorStore();

  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageMetadata, setImageMetaData] = useState(selectedImageForReCrop);

  const handleCrop = () => {
    if (!cropperRef.current) return;

    const cropper = (cropperRef.current as any).cropper;
    cropper.getCroppedCanvas().toBlob((blob: Blob | null) => {
      if (!blob) return;

      const data = cropper.getData(true); // 실제 원본 사이즈 기반
      const updatedCoords: FaceCoordinates = {
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
      };

      updateImage({
        ...imageMetadata!,
        faceCoordinates: updatedCoords,
      });
    }, "image/jpeg");
  };

  useEffect(() => {
    if (selectedImageForReCrop) {
      setImageMetaData(selectedImageForReCrop);

      const image = selectedImageForReCrop.file;
      const objectUrl = URL.createObjectURL(image);
      setImageSrc(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [isVisible, selectedImageForReCrop]);

  return (
    <>
      {
        <AlertDialog className="h-[calc(95*var(--vh))]" isVisible={isVisible} onChangeVisible={onChangeVisible}>
          <AlertDialog.Header className="flex flex-col gap-[1.1rem]">
            <h1>크롭 다시하기</h1>
            <div className="w-screen h-[1.9px] bg-border-borderOpaque"></div>
          </AlertDialog.Header>
          <AlertDialog.Body className="flex flex-col flex-start overflow-x-hidden overflow-h-scroll">
            <div className="flex flex-col gap-2 justify-between w-full px-4">
              <h2 className="subhead-3 flex flex-col text-text-01 h-[40px]">크롭할 영역을 선택해주세요</h2>

              <div className="text-text-03 body-2">
                <p>원본사진에서 크롭 영역을 다시 지정해주세요.</p>
                <p>파란색 영역의 크기를 조절하면 영역이 지정됩니다.</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full px-4 my-4">
              <p className="w-full h-4 text-text-01 subhead-2">사진을 분류해주세요</p>

              <Dropdown>
                <Dropdown.Trigger className="flex justify-between px-[0.625rem] items-center">
                  {imageMetadata?.selectedPlayer ?? "사람을 선택해주세요."}
                </Dropdown.Trigger>
                <Dropdown.Content className="w-screen md:w-[calc(768px-5rem)]  ">
                  {Array.from(players.keys()).map((key: string) => {
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

            <div className="flex items-center justify-center px-4 ">
              <Cropper
                ref={cropperRef}
                className="w-screen h-[300px]"
                // file을 바로 넣을 수 없으므로 objectURL을 src에 전달
                src={imageSrc}
                guides={true}
                center={true}
                responsive={true}
                autoCrop={true}
                autoCropArea={0.8}
                viewMode={1}
                onInitialized={(instance) => setCropper(instance)}
              />
            </div>
          </AlertDialog.Body>

          <div className="w-full  px-6 py-4  flex flex-col flex-shrink-0 gap-[0.75rem]">
            <Button
              className="w-full h-[3.5rem]"
              type="button"
              variant="primarySolid"
              onClick={() => {
                handleCrop();
                onChangeVisible(false);
              }}
            >
              완료
            </Button>
            <Button className="w-full h-[3.5rem]" type="button" variant="line" onClick={() => onChangeVisible(false)}>
              되돌리기
            </Button>
          </div>
        </AlertDialog>
      }
    </>
  );
};

export default CropSettingDialog;
