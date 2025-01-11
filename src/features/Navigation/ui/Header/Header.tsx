import { cn } from "@/shared";
import React, { PropsWithChildren } from "react";

const Header = ({ className, children }: PropsWithChildren & { className: string }) => {
  return <header className={cn("header-content", className)}>{children}</header>;
};

export default Header;
