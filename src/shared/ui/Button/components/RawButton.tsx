// RawButton 컴포넌트
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";

import { RawButtonProps } from "../type";

const RawButton = forwardRef<HTMLButtonElement, RawButtonProps>(
  ({ variant, asChild = false, children, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // @ts-ignore
      navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      onClick?.(e);
    };

    return (
      <Comp ref={ref} {...props} onClick={handleButtonClick}>
        {children}
      </Comp>
    );
  }
);
RawButton.displayName = "RawButton";

export default RawButton;
