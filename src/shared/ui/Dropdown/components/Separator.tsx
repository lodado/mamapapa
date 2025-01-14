import React from "react";
import { Separator } from "./radix";
import { cn } from "@/shared/utils";

const DropdownSeparator = ({ className }: { className?: string }) => (
  <Separator className={cn("h-[1px] my-[0.125rem] bg-border-02 w-full", className)} />
);

export default DropdownSeparator;
