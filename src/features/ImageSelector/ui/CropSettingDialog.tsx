"use client";

import { AlertDialog } from "@/shared/ui/Dialog";
import React, { useEffect, useRef, useState } from "react";
import { FaceCoordinates, ImageMetadata, useImageSelectorStore } from "../models";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const { updateImage, handleUpdatePlayer } = useImageSelectorStore();

  // 크롭 관련 상태
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);

  const [imageMetadata, setImageMetaData] = useState(selectedImageForReCrop);
  const [cropRect, setCropRect] = useState<FaceCoordinates>(imageMetadata?.faceCoordinates!);

  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);

  // 이미지를 캔버스에 그릴 때 적용한 스케일
  const [scale, setScale] = useState<number>(1);

  // 300×300 내부에서, 이미지가 실제로 그려지는 위치
  // (이미지 비율이 다를 경우, 여백이 생길 수 있으므로 offsetX/Y로 가운데 정렬)
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  useEffect(() => {
    if (selectedImageForReCrop) {
      setImageMetaData(selectedImageForReCrop);
      setCropRect(selectedImageForReCrop.faceCoordinates);
    }
  }, [isVisible, selectedImageForReCrop]);

  useEffect(() => {
    if (canvasRef.current == undefined || !imageMetadata) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imageMetadata.url;

    console.log(img, img.src, "sibal");

    img.onload = () => {
      // Canvas 크기를 이미지 크기에 맞춤 (샘플에서는 단순 적용)
      canvas.width = 300;
      canvas.height = 300;

      // 2) 원본 이미지 크기
      const w = img.width;
      const h = img.height;

      const s = Math.min(300 / w, 300 / h);

      const displayWidth = w * s;
      const displayHeight = h * s;

      const offX = (300 - displayWidth) / 2;
      const offY = (300 - displayHeight) / 2;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, offX, offY, displayWidth, displayHeight);

      if (cropRect.width && cropRect.height) {
        const cX = offX + cropRect.x;
        const cY = offY + cropRect.y;
        const cW = cropRect.width;
        const cH = cropRect.height;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(cX, cY, cW, cH);
      }

      // ▼ 계산된 정보 state 저장(나중에 원본 좌표 환산에 사용)
      setOriginalWidth(w);
      setOriginalHeight(h);
      setScale(s);
      setOffsetX(offX);
      setOffsetY(offY);
    };
  }, [isVisible, imageMetadata, cropRect]);

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvasRef.current) return;
    setIsMouseDown(true);

    // Canvas 내에서의 좌표 계산
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartX(x);
    setStartY(y);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isMouseDown || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // startX/Y ~ 현재 마우스 위치까지 사각형
    setCropRect({
      x: Math.min(startX, x),
      y: Math.min(startY, y),
      width: Math.abs(x - startX),
      height: Math.abs(y - startY),
    });
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setIsMouseDown(false);
  };

  const handleSubmit = async () => {
    // 현재 cropRect (캔버스 기준)
    const { x, y, width, height } = cropRect;

    if (width <= 0 || height <= 0) {
      alert("크롭 영역이 없습니다.");
      return;
    }

    // 원본 이미지에서의 좌표/크기 (스케일 역산)
    const realX = (x - offsetX) / scale;
    const realY = (y - offsetY) / scale;
    const realW = width / scale;
    const realH = height / scale;

    // 만약 음수(=이미지 밖)를 잘못 선택했을 경우 보정
    const safeX = Math.max(0, realX);
    const safeY = Math.max(0, realY);
    const safeW = Math.min(realW, originalWidth - safeX);
    const safeH = Math.min(realH, originalHeight - safeY);

    console.log("원본 기준 크롭 좌표:", safeX, safeY, safeW, safeH);

    updateImage({
      ...imageMetadata!,

      faceCoordinates: {
        x: safeX,
        y: safeY,
        width: safeW,
        height: safeH,
      },
    });
  };

  return (
    <>
      {
        <AlertDialog className="h-[calc(95*var(--vh))]" isVisible={isVisible} onChangeVisible={onChangeVisible}>
          <AlertDialog.Header className="flex flex-col gap-[1.1rem]">
            <h1>크롭 다시하기</h1>
            <div className="w-screen h-[1.9px] bg-border-borderOpaque"></div>
          </AlertDialog.Header>
          <AlertDialog.Body className="flex flex-col flex-start">
            <div className="flex flex-col gap-2 justify-between w-full px-4">
              <h2 className="subhead-3 flex flex-col text-text-01 h-[40px]">크롭할 영역을 선택해주세요</h2>

              <div className="text-text-03 body-2">
                <p>원본사진에서 크롭 영역을 다시 지정해주세요.</p>
                <p>파란색 영역의 크기를 조절하면 영역이 지정됩니다.</p>
              </div>
            </div>

            <div>
              {
                <div>
                  <h3>이미지: {imageMetadata?.file.name}</h3>
                  <canvas
                    ref={canvasRef}
                    className="w-[300px] h-[300px]"
                    style={{ border: "1px solid black" }}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                  />
                </div>
              }
            </div>
          </AlertDialog.Body>
          <AlertDialog.SubmitForm submitText="확인" cancelText="취소" onSubmit={handleSubmit} />
        </AlertDialog>
      }
    </>
  );
};

export default CropSettingDialog;
