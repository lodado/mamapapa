import { create } from "zustand";
import * as tf from "@tensorflow/tfjs";

export interface FaceCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageMetadata {
  id: string; // 고유 ID (ex: uuid or timestamp)
  url: string; // 미리보기 URL
  file: File; // 원본 파일 객체

  faceCoordinates: FaceCoordinates;

  selectedPlayer?: string;

  embedding?: Float32Array | null; // 예측 모델에서 생성한 임베딩 벡터
}

export interface ImageSelectorState {
  images: ImageMetadata[];
  addImages: (image: ImageMetadata[]) => void;
  removeImage: (image: ImageMetadata) => void;
  updateImage: (image: ImageMetadata) => void;
  clearImages: () => void;

  handleUpdatePlayer: (image: ImageMetadata, player: string) => void;

  generateEmbeddings: (model: tf.LayersModel) => Promise<void>;
}

export const useImageSelectorStore = create<ImageSelectorState>((set, get) => ({
  images: [],
  addImages: (newImages: ImageMetadata[]) => set((state) => ({ images: [...state.images, ...newImages] })),
  removeImage: (image) => set((state) => ({ images: state.images.filter((img) => img.url !== image.url) })),
  clearImages: () => set({ images: [] }),

  updateImage: (newImage: ImageMetadata) =>
    set((state) => ({
      images: state.images.map((image) => {
        if (newImage.id === image.id) return newImage;

        return image;
      }),
    })),

  handleUpdatePlayer: (image, player) => {
    set((state) => {
      const targetIndex = state.images.findIndex((img) => img.id === image.id);
      const updatedImages = [...state.images];
      updatedImages[targetIndex] = { ...image, selectedPlayer: player };

      return { images: updatedImages };
    });
  },

  generateEmbeddings: async (model: tf.LayersModel) => {
    const { images } = get();

    // 이미지를 순회하며 임베딩 계산
    const updatedImages = await Promise.all(
      images.map(async (image) => {
        const embedding = await generateEmbeddingForImage(image.file, model);

        return { ...image, embedding };
      })
    );

    // 상태 업데이트
    set({ images: updatedImages });
  },
}));

async function generateEmbeddingForImage(file: File, model: tf.LayersModel): Promise<Float32Array | null> {
  const img = new Image();

  // File 객체를 읽어서 이미지로 로드
  const url = URL.createObjectURL(file);
  img.src = url;

  // 이미지 로드 대기
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  // 캔버스를 이용해 이미지 데이터를 Tensor로 변환
  const canvas = document.createElement("canvas");
  canvas.width = 112; // 모델 입력 크기
  canvas.height = 112;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 이미지를 112x112로 리사이즈하여 캔버스에 그리기
  ctx.drawImage(img, 0, 0, 112, 112);
  const faceTensor = tf.browser.fromPixels(canvas).toFloat().div(255).expandDims(0); // [0,1] 정규화

  // GhostNet 모델로 임베딩 생성
  const prediction = model.predict(faceTensor) as tf.Tensor;
  const embedding = prediction.dataSync() as Float32Array;

  // 메모리 해제
  faceTensor.dispose();
  prediction.dispose();
  URL.revokeObjectURL(url);

  return embedding;
}
