import React from "react";
import * as Toast from "@radix-ui/react-toast";
import { useToastStore } from "../stores/toastStore";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  // Zustand에서 메시지 목록, 제거 함수를 가져옴
  const { messages, removeToast } = useToastStore();

  // onOpenChange 시점에 메시지를 제거하는 핸들러
  const handleOpenChange = (id: string | number) => (open: boolean) => {
    if (!open) {
      removeToast(id);
    }
  };

  return (
    <Toast.Provider swipeDirection="down">
      {children}

      {/* 여러 개의 Toast를 맵핑하여 동시에 표시 */}
      {messages.map((msg) => (
        <Toast.Root
          key={msg.id}
          open
          onOpenChange={handleOpenChange(msg.id)}
          duration={3000} // 3초 후 자동 닫힘
          // Tailwind 스타일
          className={`
            data-[state=open]:animate-slideUp 
            data-[state=closed]:animate-slideDown 
            bg-white shadow-md rounded-lg 
            px-4 py-3 m-4 
            flex flex-col gap-1 
            cursor-pointer
          `}
          // 클릭 시 즉시 제거
          onClick={() => removeToast(msg.id)}
        >
          <Toast.Title className="font-bold text-base text-gray-800">{msg.title}</Toast.Title>
          {msg.description && (
            <Toast.Description className="text-sm text-gray-600">{msg.description}</Toast.Description>
          )}
        </Toast.Root>
      ))}
    </Toast.Provider>
  );
}
