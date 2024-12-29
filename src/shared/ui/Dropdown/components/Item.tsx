"use client";

import React from "react";
import { Check } from "lucide-react";

import { cn } from "@/shared/utils";
import { Item } from "./radix";

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof Item> {
  children: React.ReactNode;
  className?: string;
}

const DropdownItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Item
        className={cn(
          "flex items-center h-6 pl-6 py-4 text-sm leading-none text-color-text-default rounded-sm relative select-none body-02",
          "focus:outline-color-text-brand focus:outline focus:outline-1 focus:ring-2 hover:z-50",
          "data-[disabled]:text-color-icon-disabled data-[disabled]:pointer-events-none",
          "data-[highlighted]:text-color-text-brand cursor-pointer",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
      </Item>
    );
  }
);

DropdownItem.displayName = "DropdownItem";

export default DropdownItem;
