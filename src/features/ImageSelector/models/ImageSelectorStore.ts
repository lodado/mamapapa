import { create } from "zustand";

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
}

export interface ImageSelectorState {
  images: ImageMetadata[];
  addImages: (image: ImageMetadata[]) => void;
  removeImage: (image: ImageMetadata) => void;
  clearImages: () => void;
}

export const useImageSelectorStore = create<ImageSelectorState>((set) => ({
  images: [],
  addImages: (newImages: ImageMetadata[]) => set((state) => ({ images: [...state.images, ...newImages] })),
  removeImage: (image) => set((state) => ({ images: state.images.filter((img) => img.url !== image.url) })),
  clearImages: () => set({ images: [] }),
}));
