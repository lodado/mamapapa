"use client";

import React from "react";
import * as Toast from "@radix-ui/react-toast";
import { useToastStore } from "../stores/toastStore";
import { AnimatePresence } from "motion/react";
import { Motion } from "@/shared/ui/animation/animation";
import { cn } from "@/shared";
import { toastDescriptionVariants, toastHeadVariants, toastVariants } from "./style";

import Error from "/public/Error.svg";
import Success from "/public/Success.svg";

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

      <AnimatePresence>
        {messages.map((msg) => (
          <Toast.Root
            key={msg.id}
            open
            onOpenChange={handleOpenChange(msg.id)}
            duration={6000} // 3초 후 자동 닫힘
            // Tailwind 스타일

            // 클릭 시 즉시 제거
            onClick={() => removeToast(msg.id)}
            asChild
          >
            <Motion
              componentType="div"
              // initial={{ y: 80, opacity: 0 }}
              // 처음엔 빠르게 나오다가 이후에 느려지게
              animate={{ y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
              // exit={{ y: 80, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
              layout
              className={cn(
                toastVariants({ type: msg.type }) // 타입별 스타일 적용
              )}
            >
              <div className="flex h-[50px] flex-row items-center">
                {msg.type === "success" ? <Success /> : <Error />}

                <div className="flex  flex-col ">
                  <Toast.Title
                    className={cn(
                      toastHeadVariants({ type: msg.type }) // 타입별 스타일 적용
                    )}
                  >
                    {msg.title}
                  </Toast.Title>
                  {msg.description && (
                    <Toast.Description
                      className={cn(
                        toastDescriptionVariants({ type: msg.type }) // 타입별 스타일 적용
                      )}
                    >
                      {msg.description}
                    </Toast.Description>
                  )}
                </div>
              </div>
            </Motion>
          </Toast.Root>
        ))}
      </AnimatePresence>
    </Toast.Provider>
  );
}
