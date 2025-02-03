import * as tf from "@tensorflow/tfjs";
import { create } from "zustand";

export interface FaceCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RawImageMetadata {
  id: string; // 고유 ID (ex: uuid or timestamp)
  url: string; // 미리보기 URL
  file: File; // 원본 파일 객체

  faceCoordinates: FaceCoordinates;

  selectedPlayer?: string;
}

export interface ImageMetadata extends RawImageMetadata {
  embedding?: Float32Array | null; // 예측 모델에서 생성한 임베딩 벡터
}

export interface ComparisonMetaData extends RawImageMetadata {
  similarity: number;
}


export interface ImageSelectorState {
  images: ImageMetadata[];
  setImages: (images: ImageMetadata[]) => void;
  addImages: (image: ImageMetadata[]) => void;
  removeImage: (image: ImageMetadata) => void;
  updateImage: (image: ImageMetadata) => void;
  clearImages: () => void;

  handleUpdatePlayer: (image: ImageMetadata, player: string) => void;

  generateEmbeddings: (model: tf.LayersModel) => Promise<void>;
}

export const useImageSelectorStore = create<ImageSelectorState>((set, get) => ({
  images: [],

  setImages: (images: ImageMetadata[]) => set({ images }),

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
      let tempIndex;
      let tempImage: ImageMetadata | undefined;

      const targetIndex = state.images.findIndex((img) => img.id === image.id);
      const updatedImages = state.images.map((img, index) => {
        if (img.selectedPlayer === player) {
          tempIndex = index;
          tempImage = img;
          return { ...img, selectedPlayer: undefined };
        }

        return img;
      });

      if (tempImage !== undefined && tempIndex !== undefined) {
        updatedImages[tempIndex] = { ...tempImage, selectedPlayer: updatedImages[targetIndex].selectedPlayer };
      }

      updatedImages[targetIndex] = { ...image, selectedPlayer: player };

      return { images: updatedImages };
    });
  },

  generateEmbeddings: async (model: tf.LayersModel) => {
    const { images } = get();

    // 이미지를 순회하며 임베딩 계산
    const updatedImages = await Promise.all(
      images.map(async (image) => {
        const embedding = await generateEmbeddingForImage(image.file, model, image.faceCoordinates);

        return { ...image, embedding };
      })
    );

    // 상태 업데이트
    set({ images: updatedImages });
  },
}));

async function generateEmbeddingForImage(
  file: File,
  model: tf.LayersModel,
  faceCoordinates: FaceCoordinates
): Promise<Float32Array | null> {
  const img = new Image();

  if (faceCoordinates.width <= 0 || faceCoordinates.height <= 0) return null;

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
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 원본 이미지를 기준으로 faceCoordinates 영역을 캔버스에 크롭
  canvas.width = faceCoordinates.width;
  canvas.height = faceCoordinates.height;
  ctx.drawImage(
    img,
    faceCoordinates.x, // 시작 x 좌표
    faceCoordinates.y, // 시작 y 좌표
    faceCoordinates.width, // 크롭할 너비
    faceCoordinates.height, // 크롭할 높이
    0, // 캔버스에서의 x 시작 위치
    0, // 캔버스에서의 y 시작 위치
    faceCoordinates.width, // 크롭한 이미지를 캔버스 너비로 리사이즈
    faceCoordinates.height // 크롭한 이미지를 캔버스 높이로 리사이즈
  );

  // 크롭한 이미지를 112x112로 리사이즈하여 모델 입력 크기에 맞춤
  const resizedCanvas = document.createElement("canvas");
  resizedCanvas.width = 112; // 모델 입력 크기
  resizedCanvas.height = 112;
  const resizedCtx = resizedCanvas.getContext("2d");
  if (!resizedCtx) return null;

  resizedCtx.drawImage(canvas, 0, 0, 112, 112);

  // [0,1] 정규화를 위한 Tensor 변환
  const faceTensor = tf.browser.fromPixels(resizedCanvas).toFloat().div(255).expandDims(0);

  // 모델을 사용해 임베딩 생성
  const prediction = model.predict(faceTensor) as tf.Tensor;
  const embedding = prediction.dataSync() as Float32Array;

  // 메모리 해제
  faceTensor.dispose();
  prediction.dispose();
  URL.revokeObjectURL(url);

  return embedding;
}
