import { cn } from "@/shared";
import { Viewport } from "@radix-ui/react-toast";

const ToastViewPort = ({ className }: { className?: string }) => {
  return (
    <Viewport
      className={cn(
        `
    fixed bottom-0 left-1/2 
    transform -translate-x-1/2 
    flex flex-col items-center
    w-full max-w-[29rem]
    z-50
  `,
        className
      )}
    />
  );
};

export default ToastViewPort;
