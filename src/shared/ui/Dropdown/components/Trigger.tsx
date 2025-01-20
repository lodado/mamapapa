"use client";

import { ComponentProps } from "react";
import { SubTrigger, Trigger } from "./radix";
import { cn } from "@/shared/utils";
import { rawButtonVariants } from "../../Button/style";
import { ChevronDown } from "lucide-react";
import { useDropdownContext } from "./Provider";

const DropdownTrigger = (props: ComponentProps<typeof Trigger> & { doesArrowNeed?: boolean }) => {
  const { children, className, asChild = false, doesArrowNeed = true, ...rest } = props;
  const { isVisible } = useDropdownContext();
  return (
    <Trigger
      className={
        !asChild
          ? cn(
              "w-full pl-1 h-7 flex justify-between items-center rounded bg-[var(--Secondary-OP)] text-text-00 subhead-2",
              className
            )
          : ""
      }
      {...rest}
    >
      <>
        {children}

        {asChild ? null : doesArrowNeed && <ChevronDown strokeWidth={1.2} className={isVisible ? "rotate-180" : ""} />}
      </>
    </Trigger>
  );
};

export const DropdownSubTrigger = (
  props: ComponentProps<typeof SubTrigger> & ComponentProps<typeof rawButtonVariants>
) => {
  const { children, className, ...rest } = props;

  return (
    <SubTrigger
      className={!props.asChild ? cn("w-full items-center rounded bg-inherit text-text-01 subhead-2", className) : ""}
      {...rest}
    >
      {children}
    </SubTrigger>
  );
};

export default DropdownTrigger;
