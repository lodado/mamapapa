"use client";

import { ComponentProps } from "react";
import { SubTrigger, Trigger } from "./radix";
import { cn } from "@/shared/utils";
import { rawButtonVariants } from "../../Button/style";

const DropdownTrigger = (props: ComponentProps<typeof Trigger> & ComponentProps<typeof rawButtonVariants>) => {
  const { children, className, variant = "outline", size, ...rest } = props;

  return (
    <Trigger
      className={
        !props.asChild
          ? cn(
              "inline-flex items-center rounded-md px-4 py-2 text-sm leading-none h-9 gap-2 bg-background text-color-text-default",
              rawButtonVariants({ variant, size }),
              "justify-between w-min",
              className
            )
          : ""
      }
      {...rest}
    >
      {children}
    </Trigger>
  );
};

export const DropdownSubTrigger = (
  props: ComponentProps<typeof SubTrigger> & ComponentProps<typeof rawButtonVariants>
) => {
  const { children, className, variant = "outline", size, ...rest } = props;

  return (
    <SubTrigger
      className={
        !props.asChild
          ? cn(
              "inline-flex items-center rounded-md px-4 py-2 text-sm leading-none h-9 gap-2 bg-background text-color-text-default",
              rawButtonVariants({ variant, size }),
              "justify-between w-min",
              className
            )
          : ""
      }
      {...rest}
    >
      {children}
    </SubTrigger>
  );
};

export default DropdownTrigger;
