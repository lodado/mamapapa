// RawButton 컴포넌트
 
import { forwardRef } from "react";
import { motion } from "motion/react";
import { RawButtonProps } from "../type";

const RawButton = forwardRef<HTMLButtonElement, RawButtonProps>(
  ({ variant, asChild = false, children, onClick, ...props }, ref) => {
    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // @ts-ignore
      navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      onClick?.(e);
    };

    return (
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        ref={ref}
        {...(props as any)}
        onClick={handleButtonClick}
      >
        {children}
      </motion.button>
    );
  }
);
RawButton.displayName = "RawButton";

export default RawButton;
