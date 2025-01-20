import { create } from "zustand";

export type ToastMessage = {
  id: string | number;
  type: "success" | "error";
  title: string;
  description?: string;
};

export interface ToastState {
  messages: ToastMessage[];
  addToast: ({ title, description, type }: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string | number) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  messages: [],
  addToast: ({ title, description, type, id }: { id?: number | string } & Omit<ToastMessage, "id">) =>
    set((state) => ({
      messages: [...state.messages, { id: id ?? Date.now(), type, title, description }],
    })),
  removeToast: (id) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id),
    })),
}));
