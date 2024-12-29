"use client";

import React, { useState, useEffect, useRef } from "react";

// TensorFlow.js + 백엔드(CPU, WebGL)
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

// BlazeFace 얼굴 검출 모델
import * as blazeface from "@tensorflow-models/blazeface";

/**
 * FaceCropper 컴포넌트 (한 번만 크롭)
 */
function FaceCropper({
  index,
  faceModel, // BlazeFace model
  embeddingModel, // 얼굴 임베딩 모델(tf.LayersModel)
  onEmbeddingUpdate, // (embedding, index) => void (부모로 임베딩 전달)
}: {
  index: number;
  faceModel: blazeface.BlazeFaceModel | null;
  embeddingModel: tf.LayersModel | null;
  onEmbeddingUpdate: (embedding: Float32Array | null, index: number) => void;
}) {
  const [file, setFile] = useState<File | null>(null);

  // canvas ref (원본+바운딩박스), crop canvas ref (얼굴만 잘라내서 표시)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 숨긴 <img> 태그 ref
  const imgRef = useRef<HTMLImageElement | null>(null);

  // 진행 표시
  const [loading, setLoading] = useState(false);
  // 검출된 바운딩박스
  const [faceBox, setFaceBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  // **크롭이 이미 완료되었는지** 여부
  const [cropped, setCropped] = useState(false);

  // 파일이 바뀌면 초기화
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setFaceBox(null);
      onEmbeddingUpdate(null, index);
      setCropped(false); // 새 파일이 올라왔으니 다시 false
    }
  };

  // 이미지 로드 완료 시 -> (cropped가 false일 때만) 얼굴 검출 + 크롭 + 임베딩
  const handleImageLoad = async () => {
    if (!faceModel || !embeddingModel) return;
    if (!imgRef.current || !canvasRef.current) return;

    // 이미 한 번 크롭됐다면 스킵
    if (cropped) {
      console.log(`[FaceCropper #${index}] 이미 한 번 크롭됨. 스킵.`);
      return;
    }

    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // BlazeFace로 얼굴 검출
    setLoading(true);
    const predictions = await faceModel.estimateFaces(img, false);
    setLoading(false);

    if (predictions.length === 0) {
      console.log(`[FaceCropper #${index}] No face detected.`);
      setFaceBox(null);
      onEmbeddingUpdate(null, index);
      return;
    }

    // 첫 번째 얼굴만 처리
    const face = predictions[0];
    const [x, y] = face.topLeft as [number, number];
    const [rx, ry] = face.bottomRight as [number, number];
    const w = rx - x;
    const h = ry - y;
    setFaceBox({ x, y, w, h });

    // 바운딩 박스 그리기
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // crop canvas에 그리기
    if (cropCanvasRef.current) {
      const cropCtx = cropCanvasRef.current.getContext("2d");
      if (cropCtx) {
        cropCanvasRef.current.width = w;
        cropCanvasRef.current.height = h;
        cropCtx.drawImage(img, x, y, w, h, 0, 0, w, h);
      }
    }

    // 임베딩 추출
    if (!cropCanvasRef.current) {
      onEmbeddingUpdate(null, index);
      return;
    }
    const cropCanvas = cropCanvasRef.current;
    let faceTensor = tf.browser.fromPixels(cropCanvas);
    // 전처리 (112x96, (x-127.5)/128.0 예시)
    faceTensor = tf.image.resizeBilinear(faceTensor, [112, 96]);
    faceTensor = faceTensor.toFloat().sub(tf.scalar(127.5)).div(tf.scalar(128.0));
    const expanded = faceTensor.expandDims(0);

    const out = embeddingModel.predict(expanded) as tf.Tensor;
    const emb = out.dataSync() as Float32Array; // CPU 상에 복사

    // L2 정규화 (ArcFace 계열일 때)
    let norm = 0;
    for (let i = 0; i < emb.length; i++) norm += emb[i] * emb[i];
    norm = Math.sqrt(norm);
    for (let i = 0; i < emb.length; i++) emb[i] = emb[i] / (norm + 1e-8);

    onEmbeddingUpdate(emb, index);

    // “이미 한 번 크롭됨” 상태로 변경
    setCropped(true);

    // 메모리 정리
    faceTensor.dispose();
    expanded.dispose();
    out.dispose();
  };

  // dataURL
  const imgUrl = file ? URL.createObjectURL(file) : null;

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, margin: "0.5rem 0" }}>
      <h3>FaceCropper #{index} (한번만 크롭)</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {loading && <p>Detecting face...</p>}

      {/* 숨긴 <img> -> onLoad 시 handleImageLoad */}
      {imgUrl && (
        <img ref={imgRef} src={imgUrl} alt={`face${index}`} style={{ display: "none" }} onLoad={handleImageLoad} />
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <div>
          <p>원본 + Box</p>
          <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }} />
        </div>
        <div>
          <p>크롭된 얼굴</p>
          <canvas ref={cropCanvasRef} style={{ border: "1px solid #ccc" }} />
        </div>
      </div>

      {faceBox && (
        <p>
          <strong>Detected Face:</strong> x={faceBox.x}, y={faceBox.y}, w={faceBox.w}, h={faceBox.h}
        </p>
      )}
    </div>
  );
}

/**
 * 메인 페이지: 3장의 FaceCropper를 렌더링 + 임베딩 비교
 */
export default function ComparisonPage() {
  const [faceModel, setFaceModel] = useState<blazeface.BlazeFaceModel | null>(null);
  const [embeddingModel, setEmbeddingModel] = useState<tf.LayersModel | null>(null);

  // 임베딩 저장: 3장
  const [embeddings, setEmbeddings] = useState<(Float32Array | null)[]>([null, null, null]);

  // 유사도 결과
  const [similarities, setSimilarities] = useState<{ [key: string]: number }>({});

  // 코사인 유사도 계산
  function cosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dot = 0,
      normA = 0,
      normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // (1) 모델 로드 (BlazeFace + 임베딩 모델) - 최초 마운트
  useEffect(() => {
    async function loadModels() {
      try {
        console.log("Loading models...");
        const bfModel = await blazeface.load();
        setFaceModel(bfModel);
        console.log("BlazeFace loaded!");

        // 임베딩 모델 (예: /models/my_model/model.json)
        const embedModel = await tf.loadLayersModel("/models/my_model/model.json");
        setEmbeddingModel(embedModel);
        console.log("Embedding model loaded!");
      } catch (err) {
        console.error("Model load error:", err);
      }
    }
    loadModels();
  }, []);

  // (2) FaceCropper -> 임베딩 업데이트 콜백
  const handleEmbeddingUpdate = (emb: Float32Array | null, index: number) => {
    setEmbeddings((prev) => {
      const newArr = [...prev];
      newArr[index - 1] = emb; // index가 1,2,3 이므로 -1
      return newArr;
    });
  };

  // (3) Compare 버튼 -> 3개의 임베딩 간 유사도 계산
  const handleCompare = () => {
    const [e1, e2, e3] = embeddings;
    if (!e1 || !e2 || !e3) {
      alert("3장 모두 임베딩이 존재해야 합니다 (얼굴 검출 실패 or 업로드 안됨).");
      return;
    }
    const sim12 = cosineSimilarity(e1, e2);
    const sim13 = cosineSimilarity(e1, e3);
    const sim23 = cosineSimilarity(e2, e3);

    setSimilarities({
      "12": sim12,
      "13": sim13,
      "23": sim23,
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>3장 얼굴 크롭 & 임베딩 비교 (한번만 크롭)</h1>
      <p>
        사진 업로드 시 BlazeFace로 얼굴을 한 번만 검출 & 크롭 → 임베딩 추출
        <br />
        "비교하기" 버튼으로 3개 임베딩 간 코사인 유사도를 확인할 수 있습니다.
      </p>

      <FaceCropper
        index={1}
        faceModel={faceModel}
        embeddingModel={embeddingModel}
        onEmbeddingUpdate={handleEmbeddingUpdate}
      />
      <FaceCropper
        index={2}
        faceModel={faceModel}
        embeddingModel={embeddingModel}
        onEmbeddingUpdate={handleEmbeddingUpdate}
      />
      <FaceCropper
        index={3}
        faceModel={faceModel}
        embeddingModel={embeddingModel}
        onEmbeddingUpdate={handleEmbeddingUpdate}
      />

      <button onClick={handleCompare} style={{ marginTop: 20 }}>
        비교하기
      </button>

      {/* 유사도 결과 표시 */}
      {similarities["12"] != null && (
        <div style={{ marginTop: 20 }}>
          <h3>결과 (코사인 유사도)</h3>
          <p>1 vs 2: {similarities["12"].toFixed(4)}</p>
          <p>1 vs 3: {similarities["13"].toFixed(4)}</p>
          <p>2 vs 3: {similarities["23"].toFixed(4)}</p>
          <p>값이 1에 가까울수록 "더 같은 얼굴"로 판단 가능.</p>
        </div>
      )}
    </div>
  );
}
