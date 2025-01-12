import { create } from "zustand";

export type ToastMessage = {
  id: number;
  title: string;
  description?: string;
};

type ToastState = {
  messages: ToastMessage[];
  addToast: (title: string, description?: string) => void;
  removeToast: (id: number) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  messages: [],
  addToast: (title, description) =>
    set((state) => ({
      messages: [...state.messages, { id: Date.now(), title, description }],
    })),
  removeToast: (id) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id),
    })),
}));
