import { NextAuthSessionResponse } from "@/entities/Auth/server/type";
import { create } from "zustand";

type AuthState = {
  session: NextAuthSessionResponse | null;

  setSession: (session: NextAuthSessionResponse) => void;

  clearSession: () => void;

  isLogin: boolean;

  isLoginFormDialogVisible: boolean;

  setLoginFormDialogVisible: (visible: boolean) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null, // 초기 상태는 null

  isLoginFormDialogVisible: false,

  isLogin: false,

  setSession: (session) =>
    set(() => {
      return { session, isLogin: session != null };
    }),

  clearSession: () => set(() => ({ session: null, isLogin: false })),

  setLoginFormDialogVisible: (visible: boolean) => set(() => ({ isLoginFormDialogVisible: visible })),
}));
