"use client";

import { contextBuildHelper } from "@/shared";
import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";

export const [RawNavigationProvider, useNavigationContext] = contextBuildHelper<{
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}>({
  id: "defaultNavigation",
});

export const NavigationProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <RawNavigationProvider isOpen={isOpen} setOpen={setIsOpen}>
      {children}
    </RawNavigationProvider>
  );
};
