"use client";

import { PropsWithChildren, useEffect, useLayoutEffect } from "react";

import { useImageSelectorStore } from "@/features/ImageSelector/models";
import { useLoadingStore } from "@/shared/ui/LoadingSpinner";

const Layout = ({ children }: PropsWithChildren) => {
  const { setLoading } = useLoadingStore();
  const { clearImages } = useImageSelectorStore();

  useLayoutEffect(() => {
    setLoading(false);
    clearImages();
  }, []);

  return <>{children}</>;
};

export default Layout;
