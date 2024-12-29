"use client";

import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as blazeface from "@tensorflow-models/blazeface";

export default function HomePage() {
  const [faceModel, setFaceModel] = useState<blazeface.BlazeFaceModel | null>(null);

  // 원본 이미지 & 크롭 결과를 표시할 canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // <img>를 가리킬 ref
  const imgRef = useRef<HTMLImageElement | null>(null);

  // 업로드된 파일
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 얼굴 바운딩 박스
  const [faceBox, setFaceBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // **크롭을 이미 수행했는지** 여부
  const [cropped, setCropped] = useState(false);

  // (1) 컴포넌트 마운트 시 BlazeFace 모델 로드
  useEffect(() => {
    const loadFaceModel = async () => {
      setLoading(true);
      try {
        const model = await blazeface.load();
        setFaceModel(model);
        console.log("BlazeFace model loaded!");
      } catch (err) {
        console.error("Failed to load model:", err);
      }
      setLoading(false);
    };
    loadFaceModel();
  }, []);

  // (2) 파일 선택 시 -> 파일 상태 & (선택) "cropped" 플래그 초기화
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
      setFaceBox(null);
      setCropped(false); // 새 이미지 업로드 시, 다시 "크롭 안됨" 상태로
    }
  };

  // (3) <img> onLoad 시 -> 한 번만 얼굴 검출
  const handleImageLoad = async () => {
    if (!faceModel) return;
    if (!imgRef.current || !canvasRef.current) return;

    // 이미 한 번 크롭을 했으면, 더 이상 진행 안 함
    if (cropped) {
      console.log("이미 한 번 크롭이 완료되어, 다시 크롭하지 않습니다.");
      return;
    }

    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 크기 = 이미지 크기
    canvas.width = img.width;
    canvas.height = img.height;
    // 원본 이미지 캔버스에 그리기
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // 얼굴 검출
    setLoading(true);
    const predictions = await faceModel.estimateFaces(img, false);
    setLoading(false);

    if (predictions.length === 0) {
      console.log("No face detected.");
      setFaceBox(null);
      return;
    }

    // 첫 번째 얼굴만
    const face = predictions[0];
    const [x, y] = face.topLeft as [number, number];
    const [rx, ry] = face.bottomRight as [number, number];
    const width = rx - x;
    const height = ry - y;

    setFaceBox({ x, y, width, height });

    // 사각형 그리기
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // 크롭 캔버스에 표시
    if (cropCanvasRef.current) {
      const cropCtx = cropCanvasRef.current.getContext("2d");
      if (!cropCtx) return;
      cropCanvasRef.current.width = width;
      cropCanvasRef.current.height = height;
      cropCtx.drawImage(img, x, y, width, height, 0, 0, width, height);
    }

    // 여기서 "이미 한 번 크롭됨" 상태로 변경
    setCropped(true);
  };

  // 업로드된 파일을 dataURL로 표시
  const imgUrl = imageFile ? URL.createObjectURL(imageFile) : null;

  return (
    <div style={{ padding: 20 }}>
      <h1>얼굴 크롭 (한번만) 예시</h1>

      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {loading && <p>모델 동작 중...</p>}
      </div>

      {/* 숨긴 <img> => onLoad에서 캔버스에 그림 & 얼굴 검출 */}
      {imgUrl && <img ref={imgRef} src={imgUrl} alt="input" style={{ display: "none" }} onLoad={handleImageLoad} />}

      <div style={{ marginTop: 20, display: "flex", gap: 20 }}>
        <div>
          <p>원본 + 바운딩박스</p>
          <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }} />
        </div>
        <div>
          <p>잘려진 얼굴(Crop)</p>
          <canvas ref={cropCanvasRef} style={{ border: "1px solid #ccc" }} />
        </div>
      </div>

      {faceBox && (
        <div style={{ marginTop: 20 }}>
          <h3>검출된 얼굴 바운딩 박스</h3>
          <p>
            x: {faceBox.x}, y: {faceBox.y}, width: {faceBox.width}, height: {faceBox.height}
          </p>
        </div>
      )}
    </div>
  );
}
