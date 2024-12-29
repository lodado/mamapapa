import React from "react";
import { Separator } from "./radix";
import { cn } from "@/shared/utils";

const DropdownSeparator = ({ className }: { className?: string }) => (
  <Separator className={cn("h-[0.01rem] bg-color-background-accent-gray-subtler-default my-4", className)} />
);

export default DropdownSeparator;
