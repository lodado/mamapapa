import { cn } from "@/shared";
import { Viewport } from "@radix-ui/react-toast";

const ToastViewPort = ({
  className = `
          fixed bottom-0 left-1/2 
          transform -translate-x-1/2 
          flex flex-col items-center
          w-full max-w-sm
          z-50
        `,
}: {
  className?: string;
}) => {
  return <Viewport className={cn(className)} />;
};

export default ToastViewPort;
