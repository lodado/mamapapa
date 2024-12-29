"use client";

import { forwardRef } from "react";

import RawButton from "./components/RawButton";
import { buttonVariants, LeftButtonIconVariants, rawButtonVariants, RightButtonIconVariants } from "./style";
import { ButtonProps } from "./type";
import { cn } from "@/shared/utils";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, LeftIcon, RightIcon, ...props }: ButtonProps, ref) => {
    return (
      <RawButton className={cn(rawButtonVariants(props), buttonVariants(props), className)} ref={ref} {...props}>
        <>
          {LeftIcon && (
            <span className={LeftButtonIconVariants(props)} role="none presentation" aria-hidden="true">
              {LeftIcon}
            </span>
          )}

          {children}

          {RightIcon && (
            <span className={RightButtonIconVariants(props)} role="none presentation" aria-hidden="true">
              {RightIcon}
            </span>
          )}
        </>
      </RawButton>
    );
  }
);

export default Button;
