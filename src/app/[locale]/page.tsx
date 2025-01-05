"use client";

import React, { useState, useEffect, useRef } from "react";

// TensorFlow.js + 백엔드(CPU, WebGL)
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

// BlazeFace 얼굴 검출 모델
import * as blazeface from "@tensorflow-models/blazeface";

class L2 {
  static className = "L2";

  constructor(config: any) {
    return tf.regularizers.l1l2(config);
  }
}

tf.serialization.registerClass(L2 as any);

/**
 * FaceCropper 컴포넌트 (GhostNet 기반으로 변경)
 */
function FaceCropper({
  index,
  faceModel, // BlazeFace model
  ghostNetModel, // GhostNet model (tf.GraphModel)
  onEmbeddingUpdate, // (embedding, index) => void (부모로 임베딩 전달)
}: {
  index: number;
  faceModel: blazeface.BlazeFaceModel | null;
  ghostNetModel: tf.LayersModel | null;
  onEmbeddingUpdate: (embedding: Float32Array | null, index: number) => void;
}) {
  const [file, setFile] = useState<File | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [faceBox, setFaceBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [cropped, setCropped] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setFaceBox(null);
      onEmbeddingUpdate(null, index);
      setCropped(false);
    }
  };

  const handleImageLoad = async () => {
    if (!faceModel || !ghostNetModel) return;
    if (!imgRef.current || !canvasRef.current) return;

    if (cropped) {
      console.log(`[FaceCropper #${index}] 이미 한 번 크롭됨. 스킵.`);
      return;
    }

    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    setLoading(true);
    const predictions = await faceModel.estimateFaces(img, false);
    setLoading(false);

    if (predictions.length === 0) {
      console.log(`[FaceCropper #${index}] No face detected.`);
      setFaceBox(null);
      onEmbeddingUpdate(null, index);
      return;
    }

    const face = predictions[0];
    const [x, y] = face.topLeft as [number, number];
    const [rx, ry] = face.bottomRight as [number, number];
    const w = rx - x;
    const h = ry - y;
    setFaceBox({ x, y, w, h });

    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    if (cropCanvasRef.current) {
      const cropCtx = cropCanvasRef.current.getContext("2d");
      if (cropCtx) {
        cropCanvasRef.current.width = w;
        cropCanvasRef.current.height = h;
        cropCtx.drawImage(img, x, y, w, h, 0, 0, w, h);
      }
    }

    if (!cropCanvasRef.current) {
      onEmbeddingUpdate(null, index);
      return;
    }
    const cropCanvas = cropCanvasRef.current;

    let faceTensor = tf.browser.fromPixels(cropCanvas);
    faceTensor = tf.image.resizeBilinear(faceTensor, [112, 112]); // GhostNet은 112 x 112 입력
    faceTensor = faceTensor.toFloat().div(255.0).expandDims(0); // [0, 1]로 정규화 및 배치 차원 추가

    console.log(faceTensor.shape, "sibal");

    const out = ghostNetModel.predict(faceTensor) as tf.Tensor;
    const emb = out.dataSync() as Float32Array;

    onEmbeddingUpdate(emb, index);

    setCropped(true);

    faceTensor.dispose();
    out.dispose();
  };

  const imgUrl = file ? URL.createObjectURL(file) : null;

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, margin: "0.5rem 0" }}>
      <h3>FaceCropper #{index} (GhostNet)</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {loading && <p>Detecting face...</p>}

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

export default function ComparisonPage() {
  const [faceModel, setFaceModel] = useState<blazeface.BlazeFaceModel | null>(null);
  const [ghostNetModel, setGhostNetModel] = useState<tf.LayersModel | null>(null);
  const [embeddings, setEmbeddings] = useState<(Float32Array | null)[]>([null, null, null]);
  const [similarities, setSimilarities] = useState<{ [key: string]: number }>({});

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

  useEffect(() => {
    async function loadModels() {
      try {
        const bfModel = await blazeface.load();
        setFaceModel(bfModel);

        const ghostModel = await tf.loadLayersModel("/models/ghostnet2/model.json");
        setGhostNetModel(ghostModel);
      } catch (err) {
        console.error("Model load error:", err);
      }
    }
    loadModels();
  }, []);

  const handleEmbeddingUpdate = (emb: Float32Array | null, index: number) => {
    setEmbeddings((prev) => {
      const newArr = [...prev];
      newArr[index - 1] = emb;
      return newArr;
    });
  };

  const handleCompare = () => {
    const [e1, e2, e3] = embeddings;
    if (!e1 || !e2 || !e3) {
      alert("3장 모두 임베딩이 존재해야 합니다.");
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
    <>
      <header className="header-content">test</header>
      <div style={{ padding: 20 }}>
        <h1>3장 얼굴 크롭 & GhostNet 임베딩 비교</h1>

        <FaceCropper
          index={1}
          faceModel={faceModel}
          ghostNetModel={ghostNetModel}
          onEmbeddingUpdate={handleEmbeddingUpdate}
        />
        <FaceCropper
          index={2}
          faceModel={faceModel}
          ghostNetModel={ghostNetModel}
          onEmbeddingUpdate={handleEmbeddingUpdate}
        />
        <FaceCropper
          index={3}
          faceModel={faceModel}
          ghostNetModel={ghostNetModel}
          onEmbeddingUpdate={handleEmbeddingUpdate}
        />

        <button onClick={handleCompare} style={{ marginTop: 20 }}>
          비교하기
        </button>

        {similarities["12"] != null && (
          <div style={{ marginTop: 20 }}>
            <h3>결과 (코사인 유사도)</h3>
            <p>1 vs 2: {similarities["12"].toFixed(4)}</p>
            <p>1 vs 3: {similarities["13"].toFixed(4)}</p>
            <p>2 vs 3: {similarities["23"].toFixed(4)}</p>
          </div>
        )}

        <div className="page-footer-margin" />
      </div>
      <footer className="page-footer">footer</footer>
    </>
  );
}
