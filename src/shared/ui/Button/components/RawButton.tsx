"use client";

import { forwardRef } from "react";

import { RawButtonProps } from "../type";
import { Motion } from "../../animation/animation";

const RawButton = forwardRef<HTMLButtonElement, RawButtonProps>(
  ({ variant, componentType = "button", asChild = false, children, onClick, ...props }, ref) => {
    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // @ts-ignore
      navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      onClick?.(e);
    };

    return (
      <Motion
        componentType={componentType}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 160, duration: 0.3 }}
        ref={ref}
        {...(props as any)}
        onClick={handleButtonClick}
      >
        {children}
      </Motion>
    );
  }
);
RawButton.displayName = "RawButton";

export default RawButton;
