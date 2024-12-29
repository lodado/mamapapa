// RawButton 컴포넌트
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";

import { RawButtonProps } from "../type";

const RawButton = forwardRef<HTMLButtonElement, RawButtonProps>(
  ({ variant, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp ref={ref} {...props}>
        {children}
      </Comp>
    );
  }
);
RawButton.displayName = "RawButton";

export default RawButton;
