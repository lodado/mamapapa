import { create } from "zustand";
import { LayersModel, regularizers, serialization, loadLayersModel } from "@tensorflow/tfjs";

import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import BaseAsyncStore, { BaseAsyncState } from "@/shared/models/zustand/BaseAsyncStore";
import { IndexedDBController } from "@/shared";

const MODEL_ID = "GHOST_FACE_NET_2";

class L2 {
  static className = "L2";

  constructor(config: any) {
    return regularizers.l1l2(config);
  }
}

serialization.registerClass(L2 as any);

interface FaceModelState extends BaseAsyncState {
  model: LayersModel | null;

  loadModelWithProgress: () => Promise<void>;
  setModel: (model: LayersModel) => void;
}

class FaceModelStore extends BaseAsyncStore<FaceModelState> {
  // 모델을 실제로 로딩하는 메서드
  async loadModelWithProgress() {
    if (this.get().isLoading && !!this.get().model) return;

    this.startLoading(); // 공통 로딩 시작 로직

    try {
      let model = await loadLayersModel("/models/ghostnet2/model.json");

      // 모델 세팅
      this.setModel(model);
      this.finishLoading();

      // offline에서도 사용 가능하도록 indexed DB caching
      await model.save(`indexeddb://${MODEL_ID}`);
    } catch (error) {
      this.setModel(null);
      this.setError("모델 로딩에 실패했습니다.");
      this.set({ isLoading: false });
    }
  }

  // 모델 세팅
  setModel(model: LayersModel | null) {
    this.set({ model });
  }
}

export const useFaceModelStore = create<FaceModelState>((set, get) => {
  // FaceModelStore 인스턴스 생성
  const store = new FaceModelStore(set, get);

  return {
    // BaseAsyncState
    isLoading: true,
    isError: false,
    progress: 0,
    errorMessage: undefined,

    // FaceModelState
    model: null,

    // 메서드 바인딩
    loadModelWithProgress: store.loadModelWithProgress.bind(store),
    setModel: store.setModel.bind(store),
  };
});
