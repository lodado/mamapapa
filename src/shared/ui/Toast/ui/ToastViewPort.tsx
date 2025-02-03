"use client";

import { Viewport } from "@radix-ui/react-toast";

import { cn } from "@/shared";

const ToastViewPort = ({ className }: { className?: string }) => {
  return (
    <Viewport
      className={cn(
        `
    fixed bottom-0 left-1/2 
    transform -translate-x-1/2 
    flex flex-col items-center
    w-[calc(100%-3rem)] max-w-[29rem] 
    gap-2
    z-50
  `,
        className
      )}
    />
  );
};

export default ToastViewPort;
