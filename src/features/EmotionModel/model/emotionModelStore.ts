"use client";

import { create } from "zustand";

import { BaseAsyncState, default as BaseAsyncStore } from "@/shared/models/zustand/BaseAsyncStore";

const FACE_API_MODEL_URI = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model";

export const EMOTION_LABELS = ["neutral", "happy", "sad", "angry", "fearful", "disgusted", "surprised"] as const;

export type EmotionLabel = (typeof EMOTION_LABELS)[number];

export interface EmotionScore {
  label: EmotionLabel;
  score: number;
}

export interface EmotionPredictionResult {
  dominantEmotion: EmotionLabel;
  scores: EmotionScore[];
}

type FaceApiModule = typeof import("@vladmandic/face-api");

interface EmotionModelState extends BaseAsyncState {
  faceApi: FaceApiModule | null;
  loadModelWithProgress: () => Promise<void>;
  predictEmotion: (file: File) => Promise<EmotionPredictionResult>;
}

const createImageElement = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("EMOTION_IMAGE_LOAD_FAILED"));
    };
    image.src = url;
  });

class EmotionModelStore extends BaseAsyncStore<EmotionModelState> {
  async loadModelWithProgress() {
    if (this.get().isLoading || this.get().faceApi) return;

    try {
      this.startLoading();
      this.setProgress(20);

      const faceApi = await import("@vladmandic/face-api");
      this.setProgress(45);

      await Promise.all([
        faceApi.nets.tinyFaceDetector.loadFromUri(FACE_API_MODEL_URI),
        faceApi.nets.faceExpressionNet.loadFromUri(FACE_API_MODEL_URI),
      ]);

      this.set({ ...this.get(), faceApi, isLoading: false, isError: false, progress: 100 });
    } catch (error) {
      this.setError(error instanceof Error ? error.message : "EMOTION_MODEL_LOAD_FAILED");
    }
  }

  async predictEmotion(file: File) {
    const faceApi = this.get().faceApi;
    if (!faceApi) throw new Error("EMOTION_MODEL_NOT_READY");

    const image = await createImageElement(file);
    const prediction = await faceApi
      .detectSingleFace(image, new faceApi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.45 }))
      .withFaceExpressions();

    if (!prediction) {
      throw new Error("EMOTION_FACE_NOT_FOUND");
    }

    const scores = EMOTION_LABELS.map((label) => ({
      label,
      score: Math.round((prediction.expressions[label] ?? 0) * 100),
    })).sort((a, b) => b.score - a.score);

    return {
      dominantEmotion: scores[0].label,
      scores,
    };
  }
}

export const useEmotionModelStore = create<EmotionModelState>((set, get) => {
  const store = new EmotionModelStore(set, get);

  return {
    faceApi: null,
    isLoading: false,
    isError: false,
    progress: 0,
    loadModelWithProgress: store.loadModelWithProgress.bind(store),
    predictEmotion: store.predictEmotion.bind(store),
  };
});
