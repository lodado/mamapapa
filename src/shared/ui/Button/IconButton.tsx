import { cloneElement, forwardRef } from "react";

import RawButton from "./components/RawButton";
import { iconButtonVariants, LeftButtonIconVariants, rawButtonVariants } from "./style";
import { IconButtonProps } from "./type";
import { cn } from "@/shared/utils";

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({ children, className = "", ...props }, ref) => {
  return (
    <RawButton className={cn(rawButtonVariants(props), iconButtonVariants(props), className)} ref={ref} {...props}>
      <span className={LeftButtonIconVariants(props)} role="none presentation" aria-hidden="true">
        {children}
      </span>
    </RawButton>
  );
});
export default IconButton;
