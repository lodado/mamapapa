import { create } from "zustand";

// Zustand 상태 정의
export const useLoadingStore = create((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
