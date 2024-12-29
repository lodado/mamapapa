"use client";
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

export default function HomePage() {
  const [model, setModel] = useState<tf.LayersModel | null>(null);

  // 이미지 파일 상태: A, B, C (테스트용)
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [fileC, setFileC] = useState<File | null>(null);

  // 코사인 유사도 결과
  const [similarityAC, setSimilarityAC] = useState<number | null>(null);
  const [similarityBC, setSimilarityBC] = useState<number | null>(null);

  // 1) 컴포넌트 마운트 시 모델 로드
  useEffect(() => {
    const loadModel = async () => {
      try {
        // public/models/my_model/ 폴더 내 model.json 경로
        const loadedModel = await tf.loadLayersModel("/model.json");
        console.log("TF.js Model Loaded!");
        setModel(loadedModel);
      } catch (err) {
        console.error("Failed to load model:", err);
      }
    };
    loadModel();
  }, []);

  // 2) 이미지 -> 임베딩 추출 함수
  const getEmbedding = async (file: File): Promise<tf.Tensor> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          if (!model) {
            throw new Error("Model not loaded yet!");
          }
          // (A) 이미지 태그로 변환
          const img = new Image();
          img.crossOrigin = "anonymous"; // CORS 대응 (필요 시)
          img.onload = () => {
            // (B) tf.browser.fromPixels()로 텐서 변환
            let imgTensor = tf.browser.fromPixels(img);

            // (C) 전처리: 예) (112x96) 리사이즈, (x - 127.5)/128.0 스케일링
            //   - 학습시 사용했던 방식에 맞춰 조정해야 합니다.
            imgTensor = tf.image.resizeBilinear(imgTensor, [112, 96]);
            imgTensor = imgTensor.toFloat().sub(tf.scalar(127.5)).div(tf.scalar(128.0));

            // (D) 배치 차원 추가 [1, 112, 96, 3]
            const expanded = imgTensor.expandDims(0);

            // (E) 모델 추론
            const embedding = model.predict(expanded) as tf.Tensor;

            // (F) 메모리 정리
            imgTensor.dispose();
            expanded.dispose();

            // 임베딩 텐서를 resolve
            resolve(embedding);
          };

          if (e.target?.result) {
            img.src = e.target.result as string;
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // 3) 코사인 유사도 계산 함수
  //   - 임베딩이 이미 L2 정규화된 모델이라면 'dot'만으로도 가능
  //   - 여기서는 일반화하여 norm까지 계산
  const cosineSimilarity = (tensorA: tf.Tensor, tensorB: tf.Tensor): number => {
    // shape: [1, embedding_dim] 가정
    const aData = tensorA.dataSync() as Float32Array;
    const bData = tensorB.dataSync() as Float32Array;

    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < aData.length; i++) {
      dot += aData[i] * bData[i];
      normA += aData[i] * aData[i];
      normB += bData[i] * bData[i];
    }

    const sim = dot / (Math.sqrt(normA) * Math.sqrt(normB));
    return sim;
  };

  // 4) 이미지 3장 모두 임베딩 추출 후, 코사인 유사도 계산
  const handleCompare = async () => {
    try {
      if (!fileA || !fileB || !fileC || !model) {
        alert("모델 또는 이미지 파일이 없습니다.");
        return;
      }
      // 임베딩 추출
      const embA = await getEmbedding(fileA);
      const embB = await getEmbedding(fileB);
      const embC = await getEmbedding(fileC);

      // A vs C, B vs C 코사인 유사도
      const simAC = cosineSimilarity(embA, embC);
      const simBC = cosineSimilarity(embB, embC);

      setSimilarityAC(simAC);
      setSimilarityBC(simBC);

      // 메모리 해제
      embA.dispose();
      embB.dispose();
      embC.dispose();
    } catch (err) {
      console.error(err);
      alert("비교에 실패했습니다.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>얼굴 임베딩 비교 (코사인 유사도)</h1>

      {/* 이미지 업로드 */}
      <div style={{ marginBottom: 10 }}>
        <p>사람 A 이미지:</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) setFileA(e.target.files[0]);
          }}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <p>사람 B 이미지:</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) setFileB(e.target.files[0]);
          }}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <p>테스트(비교할) 이미지(C):</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) setFileC(e.target.files[0]);
          }}
        />
      </div>

      <button onClick={handleCompare} disabled={!model}>
        Compare
      </button>

      {/* 결과 표시 */}
      {similarityAC !== null && similarityBC !== null && (
        <div style={{ marginTop: 20 }}>
          <h2>결과</h2>
          <p>코사인 유사도 (A, C): {similarityAC.toFixed(4)}</p>
          <p>코사인 유사도 (B, C): {similarityBC.toFixed(4)}</p>
          {similarityAC > similarityBC ? (
            <p>
              ==> C는 <strong>A</strong>에 더 가깝습니다!
            </p>
          ) : (
            <p>
              ==> C는 <strong>B</strong>에 더 가깝습니다!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
