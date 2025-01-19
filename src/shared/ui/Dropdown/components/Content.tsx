"use client";

import { cn } from "@/shared/utils";
import { Content, Portal, Arrow, SubContent } from "./radix";

import { ComponentProps, PropsWithChildren } from "react";

interface DropdownContentProps extends ComponentProps<typeof Content> {
  className?: string;
  isSub?: boolean;
  [key: string]: any;
}

const DropdownContent: React.FC<DropdownContentProps> = ({ children, className, isSub, ...rest }) => {
  const Box = isSub ? SubContent : Content;

  return (
    <Portal>
      <Box
        className={cn("mt-[4px] dropdown-shadow rounded bg-background-01 flex flex-col px-[4px] py-1", className)}
        {...rest}
      >
        {children}
      </Box>
    </Portal>
  );
};

export default DropdownContent;
